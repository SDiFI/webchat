import 'react-app-polyfill/ie11';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import ConnectedChat from '../.';

const App = () => {
  return (
    <div>
      <ConnectedChat serverAddress="http://localhost:8080" />
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />, );
