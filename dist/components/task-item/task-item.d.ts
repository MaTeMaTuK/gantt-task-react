import React from "react";
import { BarTask } from "../../types/bar-task";
import { GanttContentMoveAction } from "../../types/gantt-task-actions";
export declare type TaskItemProps = {
    task: BarTask;
    arrowIndent: number;
    taskHeight: number;
    isProgressChangeable: boolean;
    isDateChangeable: boolean;
    isDelete: boolean;
    isSelected: boolean;
    rtl: boolean;
    onEventStart: (action: GanttContentMoveAction, selectedTask: BarTask, event?: React.MouseEvent | React.KeyboardEvent) => any;
};
export declare const TaskItem: React.FC<TaskItemProps>;
