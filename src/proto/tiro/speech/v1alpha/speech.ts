/* eslint-disable */
import type { CallContext, CallOptions } from "nice-grpc-common";
import _m0 from "protobufjs/minimal";
import { Duration } from "../../../google/protobuf/duration";
import { Status } from "../../../google/rpc/status";

export const protobufPackage = "tiro.speech.v1alpha";

/** The top-level message sent by the client for the `Recognize` method. */
export interface RecognizeRequest {
  /**
   * Required. Provides information to the recognizer that specifies how to
   * process the request.
   */
  config:
    | RecognitionConfig
    | undefined;
  /** Required. The audio data to be recognized. */
  audio: RecognitionAudio | undefined;
}

/**
 * The top-level message sent by the client for the `StreamingRecognize` method.
 * Multiple `StreamingRecognizeRequest` messages are sent. The first message
 * must contain a `streaming_config` message and must not contain
 * `audio_content`. All subsequent messages must contain `audio_content` and
 * must not contain a `streaming_config` message.
 */
export interface StreamingRecognizeRequest {
  /**
   * Provides information to the recognizer that specifies how to process the
   * request. The first `StreamingRecognizeRequest` message must contain a
   * `streaming_config`  message.
   */
  streamingConfig?:
    | StreamingRecognitionConfig
    | undefined;
  /**
   * The audio data to be recognized. Sequential chunks of audio data are sent
   * in sequential `StreamingRecognizeRequest` messages. The first
   * `StreamingRecognizeRequest` message must not contain `audio_content` data
   * and all subsequent `StreamingRecognizeRequest` messages must contain
   * `audio_content` data. The audio bytes must be encoded as specified in
   * `RecognitionConfig`. Note: as with all bytes fields, proto buffers use a
   * pure binary representation (not base64). See
   * [content limits](https://cloud.google.com/speech-to-text/quotas#content).
   */
  audioContent?: Uint8Array | undefined;
}

/**
 * Provides information to the recognizer that specifies how to process the
 * request.
 */
export interface StreamingRecognitionConfig {
  /**
   * Required. Provides information to the recognizer that specifies how to
   * process the request.
   */
  config:
    | RecognitionConfig
    | undefined;
  /**
   * If `false` or omitted, the recognizer will perform continuous
   * recognition (continuing to wait for and process audio even if the user
   * pauses speaking) until the client closes the input stream (gRPC API) or
   * until the maximum time limit has been reached. May return multiple
   * `StreamingRecognitionResult`s with the `is_final` flag set to `true`.
   *
   * If `true`, the recognizer will detect a single spoken utterance. When it
   * detects that the user has paused or stopped speaking, it will return an
   * `END_OF_SINGLE_UTTERANCE` event and cease recognition. It will return no
   * more than one `StreamingRecognitionResult` with the `is_final` flag set to
   * `true`.
   */
  singleUtterance: boolean;
  /**
   * If `true`, interim results (tentative hypotheses) may be
   * returned as they become available (these interim results are indicated with
   * the `is_final=false` flag).
   * If `false` or omitted, only `is_final=true` result(s) are returned.
   */
  interimResults: boolean;
}

/**
 * Provides information to the recognizer that specifies how to process the
 * request.
 */
export interface RecognitionConfig {
  /**
   * Encoding of audio data sent in all `RecognitionAudio` messages.
   * This field is optional for `FLAC` and `WAV` audio files and required
   * for all other audio formats. For details, see
   * [AudioEncoding][tiro.speech.v1alpha.RecognitionConfig.AudioEncoding].
   */
  encoding: RecognitionConfig_AudioEncoding;
  /**
   * Sample rate in Hertz of the audio data sent in all
   * `RecognitionAudio` messages. Valid values are: 8000-48000.
   * 16000 is optimal. For best results, set the sampling rate of the audio
   * source to 16000 Hz. If that's not possible, use the native sample rate of
   * the audio source (instead of re-sampling).
   * [AudioEncoding][tiro.speech.v1alpha.RecognitionConfig.AudioEncoding].
   */
  sampleRateHertz: number;
  /**
   * Required. The language of the supplied audio as a
   * [BCP-47](https://www.rfc-editor.org/rfc/bcp/bcp47.txt) language tag.
   * Example: "is-IS".
   */
  languageCode: string;
  /**
   * Maximum number of recognition hypotheses to be returned.
   * Specifically, the maximum number of `SpeechRecognitionAlternative` messages
   * within each `SpeechRecognitionResult`.
   * The server may return fewer than `max_alternatives`.
   * Valid values are `0`-`30`. A value of `0` or `1` will return a maximum of
   * one. If omitted, will return a maximum of one.
   */
  maxAlternatives: number;
  /**
   * If `true`, the top result includes a list of words and
   * the start and end time offsets (timestamps) for those words. If
   * `false`, no word-level time offset information is returned. The default is
   * `false`.
   */
  enableWordTimeOffsets: boolean;
  /** Metadata regarding this request. */
  metadata:
    | RecognitionMetadata
    | undefined;
  /** If 'true', adds punctuation to recognition result hypotheses. */
  enableAutomaticPunctuation: boolean;
  diarizationConfig: SpeakerDiarizationConfig | undefined;
}

/**
 * The encoding of the audio data sent in the request.
 *
 * All encodings support only 1 channel (mono) audio
 *
 * For best results, the audio source should be captured and transmitted using
 * a lossless encoding (`FLAC` or `LINEAR16`). The accuracy of the speech
 * recognition can be reduced if lossy codecs are used to capture or transmit
 * audio.
 */
