import { Task } from "../types/public-types";
import { BarTask } from "../types/bar-task";
import { BarMoveAction } from "../types/gantt-task-actions";
export declare const convertToBarTasks: (tasks: Task[], dates: Date[], columnWidth: number, rowHeight: number, taskHeight: number, barCornerRadius: number, handleWidth: number, rtl: boolean, barProgressColor: string, barProgressSelectedColor: string, barBackgroundColor: string, barBackgroundSelectedColor: string, projectProgressColor: string, projectProgressSelectedColor: string, projectBackgroundColor: string, projectBackgroundSelectedColor: string, milestoneBackgroundColor: string, milestoneBackgroundSelectedColor: string) => BarTask[];
export declare const progressWithByParams: (taskX1: number, taskX2: number, progress: number, rtl: boolean) => number[];
export declare const progressByProgressWidth: (progressWidth: number, barTask: BarTask) => number;
export declare const getProgressPoint: (progressX: number, taskY: number, taskHeight: number) => string;
/**
 * Method handles event in real time(mousemove) and on finish(mouseup)
 */
export declare const handleTaskBySVGMouseEvent: (svgX: number, action: BarMoveAction, selectedTask: BarTask, xStep: number, timeStep: number, initEventX1Delta: number, rtl: boolean) => {
    isChanged: boolean;
    changedTask: BarTask;
};
