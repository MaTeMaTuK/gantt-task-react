import React from "react";
import { CalendarColor, Task } from "../../types/public-types";
export declare type GridBodyProps = {
    tasks: Task[];
    dates: Date[];
    svgWidth: number;
    rowHeight: number;
    columnWidth: number;
    todayColor: string;
    customDates?: CalendarColor[];
    rtl: boolean;
};
export declare const GridBody: React.FC<GridBodyProps>;
