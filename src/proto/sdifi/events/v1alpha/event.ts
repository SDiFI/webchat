/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { Timestamp } from "../../../google/protobuf/timestamp";
import {
  RecognitionConfig_AudioEncoding,
  StreamingRecognizeResponse_SpeechEventType,
} from "../../speech/v1alpha/speech";

export const protobufPackage = "sdifi.events.v1alpha";

export interface Conversation {
  name: string;
}

export interface Metadata {
  conversation: Conversation | undefined;
  createdAt: Date | undefined;
  labels: { [key: string]: string };
}

export interface Metadata_LabelsEntry {
  key: string;
  value: string;
}

export interface Event {
  metadata: Metadata | undefined;
  speechFinal?: SpeechFinalEvent | undefined;
  speechPartial?: SpeechPartialEvent | undefined;
  speechContent?: SpeechContentEvent | undefined;
}

export interface SpeechFinalEvent {
  transcript: string;
}

export interface SpeechPartialEvent {
  transcript?: string | undefined;
  speechEventType?: StreamingRecognizeResponse_SpeechEventType | undefined;
}

export interface SpeechContentEvent {
  /** Incoming chunks of audio. In the case of */
  content: Uint8Array;
  /** Metadata for audio chunk in `content`, i.e. sample rate, encoding, etc. */
  info: SpeechContentEvent_Info | undefined;
}

export interface SpeechContentEvent_Info {
  encoding: RecognitionConfig_AudioEncoding;
  sampleRateHertz: number;
}

function createBaseConversation(): Conversation {
  return { name: "" };
}

export const Conversation = {
  encode(message: Conversation, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Conversation {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConversation();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<Conversation>): Conversation {
    return Conversation.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<Conversation>): Conversation {
    const message = createBaseConversation();
    message.name = object.name ?? "";
    return message;
  },
};

function createBaseMetadata(): Metadata {
  return { conversation: undefined, createdAt: undefined, labels: {} };
}

export const Metadata = {
  encode(message: Metadata, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.conversation !== undefined) {
      Conversation.encode(message.conversation, writer.uint32(10).fork()).ldelim();
    }
    if (message.createdAt !== undefined) {
      Timestamp.encode(toTimestamp(message.createdAt), writer.uint32(18).fork()).ldelim();
    }
    Object.entries(message.labels).forEach(([key, value]) => {
      Metadata_LabelsEntry.encode({ key: key as any, value }, writer.uint32(26).fork()).ldelim();
    });
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Metadata {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMetadata();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.conversation = Conversation.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.createdAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          const entry3 = Metadata_LabelsEntry.decode(reader, reader.uint32());
          if (entry3.value !== undefined) {
            message.labels[entry3.key] = entry3.value;
          }
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<Metadata>): Metadata {
    return Metadata.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<Metadata>): Metadata {
    const message = createBaseMetadata();
    message.conversation = (object.conversation !== undefined && object.conversation !== null)
      ? Conversation.fromPartial(object.conversation)
      : undefined;
    message.createdAt = object.createdAt ?? undefined;
    message.labels = Object.entries(object.labels ?? {}).reduce<{ [key: string]: string }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = String(value);
      }
      return acc;
    }, {});
    return message;
  },
};

function createBaseMetadata_LabelsEntry(): Metadata_LabelsEntry {
  return { key: "", value: "" };
}

