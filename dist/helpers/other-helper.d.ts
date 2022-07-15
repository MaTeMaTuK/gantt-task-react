/// <reference types="react" />
import { BarTask } from "../types/bar-task";
import { Task, Assignee } from "../types/public-types";
export declare function isKeyboardEvent(event: React.MouseEvent | React.KeyboardEvent | React.FocusEvent): event is React.KeyboardEvent;
export declare function isMouseEvent(event: React.MouseEvent | React.KeyboardEvent | React.FocusEvent): event is React.MouseEvent;
export declare function isBarTask(task: Task | BarTask): task is BarTask;
export declare function isLeapYear(year: number): boolean;
export declare function getQuarter(currMonth: number): number;
export declare const initAssignee: (assignee: Assignee[]) => string;
