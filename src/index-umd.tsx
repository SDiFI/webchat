/* import 'react-app-polyfill/ie11'; */
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import ConnectedChat, { ConnectedChatProps } from './views/ConnectedChat';

export const init = (rootId: string, props: ConnectedChatProps) => {
    const root = createRoot(document.getElementById(rootId)!);
    root.render(<ConnectedChat {...props} />);
};
