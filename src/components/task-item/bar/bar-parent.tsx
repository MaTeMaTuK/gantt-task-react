import React from "react";
import {
  progressWithByParams,
  getProgressPoint,
} from "../../../helpers/bar-helper";
import { BarDisplay } from "./parent-bar-display";
import { BarDateHandle } from "./bar-date-handle";
import { BarProgressHandle } from "./bar-progress-handle";
import { TaskItemProps } from "../task-item";
import styles from "./bar.module.css";

export const BarParent: React.FC<TaskItemProps> = ({
  task,
  isProgressChangeable,
  isDateChangeable,
  onEventStart,
  isSelected,
}) => {
  const progressWidth = progressWithByParams(task.x1, task.x2, task.progress);
  const progressPoint = getProgressPoint(
    progressWidth + task.x1 + 1,
    task.y + 5,
    task.height
  );
  const handleHeight = task.height - 10;
  return (
    <g className={styles.barWrapper} tabIndex={0}>
      <g className={styles.barHandle}>
        <rect
          x={task.x1 - 16}
          y={task.y - 6}
          width={task.x2 - task.x1 + 32}
          height={task.height + 12}
          className={`${styles.barHandle} ${styles.barHandleBackground}`}
          ry={task.barCornerRadius}
          rx={task.barCornerRadius}
        />
      </g>
      <BarDisplay
        x={task.x1}
        y={task.y}
        task={task}
        width={task.x2 - task.x1}
        height={task.height}
        progressWidth={progressWidth}
        barCornerRadius={task.barCornerRadius}
        styles={task.styles}
        isSelected={isSelected}
        onMouseDown={e => {
          isDateChangeable && onEventStart("move", task, e);
        }}
      />
      <g className="handleGroup">
        {isDateChangeable && (
          <g>
            {/* left */}
            <BarDateHandle
              x={task.x1}
              y={task.y}
              width={task.handleWidth}
              height={handleHeight}
              type="left"
              onMouseDown={e => {
                onEventStart("start", task, e);
              }}
            />
            {/* right */}
            <BarDateHandle
              x={task.x2 - task.handleWidth}
              y={task.y}
              width={task.handleWidth}
              height={handleHeight}
              type="right"
              onMouseDown={e => {
                onEventStart("end", task, e);
              }}
            />
          </g>
        )}
        {isProgressChangeable && (
          <BarProgressHandle
            progressPoint={progressPoint}
            onMouseDown={e => {
              onEventStart("progress", task, e);
            }}
          />
        )}
      </g>
    </g>
  );
};
