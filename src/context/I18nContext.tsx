import React, { createContext, Dispatch, useContext, useEffect, useState } from 'react';
import { useSettings } from './SettingsContext';
import intl from 'react-intl-universal';

import { locales } from '../locales/locales';
import { useMasdifClient, useMasdifStatus } from './MasdifClientContext';
import { useConversationContext } from './ConversationContext';
import { LanguageData } from '../api/types';

export const i18nLocales = {
    'is-IS': locales.isIS,
    'en-US': locales.enUS,
};

export type I18n = {
    // Current locale selection.
    currentLanguageCode: string;

    // Local (widget) supported locales.
    locales: typeof i18nLocales;

    // An intersection of local (widget) supported locales and masdif supported languages.
    supportedLocales: LanguageData[];
};

export const defaultI18n: I18n = {
    currentLanguageCode: 'is-IS',
    locales: i18nLocales,
    supportedLocales: [],
};

type I18nContextValue = [I18n, Dispatch<I18n>];

export const supportedLanguages = ['is-IS', 'en-US'] as const;
type LanguageCodeTuple = typeof supportedLanguages;
type LanguageCode = LanguageCodeTuple[number];
function isValidLanguageCode(languageCode: string): languageCode is LanguageCode {
    return supportedLanguages.includes(languageCode as LanguageCode);
}

export const I18nContext = createContext<I18nContextValue>([defaultI18n, () => {}]);

export function I18nProvider(props: { defaultValue?: Partial<I18n>; children: React.ReactNode }) {
    const [settings, setSettings] = useSettings();
    const masdifClient = useMasdifClient();
    const masdifStatus = useMasdifStatus();
    const [convoState] = useConversationContext();
    const [i18n, setI18n] = useState<I18n>({
        currentLanguageCode: settings.language,
        locales: i18nLocales,
        supportedLocales: [],
    });

    useEffect(() => {
        const getSupportedLanguages = async () => {
            const msg: string = 'Unable to fetch supported languages.';
            if (!convoState.conversationId) {
                console.warn(`${msg} No conversation id present.`);
                return [];
            }
            if (masdifClient && masdifStatus) {
                const info = await masdifClient.info(convoState.conversationId);
                if (!info) {
                    console.error(msg);
                    return [];
                }
                return info.supported_languages;
            }
            console.warn(msg);
            return [];
        };

        if (i18n.supportedLocales.length === 0) {
            getSupportedLanguages().then(langs => {
                if (langs.length > 0) {
                    const webchatSupportedLocales: string[] = Object.keys(i18n.locales);
                    const masdifSupportedLanguages: string[] = langs.map(lang => {
                        return lang.lang;
                    });
                    masdifSupportedLanguages.forEach(l => {
                        if (!isValidLanguageCode(l)) {
                            throw new Error('Invalid language code!');
                        }
                    });

                    const commonlySupportedLanguages: string[] = webchatSupportedLocales.filter(l =>
                        masdifSupportedLanguages.includes(l),
                    );

                    console.debug('Supported widget languages:', webchatSupportedLocales);
                    console.debug('Supported chatbot languages:', masdifSupportedLanguages);
                    console.debug('Supported languages (intersection):', commonlySupportedLanguages);
                    commonlySupportedLanguages.length === 0 &&
                        console.warn('Backend does not support any locally supported locale!');

                    setI18n({
                        ...i18n,
                        supportedLocales: langs.filter(l => commonlySupportedLanguages.includes(l.lang)),
                    });
                }
            });
        }
    }, [convoState.conversationId, masdifClient, masdifStatus]);

    useEffect(() => {
        if (!isValidLanguageCode(i18n.currentLanguageCode)) {
            throw new Error('Invalid language code!');
        }
        intl.init({
            locales: defaultI18n.locales,
            currentLocale: i18n.currentLanguageCode,
        });
        setSettings({ language: i18n.currentLanguageCode });
    }, [i18n.currentLanguageCode]);

    return <I18nContext.Provider value={[i18n, setI18n]}>{props.children}</I18nContext.Provider>;
}

export function useI18n(): [I18n, Dispatch<Partial<I18n>>] {
    const [ctx, setCtx] = useContext(I18nContext);

    const mergeAndSetValue = (newI18n: Partial<I18n>) => {
        setCtx({ ...ctx, ...newI18n });
    };

    return [ctx, mergeAndSetValue];
}
