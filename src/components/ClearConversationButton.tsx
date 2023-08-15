import React from 'react';
import styled from 'styled-components';
import { useMasdifClient, useMasdifStatus } from '../context/MasdifClientContext';
import { useConversationContext } from '../context/ConversationContext';

const Button = styled.button<{ $shake?: boolean; $disabled?: boolean }>`
    border: none;
    background: unset;
    opacity: ${props => (!props.$disabled ? '1' : '0.25')};

    &:hover {
        cursor: ${props => (!props.$disabled ? 'pointer' : 'wait')};

        svg {
            filter: ${props => (!props.$disabled ? 'drop-shadow(0px 0px 2px rgb(0 0 0 / 0.8))' : '')};
        }
    }

    &:disabled {
        cursor: auto;
    }

    svg {
        @keyframes shake {
            0% {
                transform: rotate(0deg);
            }
            25% {
                transform: rotate(5deg);
            }
            50% {
                transform: rotate(0eg);
            }
            75% {
                transform: rotate(-5deg);
            }
            100% {
                transform: rotate(0deg);
            }
        }

        animation: ${props => (props.$shake && !props.$disabled ? 'shake 0.25s' : '')};
    }
`;

export default function ClearConversationButton() {
    const [shake, setShake] = React.useState(false);
    const masdifClient = useMasdifClient();
    const masdifStatus = useMasdifStatus();
    const [, convoDispatch] = useConversationContext();

    const clearConversation = async () => {
        if (masdifClient && masdifStatus) {
            // Clear messages and message feedback info.
            convoDispatch({ type: 'CLEAR_CONVERSATION' });

            // Current conversationId is overwritten.
            const conversationId = await masdifClient.createConversation();
            convoDispatch({ type: 'SET_CONVERSATION_ID', conversationId });

            // New conversation is started with MOTD.
            const info = await masdifClient.info(conversationId);
            info.motd.reduce(
                (p, text) =>
                    p.then(
                        () =>
                            new Promise<void>(resolve => {
                                convoDispatch({ type: 'DELAY_MOTD_RESPONSE' });
                                window.setTimeout(() => {
                                    convoDispatch({ type: 'ADD_RESPONSE', text });
                                    resolve();
                                }, 1000);
                            }),
                    ),
                Promise.resolve(),
            );
            console.log('Conversation deleted.');
        }
    };

    return (
        <Button
            onClick={() => {
                clearConversation();
                setShake(true);
            }}
            $shake={shake}
            $disabled={!masdifStatus}
        >
            <svg
                version='1.0'
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='300 300 750 750'
                onAnimationEnd={() => setShake(false)}
            >
                <g transform='translate(0.000000,1280.000000) scale(0.100000,-0.100000)' style={{ fill: '#FFFFFF' }}>
                    <path
                        strokeWidth='2%'
                        d='M5675 9896 c-26 -11 -37 -32 -105 -202 l-76 -189 -987 -5 c-970 -5 -987 -5 -1006 -25 -18 -19 -46 -212 -137 -945 -5 -36 -2 -50 16 -73 l21 -27 3136 2 3136 3 20 27 20 27 -63 483 c-53 407 -65 486 -82 503 -18 20 -35 20 -1005 25 l-987 5 -53 130 c-106 261 -102 253 -135 264 -48 17 -1673 14 -1713 -3z'
                    />
                    <path
                        strokeWidth='2%'
                        d='M3779 8209 c-25 -25 -26 11 11 -609 11 -184 31 -528 45 -765 26 -456 158 -2721 200 -3435 l25 -425 25 -22 26 -23 2424 0 2424 0 25 23 c24 20 26 31 36 162 9 127 49 689 115 1650 24 344 49 701 115 1635 38 544 109 1566 117 1691 5 89 4 98 -16 118 l-21 21 -649 0 -650 0 -20 -26 -21 -27 0 -2199 0 -2199 -147 3 -148 3 -3 2204 c-2 2034 -3 2206 -19 2223 -15 17 -44 18 -483 18 -462 0 -467 0 -486 -21 -19 -21 -19 -74 -22 -2225 l-2 -2204 -145 0 -145 0 -2 1948 c-2 1071 -3 2062 -3 2203 0 239 -1 258 -19 278 -19 21 -23 21 -516 21 -492 0 -497 0 -516 -21 -19 -21 -19 -74 -22 -2225 l-2 -2204 -145 0 -145 0 -2 2204 c-3 2151 -3 2204 -22 2225 -19 21 -22 21 -608 21 l-588 0 -21 -21z'
                    />
                </g>
            </svg>
        </Button>
    );
}
