import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useConversationContext } from '../context/ConversationContext';
import SenderForm from './SenderForm';
import Launcher from './Launcher';
import Messages from './Messages';
import { useMasdifClient, useMasdifStatus } from '../context/MasdifClientContext';
import { Header, HeaderButton, HeaderButtonGroup, HeaderSubtitle, HeaderTitle } from './Header';
import infoSvg from '../images/info.svg';
import cogSvg from '../images/cog.svg';
import Info, { SimpleInfoProps } from './Info';
import Settings from './Settings';

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
`;

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
  animation-duration: .5s;
  animation-name: ${slideInAnimation};
  animation-fill-mode: forwards;

  border-radius: 10px;
  box-shadow:
    0 1px 1.5px -1px rgba(0,0,0,.048),
    0 2.5px 3.7px -1px rgba(0,0,0,.069),
    0 5px 7px -1px rgba(0,0,0,.085),
    0 9.7px 12.5px -1px rgba(0,0,0,.101),
    0 19.7px 23.4px -1px rgba(0,0,0,.122),
    0 54px 56px -1px rgba(0,0,0,.17);
  overflow: hidden;
  width: 370px;
  margin-bottom: 10px;
`;

export type ChatProps = {
    title: string,
    subtitle: string,
    placeholder: string,
    startClosed?: boolean,
    hideSettings?: boolean,
    info?: SimpleInfoProps,
};

// The Chat component expects to be wrapped in both MasdifClientContextProvider and ConversationContextProvider
// somewhere higher up in the component tree.
export default function Chat(props: ChatProps) {
    const [visible, setVisible] = useState<boolean>(!props.startClosed);
    const [convoState, convoDispatch] = useConversationContext();
    const masdifClient = useMasdifClient();
    const masdifStatus = useMasdifStatus();

    const [activeView, setActiveView] = useState<'' | 'info' | 'settings'>('');
    const toggleView = (view: typeof activeView) => setActiveView(activeView === view ? '' : view);

    useEffect(() => {
        const fetchId = async () => {
            if (masdifClient && masdifStatus && !convoState.conversationId) {
                console.debug("getting convo id");
                const conversationId = await masdifClient.createConversation();
                convoDispatch({ type: 'SET_CONVERSATION_ID', conversationId });
            }
        };
        fetchId();
    }, [masdifClient, masdifStatus]);

    return (
        <ChatContainer>
            {visible && masdifStatus && (
                <ConversationContainer>
                    <Header>
                        <HeaderTitle>{props.title}</HeaderTitle>
                        <HeaderSubtitle>{props.subtitle}</HeaderSubtitle>

                        <HeaderButtonGroup>
                            {props.info &&
                                <HeaderButton onClick={() => toggleView('info')} active={activeView === 'info'}>
                                    <img src={infoSvg} />
                                </HeaderButton>}
                            {!props.hideSettings &&
                                <HeaderButton onClick={() => toggleView('settings')} active={activeView === 'settings'}>
                                    <img src={cogSvg} />
                                </HeaderButton>}
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
                                return props.hideSettings ? null : (
                                    <Settings />
                                );
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
            {masdifStatus && (
                <Launcher
                    visible={visible}
                    onClick={() => setVisible(!visible)}
                />
            )}
        </ChatContainer>
    );
}
