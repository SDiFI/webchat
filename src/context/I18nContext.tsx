import React, { createContext, Dispatch, useContext, useEffect, useState } from "react";
import { useSettings } from "./SettingsContext";
import intl from 'react-intl-universal';

import { locales } from '../locales/locales';

export const i18nLocales = {
    "is-IS": locales.isIS,
    "en-US": locales.enUS,
};

export type I18n = {
    currentLanguageCode: string,
    locales: typeof i18nLocales,
};

export const defaultI18n: I18n = {
    currentLanguageCode: "is-IS",
    locales: i18nLocales,
};

type I18nContextValue = [
    I18n,
    Dispatch<I18n>,
];

// TODO(Smári, STIFI-29): Get the data and populate this array dynamically.
export const languagesCodes = ["is-IS", "en-US"] as const;
type LanguageCodeTuple = typeof languagesCodes;
type LanguageCode = LanguageCodeTuple[number];
function isValidLanguageCode(languageCode: string): languageCode is LanguageCode {
    return languagesCodes.includes(languageCode as LanguageCode);
}

export const I18nContext = createContext<I18nContextValue>([defaultI18n, () => {}]);

export function I18nProvider(props: { defaultValue?: Partial<I18n>, children: React.ReactNode }) {
    const [settings, setSettings] = useSettings();
    const [i18n, setI18n] = useState<I18n>({
        currentLanguageCode: settings.language,
        locales: i18nLocales,
    });

    useEffect(() => {
        if (!isValidLanguageCode(i18n.currentLanguageCode)) {
            throw new Error("Invalid language code!");
        }
        intl.init({
            locales: defaultI18n.locales,
            currentLocale: i18n.currentLanguageCode,
        });
        setSettings({["language"]: i18n.currentLanguageCode});
    }, [i18n.currentLanguageCode]);

    return(
        <I18nContext.Provider value={[i18n, setI18n]}>
            {props.children}
        </I18nContext.Provider>
    );
}

export function useI18n(): [I18n, Dispatch<Partial<I18n>>] {
    const [ctx, setCtx] = useContext(I18nContext);

    const mergeAndSetValue = (newI18n: Partial<I18n>) => {
        setCtx({...ctx, ...newI18n});
    }

    return [ctx, mergeAndSetValue];
}
