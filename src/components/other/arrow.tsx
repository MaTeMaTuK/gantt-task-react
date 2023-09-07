import React from "react";
import { BarTask } from "../../types/bar-task";

type ArrowProps = {
  taskFrom: BarTask;
  taskTo: BarTask;
  rowHeight: number;
  taskHeight: number;
  arrowIndent: number;
  rtl: boolean;
};
export const Arrow: React.FC<ArrowProps> = ({
  taskFrom,
  taskTo,
  rowHeight,
  taskHeight,
  arrowIndent,
  rtl
}) => {
  let path: string;
  if (rtl) {
    [path] = drownPathAndTriangleRTL(
      taskFrom,
      taskTo,
      rowHeight,
      taskHeight,
      arrowIndent,
    );
  } else {
    [path] = drownPathAndTriangle(
      taskFrom,
      taskTo,
      rowHeight,
      taskHeight,
      arrowIndent
    );
  }

  const radius: number = 8;

  return (
    <g className="arrow">
      <path strokeWidth="1.5" d={path} fill="none" />
      <circle
        cx={taskFrom.x1 - arrowIndent / 2 - radius / 2}
        cy={taskFrom.y + taskHeight / 2}
        r="8"
        stroke="black"
        strokeWidth="0"
        fill="black"
      />
      <circle
        cx={taskTo.x1 - arrowIndent / 2 - radius / 2}
        cy={taskTo.y + taskHeight / 2}
        r={radius}
        stroke="black"
        strokeWidth="0"
        fill="black"
      />
      <text
        x={taskFrom.x1 - arrowIndent / 2 - radius / 2}
        y={taskFrom.y + taskHeight / 2}
        fontSize="12px"
        textAnchor="middle"
        dy=".3em"
        fill="white"
        strokeWidth="0.4px"
        stroke="white"
      >
        {taskFrom?.dependenciesNumber || 0}
      </text>
      <text
        x={taskTo.x1 - arrowIndent / 2 - radius / 2}
        y={taskTo.y + taskHeight / 2}
        fontSize="12px"
        textAnchor="middle"
        dy=".3em"
        fill="white"
        strokeWidth="0.4px"
        stroke="white"
      >
        {taskTo?.dependenciesNumber || 0}
      </text>
    </g>
  );
};

const drownPathAndTriangle = (
  taskFrom: BarTask,
  taskTo: BarTask,
  rowHeight: number,
  taskHeight: number,
  arrowIndent: number,
) => {
  const indexCompare = taskFrom.index > taskTo.index ? -1 : 1;
  const taskToEndPosition = taskTo.y + taskHeight / 2;
  const taskFromEndPosition = taskFrom.x1 + arrowIndent * 2;
  const taskFromHorizontalOffsetValue =
    taskFromEndPosition < taskTo.x1
      ? "0"
      : taskFrom.x1 - taskTo.x1 < arrowIndent
      ? `H ${taskTo.x1 + taskFrom.x1 - taskTo.x1 - arrowIndent * 2}`
      : `H ${taskTo.x1 - arrowIndent * 2}`;
  const taskToHorizontalOffsetValue =
    taskFromEndPosition > taskTo.x1
      ? taskTo.x1 - taskFrom.x1 < arrowIndent && taskTo.x1 - taskFrom.x1 > 0
        ? arrowIndent + taskTo.x1 - taskFrom.x1
        : arrowIndent
      : taskTo.x1 - taskFrom.x1 + arrowIndent;

  const path = `M ${taskFrom.x1 - arrowIndent} ${taskFrom.y + taskHeight / 2} 
  h ${-arrowIndent} 
  v ${taskFromEndPosition > taskTo.x1 ? "0" : (indexCompare * rowHeight) / 2} 
  ${taskFromHorizontalOffsetValue}
  V ${taskToEndPosition} 
  h ${taskToHorizontalOffsetValue}`;

  const trianglePoints = `${taskTo.x1},${taskToEndPosition} 
  ${taskTo.x1 - 5},${taskToEndPosition - 5} 
  ${taskTo.x1 - 5},${taskToEndPosition + 5}`;

  return [path, trianglePoints];
};

const drownPathAndTriangleRTL = (
  taskFrom: BarTask,
  taskTo: BarTask,
  rowHeight: number,
  taskHeight: number,
  arrowIndent: number
) => {
  const indexCompare = taskFrom.index > taskTo.index ? -1 : 1;
  const taskToEndPosition = taskTo.y + taskHeight / 2;
  const taskFromEndPosition = taskFrom.x1 - arrowIndent * 2;
  const taskFromHorizontalOffsetValue =
    taskFromEndPosition > taskTo.x2 ? "" : `H ${taskTo.x2 + arrowIndent}`;
  const taskToHorizontalOffsetValue =
    taskFromEndPosition < taskTo.x2
      ? -arrowIndent
      : taskTo.x2 - taskFrom.x1 + arrowIndent;

  const path = `M ${taskFrom.x1} ${taskFrom.y + taskHeight / 2} 
  h ${-arrowIndent} 
  v ${(indexCompare * rowHeight) / 2} 
  ${taskFromHorizontalOffsetValue}
  V ${taskToEndPosition} 
  h ${taskToHorizontalOffsetValue}`;

  const trianglePoints = `${taskTo.x2},${taskToEndPosition} 
  ${taskTo.x2 + 5},${taskToEndPosition + 5} 
  ${taskTo.x2 + 5},${taskToEndPosition - 5}`;
  return [path, trianglePoints];
};
