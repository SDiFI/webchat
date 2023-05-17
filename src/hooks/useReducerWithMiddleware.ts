import React, { useEffect, useReducer, useRef } from 'react';

/**
 * Reducer hook with multiple middleware functions and multiple afterware functions for side-effects. Note that the
   afterware functions will miss everything but the last dispatch in a rapid sequence.
 */
export function useReducerWithMiddleware<S, A>(
    reducer: React.Reducer<S, A>,
    initialState: S,
    middlewareFns: Array<(action: A, state: S) => void>,
    afterwareFns: Array<(action: A, state: S) => void>): [S, React.Dispatch<A>] {
    const [state, dispatch] = useReducer(reducer, initialState);
    const actionRef = useRef<A>();

    const dispatchWithMiddleware: React.Dispatch<A> = (action: A) => {
        middlewareFns.forEach((fn) => fn(action, state));
        actionRef.current = action;
        dispatch(action);
    };

    useEffect(() => {
        if (!actionRef.current)
            return;
        afterwareFns.forEach((fn) => actionRef.current && fn(actionRef.current, state));
        actionRef.current = undefined;

    }, [afterwareFns, state]);

    return [state, dispatchWithMiddleware];
}
