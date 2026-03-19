import React, { SyntheticEvent } from "react";
export declare const VerticalScroll: React.FC<{
    scroll: number;
    ganttHeight: number;
    ganttFullHeight: number;
    headerHeight: number;
    rtl: boolean;
    onScroll: (event: SyntheticEvent<HTMLDivElement>) => void;
}>;
