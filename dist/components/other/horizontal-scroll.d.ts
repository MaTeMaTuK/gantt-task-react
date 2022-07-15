import React, { SyntheticEvent } from "react";
export declare const HorizontalScrollComponent: React.ForwardRefRenderFunction<any, {
    svgWidth: number;
    taskListWidth: number;
    listBottomHeight: number;
    onScroll: (event: SyntheticEvent<HTMLDivElement>) => void;
}>;
export declare const HorizontalScroll: React.MemoExoticComponent<React.ForwardRefExoticComponent<{
    svgWidth: number;
    taskListWidth: number;
    listBottomHeight: number;
    onScroll: (event: SyntheticEvent<HTMLDivElement>) => void;
} & React.RefAttributes<any>>>;
