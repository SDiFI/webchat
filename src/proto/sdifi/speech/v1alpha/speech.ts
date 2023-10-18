/* eslint-disable */
import type { CallContext, CallOptions } from "nice-grpc-common";
import _m0 from "protobufjs/minimal";
import { Duration } from "../../../google/protobuf/duration";
import { Status } from "../../../google/rpc/status";

export const protobufPackage = "sdifi.speech.v1alpha";

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
   * pure binary representation (not base64).
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
  /** Identifier for which conversation this speech stream belongs to */
  conversation: string;
}

/**
 * Provides information to the recognizer that specifies how to process the
 * request.
 */
export interface RecognitionConfig {
  /** Encoding of audio data sent in all `RecognitionAudio` messages. */
  encoding: RecognitionConfig_AudioEncoding;
  /**
   * Sample rate in Hertz of the audio data sent in all
   * `RecognitionAudio` messages. Valid values are: 8000-48000.
   * 16000 is optimal. For best results, set the sampling rate of the audio
   * source to 16000 Hz. If that's not possible, use the native sample rate of
   * the audio source (instead of re-sampling).
   * [AudioEncoding][sdifi.speech.v1alpha.RecognitionConfig.AudioEncoding].
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
  /** If 'true', adds punctuation to recognition result hypotheses. */
  enableAutomaticPunctuation: boolean;
}

/**
 * The encoding of the audio data sent in the request.
 *
 * All encodings support only 1 channel (mono) audio
 * audio.
 */
export enum RecognitionConfig_AudioEncoding {
  /** ENCODING_UNSPECIFIED - Not specified. */
  ENCODING_UNSPECIFIED = 0,
  /** LINEAR16 - Uncompressed 16-bit signed little-endian samples (Linear PCM). */
  LINEAR16 = 1,
  UNRECOGNIZED = -1,
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
  /** START_OF_SPEECH - Speech has been detected in the audio stream. */
  START_OF_SPEECH = 2,
  /** END_OF_SPEECH - Speech has ceased to be detected in the audio stream. */
  END_OF_SPEECH = 3,
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
}

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
          if (tag !== 10) {
            break;
          }

          message.streamingConfig = StreamingRecognitionConfig.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.audioContent = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
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
  return { config: undefined, singleUtterance: false, interimResults: false, conversation: "" };
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
    if (message.conversation !== "") {
      writer.uint32(34).string(message.conversation);
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
          if (tag !== 10) {
            break;
          }

          message.config = RecognitionConfig.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.singleUtterance = reader.bool();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.interimResults = reader.bool();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.conversation = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
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
    message.conversation = object.conversation ?? "";
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
    enableAutomaticPunctuation: false,
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
    if (message.enableAutomaticPunctuation === true) {
      writer.uint32(88).bool(message.enableAutomaticPunctuation);
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
          if (tag !== 8) {
            break;
          }

          message.encoding = reader.int32() as any;
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.sampleRateHertz = reader.int32();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.languageCode = reader.string();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.maxAlternatives = reader.int32();
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }

          message.enableWordTimeOffsets = reader.bool();
          continue;
        case 11:
          if (tag !== 88) {
            break;
          }

          message.enableAutomaticPunctuation = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
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
    message.enableAutomaticPunctuation = object.enableAutomaticPunctuation ?? false;
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
          if (tag !== 10) {
            break;
          }

          message.error = Status.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.results.push(StreamingRecognitionResult.decode(reader, reader.uint32()));
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.speechEventType = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
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
  return { alternatives: [], isFinal: false };
}

export const StreamingRecognitionResult = {
  encode(message: StreamingRecognitionResult, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.alternatives) {
      SpeechRecognitionAlternative.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.isFinal === true) {
      writer.uint32(16).bool(message.isFinal);
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
          if (tag !== 10) {
            break;
          }

          message.alternatives.push(SpeechRecognitionAlternative.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.isFinal = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
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
          if (tag !== 10) {
            break;
          }

          message.transcript = reader.string();
          continue;
        case 2:
          if (tag !== 21) {
            break;
          }

          message.confidence = reader.float();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.words.push(WordInfo.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
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
  return { startTime: undefined, endTime: undefined, word: "", confidence: 0 };
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
          if (tag !== 10) {
            break;
          }

          message.startTime = Duration.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.endTime = Duration.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.word = reader.string();
          continue;
        case 4:
          if (tag !== 37) {
            break;
          }

          message.confidence = reader.float();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
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
    return message;
  },
};

export type SpeechServiceDefinition = typeof SpeechServiceDefinition;
export const SpeechServiceDefinition = {
  name: "SpeechService",
  fullName: "sdifi.speech.v1alpha.SpeechService",
  methods: {
    /**
     * Performs bidirectional streaming speech recognition: receive results while
     * sending audio.
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
   * Performs bidirectional streaming speech recognition: receive results while
   * sending audio.
   */
  streamingRecognize(
    request: AsyncIterable<StreamingRecognizeRequest>,
    context: CallContext & CallContextExt,
  ): ServerStreamingMethodResult<DeepPartial<StreamingRecognizeResponse>>;
}

export interface SpeechServiceClient<CallOptionsExt = {}> {
  /**
   * Performs bidirectional streaming speech recognition: receive results while
   * sending audio.
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
