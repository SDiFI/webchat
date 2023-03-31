import { createChannel, createClient, WebsocketTransport, ClientError } from 'nice-grpc-web';
import {
    DeepPartial,
    SpeechClient,
    SpeechDefinition,
    StreamingRecognizeRequest,
    RecognitionConfig_AudioEncoding,
    StreamingRecognizeResponse_SpeechEventType,
} from '../proto/tiro/speech/v1alpha/speech'

const floatTo16BitPCM = (output: ArrayBuffer, input: Float32Array, offset?: number) => {
    const outView = new DataView(output);
    if (!offset) offset = 0;
    for (var i = 0; i < input.length; i++, offset += 2) {
        var s = Math.max(-1, Math.min(1, input[i]));
        outView.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
};

export async function* createAudioContentRequests(audioCtx: AudioContext, signal: AbortSignal): AsyncIterable<DeepPartial<StreamingRecognizeRequest>> {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    const audioNode = audioCtx.createMediaStreamSource(stream)
    const processingNode = audioCtx.createScriptProcessor(8192, 1, 1);

    async function* audioprocess(signal: AbortSignal): AsyncIterable<AudioProcessingEvent> {
        while (true) {
            const opts = { signal };
            yield await new Promise(rs =>
                processingNode.addEventListener('audioprocess', rs, opts as AddEventListenerOptions));
        }
    };

    audioNode.connect(processingNode)
        .connect(audioCtx.destination);

    for await (const e of audioprocess(signal)) {
        if (signal.aborted) {
            break;
        }

        if (!e.inputBuffer.getChannelData(0).every((elem) => elem === 0)) {
            const content = new Uint8Array(e.inputBuffer.getChannelData(0).length * 2);
            floatTo16BitPCM(content.buffer, e.inputBuffer.getChannelData(0));
            yield { audioContent: content };
        }
    }
}



export type SingleUttSpeechRecognitionOptions = {
    enableAutomaticPunctuation?: boolean,

    // BCP-46 language code, defaults to 'is-IS'
    languageCode?: string,

    serverAddress?: string
};

// This opens a channel and creates a client on each invocation
export async function performSingleUttSpeechRecognition(
    handleTranscript: (transcript: string, metadata: { isFinal: boolean }) => void,
    options?: SingleUttSpeechRecognitionOptions,
): Promise<void> {
    const audioCtx = new AudioContext();

    const { languageCode, enableAutomaticPunctuation, serverAddress } = {
        languageCode: 'is-IS',
        enableAutomaticPunctuation: true,
        serverAddress: 'speech.tiro.is:443',
        ...(options || {}),
    };

    const channel = createChannel(`wss://${serverAddress}`, WebsocketTransport());
    const client: SpeechClient = createClient(SpeechDefinition, channel);

    async function* generateRequests(signal: AbortSignal): AsyncIterable<DeepPartial<StreamingRecognizeRequest>> {
        yield {
            streamingConfig: {
                singleUtterance: true,
                interimResults: true,
                config: {
                    enableAutomaticPunctuation,
                    languageCode,
                    sampleRateHertz: audioCtx.sampleRate,
                    encoding: RecognitionConfig_AudioEncoding.LINEAR16,
                },
            },
        };

        return yield* createAudioContentRequests(audioCtx, signal);
    }

    const abortcontroller = new AbortController();
    const signal = abortcontroller.signal;

    try {
        for await (const response of client.streamingRecognize(generateRequests(signal), { signal })) {
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
            } else if (response.speechEventType === StreamingRecognizeResponse_SpeechEventType.END_OF_SINGLE_UTTERANCE) {
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

    return;
}
