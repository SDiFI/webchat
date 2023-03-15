import React from 'react';
import styled, { keyframes } from 'styled-components';
import openLauncherImage from '../images/launcher.svg';
import closeLauncherImage from '../images/clear-button.svg';

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
  animation-duration: .5s;
  animation-name: ${slideInAnimation};
  animation-fill-mode: forwards;

  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #135afe;
  border: 0;
  border-radius: 50%;
  box-shadow: 0 2px 10px 1px #b5b5b5;
  height: 60px;
  margin: 0;
  width: 60px;
  box-sizing: border-box;
`;


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
    open: boolean,
};

const LauncherImg = styled.img<LauncherImgProps>`
  width: 50%;

  animation-duration: .5s;
  animation-name: ${props => props.open ? rotationLrAnimation : rotationRlAnimation };
  animation-fill-mode: forwards;
`;


type LauncherProps = {
    visible: boolean,
    onClick: () => void,
};

export default function Launcher({ visible, onClick }: LauncherProps) {
    return (
        <LauncherButton onClick={onClick}>
            {visible ?
             <LauncherImg open={visible} src={closeLauncherImage} />
            : <LauncherImg open={visible} src={openLauncherImage} />}
        </LauncherButton>
    )
}
