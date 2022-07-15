import React from "react";
import { Task, ConnectionProps } from "../../types/public-types";
export declare type TooltipProps = ConnectionProps & {
    tasks: Task[];
    taskListWidth: number;
    currentConnection?: any;
    boundTop: number;
    svgContainerHeight: number;
};
export declare const DeleteTooltip: React.FC<TooltipProps>;
