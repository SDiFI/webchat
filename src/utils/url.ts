import {
    VIDEO_ATTACHMENT_HEIGHT,
    VIDEO_ATTACHMENT_WIDTH,
    VIDEO_ATTACHMENT_SUPPORTED_SRCS,
    VideoAttachmentSrcName,
} from '../constants';

type videoSourceFunc = (urlStr: string) => VideoAttachmentSrcName;

export const setUrlHWQueryParams = (urlStr: string) => {
    const urlObj: URL = new URL(urlStr);
    urlObj.searchParams.set('height', VIDEO_ATTACHMENT_HEIGHT);
    urlObj.searchParams.set('width', VIDEO_ATTACHMENT_WIDTH);
    return urlObj.toString();
};
export const determineVideoSrc: videoSourceFunc = (urlStr: string) => {
    const urlObj: URL = new URL(urlStr);
    let videoSource: VideoAttachmentSrcName = 'FILE';
    VIDEO_ATTACHMENT_SUPPORTED_SRCS.forEach(src => {
        if (!src.knownHostnames) return;
        if (src.knownHostnames.includes(urlObj.hostname)) {
            videoSource = src.name;
            return;
        }
    });
    return videoSource;
};