export enum RecognitionConfig_AudioEncoding {
  /** ENCODING_UNSPECIFIED - Not specified. */
  ENCODING_UNSPECIFIED = 0,
  /** LINEAR16 - Uncompressed 16-bit signed little-endian samples (Linear PCM). */
  LINEAR16 = 1,
  /**
   * FLAC - `FLAC` (Free Lossless Audio
   * Codec) is the recommended encoding because it is
   * lossless--therefore recognition is not compromised--and
   * requires only about half the bandwidth of `LINEAR16`. `FLAC` stream
   * encoding supports 16-bit and 24-bit samples, however, not all fields in
   * `STREAMINFO` are supported.
   */
  FLAC = 2,
  /**
   * MP3 - MP3 audio. Support all standard MP3 bitrates (which range from 32-320
   * kbps). When using this encoding, `sample_rate_hertz` has to match the
   * sample rate of the file being used.
   */
  MP3 = 8,
  UNRECOGNIZED = -1,
}

/** Config to enable speaker diarization. */
export interface SpeakerDiarizationConfig {
  /**
   * If 'true', enables speaker detection for each recognized word in
   * the top alternative of the recognition result using a speaker_tag provided
   * in the WordInfo.
   */
  enableSpeakerDiarization: boolean;
  /**
   * Minimum number of speakers in the conversation. This range gives you more
   * flexibility by allowing the system to automatically determine the correct
   * number of speakers. If not set, the default value is 2.
   */
  minSpeakerCount: number;
  /**
   * Maximum number of speakers in the conversation. This range gives you more
   * flexibility by allowing the system to automatically determine the correct
   * number of speakers. If not set, the default value is 6.
   */
  maxSpeakerCount: number;
}

/** Description of audio data to be recognized. */
export interface RecognitionMetadata {
  /** The use case most closely describing the audio content to be recognized. */
  interactionType: RecognitionMetadata_InteractionType;
  /**
   * The industry vertical to which this speech recognition request most
   * closely applies. This is most indicative of the topics contained
   * in the audio.  Use the 6-digit NAICS code to identify the industry
   * vertical - see https://www.naics.com/search/.
   */
  industryNaicsCodeOfAudio: number;
  /** The audio type that most closely describes the audio being recognized. */
  microphoneDistance: RecognitionMetadata_MicrophoneDistance;
  /** The original media the speech was recorded on. */
  originalMediaType: RecognitionMetadata_OriginalMediaType;
  /** The type of device the speech was recorded with. */
  recordingDeviceType: RecognitionMetadata_RecordingDeviceType;
  /**
   * The device used to make the recording.  Examples 'Nexus 5X' or
   * 'Polycom SoundStation IP 6000' or 'POTS' or 'VoIP' or
   * 'Cardioid Microphone'.
   */
  recordingDeviceName: string;
  /**
   * Mime type of the original audio file.  For example `audio/m4a`,
   * `audio/x-alaw-basic`, `audio/mp3`, `audio/3gpp`.
   * A list of possible audio mime types is maintained at
   * http://www.iana.org/assignments/media-types/media-types.xhtml#audio
   */
  originalMimeType: string;
  /**
   * Description of the content. Eg. "Recordings of federal supreme court
   * hearings from 2012".
   */
  audioTopic: string;
}

/**
 * Use case categories that the audio recognition request can be described
 * by.
 */
export enum RecognitionMetadata_InteractionType {
  /**
   * INTERACTION_TYPE_UNSPECIFIED - Use case is either unknown or is something other than one of the other
   * values below.
   */
  INTERACTION_TYPE_UNSPECIFIED = 0,
  /**
   * DISCUSSION - Multiple people in a conversation or discussion. For example in a
   * meeting with two or more people actively participating. Typically
   * all the primary people speaking would be in the same room (if not,
   * see PHONE_CALL)
   */
  DISCUSSION = 1,
  /**
   * PRESENTATION - One or more persons lecturing or presenting to others, mostly
   * uninterrupted.
   */
  PRESENTATION = 2,
  /**
   * PHONE_CALL - A phone-call or video-conference in which two or more people, who are
   * not in the same room, are actively participating.
   */
  PHONE_CALL = 3,
  /** VOICEMAIL - A recorded message intended for another person to listen to. */
  VOICEMAIL = 4,
  /** PROFESSIONALLY_PRODUCED - Professionally produced audio (eg. TV Show, Podcast). */
  PROFESSIONALLY_PRODUCED = 5,
  /** VOICE_SEARCH - Transcribe spoken questions and queries into text. */
  VOICE_SEARCH = 6,
  /** VOICE_COMMAND - Transcribe voice commands, such as for controlling a device. */
  VOICE_COMMAND = 7,
  /**
   * DICTATION - Transcribe speech to text to create a written document, such as a
   * text-message, email or report.
   */
  DICTATION = 8,
  UNRECOGNIZED = -1,
}

