import React from "react";
import { Task, EventOption } from "../../types/public-types";
export declare type GridBodyProps = {
    tasks: Task[];
    dates: Date[];
    svgWidth: number;
    rowHeight: number;
    columnWidth: number;
    todayColor: string;
    viewMode?: string;
    scrollX: number;
    offsetLeft: number;
    taskListHeight?: number;
} & EventOption;
export declare const GridBody: React.FC<GridBodyProps>;
