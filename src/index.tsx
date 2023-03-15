import React, { FC, HTMLAttributes } from 'react';
import ConnectedChat, { ConnectedChatProps } from './views/ConnectedChat';

export interface Props extends HTMLAttributes<HTMLDivElement> {
}

// Please do not use types off of a default export module or else Storybook Docs will suffer.
// see: https://github.com/storybookjs/storybook/issues/9556
/**
 * A custom Thing component. Neat!
 */
export const Thing: FC<Props> = ({ children }) => {
  return <div>{children || `the snozzberries taste like snozzberries`}</div>;
};

export {
  ConnectedChat,
  ConnectedChatProps,
};