/** Enumerates the types of capture settings describing an audio file. */
export enum RecognitionMetadata_MicrophoneDistance {
  /** MICROPHONE_DISTANCE_UNSPECIFIED - Audio type is not known. */
  MICROPHONE_DISTANCE_UNSPECIFIED = 0,
  /**
   * NEARFIELD - The audio was captured from a closely placed microphone. Eg. phone,
   * dictaphone, or handheld microphone. Generally if there speaker is within
   * 1 meter of the microphone.
   */
  NEARFIELD = 1,
  /** MIDFIELD - The speaker if within 3 meters of the microphone. */
  MIDFIELD = 2,
  /** FARFIELD - The speaker is more than 3 meters away from the microphone. */
  FARFIELD = 3,
  UNRECOGNIZED = -1,
}

/** The original media the speech was recorded on. */
export enum RecognitionMetadata_OriginalMediaType {
  /** ORIGINAL_MEDIA_TYPE_UNSPECIFIED - Unknown original media type. */
  ORIGINAL_MEDIA_TYPE_UNSPECIFIED = 0,
  /** AUDIO - The speech data is an audio recording. */
  AUDIO = 1,
  /** VIDEO - The speech data originally recorded on a video. */
  VIDEO = 2,
  UNRECOGNIZED = -1,
}

/** The type of device the speech was recorded with. */
export enum RecognitionMetadata_RecordingDeviceType {
  /** RECORDING_DEVICE_TYPE_UNSPECIFIED - The recording device is unknown. */
  RECORDING_DEVICE_TYPE_UNSPECIFIED = 0,
  /** SMARTPHONE - Speech was recorded on a smartphone. */
  SMARTPHONE = 1,
  /** PC - Speech was recorded using a personal computer or tablet. */
  PC = 2,
  /** PHONE_LINE - Speech was recorded over a phone line. */
  PHONE_LINE = 3,
  /** VEHICLE - Speech was recorded in a vehicle. */
  VEHICLE = 4,
  /** OTHER_OUTDOOR_DEVICE - Speech was recorded outdoors. */
  OTHER_OUTDOOR_DEVICE = 5,
  /** OTHER_INDOOR_DEVICE - Speech was recorded indoors. */
  OTHER_INDOOR_DEVICE = 6,
  UNRECOGNIZED = -1,
}

/**
 * Contains audio data in the encoding specified in the `RecognitionConfig`.
 * Either `content` or `uri` must be supplied. Supplying both or neither
 * returns [google.rpc.Code.INVALID_ARGUMENT][google.rpc.Code.INVALID_ARGUMENT].
 * See [content limits](https://cloud.google.com/speech-to-text/quotas#content).
 */
export interface RecognitionAudio {
  /**
   * The audio data bytes encoded as specified in
   * `RecognitionConfig`. Note: as with all bytes fields, proto buffers use a
   * pure binary representation, whereas JSON representations use base64.
   */
  content?:
    | Uint8Array
    | undefined;
  /**
   * URI that points to a file that contains audio data bytes as specified in
   * `RecognitionConfig`. The file must not be compressed (for example, gzip).
   */
  uri?: string | undefined;
}

/**
 * The only message returned to the client by the `Recognize` method. It
 * contains the result as zero or more sequential `SpeechRecognitionResult`
 * messages.
 */
export interface RecognizeResponse {
  /**
   * Sequential list of transcription results corresponding to
   * sequential portions of audio.
   */
  results: SpeechRecognitionResult[];
}

/**
 * `StreamingRecognizeResponse` is the only message returned to the client by
 * `StreamingRecognize`. A series of zero or more `StreamingRecognizeResponse`
 * messages are streamed back to the client. If there is no recognizable
 * audio, and `single_utterance` is set to false, then no messages are streamed
 * back to the client.
 *
 * Here's an example of a series of ten `StreamingRecognizeResponse`s that might
 * be returned while processing audio:
 *
 * 1. results { alternatives { transcript: "tube" } stability: 0.01 }
 *
 * 2. results { alternatives { transcript: "to be a" } stability: 0.01 }
 *
 * 3. results { alternatives { transcript: "to be" } stability: 0.9 }
 *    results { alternatives { transcript: " or not to be" } stability: 0.01 }
 *
 * 4. results { alternatives { transcript: "to be or not to be"
 *                             confidence: 0.92 }
 *              alternatives { transcript: "to bee or not to bee" }
 *              is_final: true }
 *
 * 5. results { alternatives { transcript: " that's" } stability: 0.01 }
 *
 * 6. results { alternatives { transcript: " that is" } stability: 0.9 }
 *    results { alternatives { transcript: " the question" } stability: 0.01 }
 *
 * 7. results { alternatives { transcript: " that is the question"
 *                             confidence: 0.98 }
 *              alternatives { transcript: " that was the question" }
 *              is_final: true }
 *
 * Notes:
 *
 * - Only two of the above responses #4 and #7 contain final results; they are
 *   indicated by `is_final: true`. Concatenating these together generates the
 *   full transcript: "to be or not to be that is the question".
 *
 * - The others contain interim `results`. #3 and #6 contain two interim
 *   `results`: the first portion has a high stability and is less likely to
 *   change; the second portion has a low stability and is very likely to
 *   change. A UI designer might choose to show only high stability `results`.
 *
 * - The specific `stability` and `confidence` values shown above are only for
 *   illustrative purposes. Actual values may vary.
 *
 * - In each response, only one of these fields will be set:
 *     `error`,
 *     `speech_event_type`, or
 *     one or more (repeated) `results`.
 */
