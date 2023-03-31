import 'react-app-polyfill/ie11';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import ConnectedChat from '../.';

const App = () => {
    return (
        <div>
            <ConnectedChat
                serverAddress="http://localhost:8080"
                title="Jóakim"
                info={{
                    paragraphs: ['<b>First <button>a</button> paragraph</b>', 'Second', 'and <i>third</i>!'],
                    buttons: [
                        {text: 'External URL button', action: 'https://google.com'},
                        {text: 'Do something button', action: () => alert('HI!')},
                    ],
                    footer: 'Custom <i>foo</i><b>ter</b>',
                }}
            />
        </div>
    );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />, );
