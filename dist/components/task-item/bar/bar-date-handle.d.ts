import React from "react";
declare type BarDateHandleProps = {
    x: number;
    y: number;
    width: number;
    height: number;
    type: string;
    onMouseDown: (event: React.MouseEvent<SVGRectElement, MouseEvent>) => void;
};
export declare const BarDateHandle: React.FC<BarDateHandleProps>;
export {};