export interface StreamingRecognizeResponse {
  /**
   * If set, returns a [google.rpc.Status][google.rpc.Status] message that
   * specifies the error for the operation.
   */
  error:
    | Status
    | undefined;
  /**
   * This repeated list contains zero or more results that
   * correspond to consecutive portions of the audio currently being processed.
   * It contains zero or one `is_final=true` result (the newly settled portion),
   * followed by zero or more `is_final=false` results (the interim results).
   */
  results: StreamingRecognitionResult[];
  /** Indicates the type of speech event. */
  speechEventType: StreamingRecognizeResponse_SpeechEventType;
}

/** Indicates the type of speech event. */
export enum StreamingRecognizeResponse_SpeechEventType {
  /** SPEECH_EVENT_UNSPECIFIED - No speech event specified. */
  SPEECH_EVENT_UNSPECIFIED = 0,
  /**
   * END_OF_SINGLE_UTTERANCE - This event indicates that the server has detected the end of the user's
   * speech utterance and expects no additional speech. Therefore, the server
   * will not process additional audio (although it may subsequently return
   * additional results). The client should stop sending additional audio
   * data, half-close the gRPC connection, and wait for any additional results
   * until the server closes the gRPC connection. This event is only sent if
   * `single_utterance` was set to `true`, and is not used otherwise.
   */
  END_OF_SINGLE_UTTERANCE = 1,
  UNRECOGNIZED = -1,
}

/**
 * A streaming speech recognition result corresponding to a portion of the audio
 * that is currently being processed.
 */
export interface StreamingRecognitionResult {
  /**
   * May contain one or more recognition hypotheses (up to the
   * maximum specified in `max_alternatives`).
   * These alternatives are ordered in terms of accuracy, with the top (first)
   * alternative being the most probable, as ranked by the recognizer.
   */
  alternatives: SpeechRecognitionAlternative[];
  /**
   * If `false`, this `StreamingRecognitionResult` represents an
   * interim result that may change. If `true`, this is the final time the
   * speech service will return this particular `StreamingRecognitionResult`,
   * the recognizer will not return any further hypotheses for this portion of
   * the transcript and corresponding audio.
   */
  isFinal: boolean;
  /**
   * An estimate of the likelihood that the recognizer will not
   * change its guess about this interim result. Values range from 0.0
   * (completely unstable) to 1.0 (completely stable).
   * This field is only provided for interim results (`is_final=false`).
   * The default of 0.0 is a sentinel value indicating `stability` was not set.
   */
  stability: number;
}

/** A speech recognition result corresponding to a portion of the audio. */
export interface SpeechRecognitionResult {
  /**
   * May contain one or more recognition hypotheses (up to the
   * maximum specified in `max_alternatives`).
   * These alternatives are ordered in terms of accuracy, with the top (first)
   * alternative being the most probable, as ranked by the recognizer.
   */
  alternatives: SpeechRecognitionAlternative[];
}

/** Alternative hypotheses (a.k.a. n-best list). */
export interface SpeechRecognitionAlternative {
  /** Transcript text representing the words that the user spoke. */
  transcript: string;
  /**
   * The confidence estimate between 0.0 and 1.0. A higher number
   * indicates an estimated greater likelihood that the recognized words are
   * correct. This field is set only for the top alternative of a non-streaming
   * result or, of a streaming result where `is_final=true`.
   * This field is not guaranteed to be accurate and users should not rely on it
   * to be always provided.
   * The default of 0.0 is a sentinel value indicating `confidence` was not set.
   */
  confidence: number;
  /**
   * A list of word-specific information for each recognized word.
   * Note: When `enable_speaker_diarization` is true, you will see all the words
   * from the beginning of the audio.
   */
  words: WordInfo[];
}

/** Word-specific information for recognized words. */
export interface WordInfo {
  /**
   * Time offset relative to the beginning of the audio,
   * and corresponding to the start of the spoken word.
   * This field is only set if `enable_word_time_offsets=true` and only
   * in the top hypothesis.
   */
  startTime:
    | Duration
    | undefined;
  /**
   * Time offset relative to the beginning of the audio,
   * and corresponding to the end of the spoken word.
   * This field is only set if `enable_word_time_offsets=true` and only
   * in the top hypothesis.
   */
  endTime:
    | Duration
    | undefined;
  /** The word corresponding to this set of information. */
  word: string;
  /**
   * The confidence estimate between 0.0 and 1.0. A higher number
   * indicates an estimated greater likelihood that the recognized words are
   * correct. This field is set only for the top alternative of a non-streaming
   * result or, of a streaming result where `is_final=true`.
   * This field is not guaranteed to be accurate and users should not rely on it
   * to be always provided.
   * The default of 0.0 is a sentinel value indicating `confidence` was not set.
   */
  confidence: number;
  /**
   * A distinct integer value is assigned for every speaker within
   * the audio. This field specifies which one of those speakers was detected to
   * have spoken this word. Value ranges from '1' to diarization_speaker_count.
   * speaker_tag is set if enable_speaker_diarization = 'true' and only in the
   * top alternative.
   */
  speakerTag: number;
}

function createBaseRecognizeRequest(): RecognizeRequest {
  return { config: undefined, audio: undefined };
}

