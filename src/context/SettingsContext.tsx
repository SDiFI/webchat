import React, { Dispatch, createContext, useContext, useMemo, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

export type Settings = {
    disableTTS: boolean,
    language: string,
};

const defaultSettings: Settings = {
    disableTTS: false,
    language: "is-IS",
};

type SettingsContextValue = [
    Settings,
    Dispatch<Settings>,
];

const SettingsContext = createContext<SettingsContextValue>([defaultSettings, () => {}]);

export function SettingsProvider(props: { defaultValue?: Partial<Settings>, children: React.ReactNode }) {
    const [stored, _setStored] = useLocalStorage<Settings>(
        '@sdifi:settings',
        props.defaultValue ? { ...defaultSettings, ...props.defaultValue } : defaultSettings
    );

    const setStored = useCallback(_setStored, []);
    const ctxValue = useMemo<SettingsContextValue>(() => [stored, setStored], [stored, setStored]);

    return (
        <SettingsContext.Provider value={ctxValue}>
            {props.children}
        </SettingsContext.Provider>
    );
}

export function useSettings(): [Settings, Dispatch<Partial<Settings>>] {
    const [ctx, setCtx] = useContext(SettingsContext);

    const mergeAndSetValue = (newSettings: Partial<Settings>) => {
        setCtx({...ctx, ...newSettings});
    };

    return [ctx, mergeAndSetValue];
}
