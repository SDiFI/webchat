import 'styled-components';

declare module 'styled-components' {
    export interface DefaultTheme {
        fontFamily: string,

        primaryBgColor: string,
        secondaryBgColor: string,
        secondaryFgColor: string,

        secondaryButtonBg: string,
        secondaryButtonHoverBg: string,
        secondaryButtonFg: string,

        primaryButtonBg: string,
        primaryButtonHoverBg: string,
        primaryButtonFg: string,

        userMessageBgColor: string,
        userMessageFgColor: string,

        botAvatarImageURL?: string,
        botAvatarImageSize: string,
        botMessageBgColor: string,
        botMessageFgColor: string,

        formFgColor: string,
        formBgColor: string,
        formHeight: string,

        launcherBgColor: string,
        launcherSize: string,
        launcherOpenImageURL?: string,
        launcherCloseImageURL?: string,
        launcherImageSize: string,
        launcherShadow: boolean,
    }
}
