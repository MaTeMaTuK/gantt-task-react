import { BarTask } from "../types/bar-task";
import { Task } from "../types/public-types";

export function isKeyboardEvent(
  event: React.MouseEvent | React.KeyboardEvent
): event is React.KeyboardEvent {
  return (event as React.KeyboardEvent).key !== undefined;
}

export function isBarTask(task: Task | BarTask): task is BarTask {
  return (task as BarTask).x1 !== undefined;
}
