# SDiFI Webchat

This is the webchat widget for SDiFI. It requires a working instance of a
[Masdif](https://github.com/sdifi/masdif/) server.

In development.

## Development workflow

1. Have a running [Masdif](https://github.com/sdifi/masdif/) server.
2. `yarn install`
3. `yarn start &`
4. `cd example && yarn install && yarn start`
5. Go look at http://localhost:1234 hot reload while editing the code

## Things todo

- [x] Send and receive text messages
- [x] Style components
- [x] Receive images
- [x] Receive buttons
- [x] Send button/quick_replies actions back
- [x] Play audio replies
- [ ] Speech input
- [ ] User settings
- [ ] Keep track of read/unread status of responses
- [ ] Tooltip for responses when closed
- [ ] Disable when Masdif is unhealthy
- [ ] Tests
- [ ] Make themeable (see styled-components ThemeProvider)

