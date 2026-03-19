import React from "react";
declare type BarDisplayProps = {
    x: number;
    y: number;
    width: number;
    height: number;
    isSelected: boolean;
    progressX: number;
    progressWidth: number;
    barCornerRadius: number;
    styles: {
        backgroundColor: string;
        backgroundSelectedColor: string;
        progressColor: string;
        progressSelectedColor: string;
    };
    onMouseDown: (event: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void;
};
export declare const BarDisplay: React.FC<BarDisplayProps>;
export {};