export const Metadata_LabelsEntry = {
  encode(message: Metadata_LabelsEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== "") {
      writer.uint32(18).string(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Metadata_LabelsEntry {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMetadata_LabelsEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.value = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<Metadata_LabelsEntry>): Metadata_LabelsEntry {
    return Metadata_LabelsEntry.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<Metadata_LabelsEntry>): Metadata_LabelsEntry {
    const message = createBaseMetadata_LabelsEntry();
    message.key = object.key ?? "";
    message.value = object.value ?? "";
    return message;
  },
};

function createBaseEvent(): Event {
  return { metadata: undefined, speechFinal: undefined, speechPartial: undefined, speechContent: undefined };
}

export const Event = {
  encode(message: Event, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.metadata !== undefined) {
      Metadata.encode(message.metadata, writer.uint32(10).fork()).ldelim();
    }
    if (message.speechFinal !== undefined) {
      SpeechFinalEvent.encode(message.speechFinal, writer.uint32(18).fork()).ldelim();
    }
    if (message.speechPartial !== undefined) {
      SpeechPartialEvent.encode(message.speechPartial, writer.uint32(26).fork()).ldelim();
    }
    if (message.speechContent !== undefined) {
      SpeechContentEvent.encode(message.speechContent, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Event {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEvent();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.metadata = Metadata.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.speechFinal = SpeechFinalEvent.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.speechPartial = SpeechPartialEvent.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.speechContent = SpeechContentEvent.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<Event>): Event {
    return Event.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<Event>): Event {
    const message = createBaseEvent();
    message.metadata = (object.metadata !== undefined && object.metadata !== null)
      ? Metadata.fromPartial(object.metadata)
      : undefined;
    message.speechFinal = (object.speechFinal !== undefined && object.speechFinal !== null)
      ? SpeechFinalEvent.fromPartial(object.speechFinal)
      : undefined;
    message.speechPartial = (object.speechPartial !== undefined && object.speechPartial !== null)
      ? SpeechPartialEvent.fromPartial(object.speechPartial)
      : undefined;
    message.speechContent = (object.speechContent !== undefined && object.speechContent !== null)
      ? SpeechContentEvent.fromPartial(object.speechContent)
      : undefined;
    return message;
  },
};

function createBaseSpeechFinalEvent(): SpeechFinalEvent {
  return { transcript: "" };
}

export const SpeechFinalEvent = {
  encode(message: SpeechFinalEvent, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.transcript !== "") {
      writer.uint32(10).string(message.transcript);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SpeechFinalEvent {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSpeechFinalEvent();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.transcript = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<SpeechFinalEvent>): SpeechFinalEvent {
    return SpeechFinalEvent.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<SpeechFinalEvent>): SpeechFinalEvent {
    const message = createBaseSpeechFinalEvent();
    message.transcript = object.transcript ?? "";
    return message;
  },
};

function createBaseSpeechPartialEvent(): SpeechPartialEvent {
  return { transcript: undefined, speechEventType: undefined };
}

export const SpeechPartialEvent = {
  encode(message: SpeechPartialEvent, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.transcript !== undefined) {
      writer.uint32(10).string(message.transcript);
    }
    if (message.speechEventType !== undefined) {
      writer.uint32(16).int32(message.speechEventType);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SpeechPartialEvent {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSpeechPartialEvent();
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
          if (tag !== 16) {
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

  create(base?: DeepPartial<SpeechPartialEvent>): SpeechPartialEvent {
    return SpeechPartialEvent.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<SpeechPartialEvent>): SpeechPartialEvent {
    const message = createBaseSpeechPartialEvent();
    message.transcript = object.transcript ?? undefined;
    message.speechEventType = object.speechEventType ?? undefined;
    return message;
  },
};

function createBaseSpeechContentEvent(): SpeechContentEvent {
  return { content: new Uint8Array(0), info: undefined };
}

export const SpeechContentEvent = {
  encode(message: SpeechContentEvent, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.content.length !== 0) {
      writer.uint32(10).bytes(message.content);
    }
    if (message.info !== undefined) {
      SpeechContentEvent_Info.encode(message.info, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SpeechContentEvent {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSpeechContentEvent();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.content = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.info = SpeechContentEvent_Info.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<SpeechContentEvent>): SpeechContentEvent {
    return SpeechContentEvent.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<SpeechContentEvent>): SpeechContentEvent {
    const message = createBaseSpeechContentEvent();
    message.content = object.content ?? new Uint8Array(0);
    message.info = (object.info !== undefined && object.info !== null)
      ? SpeechContentEvent_Info.fromPartial(object.info)
      : undefined;
    return message;
  },
};

function createBaseSpeechContentEvent_Info(): SpeechContentEvent_Info {
  return { encoding: 0, sampleRateHertz: 0 };
}

export const SpeechContentEvent_Info = {
  encode(message: SpeechContentEvent_Info, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.encoding !== 0) {
      writer.uint32(8).int32(message.encoding);
    }
    if (message.sampleRateHertz !== 0) {
      writer.uint32(16).int32(message.sampleRateHertz);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SpeechContentEvent_Info {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSpeechContentEvent_Info();
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
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<SpeechContentEvent_Info>): SpeechContentEvent_Info {
    return SpeechContentEvent_Info.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<SpeechContentEvent_Info>): SpeechContentEvent_Info {
    const message = createBaseSpeechContentEvent_Info();
    message.encoding = object.encoding ?? 0;
    message.sampleRateHertz = object.sampleRateHertz ?? 0;
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function toTimestamp(date: Date): Timestamp {
  const seconds = date.getTime() / 1_000;
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): Date {
  let millis = (t.seconds || 0) * 1_000;
  millis += (t.nanos || 0) / 1_000_000;
  return new Date(millis);
}
