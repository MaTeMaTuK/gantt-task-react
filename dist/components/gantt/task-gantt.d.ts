import React, { SyntheticEvent } from "react";
import { GridProps } from "../grid/grid";
import { CalendarProps } from "../calendar/calendar";
import { TaskGanttContentProps } from "./task-gantt-content";
export declare type TaskGanttProps = {
    gridProps: GridProps;
    calendarProps: CalendarProps;
    barProps: TaskGanttContentProps;
    ganttHeight: number;
    scrollX: number;
    onScroll: (event: SyntheticEvent<HTMLDivElement>) => void;
    taskListHieght?: number;
    listBottomHeight?: number;
    taskListHeight?: number;
    headerHeight: number;
};
export declare const TaskGantt: React.MemoExoticComponent<React.ForwardRefExoticComponent<TaskGanttProps & React.RefAttributes<any>>>;
