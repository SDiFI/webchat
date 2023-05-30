import React, { useState, useEffect } from 'react';
import styled, { DefaultTheme, keyframes, ThemeProvider } from 'styled-components';
import { useConversationContext } from '../context/ConversationContext';
import SenderForm from './SenderForm';
import Launcher from './Launcher';
import Messages from './Messages';
import { useMasdifClient, useMasdifStatus } from '../context/MasdifClientContext';
import { Header, HeaderButton, HeaderButtonGroup, HeaderSubtitle, HeaderTitle } from './Header';
import infoSvg from '../images/info.svg';
import cogSvg from '../images/cog.svg';
import soundOnSvg from '../images/sound-on.svg';
import soundOffSvg from '../images/sound-off.svg';
import Info, { SimpleInfoProps } from './Info';
import Settings from './Settings';
import { useSettings } from '../context/SettingsContext';
import useSessionStorage from '../hooks/useSessionStorage';
import { defaultTheme } from '../theme';

const ChatContainer = styled.div`
    position: fixed;
    bottom: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    margin: 0 20px 20px 0;
    width: auto;
    z-index: 9999;
    align-items: flex-end;
    justify-content: flex-end;
    font-family: ${({ theme }) => theme.fontFamily};
`;

ChatContainer.defaultProps = {
    theme: defaultTheme,
};

const slideInAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ConversationContainer = styled.div`
    animation-duration: 0.5s;
    animation-name: ${slideInAnimation};
    animation-fill-mode: forwards;

    border-radius: 10px;
    box-shadow: 0 1px 1.5px -1px rgba(0, 0, 0, 0.048), 0 2.5px 3.7px -1px rgba(0, 0, 0, 0.069),
        0 5px 7px -1px rgba(0, 0, 0, 0.085), 0 9.7px 12.5px -1px rgba(0, 0, 0, 0.101),
        0 19.7px 23.4px -1px rgba(0, 0, 0, 0.122), 0 54px 56px -1px rgba(0, 0, 0, 0.17);
    overflow: hidden;
    width: 370px;
    margin-bottom: 10px;
`;

export type ChatProps = {
    title: string;
    subtitle?: string;
    placeholder: string;
    startClosed?: boolean;
    hideSettings?: boolean;
    hideMute?: boolean;
    info?: SimpleInfoProps;
    themeOverrides?: Partial<DefaultTheme>;
    fakeResponseDelaySecs?: number;
};

// The Chat component expects to be wrapped in both MasdifClientContextProvider and ConversationContextProvider
// somewhere higher up in the component tree.
export default function Chat(props: ChatProps) {
    const [visible, setVisible] = useSessionStorage<boolean>('@sdifi:visible', !props.startClosed);
    const [convoState, convoDispatch] = useConversationContext();
    const masdifClient = useMasdifClient();
    const masdifStatus = useMasdifStatus();
    const [settings, setSettings] = useSettings();

    const [activeView, setActiveView] = useState<'' | 'info' | 'settings'>('');
    const toggleView = (view: typeof activeView) => setActiveView(activeView === view ? '' : view);

    useEffect(() => {
        const fetchId = async () => {
            if (masdifClient && masdifStatus && !convoState.conversationId) {
                console.debug('getting convo id');
                const conversationId = await masdifClient.createConversation();
                convoDispatch({ type: 'SET_CONVERSATION_ID', conversationId });

                // TODO(rkjaran): Once we have i18n honor current language and set possible languages.
                // TODO(rkjaran): Perhaps this should be a separate action for motd and a middleware that adds the
                //   responses with a delay.
                const info = await masdifClient.info(conversationId);
                info.motd.reduce(
                    (p, text) =>
                        p.then(
                            () =>
                                new Promise<void>(resolve => {
                                    convoDispatch({ type: 'DELAY_MOTD_RESPONSE' });
                                    window.setTimeout(() => {
                                        convoDispatch({ type: 'ADD_RESPONSE', text });
                                        resolve();
                                    }, (props.fakeResponseDelaySecs ?? 1) * 1000);
                                }),
                        ),
                    Promise.resolve(),
                );
            }
        };
        fetchId();
    }, [masdifClient, masdifStatus]);

    return (
        <ThemeProvider theme={{ ...defaultTheme, ...props.themeOverrides }}>
            <ChatContainer>
                {visible && masdifStatus && (
                    <ConversationContainer>
                        <Header>
                            <HeaderTitle>{props.title}</HeaderTitle>
                            <HeaderSubtitle>{props.subtitle}</HeaderSubtitle>

                            <HeaderButtonGroup>
                                {props.info && (
                                    <HeaderButton onClick={() => toggleView('info')} active={activeView === 'info'}>
                                        <img src={infoSvg} />
                                    </HeaderButton>
                                )}

                                {!props.hideMute && (
                                    <HeaderButton
                                        title={`${settings.disableTTS ? 'Kveikja' : 'Slökkva'} á talgervingu.`}
                                        onClick={() => setSettings({ disableTTS: !settings.disableTTS })}
                                    >
                                        <img src={settings.disableTTS ? soundOffSvg : soundOnSvg} />
                                    </HeaderButton>
                                )}

                                {!props.hideSettings && (
                                    <HeaderButton
                                        onClick={() => toggleView('settings')}
                                        active={activeView === 'settings'}
                                    >
                                        <img src={cogSvg} />
                                    </HeaderButton>
                                )}
                            </HeaderButtonGroup>
                        </Header>
                        {(() => {
                            switch (activeView) {
                                case 'info':
                                    return (
                                        <Info
                                            paragraphs={props.info!.paragraphs}
                                            buttons={props.info!.buttons}
                                            footer={props.info!.footer}
                                        />
                                    );
                                case 'settings':
                                    return props.hideSettings ? null : <Settings />;
                                default:
                                    return (
                                        <>
                                            <Messages />
                                            <SenderForm placeholder={props.placeholder} />
                                        </>
                                    );
                            }
                        })()}
                    </ConversationContainer>
                )}
                {masdifStatus && <Launcher visible={visible} onClick={() => setVisible(!visible)} />}
            </ChatContainer>
        </ThemeProvider>
    );
}
