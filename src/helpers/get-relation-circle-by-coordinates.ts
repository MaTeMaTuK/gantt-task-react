import { BarTask } from "../types/bar-task";
import { RelationMoveTarget } from "../types/gantt-task-actions";

export const getRelationCircleByCoordinates = (
  svgP: DOMPoint,
  tasks: BarTask[],
  taskHalfHeight: number,
  relationCircleOffset: number,
  relationCircleRadius: number,
): [BarTask, RelationMoveTarget] | null => {
  const {
    x,
    y,
  } = svgP;

  for (let i = 0, l = tasks.length; i < l; ++i) {
    const task = tasks[i];

    if (
      y >= task.y + taskHalfHeight - relationCircleRadius
      && y <= task.y + taskHalfHeight + relationCircleRadius
    ) {
      if (
        x >= task.x1 - relationCircleOffset - relationCircleRadius
        && y <= task.x1 - relationCircleOffset + relationCircleRadius
      ) {
        return [task, "startOfTask"];
      }

      if (
        x >= task.x2 + relationCircleOffset - relationCircleRadius
        && y <= task.x2 + relationCircleOffset + relationCircleRadius
      ) {
        return [task, "startOfTask"];
      }
    }
  }

  return null;
};
