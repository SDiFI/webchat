import React from 'react';
import Chat from '../components/Chat';
import { SimpleInfoProps } from '../components/Info';
import { ConversationContextProvider } from '../context/ConversationContext';
import { MasdifContextProvider } from '../context/MasdifClientContext';
import { SettingsProvider } from '../context/SettingsContext';

export type ConnectedChatProps = {
    serverAddress: string,
    title?: string,
    subtitle?: string,
    placeholder?: string,
    disableTTS?: boolean,
    info?: SimpleInfoProps,
};

export default function ConnectedChat(props: ConnectedChatProps) {
    return (
        <SettingsProvider defaultValue={{ disableTTS: props.disableTTS }}>
            <MasdifContextProvider serverAddress={props.serverAddress}>
                <ConversationContextProvider>
                    <Chat
                        title={props.title || "SDiFI"}
                        subtitle={props.subtitle || "Botti"}
                        placeholder={props.placeholder || "Spyrðu mig spjörunum úr..."}
                        info={props.info || {
                            paragraphs: [
                                ('Þetta snjallmenni er hluti af SDiFI, sem er samstarfsþróunarverkefni ' +
                                    'Háskólans í Reykjavík, Grammatek og Tiro.'),
                                'Snjallmennið <b>Jóakim</b> veit ekkert voða mikið, en getur svarað spurningum um Andabæ.'
                            ],
                            footer: '<a href="https://github.com/sdifi" target="_blank">SDiFI</a>',
                        }}
                    />
                </ConversationContextProvider>
            </MasdifContextProvider>
        </SettingsProvider>
    );
}
