import React, { createContext, useContext, useEffect } from 'react';
import { ConversationResponse, ConversationSentMessage } from '../api/types';
import useSessionStorage from '../hooks/useSessionStorage';
import { useReducerWithMiddleware } from '../hooks/useReducerWithMiddleware';
import { PlaybackState, useAudioPlayback } from './AudioPlaybackContext';

export type ConversationState = {
    conversationId: string | null,
    messages: (
        | ({ actor?: 'bot' } & ConversationResponse)
        | ({ actor: 'user' } & ConversationSentMessage)
    )[],
    speechHypothesis?: string,
    loading: boolean,
    userSpeaking: boolean,
    error: string | null,
};

const initialState: ConversationState = {
    conversationId: null,
    messages: [],
    loading: false,
    userSpeaking: false,
    error: null,
};

// TODO(rkjaran): Define this type in more detail
export type ConversationAction =
    | { type: 'ADD_RESPONSE' } & ConversationResponse
    | { type: 'ADD_SENT_TEXT' } & ConversationSentMessage
    | { type: 'SEND_ACTION' }
    | { type: 'SET_CONVERSATION_ID', conversationId: string }
    | { type: 'START_USER_SPEECH' }
    | { type: 'END_USER_SPEECH' }
    | { type: 'SET_USER_SPEECH_PARTIAL', hypothesis: string }
    | { type: 'DELAY_MOTD_RESPONSE' }
    ;

const reducer: React.Reducer<ConversationState, ConversationAction> = (state: ConversationState, action: ConversationAction) => {
    switch (action.type) {
        case 'ADD_RESPONSE':
            return Object.assign({}, state, {
                loading: false,
                messages: [...state.messages, { actor: 'bot', ...(action as ConversationResponse) }],
            });
        case 'ADD_SENT_TEXT':
            return Object.assign({}, state, {
                loading: true,
                messages: [...state.messages, { actor: 'user', ...(action as ConversationSentMessage) }],
            });
        case 'SEND_ACTION':
            return Object.assign({}, state, { loading: true });
        case 'SET_CONVERSATION_ID':
            return Object.assign({}, state, { conversationId: action.conversationId });
        case 'START_USER_SPEECH':
            return Object.assign({}, state, { userSpeaking: true });
        case 'END_USER_SPEECH':
            return Object.assign({}, state, { userSpeaking: false, speechHypothesis: undefined });
        case 'SET_USER_SPEECH_PARTIAL':
            return Object.assign({}, state, { userSpeaking: true, speechHypothesis: action.hypothesis });
        case 'DELAY_MOTD_RESPONSE':
            return Object.assign({}, state, { loading: true });
        default:
            throw new Error('Unknown action type');
    }
};

const makePlaybackAfterware = (setPlaybackFn: (playbackState: PlaybackState) => void) =>
    (action: ConversationAction, /* state: ConversationState */) => {
        if (action.type === 'ADD_RESPONSE') {
            const audioAttachment = action.data?.attachment?.find((attachment) => attachment.type === 'audio');
            if (audioAttachment) {
                setPlaybackFn({
                    src: audioAttachment.payload.src,
                    playing: true,
                });
            }
        }
    };

export type ConversationContextValue = [
    ConversationState,
    React.Dispatch<ConversationAction>,
];

const ConversationContext = createContext<ConversationContextValue>([initialState, () => {}]);

export type Props = {
    children?: React.ReactNode,
};

export function ConversationContextProvider(props: Props) {
    const [savedState, setSavedState] = useSessionStorage<ConversationState>('@sdifi:conversation', initialState);
    const [, setPlayback] = useAudioPlayback();
    const playbackAfterware = makePlaybackAfterware(setPlayback);
    const [state, dispatch] = useReducerWithMiddleware(reducer, savedState, [], [playbackAfterware]);

    useEffect(() => {
        console.debug('saving state for session');
        setSavedState(state);
    }, [state]);

    return (
        <ConversationContext.Provider value={[state, dispatch]}>
            {props.children}
        </ConversationContext.Provider>
    );
}

export const useConversationContext = () => useContext(ConversationContext);

export default ConversationContext;
