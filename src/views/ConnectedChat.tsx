import React from 'react';
import Chat from '../components/Chat';
import { SimpleInfoProps } from '../components/Info';
import { ConversationContextProvider } from '../context/ConversationContext';
import { MasdifContextProvider } from '../context/MasdifClientContext';
import { SettingsProvider } from '../context/SettingsContext';

export type ConnectedChatProps = {
    // Address of Masdif server backing the chat widget
    serverAddress: string,

    // The title and subtitle are displayed in the header of the chat widget
    title?: string,
    subtitle?: string,

    // Placeholder to display in the text input box
    placeholder?: string,

    // Don't request TTS responses from server
    disableTTS?: boolean,

    // Don't display client side settings (saved in local storage)
    hideSettings?: boolean,

    // Don't display a button to switch TTS on/off
    hideMute?: boolean,

    // Contents of the info tab in the chat widget. See SimpleInfoProps for more details.
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
                        hideSettings={props.hideSettings}
                        hideMute={props.hideMute}
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
