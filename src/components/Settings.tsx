import React from 'react';
import styled from 'styled-components';
import { Settings as SettingsValue, useSettings } from '../context/SettingsContext';
import AltContainer from './AltContainer';

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

// TODO: Switch to t-strings once we need translations.
const settingsDescription: { [Property in keyof SettingsValue]: string } = {
    disableTTS: 'Sleppa talgervingu',
};

export type SettingsProps = {};

export default function Settings(_: SettingsProps) {
    const [settings, setSettings] = useSettings();
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
                                        {settingsDescription[key]}
                                    </label>
                                </React.Fragment>
                            );
                        default:
                            console.warn("don't know what to do with this one");
                            return null;
                    }
                })}
            </InputGroup>
        </AltContainer>
    );
}
