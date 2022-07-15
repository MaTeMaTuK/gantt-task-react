import React from "react";
declare type BarProgressHandleProps = {
    progressPoint: string;
    onMouseDown: (event: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void;
};
export declare const BarProgressHandle: React.FC<BarProgressHandleProps>;
export {};
