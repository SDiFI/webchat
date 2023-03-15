import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { Button as ButtonData, ConversationAttachment } from '../api/types';
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

type ReplyAudioProps = {
    src?: string,
};

function ReplyAudio({ src }: ReplyAudioProps) {
    // TODO: Perhaps this should rather use a widget global audio element for the playback, so that we don't get
    //   multiple playing audio attachments at the same time.
    const [ended, setEnded] = useState<boolean>(false);

    if (!src || ended)
        return null;

    return (
        <audio autoPlay src={src} controls={false} onEnded={() => setEnded(true)} />
    );
}

type ReplyImageProps = {
    src?: string,
    alt?: string,
    title?: string,
};

function ReplyImage({ src, alt, title }: ReplyImageProps) {
    if (!src)
        return null;

    return (
        <img src={src} alt={alt} title={title} />
    );
}

type ReplyAttachmentsProps = {
    attachments: ConversationAttachment[],
};

function ReplyAttachments({ attachments }: ReplyAttachmentsProps) {
    return (
        <>
            {attachments.map((attachmentData) => {
                switch (attachmentData.type) {
                    case 'audio':
                        return (
                            <ReplyAudio
                                key={attachmentData.payload.src}
                                src={attachmentData.payload.src}
                            />
                        );
                    case 'image':
                        return (
                            <ReplyImage
                                key={attachmentData.payload.src}
                                src={attachmentData.payload.src}
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


export {
    ReplyButtonsProps,
    ReplyButtons,

    ReplyAttachmentsProps,
    ReplyAttachments,
};
