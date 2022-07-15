import React from "react";
import { BarTask } from "../../../types/bar-task";
declare type BarDisplayProps = {
    x: number;
    y: number;
    task: BarTask;
    width: number;
    height: number;
    isSelected: boolean;
    progressWidth: number;
    barCornerRadius: number;
    styles: {
        backgroundColor: string;
        backgroundSelectedColor: string;
        progressColor: string;
        progressSelectedColor: string;
        opacity?: number;
    };
    onMouseDown: (event: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void;
    id: string;
    isLog?: boolean | undefined;
};
export declare const BarDisplay: React.FC<BarDisplayProps>;
export {};
