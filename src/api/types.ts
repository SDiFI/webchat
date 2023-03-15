export type ConversationSentMessage = {
    text: string,
    metadata?: {
        // Optional language code specified as BCP-47 code
        language?: string,
        // Whether to allow (or request) TTS responses. The server may send them by default.
        tts: boolean,
        // TTS voice to use
        voice_id: string,
    },
};

export type ConversationAttachment =
    | { type: 'audio', payload: { src: string } }
    | { type: 'image', payload: { title: string, src: string } }
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
    recipient_id: string,
    text: string,
    buttons?: Button[],
    data: ConversationData,
};


export interface TMasdifClient {
    async status(): Promise<boolean>;

    // Create a new conversation and return its conversation ID, which the caller should use for other calls.
    async createConversation(): Promise<string>;

    async sendMessage(conversationId: string, message: ConversationSentMessage): Promise<ConversationResponse[]>;

    // TODO: Type this
    async conversationHistory(): Promise<any>;
}
