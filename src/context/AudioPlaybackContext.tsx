import React, { createContext, Dispatch, useContext, useEffect, useRef, useState } from 'react';

export type PlaybackState = {
    src?: string;
    playing: boolean;
};

export type AudioPlaybackContextValue = [PlaybackState, Dispatch<PlaybackState>];

const AudioPlaybackContext = createContext<AudioPlaybackContextValue>([{ playing: false }, () => {}]);

export type AudioPlaybackProviderProps = {
    children: React.ReactNode;
};

export function AudioPlaybackProvider({ children }: AudioPlaybackProviderProps) {
    const refContainer = useRef<HTMLAudioElement>(null);
    const [playback, setPlayback] = useState<PlaybackState>({ playing: false });

    useEffect(() => {
        const handleEnded = () =>
            setPlayback({
                playing: false,
            });
        refContainer.current?.addEventListener('ended', handleEnded);
        refContainer.current?.addEventListener('pause', handleEnded);
        return function cleanup() {
            refContainer.current?.removeEventListener('ended', handleEnded);
            refContainer.current?.removeEventListener('pause', handleEnded);
        };
    }, [playback, setPlayback, refContainer.current]);

    useEffect(() => {
        (async () => {
            if (playback.playing) {
                try {
                    await refContainer.current?.play();
                } catch (e) {
                    console.warn(`Playback failed for ${playback.src}`);
                    setPlayback({ playing: false });
                }
            } else {
                refContainer.current?.pause();
            }
        })();
    }, [playback.playing, playback.src, refContainer.current]);

    return (
        <AudioPlaybackContext.Provider value={[playback, setPlayback]}>
            <audio ref={refContainer} src={playback.src} />
            {children}
        </AudioPlaybackContext.Provider>
    );
}

export const useAudioPlayback = () => useContext(AudioPlaybackContext);
