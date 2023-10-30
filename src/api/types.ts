import { Channel } from 'nice-grpc-web';

export type ConversationSentMessage = {
    text: string;
    metadata?: {
        // Optional language code specified as BCP-47 code
        language?: string;
        // Whether to allow (or request) TTS responses. The server may send them by default.
        tts?: boolean;
        // TTS voice to use
        voice_id?: string;
        // Whether or not message was generated via ASR
        asr_generated?: boolean;
    };
    // Optional message id for feedback messages.
    message_id?: string;
};

export type ConversationAttachment =
    | { type: 'audio'; payload: { src: string } }
    | { type: 'image'; payload: { title?: string; link?: string; src: string } }
    | { type: 'video'; payload: { src: string } };

function isConversationAttachment(data: any) {
    if (typeof data !== 'object') return false;
    if (!['audio', 'image', 'video'].includes(data.type)) return false;

    if (typeof data.payload !== 'object') return false;
    if (typeof data.payload.src !== 'string') return false;

    if (data.type !== 'audio') {
        if (data.payload.link) {
            if (typeof data.payload.link !== 'string') return false;
        }
    }

    if (data.type === 'image') {
        if (data.payload.title) {
            if (typeof data.payload.title !== 'string') return false;
        }
    }

    if (data.type === 'video') {
        if (typeof data.payload.title !== 'string') return false;
    }

    return true;
}

export type Button = { content_type?: 'text'; title: string } & (
    | { type?: 'postback'; payload: string }
    | { type?: 'web_url'; url: string }
);

function isButton(data: any) {
    if (typeof data !== 'object') return false;

    if (data.content_type) {
        if (data.content_type !== 'text') return false;
    }

    if (typeof data.title !== 'string') return false;

    if (data.type) {
        if (!['postback', 'web_url'].includes(data.type)) return false;

        if (data.type === 'postback') {
            if (typeof data.payload !== 'string') return false;
        } else {
            if (typeof data.url !== 'string') return false;
        }
    }
    return true;
}

// TODO(rkjaran): What data is Masdif actually going to support? Don't add stuff here that will never be
//   used. E.g. quick_replies is deprecated in Rasa, are we going to use it?
export type ConversationData = {
    elements?: any; // TODO: define
    quick_replies?: Button[];
    attachment?: ConversationAttachment[];
};

function isConversationData(data: any) {
    if (typeof data !== 'object') return false;

    let correctType: boolean = true;
    if (data.quick_replies) {
        if (typeof data.quick_replies !== 'object') return false;
        if (!Array.isArray(data.quick_replies)) return false;
        data.quick_replies.forEach((b: any) => {
            if (!isButton(b)) {
                correctType = false;
                return;
            }
        });
        if (!correctType) return false;
    }
    if (data.attachment) {
        if (typeof data.attachment !== 'object') return false;
        if (!Array.isArray(data.attachment)) return false;
        data.attachment.forEach((a: any) => {
            if (!isConversationAttachment(a)) {
                correctType = false;
                return;
            }
        });
        if (!correctType) return false;
    }
    return true;
}

export type ConversationResponse = {
    message_id?: string;
    recipient_id?: string;
    text?: string; // Some responses may lack text, e.g. responses to feedback messages.
    buttons?: Button[];
    data?: ConversationData;
};

export function isConversationResponseArray(data: any) {
    // A typeguard function for ConversationResponse[].

    if (typeof data !== 'object') return false;
    if (!Array.isArray(data)) return false;

    let correctType: boolean = true;
    data.forEach(convoResp => {
        if (convoResp.message_id) {
            if (typeof convoResp.message_id !== 'string') {
                correctType = false;
                return;
            }
        }
        if (convoResp.recipient_id) {
            if (typeof convoResp.recipient_id !== 'string') {
                correctType = false;
                return;
            }
        }
        if (convoResp.text) {
            if (typeof convoResp.text !== 'string') {
                correctType = false;
                return;
            }
        }
        if (convoResp.buttons) {
            if (typeof convoResp.buttons !== 'object') {
                correctType = false;
                return;
            }
            if (!Array.isArray(convoResp.buttons)) {
                correctType = false;
                return;
            }
            let btnCorrectType: boolean = true;
            convoResp.buttons.forEach((b: any) => {
                if (!isButton(b)) {
                    btnCorrectType = false;
                    return;
                }
            });
            if (!btnCorrectType) {
                correctType = false;
                return;
            }
        }
        if (convoResp.data) {
            if (!isConversationData(convoResp.data)) {
                correctType = false;
            }
        }
    });
    return correctType;
}

export type LanguageData = {
    // BCP-46 language code
    lang: string;

    // Human explanation of the language
    explanation: string;
};

function isLanguageData(data: any) {
    // A typeguard function for LanguageData.
    return typeof data === 'object' && typeof data.lang === 'string' && typeof data.explanation === 'string';
}

type StatusData = {
    tts: string;
    database: string;
    dialog_system: string;
    sidekiq: string;
    masdif: string;
};

export function isStatusData(data: any): data is StatusData {
    // A typeguard function for StatusData.
    return (
        typeof data === 'object' &&
        typeof data.tts === 'string' &&
        typeof data.database === 'string' &&
        typeof data.dialog_system === 'string' &&
        typeof data.sidekiq === 'string' &&
        typeof data.masdif === 'string'
    );
}

export type InfoData = {
    // Languages supported by server
    supported_languages: LanguageData[];

    // Message of the day. Multiple messages displayed if more than one element.
    motd: string[];
};

export function isInfoData(data: any): data is InfoData {
    // A typeguard function for InfoData.
    if (typeof data !== 'object') return false;
    if (!Array.isArray(data.supported_languages)) return false;
    if (!Array.isArray(data.motd)) return false;

    let correctType = true;
    data.motd.forEach((m: string) => {
        if (typeof m !== 'string') {
            correctType = false;
            return;
        }
    });
    if (!correctType) return false;

    correctType = true;
    data.supported_languages.forEach((l: LanguageData) => {
        if (!isLanguageData(l)) {
            correctType = false;
            return;
        }
    });
    return correctType;
}

export type FeedbackValue = {
    thumbUp: string;
    thumbDown: string;
    untoggle: string;
};

export interface TMasdifClient {
    status(): Promise<boolean>;

    info(conversationId: string): Promise<InfoData>;

    // Create a new conversation and return its conversation ID, which the caller should use for other calls.
    createConversation(): Promise<string>;

    sendMessage(conversationId: string, message: ConversationSentMessage): Promise<ConversationResponse[]>;

    // TODO: Type this
    conversationHistory(): Promise<any>;

    // Whether or not to ask for feedback.
    shouldAskForFeedback(): boolean;

    getFeedbackValues(): FeedbackValue;

    channel(): Channel;
}

export type MasdifClientOptions = {
    axyAddress?: string;
    extraHeaders?: { [key: string]: string };
    disableTTS?: boolean;
    language?: string;
    askForFeedback?: boolean;
    feedbackValues?: FeedbackValue;
};
