import React from "react";
import { EventOption } from "../../types/public-types";
import { BarTask } from "../../types/bar-task";
import { Arrow } from "../other/arrow";
import {
  GanttEvent,
} from "../../types/gantt-task-actions";

export type TaskGanttContentProps = {
  tasks: BarTask[];
  dates: Date[];
  ganttEvent: GanttEvent;
  selectedTask: BarTask | undefined;
  rowHeight: number;
  columnWidth: number;
  timeStep: number;
  svg?: React.RefObject<SVGSVGElement>;
  svgWidth: number;
  taskHeight: number;
  arrowColor: string;
  arrowIndent: number;
  fontSize: string;
  fontFamily: string;
  setGanttEvent: (value: GanttEvent) => void;
  setFailedTask: (value: BarTask | null) => void;
  setSelectedTask: (taskId: string) => void;
} & EventOption;

export const TaskGanttContent: React.FC<TaskGanttContentProps> = ({
  tasks,
  rowHeight,
  taskHeight,
  arrowColor,
  arrowIndent,
}) => {
  return (
    <g className="content">
      <g className="arrows" fill={arrowColor} stroke={arrowColor}>
        {tasks.map(task => {
          return task.barChildren.map(child => {
            return (
              <Arrow
                key={`Arrow from ${task.id} to ${tasks[child].id}`}
                taskFrom={task}
                taskTo={tasks[child]}
                rowHeight={rowHeight}
                taskHeight={taskHeight}
                arrowIndent={arrowIndent}
              />
            );
          });
        })}
      </g>
    </g>
  );
};
