import React, { useEffect, useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import { ConversationResponse, ConversationSentMessage } from '../api/types';
import { useConversationContext } from '../context/ConversationContext';
import { defaultTheme } from '../theme';
import Loading from './Loading';
import { ReplyAttachments, ReplyButtons } from './reply-components';
import thumbsDown from '../images/thumbs-down-regular.svg';
import thumbsUp from '../images/thumbs-up-regular.svg';

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

const BotMessageFeedbackThumbIcon = styled.img<{ $horFlip?: boolean; }>`
    height: 25px;
    width: 25px;
    transform: ${props => props.$horFlip ? 'scaleX(-1)': ''};
`;

BotMessageFeedbackThumbIcon.defaultProps = {
    $horFlip: false,
};

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
`

function BotAvatar(_: {}) {
    const theme = useTheme();
    if (!theme.botAvatarImageURL) return null;

    return <img src={theme.botAvatarImageURL} style={{ height: theme.botAvatarImageSize }} alt='Bot avatar' />;
}


type BotMessageFeedbackButtonProps = {
    up: boolean,
    horFlip: boolean,
    hoverMsg: string,
};

function BotMessageFeedbackButton({ up, horFlip, hoverMsg }: BotMessageFeedbackButtonProps) {
    return (
        <Button
        >
            <BotMessageFeedbackThumbIcon
                src={up ? thumbsUp : thumbsDown}
                alt={hoverMsg}
                title={hoverMsg}
                $horFlip={horFlip}
            />
        </Button>
    )
}

BotMessageFeedbackButton.defaultProps = {
    horFlip: false,
};

function BotMessageFeedback() {
    // TODO(Smári): Add i18n strings for alt and title strings.
    return (
        <BotMessageFeedbackButtonContainer>
            <BotMessageFeedbackButton
                up
                hoverMsg='Gott svar!'
            />
            <BotMessageFeedbackButton
                up={false}
                hoverMsg='Ekki hjálplegt.'
                horFlip
            />
        </BotMessageFeedbackButtonContainer>
    );
}

type BotMessageProps = {
    message: ConversationResponse;
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
            {/*TODO(Smári, STIFI-27): Make feedback buttons persistent (should not disappear on rerender)*/}
            {
                props.askForFeedback
                && props.lastMessage
                && <BotMessageFeedback />
            }
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
    askForFeedback?: boolean,
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
                                lastMessage={(convoContext.messages.length - 1 === idx) /* TODO: make available from context */}
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
