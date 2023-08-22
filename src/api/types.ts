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

export type Button = { content_type?: 'text'; title: string } & (
    | { type?: 'postback'; payload: string }
    | { type?: 'web_url'; url: string }
);

// TODO(rkjaran): What data is Masdif actually going to support? Don't add stuff here that will never be
//   used. E.g. quick_replies is deprecated in Rasa, are we going to use it?
export type ConversationData = {
    elements?: any; // TODO: define
    quick_replies?: Button[];
    attachment?: ConversationAttachment[];
};

export type ConversationResponse = {
    message_id?: string;
    recipient_id?: string;
    text: string;
    buttons?: Button[];
    data?: ConversationData;
};

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

    info(conversationId: string): Promise<InfoData | undefined>;

    // Create a new conversation and return its conversation ID, which the caller should use for other calls.
    createConversation(): Promise<string | undefined>;

    sendMessage(conversationId: string, message: ConversationSentMessage): Promise<ConversationResponse[]>;

    // TODO: Type this
    conversationHistory(): Promise<any>;

    // Whether or not to ask for feedback.
    shouldAskForFeedback(): boolean;

    getFeedbackValues(): FeedbackValue;
}

export type MasdifClientOptions = {
    extraHeaders?: { [key: string]: string };
    disableTTS?: boolean;
    language?: string;
    askForFeedback?: boolean;
    feedbackValues?: FeedbackValue;
};
