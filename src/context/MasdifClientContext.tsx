import React, { createContext, useContext, useEffect, useState } from 'react';
import MasdifClient from '../api';
import { TMasdifClient } from '../api/types';

const MasdifClientContext = createContext<TMasdifClient | null>(null);

export type MasdifClientContextProviderProps = {
    serverAddress: string,
    extraHttpHeaders?: { [key: string]: string },
    disableTTS?: boolean,
    children?: React.ReactNode,
};

export function MasdifContextProvider(props: MasdifClientContextProviderProps) {
    const [masdifClient, setMasdifClient] = useState<MasdifClient | null>(null);

    useEffect(() => {
        setMasdifClient(new MasdifClient(props.serverAddress, {
            extraHeaders: props.extraHttpHeaders,
            disableTTS: props.disableTTS,
        }));
    }, [props.serverAddress])

    return (
        <MasdifClientContext.Provider value={masdifClient}>
            {props.children}
        </MasdifClientContext.Provider>
    );
}

export const useMasdifClient = () => useContext(MasdifClientContext);
