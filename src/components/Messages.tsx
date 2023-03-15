import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ConversationResponse, ConversationSentMessage } from '../api/types';
import { ConversationState, useConversationContext } from '../context/ConversationContext';
import Loading from './Loading';
import { ReplyAttachments, ReplyButtons } from './reply-components';


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

  img {
    max-width: 180px;
  }
`;

type BotMessageProps = {
    message: ConversationResponse,
};

function BotMessage(props: BotMessageProps) {
    const buttons = props.message.buttons;
    const attachments = props.message.data.attachment;

    return (
        <MessageContainer>
            <BotMessageContainer>
                <MessageText>
                    {props.message.text}
                </MessageText>
                <ReplyAttachments attachments={attachments || []} />
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
