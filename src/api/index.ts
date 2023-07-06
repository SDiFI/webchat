import axios, { AxiosInstance } from 'axios';
import {
    ConversationSentMessage,
    ConversationResponse,
    TMasdifClient,
    MasdifClientOptions,
    InfoData,
    FeedbackValue,
} from './types';

// Example usage of MasdifClient:
//
//   const client = new MasdifClient('http://localhost:8080');
//   await const convoId = client.createConversation();
//   await response = client.sendMessage(convoId, {text: 'Hver er bæjarstjóri Andabæjar?'});
//   console.debug(`The server said: "${response[0].text}"`);
//

export default class MasdifClient implements TMasdifClient {
    // TODO: Support user settings from local storage, for thing like TTS.
    private http: AxiosInstance;
    private disableTTS: boolean;
    private language?: string;
    private askForFeedback: boolean;
    private feedbackValues: FeedbackValue;

    constructor(baseURL: string, options: MasdifClientOptions | undefined) {
        this.http = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
                ...(options?.extraHeaders ? options.extraHeaders : {}),
            },
            validateStatus: (status: number) => {
                return (status >= 200 && status < 300) || status === 503;
            },
        });

        this.disableTTS = options?.disableTTS || false;
        this.language = options?.language || undefined;
        this.askForFeedback = options?.askForFeedback || false;
        this.feedbackValues = options?.feedbackValues || {
            thumbDown: 'negative',
            thumbUp: 'positive',
            untoggle: 'none',
        };
    }

    async status() {
        try {
            const response = await this.http.get('/health');
            if (response.status === 503) {
                console.warn('Server not fully healthy.');
                return (
                    response.data.tts !== 'OK' &&
                    response.data.database === 'OK' &&
                    response.data.dialog_system === 'OK' &&
                    response.data.sidekiq === 'OK'
                );
            }

            return response.status === 200 && response.data.masdif === 'OK';
        } catch (e) {
            console.error('Could not contact server');
            return false;
        }
    }

    async info(conversationId: string) {
        const response = await this.http.get<InfoData>(`/info?id=${conversationId}`);
        return response.data;
    }

    // Create a new conversation and return its conversation ID, which the caller should use for other calls.
    async createConversation() {
        const response = await this.http.post<{ conversation_id: string }>('/conversations');
        if (response.status !== 200) {
            throw new Error('Could not create a new conversation');
        }
        return response.data.conversation_id;
    }

    async sendMessage(conversationId: string, message: ConversationSentMessage) {
        const payload: ConversationSentMessage = {
            text: message.text,
            metadata: {
                tts: !this.disableTTS,
                asr_generated:
                    // Not specified means no.
                    message?.metadata?.asr_generated ? message.metadata.asr_generated : false,
                language: this.language,
            },
            ...(message.message_id && { message_id: message.message_id }),
        };

        const response = await this.http.put<ConversationResponse[]>(`/conversations/${conversationId}`, payload);
        if (response.status !== 200) {
            throw new Error('Could not send message to server.');
        }
        return response.data;
    }

    async conversationHistory() {
        // TODO: Implement once historic replies returned by the server are in JSON
    }

    shouldAskForFeedback() {
        return this.askForFeedback;
    }

    getFeedbackValues() {
        return this.feedbackValues;
    }
}
