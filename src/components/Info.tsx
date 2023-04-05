import React from 'react';
import styled from 'styled-components';
import { defaultTheme } from '../theme';
import AltContainer from './AltContainer';

const InfoFooter = styled.div`
  width: 100%;
  height: 40px;
  position: absolute;
  bottom: 0px;
  padding: 10px;
  font-weight: bold;
  background-color: ${({ theme }) => theme.secondaryBackground};
`;

InfoFooter.defaultProps = {
    theme: defaultTheme,
};


export type InfoButtonProps = {
    secondary?: boolean,
};

const InfoButton = styled.button<InfoButtonProps>`
  background-color: ${props => props.secondary ? props.theme.secondaryButtonBg : props.theme.primaryButtonBg};
  color: ${props => props.secondary ? props.theme.secondaryButtonFg : props.theme.primaryButtonFg};
  margin: 2px;
  display: block;
  padding: 6px 12px;
  text-align: center;
  border: 2px #eee;
  border-radius: 4px;
  font-family: sans-serif;
  font-size: 14px;
  width: fit-content;

  &:hover {
    background-color: ${props => props.secondary ? props.theme.secondaryButtonHoverBg : props.theme.primaryButtonHoverBg};
    cursor: pointer;
  }

  a {
    height: 100%;
    width: 100%;
  }
`;

InfoButton.defaultProps = {
    theme: defaultTheme,
};

const P = styled.p`
  margin: 0 35px;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  text-align: center;
  align-items: center;

`

export type InfoButtonAction = {
    text: string,
    // The button action can either be an external URL or a function
    action: string | (() => void),
    secondary?: boolean,
};

export type SimpleInfoProps = {
    // Paragraphs of text to display, can be HTML.
    paragraphs: string[],

    buttons?: InfoButtonAction[],

    // The footer at the bottom of the info page, can be HTML.
    footer: string,
};

export default function Info(props: SimpleInfoProps) {
    // Note that this component uses `dangerouslySetInnerHTML` to support richer text in the info page for deployments
    // using the standalone bundle.
    const buttons = props.buttons || [];
    return (
        <AltContainer>
            {props.paragraphs.map((text) => <P key={text} dangerouslySetInnerHTML={{ __html: text }} />)}
            <ButtonGroup>
                {buttons.map((btn) =>
                    <InfoButton key={btn.text} onClick={typeof btn.action !== 'string' ? btn.action : undefined}>
                        {'string' === typeof btn.action ? <a href={btn.action} target='_blank'>{btn.text}</a> : btn.text}
                    </InfoButton>
                )}
            </ButtonGroup>
            <InfoFooter dangerouslySetInnerHTML={{ __html: props.footer }} />
        </AltContainer>
    );
};
