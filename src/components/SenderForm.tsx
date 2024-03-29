import React, { useState } from 'react';
import styled from 'styled-components';
import { ConversationAction, useConversationContext } from '../context/ConversationContext';
import { Settings, useSettings } from '../context/SettingsContext';
import { defaultTheme } from '../theme';
import SendButton from './SendButton';
import SpeechInput from './SpeechInput';
import intl from 'react-intl-universal';
import { useMasdifStatus } from '../context/MasdifClientContext';

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
    const masdifStatus = useMasdifStatus();
    const [convoState, convoDispatch] = useConversationContext();
    const [text, setText] = useState('');
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
                data: { attachment: [{ type: 'image', payload: { src: duckUrl, title: 'Quack!' } }] },
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

        if (text.startsWith('/debug video')) {
            const msgParts: string[] = text.split(' ');

            let videoSrc: string = '';
            let descText: string = 'Þetta er myndskeið';
            switch (msgParts[2]) {
                case 'youtube':
                    videoSrc = 'https://www.youtube.com/embed/FPWj6W5dgNM';
                    descText = `${descText} af YouTube`;
                    break;
                case 'vimeo':
                    videoSrc = 'https://player.vimeo.com/video/295233741?h=9aa727fe41';
                    descText = `${descText} af Vimeo`;
                    break;
                case 'facebook':
                    videoSrc =
                        'https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Fofficialhpc%2Fvideos%2F1190669514972266%2F&show_text=false&width=476&t=0';
                    descText = `${descText} af Facebook`;
                    break;
                case 'file':
                default:
                    videoSrc =
                        'https://jsoncompare.org/LearningContainer/SampleFiles/Video/MP4/Sample-MP4-Video-File-for-Testing.mp4';
                    descText = `${descText} úr skrá`;
            }
            convoDispatch({
                type: 'ADD_RESPONSE',
                recipient_id: 'debug',
                text: descText,
                data: { attachment: [{ type: 'video', payload: { src: videoSrc } }] },
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

    return (
        <Form
            title={!masdifStatus ? intl.get('CHAT_SERVER_DOWN_TOOLTIP') : ''}
            onSubmit={handleSubmit}
            $disabled={!masdifStatus}
        >
            <SpeechInput />
            <Textarea
                disabled={convoState.userSpeaking || !masdifStatus}
                placeholder={convoState.speechHypothesis || props.placeholder}
                value={text}
                onChange={({ target }) => setText(target.value)}
                onKeyDown={handleKeyDown}
            ></Textarea>
            <SendButton ready={!!text} onClick={sendText} />
        </Form>
    );
}
