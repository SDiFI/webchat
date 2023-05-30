import React from 'react';
import styled, { keyframes, useTheme } from 'styled-components';
import openLauncherImage from '../images/launcher.svg';
import closeLauncherImage from '../images/clear-button.svg';
import { defaultTheme } from '../theme';

const slideInAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const LauncherButton = styled.button`
    animation-duration: 0.5s;
    animation-name: ${slideInAnimation};
    animation-fill-mode: forwards;

    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${({ theme }) => theme.launcherBgColor};
    border: ${({ theme }) => (theme.launcherShadow ? 0 : '1px solid #b5b5b5')};
    border-radius: 50%;
    box-shadow: ${({ theme }) => (theme.launcherShadow ? '0 2px 10px 1px #b5b5b5' : 'none')};
    height: ${({ theme }) => theme.launcherSize};
    margin: 0;
    width: ${({ theme }) => theme.launcherSize};
    box-sizing: border-box;
`;

LauncherButton.defaultProps = {
    theme: defaultTheme,
};

const rotationLrAnimation = keyframes`
  from  {
    transform: rotate(-90deg);
  }
  to {
    transform: rotate(0);
  }
`;

const rotationRlAnimation = keyframes`
  from  {
    transform: rotate(90deg);
  }
  to {
    transform: rotate(0);
  }
`;

type LauncherImgProps = {
    open: boolean;
};

const LauncherImg = styled.img<LauncherImgProps>`
    width: ${({ theme }) => theme.launcherImageSize};

    animation-duration: 0.5s;
    animation-name: ${props => (props.open ? rotationLrAnimation : rotationRlAnimation)};
    animation-fill-mode: forwards;
`;

LauncherImg.defaultProps = {
    theme: defaultTheme,
};

type LauncherProps = {
    visible: boolean;
    onClick: () => void;
};

export default function Launcher({ visible, onClick }: LauncherProps) {
    const theme = useTheme();
    const openImgSrc = theme.launcherOpenImageURL ?? openLauncherImage;
    const closeImgSrc = theme.launcherCloseImageURL ?? closeLauncherImage;
    return (
        <LauncherButton onClick={onClick}>
            {visible ? (
                <LauncherImg open={visible} src={closeImgSrc} />
            ) : (
                <LauncherImg open={visible} src={openImgSrc} />
            )}
        </LauncherButton>
    );
}
