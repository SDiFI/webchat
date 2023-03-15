import React from 'react';
import Chat from '../components/Chat';
import { ConversationContextProvider } from '../context/ConversationContext';
import { MasdifContextProvider } from '../context/MasdifClientContext';

export type ConnectedChatProps = {
    serverAddress: string,
    title?: string,
    subtitle?: string,
    placeholder?: string,
};

export default function ConnectedChat(props: ConnectedChatProps) {
    return (
        <MasdifContextProvider serverAddress={props.serverAddress}>
            <ConversationContextProvider>
                <Chat
                    title={props.title || "SDiFI"}
                    subtitle={props.subtitle || "Botti"}
                    placeholder={props.placeholder || "Spyrðu mig spjörunum úr..."}
                />
            </ConversationContextProvider>
        </MasdifContextProvider>
    );
}
