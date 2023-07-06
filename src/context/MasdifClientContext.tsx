import React, { createContext, useContext, useEffect, useState } from 'react';
import MasdifClient from '../api';
import { FeedbackValue, TMasdifClient } from '../api/types';
import { useSettings } from './SettingsContext';

const MasdifClientContext = createContext<TMasdifClient | null>(null);

export type MasdifClientContextProviderProps = {
    serverAddress: string;
    extraHttpHeaders?: { [key: string]: string };
    askForFeedback?: boolean;
    feedbackValues?: FeedbackValue;
    children?: React.ReactNode;
};

export function MasdifContextProvider(props: MasdifClientContextProviderProps) {
    const [masdifClient, setMasdifClient] = useState<MasdifClient | null>(null);
    const [settings] = useSettings();

    useEffect(() => {
        setMasdifClient(
            new MasdifClient(props.serverAddress, {
                extraHeaders: props.extraHttpHeaders,
                disableTTS: settings.disableTTS,
                language: settings.language,
                askForFeedback: props.askForFeedback,
                feedbackValues: props.feedbackValues,
            }),
        );
    }, [props.serverAddress, settings.disableTTS, settings.language, props.askForFeedback, props.feedbackValues]);

    return <MasdifClientContext.Provider value={masdifClient}>{props.children}</MasdifClientContext.Provider>;
}

export const useMasdifClient = () => useContext(MasdifClientContext);

export function useMasdifStatus() {
    const [status, setStatus] = useState<boolean>(false);
    const masdifClient = useMasdifClient();

    useEffect(() => {
        let handler: number | null = null;

        const fetchStatus = async () => {
            if (masdifClient) {
                setStatus(await masdifClient?.status());
                handler = window.setTimeout(fetchStatus, 30000);
            }
        };

        fetchStatus();

        return () => {
            if (handler !== null) {
                window.clearTimeout(handler);
            }
        };
    }, [masdifClient]);

    return status;
}
