import React, { useEffect, useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import intl from 'react-intl-universal';
import { ConversationSentMessage } from '../api/types';
import { BotConversationMessage, useConversationContext } from '../context/ConversationContext';
import { defaultTheme } from '../theme';
import Loading from './Loading';
import { ReplyAttachments, ReplyButtons } from './reply-components';
import BotMessageFeedbackThumbIcon from './BotMessageFeedbackThumbIcon';

// TODO: Make responsive
const MessagesContainer = styled.div`
    height: 510px;
    max-height: 50vh;

    background-color: ${({ theme }) => theme.primaryBgColor};
    overflow-y: auto;
    padding-top: 10px;
`;

MessagesContainer.defaultProps = {
    theme: defaultTheme,
};

const MessageContainer = styled.div`
    margin: 10px;
    font-size: 16px;
    line-height: 20px;
    display: flex;
    flex-wrap: nowrap;
    position: relative;
`;

const MessageText = styled.div`
    margin: 0;
`;

const UserMessageContainer = styled.div`
    background-color: ${({ theme }) => theme.userMessageBgColor};
    color: ${({ theme }) => theme.userMessageFgColor};
    border-radius: 15px;
    padding: 11px 15px;
    max-width: 215px;
    text-align: left;
    max-width: 85%;
    margin-left: auto;
    overflow-wrap: break-word;
`;

UserMessageContainer.defaultProps = {
    theme: defaultTheme,
};

const BotMessageContainer = styled.div`
    background-color: ${({ theme }) => theme.botMessageBgColor};
    color: ${({ theme }) => theme.botMessageFgColor};
    border-radius: 0 15px 15px 15px;
    padding: 11px 15px;
    max-width: 215px;
    text-align: left;
    max-width: 85%;

    img {
        max-width: ${({ theme }) => theme.botMessageMaxImageWidth};
    }
`;

BotMessageContainer.defaultProps = {
    theme: defaultTheme,
};

const BotMessageFeedbackButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
`;

// TODO(Smári): Taken from SpeechInput.tsx. Refactor and reuse!
const Button = styled.button`
    border: none;
    background: unset;

    &:hover {
        cursor: pointer;
    }

    &:disabled {
        cursor: auto;
    }
`;

function BotAvatar(_: {}) {
    const theme = useTheme();
    if (!theme.botAvatarImageURL) return null;

    return <img src={theme.botAvatarImageURL} style={{ height: theme.botAvatarImageSize }} alt='Bot avatar' />;
}

type BotMessageFeedbackButtonProps = {
    up: boolean;
    hoverMsg: string;
    messageId: string;
};

function BotMessageFeedbackButton(props: BotMessageFeedbackButtonProps) {
    const [convoContext, convoDispatch] = useConversationContext();
    const sendFeedback = (up: boolean) => {
        if (Object.keys(convoContext.feedback).includes(props.messageId)) {
            return;
        }
        console.log(`${up ? 'Já' : 'Nei'}kvæð endurgjöf fyrir ${props.messageId}`);
        convoDispatch({
            type: 'SET_RESPONSE_REACTION',
            messageId: props.messageId,
            value: up ? 'positive' : 'negative',
        });
    };

    return (
        <Button title={props.hoverMsg} onClick={() => sendFeedback(props.up)}>
            <BotMessageFeedbackThumbIcon
                positive={props.up}
                toggled={
                    (props.up &&
                        props.messageId in convoContext.feedback &&
                        convoContext.feedback[props.messageId] == 'positive') ||
                    (!props.up &&
                        props.messageId in convoContext.feedback &&
                        convoContext.feedback[props.messageId] == 'negative')
                }
            />
        </Button>
    );
}

type BotMessageFeedbackProps = {
    messageId: string;
    isPositive?: boolean | undefined;
};

function BotMessageFeedback({ messageId }: BotMessageFeedbackProps) {
    return (
        <BotMessageFeedbackButtonContainer>
            <BotMessageFeedbackButton up messageId={messageId} hoverMsg={intl.get('FEEDBACK_TOOLTIP_POSITIVE')} />
            <BotMessageFeedbackButton
                up={false}
                messageId={messageId}
                hoverMsg={intl.get('FEEDBACK_TOOLTIP_NEGATIVE')}
            />
        </BotMessageFeedbackButtonContainer>
    );
}

type BotMessageProps = {
    message: BotConversationMessage;
    lastMessage?: boolean;
    askForFeedback: boolean;
};

function BotMessage(props: BotMessageProps) {
    const buttons = props.message.buttons;
    const attachments = props.message.data?.attachment;

    return (
        <MessageContainer>
            <BotAvatar />
            <BotMessageContainer>
                <MessageText>{props.message.text}</MessageText>
                <ReplyAttachments lastMessage={props.lastMessage} attachments={attachments || []} />
                <ReplyButtons buttons={buttons || []} />
            </BotMessageContainer>
            {props.askForFeedback && props.message.isLast && (
                <BotMessageFeedback messageId={props.message.message_id ? props.message.message_id : ''} />
            )}
        </MessageContainer>
    );
}

type UserMessageProps = {
    message?: ConversationSentMessage | string;
    children?: React.ReactNode;
};

function UserMessage(props: UserMessageProps) {
    return (
        <MessageContainer>
            <UserMessageContainer>
                {props.message && (
                    <MessageText>{typeof props.message === 'string' ? props.message : props.message.text}</MessageText>
                )}
                {props.children}
            </UserMessageContainer>
        </MessageContainer>
    );
}

const SpeechHypothesisText = styled.span`
    font-style: italic;
`;

type SpeechHypothesisProps = {
    text: string;
};

function SpeechHypothesisMessage(props: SpeechHypothesisProps) {
    return (
        <UserMessage>
            <SpeechHypothesisText>{props.text}</SpeechHypothesisText>
        </UserMessage>
    );
}

function LoadingMessage() {
    return (
        <MessageContainer>
            <BotAvatar />
            <BotMessageContainer>
                <Loading />
            </BotMessageContainer>
        </MessageContainer>
    );
}

type MessagesProps = {
    askForFeedback?: boolean;
};

export default function Messages({ askForFeedback }: MessagesProps) {
    const [convoContext] = useConversationContext();
    const containerElement = useRef<HTMLDivElement>(null);

    useEffect(() => {
        containerElement.current?.scrollTo({ top: containerElement.current.scrollHeight });
    }, [convoContext.messages.length, convoContext.speechHypothesis, convoContext.loading]);

    return (
        <MessagesContainer ref={containerElement}>
            {convoContext.messages.map((message, idx) => {
                switch (message.actor) {
                    case 'bot':
                        return (
                            <BotMessage
                                key={idx}
                                message={message}
                                lastMessage={
                                    convoContext.messages.length - 1 === idx /* TODO: make available from context */
                                }
                                askForFeedback={askForFeedback ? askForFeedback : false}
                            />
                        );
                    case 'user':
                        return <UserMessage key={idx} message={message} />;
                    default:
                        return null;
                }
            })}
            {convoContext.speechHypothesis && <SpeechHypothesisMessage text={convoContext.speechHypothesis} />}
            {convoContext.loading && <LoadingMessage />}
        </MessagesContainer>
    );
}
