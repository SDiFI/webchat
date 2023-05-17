import React, { useState } from 'react';
import styled from 'styled-components';
import { useConversationContext } from '../context/ConversationContext';
import { useMasdifClient } from '../context/MasdifClientContext';
import { Settings, useSettings } from '../context/SettingsContext';
import { defaultTheme } from '../theme';
import SendButton from './SendButton';
import SpeechInput from './SpeechInput';

const Form = styled.form`
    align-items: center;
    display: flex;
    background-color: ${({ theme }) => theme.formBgColor};
    height: ${({ theme }) => theme.formHeight};
    padding: 15px 5px;
`;

Form.defaultProps = {
    theme: defaultTheme,
};

const Textarea = styled.textarea`
    font-size: 1em;
    width: 100%;
    height: 100%;
    border: 0;
    color: ${({ theme }) => theme.formFgColor};
    background-color: ${({ theme }) => theme.formBgColor};
    padding-left: 15px;
    resize: none;
    font-family: inherit;

    &:focus {
        outline: none !important;
    }
`;

Textarea.defaultProps = {
    theme: defaultTheme,
};

export type SenderFormProps = {
    placeholder: string;
};

export default function SenderForm(props: SenderFormProps) {
    const [convoState, convoDispatch] = useConversationContext();
    const [text, setText] = useState('');
    const masdifClient = useMasdifClient();
    const [settings, setSettings] = useSettings();

    const sendText = () => {
        if (!text) return;

        if (text.startsWith('/debug image')) {
            const duckUrl =
                'https://www.pinclipart.com/picdir/middle/122-1222832_kooz-top-donald-duck-drawing-color-clipart.png';
            convoDispatch({
                type: 'ADD_RESPONSE',
                recipient_id: 'debug',
                text: 'Þetta er mynd',
                data: { attachment: [{ type: 'image', payload: { src: duckUrl } }] },
            });

            setText('');
            return;
        }

        if (text.startsWith('/debug button')) {
            convoDispatch({
                type: 'ADD_RESPONSE',
                recipient_id: 'debug',
                text: 'Þetta eru takkar',
                buttons: [
                    { title: 'Gerðu þetta', payload: '/request_contact{"subject":"Fjármál"}' },
                    { title: 'Farðu þangað', url: 'https://duckduckgo.com' },
                ],
            });

            setText('');
            return;
        }

        if (text.startsWith('/debug settings ')) {
            const subcommand = text.substring(16);
            if (subcommand.startsWith('get')) {
                convoDispatch({ type: 'ADD_RESPONSE', recipient_id: 'debug', text: JSON.stringify(settings) });
            } else if (subcommand.startsWith('set ')) {
                setSettings(JSON.parse(subcommand.substring(4)) as Partial<Settings>);
            }
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

        masdifClient.sendMessage(
            convoState.conversationId,
            {
                text: text,
                metadata: { language: settings.language },
            }
        ).then((responses) => {
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
            ></Textarea>
            <SendButton ready={!!text} onClick={sendText} />
        </Form>
    );
}
