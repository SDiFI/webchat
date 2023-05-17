import React from 'react';
import styled from 'styled-components';
import { Settings as SettingsValue, useSettings } from '../context/SettingsContext';
import intl from 'react-intl-universal';
import AltContainer from './AltContainer';
import { useI18n } from '../context/I18nContext';


const InputGroup = styled.div`
    display: inline-block;
    input[type='checkbox'] {
        opacity: 0;
    }

    input[type='checkbox'] + label {
        position: relative;
        padding-left: 25px;
        cursor: pointer;
        &:before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 17px;
            height: 17px;
            border: 1px solid #aaa;
            background: #f8f8f8;
            border-radius: 3px;
        }
        &:after {
            content: '✔';
            position: absolute;
            top: -1px;
            left: 2px;
            font-size: 16px;
            color: #09ad7e;
            transition: all 0.2s;
        }
    }
    input[type='checkbox']:not(:checked) + label {
        &:after {
            opacity: 0;
            transform: scale(0);
        }
    }
    input[type='checkbox']:disabled:not(:checked) + label {
        &:before {
            box-shadow: none;
            border-color: #bbb;
            background-color: #ddd;
        }
    }
    input[type='checkbox']:checked + label {
        &:after {
            opacity: 1;
            transform: scale(1);
        }
    }
    input[type='checkbox']:disabled:checked + label {
        &:after {
            color: #999;
        }
    }
    input[type='checkbox']:disabled + label {
        color: #aaa;
    }
    input[type='checkbox']:checked:focus + label,
    input[type='checkbox']:not(:checked):focus + label {
        &:before {
            border: 1px dotted blue;
        }
    }
`;

const getSettingsDescription = (setting: keyof SettingsValue) => {
    // TODO(Smári, STIFI-29): Switch to t-strings once we need translations.
    const settingsDescription: {[Property in keyof SettingsValue]: string} = {
        disableTTS: intl.get("SETTINGS_DESCRIPTION_DISABLE_TTS"),
        language: intl.get("SETTINGS_DESCRIPTION_LANGUAGE"),
    };
    return settingsDescription[setting];
};

export type SettingsProps = {};

export default function Settings(_: SettingsProps) {
    const [settings, setSettings] = useSettings();
    const [i18n, setI18n] = useI18n();
    return (
        <AltContainer>
            <InputGroup>
                {Object.keys(settings).map(value => {
                    const key = value as keyof SettingsValue;
                    switch (typeof settings[key]) {
                        case 'boolean':
                            return (
                                <React.Fragment key={`${key}-group`}>
                                    <input
                                        key={`${key}-input`}
                                        name={key}
                                        type='checkbox'
                                        checked={settings[key] as boolean}
                                        onChange={() => setSettings({ [key]: !settings[key] })}
                                    />
                                    <label
                                        key={`${key}-label`}
                                        htmlFor={key}
                                        onClick={() => setSettings({ [key]: !settings[key] })}
                                    >
                                        {getSettingsDescription(key)}
                                    </label>
                                </React.Fragment>
                            );
                        case 'string':
                            if (key === "language" && i18n.supportedLocales.length > 1) {
                                return (
                                    <React.Fragment key={`${key}-group`}>
                                        {i18n.supportedLocales.map((langData) => {
                                            return (
                                                <React.Fragment key={`${langData.lang}-sub-group`}>
                                                    <input
                                                        key={`${langData.lang}-input`}
                                                        name={langData.lang}
                                                        type='radio'
                                                        value={langData.lang}
                                                        checked={langData.lang === settings.language}
                                                        onChange={(e) => setI18n({['currentLanguageCode']: e.target.value})}
                                                        title={langData.explanation}
                                                    />
                                                    <label
                                                        key={`${langData.lang}-label`}
                                                        htmlFor={langData.lang}
                                                    >
                                                        {langData.lang}
                                                    </label>
                                                </React.Fragment>
                                            );
                                        })}
                                    </React.Fragment>
                                );
                            }
                            return null;
                        default:
                            console.warn("don't know what to do with this one");
                            return null;
                    }
                })}
            </InputGroup>
        </AltContainer>
    );
}
