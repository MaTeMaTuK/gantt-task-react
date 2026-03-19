/// <reference types="react" />
import { BarTask } from "../types/bar-task";
import { Task } from "../types/public-types";
export declare function isKeyboardEvent(event: React.MouseEvent | React.KeyboardEvent | React.FocusEvent): event is React.KeyboardEvent;
export declare function isMouseEvent(event: React.MouseEvent | React.KeyboardEvent | React.FocusEvent): event is React.MouseEvent;
export declare function isBarTask(task: Task | BarTask): task is BarTask;
export declare function removeHiddenTasks(tasks: Task[]): Task[];
export declare const sortTasks: (taskA: Task, taskB: Task) => 0 | 1 | -1;
