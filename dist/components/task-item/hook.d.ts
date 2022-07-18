export declare const pointOverEvent: (barRef: any, jsPlumb: any, id: string) => void;
export declare const pointOutEvent: (barRef: React.RefObject<Element>, jsPlumb: any, id: string) => void;
export declare const barAnchor: {
    milestone: {
        Left: (string | number)[];
        Right: (string | number)[];
    };
    normal: {
        Left: (string | number)[];
        Right: (string | number)[];
    };
};
export declare const useHover: (barRef: React.RefObject<Element>, jsPlumb: any, id: string, action: string) => any;
export declare const useAddPoint: (jsPlumb: any, task: any, barRef: any, type?: string | undefined) => boolean;
