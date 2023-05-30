import React from 'react';
import styled from 'styled-components';
import loadingAnimation from '../images/loading-gif.gif';

const LoadingImg = styled.img`
    width: 30px;
    height: 30px;
`;

export type LoadingProps = {};

export default function Loading(_: LoadingProps) {
    return <LoadingImg src={loadingAnimation} alt='loading animation' />;
}
