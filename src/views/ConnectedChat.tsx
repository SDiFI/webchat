import React from 'react';
import { DefaultTheme } from 'styled-components';
import Chat from '../components/Chat';
import { SimpleInfoProps } from '../components/Info';
import { AudioPlaybackProvider } from '../context/AudioPlaybackContext';
import { ConversationContextProvider } from '../context/ConversationContext';
import { MasdifContextProvider } from '../context/MasdifClientContext';
import { I18nProvider } from '../context/I18nContext';
import { SettingsProvider } from '../context/SettingsContext';

export type ConnectedChatProps = {
    // Address of Masdif server backing the chat widget
    serverAddress: string;

    // The title is displayed at top of the header. A default one will be used if not provided.
    title?: string;

    // The subtitle is displayed below the title. Leaving it undefined renders no subtitle.
    subtitle?: string;

    // Placeholder to display in the text input box
    placeholder?: string;

    // Don't request TTS responses from server
    disableTTS?: boolean;

    // Don't display client side settings (saved in local storage)
    hideSettings?: boolean;

    // Don't display a button to switch TTS on/off
    hideMute?: boolean;

    // Contents of the info tab in the chat widget. See SimpleInfoProps for more details.
    info?: SimpleInfoProps;

    // Should the chat not be open by default?
    startClosed?: boolean;

    theme?: Partial<DefaultTheme>;

    // Delay before displaying immediate responses and between multi message responses. Defaults to 1 sec.
    fakeResponseDelaySecs?: number;
};

export default function ConnectedChat(props: ConnectedChatProps) {
    return (
        <SettingsProvider
            defaultValue={{
                disableTTS: !!props.disableTTS,
                language: 'is-IS',
            }}
        >
            <MasdifContextProvider serverAddress={props.serverAddress}>
                <AudioPlaybackProvider>
                    <ConversationContextProvider>
                        <I18nProvider>
                            <Chat
                                title={props.title || 'SDiFI'}
                                subtitle={props.subtitle}
                                placeholder={props.placeholder}
                                hideSettings={props.hideSettings}
                                hideMute={props.hideMute}
                                info={props.info}
                                startClosed={props.startClosed}
                                themeOverrides={props.theme}
                                fakeResponseDelaySecs={props.fakeResponseDelaySecs}
                            />
                        </I18nProvider>
                    </ConversationContextProvider>
                </AudioPlaybackProvider>
            </MasdifContextProvider>
        </SettingsProvider>
    );
}
