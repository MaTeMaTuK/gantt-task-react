import React from "react";
import { BarTask } from "../../types/bar-task";
declare type ArrowProps = {
    taskFrom: BarTask;
    taskTo: BarTask;
    rowHeight: number;
    taskHeight: number;
    arrowIndent: number;
    rtl: boolean;
};
export declare const Arrow: React.FC<ArrowProps>;
export {};
