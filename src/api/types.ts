export type ConversationSentMessage = {
    text: string,
    metadata?: {
        // Optional language code specified as BCP-47 code
        language?: string,
        // Whether to allow (or request) TTS responses. The server may send them by default.
        tts?: boolean,
        // TTS voice to use
        voice_id?: string,
        // Whether or not message was generated via ASR
        asr_generated?: boolean,
    },
};

export type ConversationAttachment =
    | { type: 'audio', payload: { src: string } }
    | { type: 'image', payload: { title?: string, src: string } }
    | { type: 'audio', payload: { src: string } }
    | { type: 'video', payload: { title: string, src: string } }
;

export type Button = { content_type?: 'text', title: string } & (
    | { type?: 'postback', payload: string }
    | { type?: 'web_url', url: string }
);

// TODO(rkjaran): What data is Masdif actually going to support? Don't add stuff here that will never be
//   used. E.g. quick_replies is deprecated in Rasa, are we going to use it?
export type ConversationData = {
    elements?: any, // TODO: define
    quick_replies?: Button[],
    attachment?: ConversationAttachment[],
};

export type ConversationResponse = {
    recipient_id?: string,
    text: string,
    buttons?: Button[],
    data?: ConversationData,
};


export type LanguageData = {
    // BCP-46 language code
    lang: string,

    // Human explanation of the language
    explanation: string,
};

export type InfoData = {
    // Lanugages supported by server
    supported_languages: LanguageData[],

    // Message of the day. Multiple messages displayed if more than one element.
    motd: string[],
};


export interface TMasdifClient {
    async status(): Promise<boolean>;

    async info(conversationId: string): Promise<InfoData>;

    // Create a new conversation and return its conversation ID, which the caller should use for other calls.
    async createConversation(): Promise<string>;

    async sendMessage(conversationId: string, message: ConversationSentMessage): Promise<ConversationResponse[]>;

    // TODO: Type this
    async conversationHistory(): Promise<any>;
}

export type MasdifClientOptions = {
    extraHeaders?:  {[key: string]: string},
    disableTTS?: boolean,
};
