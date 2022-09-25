export declare const typeHandlers: {
    bmp: import("./types/interface").IImage;
    cur: import("./types/interface").IImage;
    dds: import("./types/interface").IImage;
    gif: import("./types/interface").IImage;
    icns: import("./types/interface").IImage;
    ico: import("./types/interface").IImage;
    j2c: import("./types/interface").IImage;
    jp2: import("./types/interface").IImage;
    jpg: import("./types/interface").IImage;
    ktx: import("./types/interface").IImage;
    png: import("./types/interface").IImage;
    pnm: import("./types/interface").IImage;
    psd: import("./types/interface").IImage;
    svg: import("./types/interface").IImage;
    tiff: import("./types/interface").IImage;
    webp: import("./types/interface").IImage;
};
export declare type imageType = keyof typeof typeHandlers;