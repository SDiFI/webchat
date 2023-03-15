import React, { useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { Button as ButtonData, ConversationResponse, ConversationSentMessage } from '../api/types';
import { ConversationState, useConversationContext } from '../context/ConversationContext';
import { useMasdifClient } from '../context/MasdifClientContext';
import Loading from './Loading';


// TODO: Make responsive
const MessagesContainer = styled.div`
  height: 510px;
  max-height: 50vh;

  background-color: #fff;
  overflow-y: auto;
  padding-top: 10px;
`;

const MessageContainer = styled.div`
  margin: 10px;
  font-size: 16px;
  line-height: 20px;
  display: flex;
  font-family: sans-serif;
  flex-wrap: wrap;
  position: relative;
`;

const MessageText = styled.div`
  margin: 0;
`;

const UserMessageContainer = styled.div`
  background-color: #003a9b;
  color: #fff;
  border-radius: 15px;
  padding: 11px 15px;
  max-width: 215px;
  text-align: left;
  font-family: sans-serif;
  background-color: #135afe;
  max-width: 85%;
  margin-left: auto;
  overflow-wrap: break-word;
`;

const BotMessageContainer = styled.div`
  background-color: #f4f7f9;
  color: #000;
  border-radius: 0 15px 15px 15px;
  padding: 11px 15px;
  max-width: 215px;
  text-align: left;
  font-family: sans-serif;
  max-width: 85%;
`;


const replyStyle = css`
  background-color: #ccc;
  margin: 2px;
  display: inline-block;
  padding: 6px;
  text-align: center;
  border: 2px #eee;
  border-radius: 4px;
  font-family: sans-serif;
  font-size: 14px;

  &:hover {
    background-color: #eee;
  }
`;

const ReplyButton = styled.button`
  ${replyStyle}
  &:hover {
    cursor:  pointer;
  }
`;

type ReplyActionProps = {
    title: string,
    payload: string,
};

function ReplyAction(props: ReplyActionProps) {
    const masdifClient = useMasdifClient();
    const [convoState, convoDispatch] = useConversationContext();

    const handlePostback = (_: React.MouseEvent) => {
        // TODO: We should probably move this update logic somewhere else, since SendForm is doing the exact same action
        masdifClient?.sendMessage(convoState.conversationId!, { text: props.payload })
                     .then((responses) => {
                         responses.forEach((response) => {
                             convoDispatch({ type: 'ADD_RESPONSE', ...response });
                         });
                     });
    };

    return (
        <ReplyButton onClick={handlePostback}>
            {props.title}
        </ReplyButton>
    );
}

const ReplyA = styled.a`
  ${replyStyle}
  text-decoration: none !important;
  color: inherit;
  line-height: normal;
`;

type ReplyLinkProps = {
    title: string,
    href: string,
};

function ReplyLink(props: ReplyLinkProps) {
    return <ReplyA href={props.href} target='_blank'>{props.title}</ReplyA>;
}

type ReplyButtonsProps = {
    buttons: ButtonData[],
};

function ReplyButtons({ buttons }: ReplyButtonsProps) {
    return (
        <>
            {buttons.map((buttonData, idx) => {
                if ('url' in buttonData) {
                    return (
                        <ReplyLink
                            key={idx}
                            title={buttonData.title}
                            href={buttonData.url}
                        />
                    );
                }

                return (
                    <ReplyAction
                        key={idx}
                        title={buttonData.title}
                        payload={buttonData.payload}
                    />
                );
            }
            )}
        </>
    );
}

type BotMessageProps = {
    message: ConversationResponse,
};

function BotMessage(props: BotMessageProps) {
    // TODO: handle data.attachment.{audio, image, etc...}
    // TODO: handle data.buttons
    const buttons =  props.message.buttons;

    return (
        <MessageContainer>
            <BotMessageContainer>
                <MessageText>
                    {props.message.text}
                </MessageText>
                <ReplyButtons buttons={buttons || []} />
            </BotMessageContainer>
        </MessageContainer>
    );
}

type UserMessageProps = {
    message: ConversationSentMessage,
};

function UserMessage(props: UserMessageProps) {
    return (
        <MessageContainer>
            <UserMessageContainer>
                <MessageText>
                    {props.message.text}
                </MessageText>
            </UserMessageContainer>
        </MessageContainer>
    );
}

function LoadingMessage() {
    return (
        <MessageContainer>
            <BotMessageContainer>
                <Loading />
            </BotMessageContainer>
        </MessageContainer>
    );
}


type MessagesProps = {
    messages: ConversationState["messages"],
};

export default function Messages(props: MessagesProps) {
    const [convoContext] = useConversationContext();

    const latestElement = useRef<HTMLDivElement>(null);
    useEffect(() => {
        console.debug('Scrolling to bottom');
        latestElement.current?.scrollTo({ top: latestElement.current.scrollHeight });
    }, [props.messages])

    return (
        <MessagesContainer ref={latestElement}>
            {props.messages.map((message, idx) => {
                console.debug(message);
                switch (message.actor) {
                    case 'bot':
                        return (
                            <BotMessage key={idx} message={message} />
                        );
                    case 'user':
                        return (
                            <UserMessage key={idx} message={message} />
                        );
                    default:
                        return null;
                }
            })}
        {convoContext.loading && <LoadingMessage />}
        </MessagesContainer>
    );
}
