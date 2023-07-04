import React, { createContext, useContext, useEffect } from 'react';
import { ConversationResponse, ConversationSentMessage, TMasdifClient } from '../api/types';
import { useMasdifClient } from '../context/MasdifClientContext';
import useSessionStorage from '../hooks/useSessionStorage';
import { useReducerWithMiddleware } from '../hooks/useReducerWithMiddleware';
import { PlaybackState, useAudioPlayback } from './AudioPlaybackContext';

type BotConversationMessageFeedback = {
    [key: string]: string;
};

export type BotConversationMessage = {
    actor?: 'bot';
    isLast: boolean;
} & ConversationResponse;

export type UserConversationMessage = {
    actor: 'user';
} & ConversationSentMessage;

export type ConversationState = {
    conversationId: string | null;
    messages: (BotConversationMessage | UserConversationMessage)[];
    speechHypothesis?: string;
    loading: boolean;
    userSpeaking: boolean;
    error: string | null;
    feedback: BotConversationMessageFeedback;
};

const initialState: ConversationState = {
    conversationId: null,
    messages: [],
    loading: false,
    userSpeaking: false,
    error: null,
    feedback: {},
};

// TODO(rkjaran): Define this type in more detail
export type ConversationAction =
    | ({ type: 'ADD_RESPONSE' } & ConversationResponse)
    | ({ type: 'ADD_SENT_TEXT' } & ConversationSentMessage)
    | { type: 'SEND_ACTION'; payload: string }
    | { type: 'SET_CONVERSATION_ID'; conversationId: string }
    | { type: 'START_USER_SPEECH' }
    | { type: 'END_USER_SPEECH' }
    | { type: 'SET_USER_SPEECH_PARTIAL'; hypothesis: string }
    | { type: 'DELAY_MOTD_RESPONSE' }
    | { type: 'SET_RESPONSE_REACTION'; messageId: string; value: string }
    | { type: 'REMOVE_RESPONSE_REACTION'; messageId: string; value: string };
const reducer: React.Reducer<ConversationState, ConversationAction> = (
    state: ConversationState,
    action: ConversationAction,
) => {
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
        case 'SET_RESPONSE_REACTION':
            return Object.assign({}, state, {
                feedback: {
                    ...state.feedback,
                    [action.messageId]: action.value,
                },
            });
        case 'REMOVE_RESPONSE_REACTION':
            const { [action.messageId]: value, ...feedback } = state.feedback;
            return Object.assign({}, state, {
                feedback: {
                    ...feedback,
                },
            });
        default:
            throw new Error('Unknown action type');
    }
};

const makePlaybackMiddleware = (setPlaybackFn: (playbackState: PlaybackState) => void) => (
    action: ConversationAction /* state: ConversationState */,
) => {
    if (action.type === 'ADD_RESPONSE') {
        console.debug('response data', action.data);
        const audioAttachment = action.data?.attachment?.find(attachment => attachment.type === 'audio');
        if (audioAttachment) {
            setPlaybackFn({
                src: audioAttachment.payload.src,
                playing: true,
            });
        }
    }
};

const makeMessageInteractionMiddleware = (masdifClient: TMasdifClient | null) => (
    action: ConversationAction,
    state: ConversationState,
    dispatch: React.Dispatch<ConversationAction>,
) => {
    const sendActionNames: Array<Partial<ConversationAction['type']>> = [
        'ADD_SENT_TEXT',
        'SEND_ACTION',
        'SET_RESPONSE_REACTION',
        'REMOVE_RESPONSE_REACTION',
    ];
    if (sendActionNames.includes(action.type)) {
        if (
            !masdifClient ||
            !state.conversationId ||
            (action.type === 'SET_RESPONSE_REACTION' && !action.messageId) ||
            (action.type === 'REMOVE_RESPONSE_REACTION' && !action.messageId)
        ) {
            // TODO: If these are null, something is wrong... Do something about that.
            console.error('No client, no conversation ID or no message ID. Something bad happened');
            return;
        }

        const text: string =
            action.type === 'ADD_SENT_TEXT'
                ? action.text
                : action.type === 'SEND_ACTION'
                ? action.payload
                : action.type === 'SET_RESPONSE_REACTION' || action.type === 'REMOVE_RESPONSE_REACTION'
                ? `/feedback{"value":"${action.value}"}`
                : '';
        text.length === 0 && console.warn('Sending message with an empty text string.');

        masdifClient!
            .sendMessage(state.conversationId!, {
                text,
                metadata: {
                    asr_generated: action.type === 'ADD_SENT_TEXT' ? action.metadata?.asr_generated : undefined,
                },
                ...((action.type === 'SET_RESPONSE_REACTION' || action.type === 'REMOVE_RESPONSE_REACTION') && {
                    message_id: action.messageId,
                }),
            })
            .then(responses => {
                if (action.type === 'SET_RESPONSE_REACTION' || action.type === 'REMOVE_RESPONSE_REACTION') {
                    // Don't do anything with feedback answers for now.
                    return;
                }
                responses.forEach((response, i, responseArr) => {
                    const message: BotConversationMessage = {
                        ...response,
                        actor: 'bot',
                        isLast: i === responseArr.length - 1,
                    };
                    dispatch({ type: 'ADD_RESPONSE', ...message });
                });
            });
    }
};

export type ConversationContextValue = [ConversationState, React.Dispatch<ConversationAction>];

const ConversationContext = createContext<ConversationContextValue>([initialState, () => {}]);

export type Props = {
    children?: React.ReactNode;
};

export function ConversationContextProvider(props: Props) {
    const masdifClient = useMasdifClient();
    const [savedState, setSavedState] = useSessionStorage<ConversationState>('@sdifi:conversation', initialState);
    const [, setPlayback] = useAudioPlayback();

    const playbackMiddleware = makePlaybackMiddleware(setPlayback);
    const messageInteractionMiddleware = makeMessageInteractionMiddleware(masdifClient);
    const [state, dispatch] = useReducerWithMiddleware(
        reducer,
        savedState,
        [playbackMiddleware, messageInteractionMiddleware],
        [],
    );

    useEffect(() => {
        console.debug('saving state for session');
        setSavedState(state);
    }, [state]);

    return <ConversationContext.Provider value={[state, dispatch]}>{props.children}</ConversationContext.Provider>;
}

export const useConversationContext = () => useContext(ConversationContext);

export default ConversationContext;
