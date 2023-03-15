import axios, { AxiosInstance } from 'axios';
import { ConversationSentMessage, ConversationResponse, TMasdifClient } from './types';

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

    constructor(baseURL: string) {
        this.http = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async status() {
        const response = await this.http.get('/health');
        return response.status === 200;
    }

    // Create a new conversation and return its conversation ID, which the caller should use for other calls.
    async createConversation() {
        const response = await this.http.post<{conversation_id: string}>('/conversations');
        if (response.status !== 200) {
            throw new Error("Could not create a new conversation");
        }
        return response.data.conversation_id;
    }

    async sendMessage(conversationId: string, message: ConversationSentMessage) {
        const response = await this.http.put<ConversationResponse[]>(`/conversations/${conversationId}`, message);
        if (response.status !== 200) {
            throw new Error("Could not send message to server.");
        }
        return response.data;
    }

    async conversationHistory() {
        // TODO: Implement
    }
}
