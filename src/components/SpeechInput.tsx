import React from 'react';
import styled from 'styled-components';
import { performSingleUttSpeechRecognition } from '../api/speech';
import { useConversationContext } from '../context/ConversationContext';
import SpeakIcon from './SpeakIcon';
import { useMasdifStatus } from '../context/MasdifClientContext';

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

type SpeakButtonProps = {
    active: boolean;
    onClick: () => void;
};

function SpeakButton(props: SpeakButtonProps) {
    return (
        <Button onClick={props.onClick} disabled={props.active}>
            <SpeakIcon active={props.active} />
        </Button>
    );
}

export default function SpeechInput() {
    const masdifStatus = useMasdifStatus();
    const [convoState, convoDispatch] = useConversationContext();

    async function handleSpeak() {
        if (convoState.userSpeaking || !masdifStatus) {
            console.debug(`${!masdifStatus ? 'Button disabled' : 'User already speaking'}, ignoring...`);
            return;
        }

        convoDispatch({ type: 'START_USER_SPEECH' });

        await performSingleUttSpeechRecognition((transcript, metadata) => {
            if (metadata.isFinal && transcript.length > 0) {
                // TODO: remove this once Masdif has integrated asr
                convoDispatch({
                    type: 'ADD_SENT_TEXT',
                    text: transcript,
                    metadata: { asr_generated: true },
                });
            } else {
                convoDispatch({ type: 'SET_USER_SPEECH_PARTIAL', hypothesis: transcript });
            }
        });

        convoDispatch({ type: 'END_USER_SPEECH' });
    }

    return <SpeakButton onClick={handleSpeak} active={convoState.userSpeaking} />;
}
