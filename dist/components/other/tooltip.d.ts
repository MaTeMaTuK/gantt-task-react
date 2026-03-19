import React from "react";
import { Task } from "../../types/public-types";
import { BarTask } from "../../types/bar-task";
export declare type TooltipProps = {
    task: BarTask;
    arrowIndent: number;
    rtl: boolean;
    svgContainerHeight: number;
    svgContainerWidth: number;
    svgWidth: number;
    headerHeight: number;
    taskListWidth: number;
    scrollX: number;
    scrollY: number;
    rowHeight: number;
    fontSize: string;
    fontFamily: string;
    TooltipContent: React.FC<{
        task: Task;
        fontSize: string;
        fontFamily: string;
    }>;
};
export declare const Tooltip: React.FC<TooltipProps>;
export declare const StandardTooltipContent: React.FC<{
    task: Task;
    fontSize: string;
    fontFamily: string;
}>;
