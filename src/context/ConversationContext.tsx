import React, { createContext, useContext, useReducer } from 'react';
import { ConversationResponse, ConversationSentMessage } from '../api/types';

export type ConversationState = {
    conversationId: string | null,
    messages: (
        | ({ actor?: 'bot' } & ConversationResponse)
        | ({ actor: 'user' } & ConversationSentMessage)
    )[],
    loading: boolean,
    error: string | null,
};

const initialState: ConversationState = {
    conversationId: null,
    messages: [],
    loading: false,
    error: null,
};

/* export type ConversationAction =
 *     | { type: 'ADD_TEXT', text: string }
 *     | { type: 'ADD_IMAGE', imageSrc: string }
 *     | { type: 'ADD_URL_BUTTON', title: string, url: string }
 *     | { type: 'ADD_POSTBACK_BUTTON', title: string, payload: string }
 *     | { type: 'ADD_AUDIO', audioSrc: string }
 *     | { type: 'ADD_SENT_TEXT', text: string }
 * ;
 *  */

// TODO(rkjaran): Define this type in more detail
export type ConversationAction =
    /* | { type: 'ADD_TEXT' } & ConversationResponse
     * | { type: 'ADD_IMAGE' } & ConversationResponse
     * | { type: 'ADD_URL_BUTTON' } & ConversationResponse
     * | { type: 'ADD_POSTBACK_BUTTON' } & ConversationResponse
     * | { type: 'ADD_AUDIO' } & ConversationResponse */
    | { type: 'ADD_RESPONSE' } & ConversationResponse
    | { type: 'ADD_SENT_TEXT' } & ConversationSentMessage
    | { type: 'SET_CONVERSATION_ID', conversationId: string }
;

const reducer: React.Reducer<ConversationState, ConversationAction> = (state, action) => {
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
        case 'SET_CONVERSATION_ID':
            return Object.assign({}, state, { conversationId: action.conversationId });
        default:
            throw new Error('Unknown action type');
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
    const [state, dispatch] = useReducer(reducer, initialState)
    return (
        <ConversationContext.Provider value={[state, dispatch]}>
            {props.children}
        </ConversationContext.Provider>
    );
}

export const useConversationContext = () => useContext(ConversationContext);

export default ConversationContext;
