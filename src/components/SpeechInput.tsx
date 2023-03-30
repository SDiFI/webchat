import React from 'react';
import styled from 'styled-components';
import { performSingleUttSpeechRecognition } from '../api/speech';
import { useConversationContext } from '../context/ConversationContext';
import { useMasdifClient } from '../context/MasdifClientContext';
import SpeakIcon from './SpeakIcon';

const Button = styled.button`
  border: none;
  background: unset;

  &:hover {
    cursor: pointer;
  }

  &:disabled {
   cursor: auto;
  }
`

type SpeakButtonProps = {
    active: boolean,
    onClick: () => void,
};

function SpeakButton(props: SpeakButtonProps) {
    return (
        <Button onClick={props.onClick} disabled={props.active}>
            <SpeakIcon active={props.active} />
        </Button>
    );
}

export type SpeechInputProps = {};

export default function SpeechInput(_: SpeechInputProps) {
    const [convoState, convoDispatch] = useConversationContext();
    const masdifClient = useMasdifClient();

    async function handleSpeak() {
        if (convoState.userSpeaking) {
            console.debug('User already speaking, ignoring...');
            return;
        }

        convoDispatch({ type: 'START_USER_SPEECH' });

        await performSingleUttSpeechRecognition((transcript, metadata) => {
            if (metadata.isFinal && transcript.length > 0) {
                // TODO: remove this once Masdif has integrated asr
                convoDispatch({ type: 'ADD_SENT_TEXT', text: transcript });

                // TODO: Responses should be handled globally, make this only send once we have that. Something the
                //   useMasdifClient hook should take care of.
                masdifClient!.sendMessage(convoState.conversationId!, { text: transcript })
                             .then((responses) => {
                                 responses.forEach((response) => {
                                     convoDispatch({ type: 'ADD_RESPONSE', ...response });
                                 });
                             });
            } else {
                convoDispatch({ type: 'SET_USER_SPEECH_PARTIAL', hypothesis: transcript});
            }
        });

        convoDispatch({ type: 'END_USER_SPEECH' })
    }

    return (
        <SpeakButton
            onClick={handleSpeak}
            active={convoState.userSpeaking}
        />
    );
}
