import React from 'react';
import intl from 'react-intl-universal';
import styled, { css } from 'styled-components';
import { Button as ButtonData, ConversationAttachment } from '../api/types';
import { useAudioPlayback } from '../context/AudioPlaybackContext';
import { useConversationContext } from '../context/ConversationContext';
import { useMasdifStatus } from '../context/MasdifClientContext';
import { VIDEO_ATTACHMENT_HEIGHT, VIDEO_ATTACHMENT_WIDTH } from '../constants';
import { determineVideoSrc, setUrlHWQueryParams } from '../utils/url';

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
    const [, convoDispatch] = useConversationContext();
    const handlePostback = (_: React.MouseEvent) => {
        convoDispatch({
            type: 'SEND_ACTION',
            payload: props.payload,
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
    const masdifStatus = useMasdifStatus();
    const [playback, setPlayback] = useAudioPlayback();

    const src = props.src;
    const handleClick = () => {
        if (!masdifStatus) {
            return;
        }

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

const VideoAttachmentIFrame = styled.iframe`
    max-width: ${({ theme }) => theme.botMessageMaxVideoWidth};
    border: none;
`;

type ReplyMediaProps = {
    src: string;
    title?: string;
    // Image is a link if present
    link?: string;
    alt?: string;
    type: 'image' | 'video';
};

function ReplyMedia(props: ReplyMediaProps) {
    if (!props.src) return null;

    let media: JSX.Element | undefined;
    if (props.type === 'image') {
        media = <img src={props.src} alt={props.alt} title={props.title} />;
    } else {
        switch (determineVideoSrc(props.src)) {
            case 'FACEBOOK':
                media = (
                    <VideoAttachmentIFrame
                        src={setUrlHWQueryParams(props.src)}
                        height={VIDEO_ATTACHMENT_HEIGHT}
                        width={VIDEO_ATTACHMENT_WIDTH}
                    />
                );
                break;
            case 'YOUTUBE':
            case 'VIMEO':
                media = (
                    <VideoAttachmentIFrame
                        src={props.src}
                        height={VIDEO_ATTACHMENT_HEIGHT}
                        width={VIDEO_ATTACHMENT_WIDTH}
                    />
                );
                break;
            case 'FILE':
                media = (
                    <video height={VIDEO_ATTACHMENT_HEIGHT} width={VIDEO_ATTACHMENT_WIDTH} controls>
                        <source src={props.src} />
                        {intl.get('MESSAGE_VIDEO_TAG_UNSUPPORTED_MESSAGE')}
                    </video>
                );
        }
    }

    if (props.type === 'image' && props.link) {
        return (
            <a href={props.link} target='_blank' rel='noreferrer'>
                {media}
            </a>
        );
    }

    return media;
}

type ReplyAttachmentsProps = {
    attachments: ConversationAttachment[];
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
                            <ReplyMedia
                                key={attachmentData.payload.src}
                                title={attachmentData.payload.title}
                                link={attachmentData.payload.link}
                                src={attachmentData.payload.src}
                                type={attachmentData.type}
                            />
                        );
                    case 'video':
                        return (
                            <ReplyMedia
                                key={attachmentData.payload.src}
                                src={attachmentData.payload.src}
                                type={attachmentData.type}
                            />
                        );
                    default:
                        return null;
                }
            })}
        </>
    );
}

export { ReplyButtonsProps, ReplyButtons, ReplyAttachmentsProps, ReplyAttachments };
