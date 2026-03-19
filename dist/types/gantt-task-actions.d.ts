import { BarTask } from "./bar-task";
export declare type BarMoveAction = "progress" | "end" | "start" | "move";
export declare type GanttContentMoveAction = "mouseenter" | "mouseleave" | "delete" | "dblclick" | "click" | "select" | "" | BarMoveAction;
export declare type GanttEvent = {
    changedTask?: BarTask;
    originalSelectedTask?: BarTask;
    action: GanttContentMoveAction;
};
