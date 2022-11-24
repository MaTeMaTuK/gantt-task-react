import { BarTask } from "./bar-task";

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

export type RelationMoveTarget = "startOfTask" | "endOfTask";

export type GanttEvent = {
  changedTask?: BarTask;
  originalSelectedTask?: BarTask;
  action: GanttContentMoveAction;
};

export type GanttRelationEvent = {
  target: RelationMoveTarget;
  task: BarTask;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};