export const RecognizeRequest = {
  encode(message: RecognizeRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.config !== undefined) {
      RecognitionConfig.encode(message.config, writer.uint32(10).fork()).ldelim();
    }
    if (message.audio !== undefined) {
      RecognitionAudio.encode(message.audio, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RecognizeRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRecognizeRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.config = RecognitionConfig.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag != 18) {
            break;
          }

          message.audio = RecognitionAudio.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<RecognizeRequest>): RecognizeRequest {
    return RecognizeRequest.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<RecognizeRequest>): RecognizeRequest {
    const message = createBaseRecognizeRequest();
    message.config = (object.config !== undefined && object.config !== null)
      ? RecognitionConfig.fromPartial(object.config)
      : undefined;
    message.audio = (object.audio !== undefined && object.audio !== null)
      ? RecognitionAudio.fromPartial(object.audio)
      : undefined;
    return message;
  },
};

function createBaseStreamingRecognizeRequest(): StreamingRecognizeRequest {
  return { streamingConfig: undefined, audioContent: undefined };
}

export const StreamingRecognizeRequest = {
  encode(message: StreamingRecognizeRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.streamingConfig !== undefined) {
      StreamingRecognitionConfig.encode(message.streamingConfig, writer.uint32(10).fork()).ldelim();
    }
    if (message.audioContent !== undefined) {
      writer.uint32(18).bytes(message.audioContent);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StreamingRecognizeRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStreamingRecognizeRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.streamingConfig = StreamingRecognitionConfig.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag != 18) {
            break;
          }

          message.audioContent = reader.bytes();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<StreamingRecognizeRequest>): StreamingRecognizeRequest {
    return StreamingRecognizeRequest.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<StreamingRecognizeRequest>): StreamingRecognizeRequest {
    const message = createBaseStreamingRecognizeRequest();
    message.streamingConfig = (object.streamingConfig !== undefined && object.streamingConfig !== null)
      ? StreamingRecognitionConfig.fromPartial(object.streamingConfig)
      : undefined;
    message.audioContent = object.audioContent ?? undefined;
    return message;
  },
};

function createBaseStreamingRecognitionConfig(): StreamingRecognitionConfig {
  return { config: undefined, singleUtterance: false, interimResults: false };
}

export const StreamingRecognitionConfig = {
  encode(message: StreamingRecognitionConfig, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.config !== undefined) {
      RecognitionConfig.encode(message.config, writer.uint32(10).fork()).ldelim();
    }
    if (message.singleUtterance === true) {
      writer.uint32(16).bool(message.singleUtterance);
    }
    if (message.interimResults === true) {
      writer.uint32(24).bool(message.interimResults);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StreamingRecognitionConfig {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStreamingRecognitionConfig();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.config = RecognitionConfig.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag != 16) {
            break;
          }

          message.singleUtterance = reader.bool();
          continue;
        case 3:
          if (tag != 24) {
            break;
          }

          message.interimResults = reader.bool();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<StreamingRecognitionConfig>): StreamingRecognitionConfig {
    return StreamingRecognitionConfig.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<StreamingRecognitionConfig>): StreamingRecognitionConfig {
    const message = createBaseStreamingRecognitionConfig();
    message.config = (object.config !== undefined && object.config !== null)
      ? RecognitionConfig.fromPartial(object.config)
      : undefined;
    message.singleUtterance = object.singleUtterance ?? false;
    message.interimResults = object.interimResults ?? false;
    return message;
  },
};

function createBaseRecognitionConfig(): RecognitionConfig {
  return {
    encoding: 0,
    sampleRateHertz: 0,
    languageCode: "",
    maxAlternatives: 0,
    enableWordTimeOffsets: false,
    metadata: undefined,
    enableAutomaticPunctuation: false,
    diarizationConfig: undefined,
  };
}

