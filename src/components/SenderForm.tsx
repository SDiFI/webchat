import React, { useState } from 'react';
import styled from 'styled-components';
import { useConversationContext } from '../context/ConversationContext';
import { useMasdifClient } from '../context/MasdifClientContext';
import SendButton from './SendButton';
import SpeechInput from './SpeechInput';

const Form = styled.form`
  align-items: center;
  display: flex;
  background-color: #f4f7f9;
  min-height: 30px;
  padding: 15px 5px;
`;

const Textarea = styled.textarea`
  font-size: 1em;
  width: 100%;
  height: 100%;
  border: 0;
  background-color: #f4f7f9;
  padding-left: 15px;
  font-family: Inter,sans-serif;
  resize: none;

  &:focus {
  outline: none !important;
  }
`;

export type SenderFormProps = {
    placeholder: string,
};

export default function SenderForm(props: SenderFormProps) {
    const [convoState, convoDispatch] = useConversationContext();
    const [text, setText] = useState('');
    const masdifClient = useMasdifClient();

    const sendText = () => {
        if (!text) return;

        if (text.startsWith('/debug image')) {
            const duckUrl = 'https://www.pinclipart.com/picdir/middle/122-1222832_kooz-top-donald-duck-drawing-color-clipart.png';
            convoDispatch({ type: 'ADD_RESPONSE', recipient_id: 'debug', text: 'Þetta er mynd', data: { attachment: [
                { type: 'image', payload: { src: duckUrl } },
            ] } });

            setText('');
            return;
        }

        if (text.startsWith('/debug button')) {
            convoDispatch({ type: 'ADD_RESPONSE', recipient_id: 'debug', text: 'Þetta eru takkar', buttons: [
                { title: 'Gerðu þetta', payload: '/request_contact{"subject":"Fjármál"}' },
                { title: 'Farðu þangað', url: 'https://duckduckgo.com' },
            ]});

            setText('');
            return;
        }

        convoDispatch({ type: 'ADD_SENT_TEXT', text });
        setText('');

        if (!masdifClient || !convoState.conversationId) {
            // TODO: If these are null, something is wrong... Do something about that
            console.error('No client or no conversation ID. Something bad happened');
            return;
        }

        masdifClient.sendMessage(convoState.conversationId, { text })
                    .then((responses) => {
                        responses.forEach((response) => {
                            convoDispatch({ type: 'ADD_RESPONSE', ...response });
                        });
                    });
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        sendText();
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendText();
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <SpeechInput />
            <Textarea
                disabled={convoState.userSpeaking}
                placeholder={convoState.speechHypothesis || props.placeholder}
                value={text}
                onChange={({ target }) => setText(target.value)}
                onKeyDown={handleKeyDown}
            >
            </Textarea>
            <SendButton
                ready={!!text}
                onClick={sendText}
            />
        </Form>
    );
}
