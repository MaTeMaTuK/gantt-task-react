import React from "react";

import cx from "classnames";

import { BarRelationHandle } from "../bar/bar-relation-handle";
import stylesRelationHandle from "../bar/bar-relation-handle.module.css";

import { TaskItemProps } from "../task-item";
import styles from "./milestone.module.css";

export const Milestone: React.FC<TaskItemProps> = ({
  task,
  taskHalfHeight,
  relationCircleOffset,
  relationCircleRadius,
  isDateChangeable,
  isRelationChangeable,
  isRelationDrawMode,
  onEventStart,
  onRelationStart,
  isSelected,
}) => {
  const transform = `rotate(45 ${task.x1 + task.height * 0.356} 
    ${task.y + task.height * 0.85})`;
  const getBarColor = () => {
    return isSelected
      ? task.styles.backgroundSelectedColor
      : task.styles.backgroundColor;
  };

  return (
    <g
      tabIndex={0}
      className={cx(styles.milestoneWrapper, stylesRelationHandle.barRelationHandleWrapper)}
    >
      <rect
        fill={getBarColor()}
        x={task.x1}
        width={task.height}
        y={task.y}
        height={task.height}
        rx={task.barCornerRadius}
        ry={task.barCornerRadius}
        transform={transform}
        className={styles.milestoneBackground}
        onMouseDown={e => {
          isDateChangeable && onEventStart("move", task, e);
        }}
      />

      <g className="handleGroup">
        {isRelationChangeable && (
          <g>
            {/* left */}
            <BarRelationHandle
              isRelationDrawMode={isRelationDrawMode}
              x={task.x1 - relationCircleOffset}
              y={task.y + taskHalfHeight}
              radius={relationCircleRadius}
              onMouseDown={() => {
                onRelationStart("startOfTask", task);
              }}
            />
            {/* right */}
            <BarRelationHandle
              isRelationDrawMode={isRelationDrawMode}
              x={task.x2 + relationCircleOffset}
              y={task.y + taskHalfHeight}
              radius={relationCircleRadius}
              onMouseDown={() => {
                onRelationStart("endOfTask", task);
              }}
            />
          </g>
        )}
      </g>
    </g>
  );
};
