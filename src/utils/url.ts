import { VIDEO_ATTACHMENT_HEIGHT, VIDEO_ATTACHMENT_WIDTH } from '../constants';

export const setUrlHWQueryParams = (urlStr: string) => {
    const urlObj: URL = new URL(urlStr);
    urlObj.searchParams.set('height', VIDEO_ATTACHMENT_HEIGHT);
    urlObj.searchParams.set('width', VIDEO_ATTACHMENT_WIDTH);
    return urlObj.toString();
};
