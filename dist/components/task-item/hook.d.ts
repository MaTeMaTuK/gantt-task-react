/// <reference types="react" />
export declare const pointOverEvent: (barRef: any, jsPlumb: any, id: string) => void;
export declare const pointOutEvent: (barRef: React.RefObject<Element>, jsPlumb: any, id: string) => void;
export declare const barAnchor: {
    milestone: {
        Left: import("react").ReactText[];
        Right: import("react").ReactText[];
    };
    normal: {
        Left: import("react").ReactText[];
        Right: import("react").ReactText[];
    };
};
export declare const useHover: (barRef: React.RefObject<Element>, jsPlumb: any, id: string, action: string) => any;
export declare const useAddPoint: (jsPlumb: any, task: any, barRef: any, type?: string | undefined) => boolean;
