import React from "react";
import { Task, Assignee } from "../../types/public-types";
import { BarTask } from "../../types/bar-task";
export declare type TooltipProps = {
    task: BarTask;
    arrowIndent: number;
    svgContainerHeight: number;
    svgContainerWidth: number;
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
        userAvatar?: JSX.Element;
    }>;
    renderUserAvatar?: (assignee: Assignee[]) => JSX.Element;
};
export declare const Tooltip: React.FC<TooltipProps>;
export declare const StandardTooltipContent: React.FC<{
    task: Task;
    fontSize: string;
    fontFamily: string;
    userAvatar?: JSX.Element;
}>;
