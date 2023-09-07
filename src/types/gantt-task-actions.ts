import { BarTask } from "./bar-task";
import { rulerTask } from "./ruler";

export type BarMoveAction = "progress" | "end" | "start" | "move";
export type GanttContentMoveAction =
  | "mouseenter"
  | "mouseleave"
  | "delete"
  | "dblclick"
  | "click"
  | "select"
  | ""
  | BarMoveAction;

export type GanttEvent = {
  changedTask?: BarTask;
  originalSelectedTask?: BarTask;
  action: GanttContentMoveAction;
};
export type GanttRulerEvent = {
  changedTask?: rulerTask;
  originalSelectedTask?: rulerTask;
  action: GanttContentMoveAction;
};
