import React from 'react';
import styled, { css } from 'styled-components';
import { Button as ButtonData, ConversationAttachment } from '../api/types';
import { useAudioPlayback } from '../context/AudioPlaybackContext';
import { useConversationContext } from '../context/ConversationContext';
import { useMasdifClient } from '../context/MasdifClientContext';

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
        cursor: pointer;
    }
`;

type ReplyActionProps = {
    title: string;
    payload: string;
};

function ReplyAction(props: ReplyActionProps) {
    const masdifClient = useMasdifClient();
    const [convoState, convoDispatch] = useConversationContext();

    const handlePostback = (_: React.MouseEvent) => {
        // TODO: We should probably move this update logic somewhere else, since SendForm is doing the exact same action
        convoDispatch({ type: 'SEND_ACTION' });
        masdifClient?.sendMessage(convoState.conversationId!, { text: props.payload }).then(responses => {
            responses.forEach(response => {
                convoDispatch({ type: 'ADD_RESPONSE', ...response });
            });
        });
    };

    return <ReplyButton onClick={handlePostback}>{props.title}</ReplyButton>;
}

const ReplyA = styled.a`
    ${replyStyle}
    text-decoration: none !important;
    color: inherit;
    line-height: normal;
`;

type ReplyLinkProps = {
    title: string;
    href: string;
};

function ReplyLink(props: ReplyLinkProps) {
    return (
        <ReplyA href={props.href} target='_blank'>
            {props.title}
        </ReplyA>
    );
}

type ReplyButtonsProps = {
    buttons: ButtonData[];
};

function ReplyButtons({ buttons }: ReplyButtonsProps) {
    return (
        <>
            {buttons.map((buttonData, idx) => {
                if ('url' in buttonData) {
                    return <ReplyLink key={idx} title={buttonData.title} href={buttonData.url} />;
                }

                return <ReplyAction key={idx} title={buttonData.title} payload={buttonData.payload} />;
            })}
        </>
    );
}

type ReplyAudioProps = {
    src?: string;
};

const ReplyAudio = styled(function ReplyAudio(props: ReplyAudioProps & { className?: string }) {
    const src = props.src;
    const [playback, setPlayback] = useAudioPlayback();
    const handleClick = () => {
        if (playback.playing && playback.src === src) {
            setPlayback({ playing: false });
        } else {
            setPlayback({ playing: true, src });
        }
    };

    if (!src) return null;

    return (
        <button className={props.className} onClick={handleClick}>
            {playback.playing && playback.src === src ? '⏹' : '⏵'}
        </button>
    );
})`
    background: none;
    height: 12px;
    width: 12px;
    color: #888;
    padding: 0px;
    margin: 0px;
    float: right;
    text-align: center;
    border: none;
    &:hover {
        cursor: pointer;
    }
`;

type ReplyImageProps = {
    src?: string;
    alt?: string;
    title?: string;
    // Image is a link if present
    link?: string;
};

function ReplyImage({ src, alt, title, link }: ReplyImageProps) {
    if (!src) return null;

    const image = <img src={src} alt={alt} title={title} />;

    if (link) {
        return (
            <a href={link} target='_blank' rel='noreferrer'>
                {image}
            </a>
        );
    }

    return image;
}

type ReplyAttachmentsProps = {
    attachments: ConversationAttachment[];
    lastMessage?: boolean;
};

function ReplyAttachments({ attachments }: ReplyAttachmentsProps) {
    return (
        <>
            {attachments.map(attachmentData => {
                switch (attachmentData.type) {
                    case 'audio':
                        return <ReplyAudio key={attachmentData.payload.src} src={attachmentData.payload.src} />;
                    case 'image':
                        return (
                            <ReplyImage
                                key={attachmentData.payload.src}
                                src={attachmentData.payload.src}
                                link={attachmentData.payload.link}
                            />
                        );
                    default:
                        console.warn(`Ignoring '${attachmentData.type}' attachment`);
                        return null;
                }
            })}
        </>
    );
}

export { ReplyButtonsProps, ReplyButtons, ReplyAttachmentsProps, ReplyAttachments };
