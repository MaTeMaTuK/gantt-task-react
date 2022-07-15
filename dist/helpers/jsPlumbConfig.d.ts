export declare const canChangeLayout = true;
export declare const commonConfig: {
    /**
     * 如果你将isSource和isTarget设置成true，那么久可以用户在拖动时，自动创建链接。
     */
    isSource: boolean;
    isTarget: boolean;
    maxConnections: number;
    endpoint: (string | {
        radius: number;
        cssClass: string;
    })[];
    endpointStyle: {};
    connector: (string | {
        alwaysRespectStubs: boolean;
        cornerRadius: number;
        stub: number;
    })[];
    connectorStyle: {
        stroke: string;
        strokeWidth: number;
        strokeOpacity: number;
    };
    connectorHoverStyle: {
        strokeWidth: number;
        stroke: string;
        outlineWidth: number;
        outlineStroke: string;
    };
    connectorOverlays: (string | {
        width: number;
        length: number;
        location: number;
    })[][];
};
export declare const offsetCalculators: {
    CIRCLE: (el: any) => {
        left: number;
        top: number;
    };
    ELLIPSE: (el: any) => {
        left: number;
        top: number;
    };
    RECT: (el: any) => {
        left: number;
        top: number;
    };
};
export declare const sizeCalculators: {
    CIRCLE: (el: any) => number[];
    ELLIPSE: (el: any) => number[];
    RECT: (el: any) => number[];
};
export declare const relationInit: {
    FS: string[];
    FF: string[];
    SS: string[];
    SF: string[];
};
export declare const relationReverse: (start: string, end: string) => "FS" | "FF" | "SS" | "SF";
export declare const deleteIcon = "<svg t=\"1633768438353\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"4762\" width=\"20\" height=\"20\"><path d=\"M522.24 512m-440.32 0a440.32 440.32 0 1 0 880.64 0 440.32 440.32 0 1 0-880.64 0Z\" fill=\"#666666\" p-id=\"4763\"></path><path d=\"M667.136 687.616c-7.68 0-15.872-3.072-21.504-9.216L355.84 389.12c-11.776-11.776-11.776-31.232 0-43.52 11.776-11.776 31.232-11.776 43.52 0l289.792 289.792c11.776 11.776 11.776 31.232 0 43.52-6.144 5.632-14.336 8.704-22.016 8.704z\" fill=\"#FFFFFF\" p-id=\"4764\"></path><path d=\"M377.344 687.616c-7.68 0-15.872-3.072-21.504-9.216-11.776-11.776-11.776-31.232 0-43.52L645.12 345.6c11.776-11.776 31.232-11.776 43.52 0 11.776 11.776 11.776 31.232 0 43.52L399.36 678.4c-6.144 6.144-13.824 9.216-22.016 9.216z\" fill=\"#FFFFFF\" p-id=\"4765\"></path></svg>";
