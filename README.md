# SDiFI Webchat

This is the webchat widget for the SDiFI project. It requires a working instance
of a [Masdif](https://github.com/sdifi/masdif/) server.

In development. Expect breakage.

## Usage

The Webchat widget is published both as a React component and a standalone UMD
bundle.

### React component

To use the component in your project add it as a dependency:

```
yarn add @sdifi/webchat
```

The `react` and `react-dom` packages are peer dependencies, so if you don't
already have those add them as dependencies in your project:

```
yarn add react react-dom
```

Example usage:

```typescript
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import Chat from '@sdifi/webchat';

const App = () => {
  return (
    <div>
      <Chat serverAddress="http://localhost:8080" title="Jóakim" subtitle="Aðalönd" />
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
```

### Standalone UMD bundle

```html
<!DOCTYPE html>
<html>
  <head>
  </head>
  <body>
    <div id="root"></div>
    <script src="https://cdn.jsdelivr.net/npm/@sdifi/webchat@0.3.0/dist/webchat.umd.production.min.js"></script>
    <script>
    window.onload = () => {
      Webchat.init("root", {
        serverAddress: "http://localhost:8080",
        title: "Jóakim",
        subtitle: "Aðalönd",
      });
    }
    </script>
  </body>
</html>
```

## Speech input

Currently the speech recognition input is provided by a direct client side
connection to the gRPC-Web service at `speech.tiro.is` and final results are
POSTed as text messages to the conversation. The server address is not
configurable, as the plan is to add speech recognition to
[Masdif](https://github.com/sdifi/masdif/). We use
[grpc-nice-web](https://github.com/deeplay-io/nice-grpc/tree/master/packages/nice-grpc-web#using-ts-proto)
with TypeScript code generated by
[ts-proto](https://github.com/stephenh/ts-proto). The code is generated from the
Protobuf definitions in [Tiro Speech
Core](https://github.com/tiro-is/tiro-speech-core/tree/master/proto) and rarely
change, so the generated code is committed to version control.


### What happens during speech input?

As the user presses the mic icon the browser initiates a streaming connection
with the speech recognition server in single utterance mode. As the browser
streams chunks of audio to the server it processes the incoming audio and
streams back partial recognition responses (containing `isFinal: false`) which
may or may not change as more audio gets processed. Processing is stopped, a
final full result (containing `isFinal: true`) is sent from the server and the
connection closed when an endpoint is detected. An *endpoint* is detected once
the server has recognized some speech with a good enough confidence that ends
with silence. The duration of the end-of-utterance silence depends on the
confidence of the recognized speech. As a fallback in the single utterance mode
the maximum duration of an utterance is 20 seconds.

## Development workflow

1. Have a running [Masdif](https://github.com/sdifi/masdif/) server.
2. `yarn install`
3. `yarn start &`
4. `cd example && yarn install && yarn start`
5. Go look at http://localhost:1234 hot reload while editing the code

To just build minified (and not minified) bundles do:

```
yarn build
```

This will create TypeScript typedefs, a CommonJS
(`dist/webchat.cjs.production.min.js`), ESM (`dist/webchat.esm.js`) and a
standalone UMD bundle (`dist/webchat.umd.production.min.js`).

## Publishing new versions

1. Update the `version` field in [package.json](./package.json). Try to follow semver.
2. `git add package.json && git commit -m "Update version to X.Y.Z" && git tag -a vX.Y.Z`
4. `yarn install`
5. `yarn publish --access public --new-version X.Y.Z`

## Things todo

- [x] Send and receive text messages
- [x] Style components
- [x] Receive images
- [x] Receive buttons
- [x] Send button/quick_replies actions back
- [x] Play audio replies
- [x] Speech input
- [ ] User settings
- [ ] Keep track of read/unread status of responses
- [ ] Tooltip for responses when closed
- [ ] Speech input through Masdif
- [x] Disable when Masdif is unhealthy
- [ ] Tests
- [ ] Make themeable (see styled-components ThemeProvider)

## License

See [LICENSE](./LICENSE).
