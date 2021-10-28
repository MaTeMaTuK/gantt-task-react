import { Task, TaskType } from "./public-types";

export interface BarTask extends Task {
  index: number;
  typeInternal: TaskTypeInternal;
  x1: number;
  x2: number;
  y: number;
  height: number;
  barCornerRadius: number;
  handleWidth: number;
  barChildren: number[];
  isTimeErrorItem?: boolean;
  isDelayItem?: boolean;
  isCriticalPathItem?: boolean;
  styles: {
    backgroundColor: string;
    backgroundSelectedColor: string;
    progressColor: string;
    progressSelectedColor: string;
    barBackgroundColorTimeError?: string;
  };
}

export type TaskTypeInternal = TaskType | "smalltask";
