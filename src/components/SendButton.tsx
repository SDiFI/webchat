import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  background: none;
  border: 0;
`;

export type SendButtonProps = {
    ready: boolean,
    onClick: () => void,
};

export default function SendButton(props: SendButtonProps) {
    return (
        <Button onClick={props.onClick} disabled={!props.ready}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                enableBackground="new 0 0 535.5 535.5"
                version="1.1"
                viewBox="0 0 535.5 535.5"
                xmlSpace="preserve"
            >
                <path
                    style={{ fill: props.ready ? "#135afe" : "unset" }}
                    d="M0 497.25L535.5 267.75 0 38.25 0 216.75 382.5 267.75 0 318.75z"
                />
            </svg>
        </Button>
    );
}
