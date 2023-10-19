import { createClient, ClientError, Channel } from 'nice-grpc-web';
import {
    DeepPartial,
    SpeechClient,
    SpeechDefinition,
    StreamingRecognizeRequest,
    RecognitionConfig_AudioEncoding,
    StreamingRecognizeResponse_SpeechEventType,
} from '../proto/tiro/speech/v1alpha/speech';
import {
    SpeechServiceDefinition as AxySpeechDefinition,
    SpeechServiceClient as AxySpeechClient,
    StreamingRecognizeRequest as AxyStreamingRecognizeRequest,
    StreamingRecognizeResponse_SpeechEventType as AxySpeechEventType,
    RecognitionConfig_AudioEncoding as AxyRecognitionConfig_AudioEncoding,
} from '../proto/sdifi/speech/v1alpha/speech';

const floatTo16BitPCM = (output: ArrayBuffer, input: Float32Array, offset?: number) => {
    const outView = new DataView(output);
    if (!offset) offset = 0;
    for (let i = 0; i < input.length; i++, offset += 2) {
        const s = Math.max(-1, Math.min(1, input[i]));
        outView.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
};

export type SingleUttSpeechRecognitionOptions = {
    enableAutomaticPunctuation?: boolean;

    // BCP-46 language code, defaults to 'is-IS'
    languageCode?: string;

    conversationId?: string;
};

// This opens a channel and creates a client on each invocation
export async function performSingleUttSpeechRecognition(
    channel: Channel,
    handleTranscript: (transcript: string, metadata: { isFinal: boolean }) => void,
    options?: SingleUttSpeechRecognitionOptions,
): Promise<void> {
    const audioCtx = new AudioContext();

    const { languageCode, enableAutomaticPunctuation } = {
        languageCode: 'is-IS',
        enableAutomaticPunctuation: true,
        ...(options || {}),
    };

    const backendIsAxy = !!options?.conversationId;

    const client: AxySpeechClient | SpeechClient = createClient(
        backendIsAxy ? AxySpeechDefinition : SpeechDefinition,
        channel,
    );

    async function* createAudioContentRequests<T = StreamingRecognizeRequest | AxyStreamingRecognizeRequest>(
        audioCtx: AudioContext,
        signal: AbortSignal,
    ): AsyncIterable<DeepPartial<T>> {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        const audioNode = audioCtx.createMediaStreamSource(stream);
        const processingNode = audioCtx.createScriptProcessor(8192, 1, 1);

        async function* audioprocess(signal: AbortSignal): AsyncIterable<AudioProcessingEvent> {
            while (true) {
                const opts = { signal };
                yield await new Promise(rs =>
                    processingNode.addEventListener('audioprocess', rs, opts as AddEventListenerOptions),
                );
            }
        }

        audioNode.connect(processingNode).connect(audioCtx.destination);

        for await (const e of audioprocess(signal)) {
            if (signal.aborted) {
                break;
            }

            if (!e.inputBuffer.getChannelData(0).every(elem => elem === 0)) {
                const content = new Uint8Array(e.inputBuffer.getChannelData(0).length * 2);
                floatTo16BitPCM(content.buffer, e.inputBuffer.getChannelData(0));
                yield ({ audioContent: content } as unknown) as DeepPartial<T>;
            }
        }
        stream.getTracks().forEach(track => track.stop());
    }

    async function* generateRequests<T = StreamingRecognizeRequest | AxyStreamingRecognizeRequest>(
        signal: AbortSignal,
    ): AsyncIterable<DeepPartial<T>> {
        yield ({
            streamingConfig: {
                conversation: options?.conversationId,
                singleUtterance: true,
                interimResults: true,
                config: {
                    enableAutomaticPunctuation,
                    languageCode,
                    sampleRateHertz: audioCtx.sampleRate,
                    encoding: backendIsAxy
                        ? AxyRecognitionConfig_AudioEncoding.LINEAR16
                        : RecognitionConfig_AudioEncoding.LINEAR16,
                },
            },
        } as unknown) as DeepPartial<T>;

        return yield* createAudioContentRequests(audioCtx, signal);
    }

    const abortcontroller = new AbortController();
    const signal = abortcontroller.signal;

    try {
        const stream = (() => {
            if (backendIsAxy) {
                return (client as AxySpeechClient).streamingRecognize(
                    generateRequests<AxyStreamingRecognizeRequest>(signal),
                    { signal },
                );
            } else {
                return (client as SpeechClient).streamingRecognize(
                    generateRequests<StreamingRecognizeRequest>(signal),
                    { signal },
                );
            }
        })();

        for await (const response of stream) {
            if (response.results.length > 0) {
                const result = response.results[0];

                if (result.isFinal) {
                    abortcontroller.abort();
                }

                const alternatives = result.alternatives;
                if (alternatives.length > 0) {
                    const transcript = alternatives[0].transcript;
                    handleTranscript(transcript, { isFinal: result.isFinal });
                }
            } else if (
                (backendIsAxy && response.speechEventType === AxySpeechEventType.END_OF_SINGLE_UTTERANCE) ||
                response.speechEventType === StreamingRecognizeResponse_SpeechEventType.END_OF_SINGLE_UTTERANCE
            ) {
                handleTranscript('', { isFinal: true });
                abortcontroller.abort();
            }
        }
    } catch (error) {
        if (error instanceof ClientError) {
            console.error('Got client error:', error.code, error.details);
            throw error;
        }
    }

    audioCtx.close();

    return;
}
