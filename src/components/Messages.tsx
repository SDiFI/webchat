import React, { useEffect, useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import intl from 'react-intl-universal';
import { ConversationSentMessage, FeedbackValue } from '../api/types';
import { BotConversationMessage, useConversationContext } from '../context/ConversationContext';
import { defaultTheme } from '../theme';
import Loading from './Loading';
import { ReplyAttachments, ReplyButtons } from './reply-components';
import BotMessageFeedbackThumbIcon from './BotMessageFeedbackThumbIcon';
import { useMasdifClient, useMasdifStatus } from '../context/MasdifClientContext';

// TODO: Make responsive
const MessagesContainer = styled.div<{ $disabled: boolean }>`
    height: 510px;
    max-height: 50vh;

    background-color: ${({ theme }) => theme.primaryBgColor};
    overflow-y: ${props => (props.$disabled ? 'hidden' : 'auto')};
    padding-top: 10px;

    cursor: ${props => (props.$disabled ? 'wait' : 'auto')};
    > * {
        /* For bot-generated buttons and feedback buttons */
        pointer-events: ${props => (props.$disabled ? 'none' : 'auto')};
        opacity: ${props => (props.$disabled ? '0.25' : '1')};
    }

    h4 {
        opacity: 1;
        position: fixed;
        left: 100px;
        top: 45%;
        z-index: 1;
    }
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

const BotMessageContentContainer = styled.div`
    background-color: ${({ theme }) => theme.botMessageBgColor};
    color: ${({ theme }) => theme.botMessageFgColor};
    border-radius: 0 15px 15px 15px;
    padding: 11px 15px;
    text-align: left;

    img {
        max-width: ${({ theme }) => theme.botMessageMaxImageWidth};
    }

    iframe {
        max-width: 100%;
    }
`;

BotMessageContentContainer.defaultProps = {
    theme: defaultTheme,
};

const BotMessageContainer = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 85%;
`;

const BotMessageFeedbackContainer = styled.div`
    display: flex;
    align-self: flex-end;
    margin-top: 7.5px;
`;

const BotMessageFeedbackButtonContainer = styled.div`
    display: flex;
`;

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

const Space = styled.div`
    padding-right: 1px;
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
    const masdifClient = useMasdifClient();
    const masdifStatus = useMasdifStatus();
    const [convoContext, convoDispatch] = useConversationContext();
    const sendFeedback = (value: string, feedbackValues: FeedbackValue) => {
        if (!masdifStatus) {
            console.debug('Service unreachable. Feedback not sent.');
            return;
        }
        console.log(`Endurgjöf fyrir ${props.messageId}: ${value}`);
        convoDispatch({
            type: value === feedbackValues.untoggle ? 'REMOVE_RESPONSE_REACTION' : 'SET_RESPONSE_REACTION',
            messageId: props.messageId,
            value,
        });
    };

    const determineFeedbackValue = (up: boolean, feedbackValues: FeedbackValue) => {
        if (!Object.keys(convoContext.feedback).includes(props.messageId)) {
            // No feedback record present for message.
            return up ? feedbackValues.thumbUp : feedbackValues.thumbDown;
        }
        if (up && convoContext.feedback[props.messageId] === feedbackValues.thumbUp) {
            // Up-thumb pressed, feedback record present and it's thumbUp value => Untoggle
            return feedbackValues.untoggle;
        }
        if (up && convoContext.feedback[props.messageId] === feedbackValues.thumbDown) {
            // Up-thumb pressed, feedback record present and it's thumbDown value => Switch value to thumbUp
            return feedbackValues.thumbUp;
        }
        if (!up && convoContext.feedback[props.messageId] === feedbackValues.thumbDown) {
            // Down-thumb pressed, feedback record present and it's thumbDown value => Untoggle
            return feedbackValues.untoggle;
        }
        if (!up && convoContext.feedback[props.messageId] === feedbackValues.thumbUp) {
            // Down-thumb pressed, feedback record present and it's thumbUp value => Switch value to thumbDown
            return feedbackValues.thumbDown;
        }

        console.warn('Empty feedback value.');
        return '';
    };

    const feedbackValues: FeedbackValue = masdifClient!.getFeedbackValues();
    return (
        <Button
            title={props.hoverMsg}
            onClick={() => sendFeedback(determineFeedbackValue(props.up, feedbackValues), feedbackValues)}
        >
            <BotMessageFeedbackThumbIcon
                positive={props.up}
                toggled={
                    (props.up &&
                        props.messageId in convoContext.feedback &&
                        convoContext.feedback[props.messageId] === feedbackValues.thumbUp) ||
                    (!props.up &&
                        props.messageId in convoContext.feedback &&
                        convoContext.feedback[props.messageId] === feedbackValues.thumbDown)
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
        <BotMessageFeedbackContainer>
            <BotMessageFeedbackButtonContainer>
                <BotMessageFeedbackButton up messageId={messageId} hoverMsg={intl.get('FEEDBACK_TOOLTIP_POSITIVE')} />
                <Space />
                <BotMessageFeedbackButton
                    up={false}
                    messageId={messageId}
                    hoverMsg={intl.get('FEEDBACK_TOOLTIP_NEGATIVE')}
                />
            </BotMessageFeedbackButtonContainer>
        </BotMessageFeedbackContainer>
    );
}

type BotMessageProps = {
    message: BotConversationMessage;
};

function BotMessage(props: BotMessageProps) {
    const masdifClient = useMasdifClient();

    const buttons = props.message.buttons;
    const attachments = props.message.data?.attachment;

    return (
        <MessageContainer>
            <BotAvatar />
            <BotMessageContainer>
                <BotMessageContentContainer>
                    <MessageText>{props.message.text}</MessageText>
                    <ReplyAttachments attachments={attachments || []} />
                    <ReplyButtons buttons={buttons || []} />
                </BotMessageContentContainer>
                {masdifClient?.shouldAskForFeedback() && props.message.isLast && (
                    <BotMessageFeedback messageId={props.message.message_id ? props.message.message_id : ''} />
                )}
            </BotMessageContainer>
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
            <BotMessageContentContainer>
                <Loading />
            </BotMessageContentContainer>
        </MessageContainer>
    );
}

export default function Messages() {
    const masdifStatus = useMasdifStatus();
    const [convoContext] = useConversationContext();
    const containerElement = useRef<HTMLDivElement>(null);

    useEffect(() => {
        containerElement.current?.scrollTo({ top: containerElement.current.scrollHeight });
    }, [convoContext.messages.length, convoContext.speechHypothesis, convoContext.loading]);

    return (
        <MessagesContainer ref={containerElement} $disabled={!masdifStatus}>
            {!masdifStatus && <h4>{intl.get('CHAT_SERVER_DOWN_MESSAGE')}</h4>}
            {convoContext.messages.map((message, idx) => {
                switch (message.actor) {
                    case 'bot':
                        return <BotMessage key={idx} message={message} />;
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