export const RecognitionConfig = {
  encode(message: RecognitionConfig, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.encoding !== 0) {
      writer.uint32(8).int32(message.encoding);
    }
    if (message.sampleRateHertz !== 0) {
      writer.uint32(16).int32(message.sampleRateHertz);
    }
    if (message.languageCode !== "") {
      writer.uint32(26).string(message.languageCode);
    }
    if (message.maxAlternatives !== 0) {
      writer.uint32(32).int32(message.maxAlternatives);
    }
    if (message.enableWordTimeOffsets === true) {
      writer.uint32(64).bool(message.enableWordTimeOffsets);
    }
    if (message.metadata !== undefined) {
      RecognitionMetadata.encode(message.metadata, writer.uint32(74).fork()).ldelim();
    }
    if (message.enableAutomaticPunctuation === true) {
      writer.uint32(88).bool(message.enableAutomaticPunctuation);
    }
    if (message.diarizationConfig !== undefined) {
      SpeakerDiarizationConfig.encode(message.diarizationConfig, writer.uint32(154).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RecognitionConfig {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRecognitionConfig();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 8) {
            break;
          }

          message.encoding = reader.int32() as any;
          continue;
        case 2:
          if (tag != 16) {
            break;
          }

          message.sampleRateHertz = reader.int32();
          continue;
        case 3:
          if (tag != 26) {
            break;
          }

          message.languageCode = reader.string();
          continue;
        case 4:
          if (tag != 32) {
            break;
          }

          message.maxAlternatives = reader.int32();
          continue;
        case 8:
          if (tag != 64) {
            break;
          }

          message.enableWordTimeOffsets = reader.bool();
          continue;
        case 9:
          if (tag != 74) {
            break;
          }

          message.metadata = RecognitionMetadata.decode(reader, reader.uint32());
          continue;
        case 11:
          if (tag != 88) {
            break;
          }

          message.enableAutomaticPunctuation = reader.bool();
          continue;
        case 19:
          if (tag != 154) {
            break;
          }

          message.diarizationConfig = SpeakerDiarizationConfig.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<RecognitionConfig>): RecognitionConfig {
    return RecognitionConfig.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<RecognitionConfig>): RecognitionConfig {
    const message = createBaseRecognitionConfig();
    message.encoding = object.encoding ?? 0;
    message.sampleRateHertz = object.sampleRateHertz ?? 0;
    message.languageCode = object.languageCode ?? "";
    message.maxAlternatives = object.maxAlternatives ?? 0;
    message.enableWordTimeOffsets = object.enableWordTimeOffsets ?? false;
    message.metadata = (object.metadata !== undefined && object.metadata !== null)
      ? RecognitionMetadata.fromPartial(object.metadata)
      : undefined;
    message.enableAutomaticPunctuation = object.enableAutomaticPunctuation ?? false;
    message.diarizationConfig = (object.diarizationConfig !== undefined && object.diarizationConfig !== null)
      ? SpeakerDiarizationConfig.fromPartial(object.diarizationConfig)
      : undefined;
    return message;
  },
};

function createBaseSpeakerDiarizationConfig(): SpeakerDiarizationConfig {
  return { enableSpeakerDiarization: false, minSpeakerCount: 0, maxSpeakerCount: 0 };
}

export const SpeakerDiarizationConfig = {
  encode(message: SpeakerDiarizationConfig, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.enableSpeakerDiarization === true) {
      writer.uint32(8).bool(message.enableSpeakerDiarization);
    }
    if (message.minSpeakerCount !== 0) {
      writer.uint32(16).int32(message.minSpeakerCount);
    }
    if (message.maxSpeakerCount !== 0) {
      writer.uint32(24).int32(message.maxSpeakerCount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SpeakerDiarizationConfig {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSpeakerDiarizationConfig();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 8) {
            break;
          }

          message.enableSpeakerDiarization = reader.bool();
          continue;
        case 2:
          if (tag != 16) {
            break;
          }

          message.minSpeakerCount = reader.int32();
          continue;
        case 3:
          if (tag != 24) {
            break;
          }

          message.maxSpeakerCount = reader.int32();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<SpeakerDiarizationConfig>): SpeakerDiarizationConfig {
    return SpeakerDiarizationConfig.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<SpeakerDiarizationConfig>): SpeakerDiarizationConfig {
    const message = createBaseSpeakerDiarizationConfig();
    message.enableSpeakerDiarization = object.enableSpeakerDiarization ?? false;
    message.minSpeakerCount = object.minSpeakerCount ?? 0;
    message.maxSpeakerCount = object.maxSpeakerCount ?? 0;
    return message;
  },
};

function createBaseRecognitionMetadata(): RecognitionMetadata {
  return {
    interactionType: 0,
    industryNaicsCodeOfAudio: 0,
    microphoneDistance: 0,
    originalMediaType: 0,
    recordingDeviceType: 0,
    recordingDeviceName: "",
    originalMimeType: "",
    audioTopic: "",
  };
}

export const RecognitionMetadata = {
  encode(message: RecognitionMetadata, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.interactionType !== 0) {
      writer.uint32(8).int32(message.interactionType);
    }
    if (message.industryNaicsCodeOfAudio !== 0) {
      writer.uint32(24).uint32(message.industryNaicsCodeOfAudio);
    }
    if (message.microphoneDistance !== 0) {
      writer.uint32(32).int32(message.microphoneDistance);
    }
    if (message.originalMediaType !== 0) {
      writer.uint32(40).int32(message.originalMediaType);
    }
    if (message.recordingDeviceType !== 0) {
      writer.uint32(48).int32(message.recordingDeviceType);
    }
    if (message.recordingDeviceName !== "") {
      writer.uint32(58).string(message.recordingDeviceName);
    }
    if (message.originalMimeType !== "") {
      writer.uint32(66).string(message.originalMimeType);
    }
    if (message.audioTopic !== "") {
      writer.uint32(82).string(message.audioTopic);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RecognitionMetadata {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRecognitionMetadata();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 8) {
            break;
          }

          message.interactionType = reader.int32() as any;
          continue;
        case 3:
          if (tag != 24) {
            break;
          }

          message.industryNaicsCodeOfAudio = reader.uint32();
          continue;
        case 4:
          if (tag != 32) {
            break;
          }

          message.microphoneDistance = reader.int32() as any;
          continue;
        case 5:
          if (tag != 40) {
            break;
          }

          message.originalMediaType = reader.int32() as any;
          continue;
        case 6:
          if (tag != 48) {
            break;
          }

          message.recordingDeviceType = reader.int32() as any;
          continue;
        case 7:
          if (tag != 58) {
            break;
          }

          message.recordingDeviceName = reader.string();
          continue;
        case 8:
          if (tag != 66) {
            break;
          }

          message.originalMimeType = reader.string();
          continue;
        case 10:
          if (tag != 82) {
            break;
          }

          message.audioTopic = reader.string();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<RecognitionMetadata>): RecognitionMetadata {
    return RecognitionMetadata.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<RecognitionMetadata>): RecognitionMetadata {
    const message = createBaseRecognitionMetadata();
    message.interactionType = object.interactionType ?? 0;
    message.industryNaicsCodeOfAudio = object.industryNaicsCodeOfAudio ?? 0;
    message.microphoneDistance = object.microphoneDistance ?? 0;
    message.originalMediaType = object.originalMediaType ?? 0;
    message.recordingDeviceType = object.recordingDeviceType ?? 0;
    message.recordingDeviceName = object.recordingDeviceName ?? "";
    message.originalMimeType = object.originalMimeType ?? "";
    message.audioTopic = object.audioTopic ?? "";
    return message;
  },
};

function createBaseRecognitionAudio(): RecognitionAudio {
  return { content: undefined, uri: undefined };
}

export const RecognitionAudio = {
  encode(message: RecognitionAudio, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.content !== undefined) {
      writer.uint32(10).bytes(message.content);
    }
    if (message.uri !== undefined) {
      writer.uint32(18).string(message.uri);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RecognitionAudio {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRecognitionAudio();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.content = reader.bytes();
          continue;
        case 2:
          if (tag != 18) {
            break;
          }

          message.uri = reader.string();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<RecognitionAudio>): RecognitionAudio {
    return RecognitionAudio.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<RecognitionAudio>): RecognitionAudio {
    const message = createBaseRecognitionAudio();
    message.content = object.content ?? undefined;
    message.uri = object.uri ?? undefined;
    return message;
  },
};

function createBaseRecognizeResponse(): RecognizeResponse {
  return { results: [] };
}

export const RecognizeResponse = {
  encode(message: RecognizeResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.results) {
      SpeechRecognitionResult.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RecognizeResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRecognizeResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          if (tag != 18) {
            break;
          }

          message.results.push(SpeechRecognitionResult.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<RecognizeResponse>): RecognizeResponse {
    return RecognizeResponse.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<RecognizeResponse>): RecognizeResponse {
    const message = createBaseRecognizeResponse();
    message.results = object.results?.map((e) => SpeechRecognitionResult.fromPartial(e)) || [];
    return message;
  },
};

function createBaseStreamingRecognizeResponse(): StreamingRecognizeResponse {
  return { error: undefined, results: [], speechEventType: 0 };
}

export const StreamingRecognizeResponse = {
  encode(message: StreamingRecognizeResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.error !== undefined) {
      Status.encode(message.error, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.results) {
      StreamingRecognitionResult.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    if (message.speechEventType !== 0) {
      writer.uint32(32).int32(message.speechEventType);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StreamingRecognizeResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStreamingRecognizeResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.error = Status.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag != 18) {
            break;
          }

          message.results.push(StreamingRecognitionResult.decode(reader, reader.uint32()));
          continue;
        case 4:
          if (tag != 32) {
            break;
          }

          message.speechEventType = reader.int32() as any;
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<StreamingRecognizeResponse>): StreamingRecognizeResponse {
    return StreamingRecognizeResponse.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<StreamingRecognizeResponse>): StreamingRecognizeResponse {
    const message = createBaseStreamingRecognizeResponse();
    message.error = (object.error !== undefined && object.error !== null)
      ? Status.fromPartial(object.error)
      : undefined;
    message.results = object.results?.map((e) => StreamingRecognitionResult.fromPartial(e)) || [];
    message.speechEventType = object.speechEventType ?? 0;
    return message;
  },
};

function createBaseStreamingRecognitionResult(): StreamingRecognitionResult {
  return { alternatives: [], isFinal: false, stability: 0 };
}

export const StreamingRecognitionResult = {
  encode(message: StreamingRecognitionResult, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.alternatives) {
      SpeechRecognitionAlternative.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.isFinal === true) {
      writer.uint32(16).bool(message.isFinal);
    }
    if (message.stability !== 0) {
      writer.uint32(29).float(message.stability);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StreamingRecognitionResult {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStreamingRecognitionResult();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.alternatives.push(SpeechRecognitionAlternative.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag != 16) {
            break;
          }

          message.isFinal = reader.bool();
          continue;
        case 3:
          if (tag != 29) {
            break;
          }

          message.stability = reader.float();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<StreamingRecognitionResult>): StreamingRecognitionResult {
    return StreamingRecognitionResult.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<StreamingRecognitionResult>): StreamingRecognitionResult {
    const message = createBaseStreamingRecognitionResult();
    message.alternatives = object.alternatives?.map((e) => SpeechRecognitionAlternative.fromPartial(e)) || [];
    message.isFinal = object.isFinal ?? false;
    message.stability = object.stability ?? 0;
    return message;
  },
};

function createBaseSpeechRecognitionResult(): SpeechRecognitionResult {
  return { alternatives: [] };
}

export const SpeechRecognitionResult = {
  encode(message: SpeechRecognitionResult, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.alternatives) {
      SpeechRecognitionAlternative.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SpeechRecognitionResult {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSpeechRecognitionResult();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.alternatives.push(SpeechRecognitionAlternative.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<SpeechRecognitionResult>): SpeechRecognitionResult {
    return SpeechRecognitionResult.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<SpeechRecognitionResult>): SpeechRecognitionResult {
    const message = createBaseSpeechRecognitionResult();
    message.alternatives = object.alternatives?.map((e) => SpeechRecognitionAlternative.fromPartial(e)) || [];
    return message;
  },
};

function createBaseSpeechRecognitionAlternative(): SpeechRecognitionAlternative {
  return { transcript: "", confidence: 0, words: [] };
}

export const SpeechRecognitionAlternative = {
  encode(message: SpeechRecognitionAlternative, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.transcript !== "") {
      writer.uint32(10).string(message.transcript);
    }
    if (message.confidence !== 0) {
      writer.uint32(21).float(message.confidence);
    }
    for (const v of message.words) {
      WordInfo.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SpeechRecognitionAlternative {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSpeechRecognitionAlternative();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.transcript = reader.string();
          continue;
        case 2:
          if (tag != 21) {
            break;
          }

          message.confidence = reader.float();
          continue;
        case 3:
          if (tag != 26) {
            break;
          }

          message.words.push(WordInfo.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<SpeechRecognitionAlternative>): SpeechRecognitionAlternative {
    return SpeechRecognitionAlternative.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<SpeechRecognitionAlternative>): SpeechRecognitionAlternative {
    const message = createBaseSpeechRecognitionAlternative();
    message.transcript = object.transcript ?? "";
    message.confidence = object.confidence ?? 0;
    message.words = object.words?.map((e) => WordInfo.fromPartial(e)) || [];
    return message;
  },
};

function createBaseWordInfo(): WordInfo {
  return { startTime: undefined, endTime: undefined, word: "", confidence: 0, speakerTag: 0 };
}

export const WordInfo = {
  encode(message: WordInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.startTime !== undefined) {
      Duration.encode(message.startTime, writer.uint32(10).fork()).ldelim();
    }
    if (message.endTime !== undefined) {
      Duration.encode(message.endTime, writer.uint32(18).fork()).ldelim();
    }
    if (message.word !== "") {
      writer.uint32(26).string(message.word);
    }
    if (message.confidence !== 0) {
      writer.uint32(37).float(message.confidence);
    }
    if (message.speakerTag !== 0) {
      writer.uint32(40).int32(message.speakerTag);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): WordInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseWordInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.startTime = Duration.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag != 18) {
            break;
          }

          message.endTime = Duration.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag != 26) {
            break;
          }

          message.word = reader.string();
          continue;
        case 4:
          if (tag != 37) {
            break;
          }

          message.confidence = reader.float();
          continue;
        case 5:
          if (tag != 40) {
            break;
          }

          message.speakerTag = reader.int32();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<WordInfo>): WordInfo {
    return WordInfo.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<WordInfo>): WordInfo {
    const message = createBaseWordInfo();
    message.startTime = (object.startTime !== undefined && object.startTime !== null)
      ? Duration.fromPartial(object.startTime)
      : undefined;
    message.endTime = (object.endTime !== undefined && object.endTime !== null)
      ? Duration.fromPartial(object.endTime)
      : undefined;
    message.word = object.word ?? "";
    message.confidence = object.confidence ?? 0;
    message.speakerTag = object.speakerTag ?? 0;
    return message;
  },
};

/** Service that implements Google Cloud Speech API. */
export type SpeechDefinition = typeof SpeechDefinition;
export const SpeechDefinition = {
  name: "Speech",
  fullName: "tiro.speech.v1alpha.Speech",
  methods: {
    /**
     * Performs synchronous speech recognition: receive results after all audio
     * has been sent and processed.
     */
    recognize: {
      name: "Recognize",
      requestType: RecognizeRequest,
      requestStream: false,
      responseType: RecognizeResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          8410: [new Uint8Array([12, 99, 111, 110, 102, 105, 103, 44, 97, 117, 100, 105, 111])],
          578365826: [
            new Uint8Array([
              30,
              34,
              25,
              47,
              118,
              49,
              97,
              108,
              112,
              104,
              97,
              47,
              115,
              112,
              101,
              101,
              99,
              104,
              58,
              114,
              101,
              99,
              111,
              103,
              110,
              105,
              122,
              101,
              58,
              1,
              42,
            ]),
          ],
        },
      },
    },
    /**
     * Performs bidirectional streaming speech recognition: receive results while
     * sending audio. This method is only available via the gRPC API (not REST).
     */
    streamingRecognize: {
      name: "StreamingRecognize",
      requestType: StreamingRecognizeRequest,
      requestStream: true,
      responseType: StreamingRecognizeResponse,
      responseStream: true,
      options: {},
    },
  },
} as const;

export interface SpeechServiceImplementation<CallContextExt = {}> {
  /**
   * Performs synchronous speech recognition: receive results after all audio
   * has been sent and processed.
   */
  recognize(request: RecognizeRequest, context: CallContext & CallContextExt): Promise<DeepPartial<RecognizeResponse>>;
  /**
   * Performs bidirectional streaming speech recognition: receive results while
   * sending audio. This method is only available via the gRPC API (not REST).
   */
  streamingRecognize(
    request: AsyncIterable<StreamingRecognizeRequest>,
    context: CallContext & CallContextExt,
  ): ServerStreamingMethodResult<DeepPartial<StreamingRecognizeResponse>>;
}

export interface SpeechClient<CallOptionsExt = {}> {
  /**
   * Performs synchronous speech recognition: receive results after all audio
   * has been sent and processed.
   */
  recognize(request: DeepPartial<RecognizeRequest>, options?: CallOptions & CallOptionsExt): Promise<RecognizeResponse>;
  /**
   * Performs bidirectional streaming speech recognition: receive results while
   * sending audio. This method is only available via the gRPC API (not REST).
   */
  streamingRecognize(
    request: AsyncIterable<DeepPartial<StreamingRecognizeRequest>>,
    options?: CallOptions & CallOptionsExt,
  ): AsyncIterable<StreamingRecognizeResponse>;
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

export type ServerStreamingMethodResult<Response> = { [Symbol.asyncIterator](): AsyncIterator<Response, void> };
