import React from "react";
import { Task } from "../../types/public-types";
export declare type GridBodyProps = {
    tasks: Task[];
    dates: Date[];
    svgWidth: number;
    rowHeight: number;
    columnWidth: number;
    todayColor: string;
    rtl: boolean;
};
export declare const GridBody: React.FC<GridBodyProps>;
