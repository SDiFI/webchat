import React, { useState } from 'react';
import styled from 'styled-components';
import { ConversationAction, useConversationContext } from '../context/ConversationContext';
import { Settings, useSettings } from '../context/SettingsContext';
import { defaultTheme } from '../theme';
import SendButton from './SendButton';
import SpeechInput from './SpeechInput';
import { useMasdifStatus } from '../context/MasdifClientContext';
import intl from 'react-intl-universal';

const Form = styled.form<{ $disabled: boolean }>`
    align-items: center;
    display: flex;
    background-color: ${({ theme }) => theme.formBgColor};
    height: ${({ theme }) => theme.formHeight};
    padding: 15px 5px;
    opacity: ${props => (props.$disabled ? '0.5' : '1')};
    cursor: ${props => (props.$disabled ? 'wait' : 'auto')};
    > * {
        pointer-events: ${props => (props.$disabled ? 'none' : 'auto')};
    }
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
    const [settings, setSettings] = useSettings();
    const masdifStatus = useMasdifStatus();

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
                convoDispatch({
                    type: 'ADD_RESPONSE',
                    recipient_id: 'debug',
                    text: JSON.stringify(settings),
                });
            } else if (subcommand.startsWith('set ')) {
                setSettings(JSON.parse(subcommand.substring(4)) as Partial<Settings>);
            }
            setText('');
            return;
        }

        if (text.startsWith('/debug multi')) {
            const messages: string[] = [
                'Afi minn fór á honum Rauð',
                'Eitthvað suður á bæi,',
                'að sækja bæði sykur og brauð,',
                'sitt af hvoru tagi',
            ];
            messages.forEach((msg, i, arr) => {
                convoDispatch({
                    type: 'ADD_RESPONSE',
                    recipient_id: 'debug',
                    text: msg,
                    isLast: i === arr.length - 1,
                } as ConversationAction);
            });
            setText('');
            return;
        }

        convoDispatch({ type: 'ADD_SENT_TEXT', text });
        setText('');
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

    const disabled = settings.alwaysRender && !masdifStatus;
    return (
        <Form title={disabled ? intl.get('CHAT_SERVER_DOWN_TOOLTIP') : ''} onSubmit={handleSubmit} $disabled={disabled}>
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
