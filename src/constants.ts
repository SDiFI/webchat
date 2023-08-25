export type VideoAttachmentSrcName = 'FACEBOOK' | 'YOUTUBE' | 'VIMEO' | 'FILE';
type VideoAttachmentSrcs = { name: VideoAttachmentSrcName; knownHostnames?: string[] }[];

export const VIDEO_ATTACHMENT_WIDTH: '267px' = '267px';
export const VIDEO_ATTACHMENT_HEIGHT: '150px' = '150px';
export const VIDEO_ATTACHMENT_SUPPORTED_SRCS: VideoAttachmentSrcs = [
    { name: 'FACEBOOK', knownHostnames: ['www.facebook.com', 'www.fb.watch', 'www.fb.com'] },
    { name: 'YOUTUBE', knownHostnames: ['www.youtube.com', 'youtu.be'] },
    { name: 'VIMEO', knownHostnames: ['player.vimeo.com'] },
    { name: 'FILE' },
];
