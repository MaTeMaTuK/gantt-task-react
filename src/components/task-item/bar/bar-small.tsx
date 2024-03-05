import React from "react";
import { getProgressPoint } from "../../../helpers/bar-helper";
import { BarDisplay } from "./bar-display";
import { BarProgressHandle } from "./bar-progress-handle";
import { TaskItemProps } from "../task-item";
import styles from "./bar.module.css";

export const BarSmall: React.FC<TaskItemProps> = ({
  task,
  isProgressChangeable,
  isDateChangeable,
  onEventStart,
  isSelected,
}) => {
  const progressPoint = getProgressPoint(
    task.progressWidth + task.x1,
    task.y,
    task.height
  );
  return (<g>
    <g className={styles.barWrapper} tabIndex={0}>
      <BarDisplay
        x={task.x1}
        y={task.y}
        width={task.x2 - task.x1}
        height={task.height}
        progressX={task.progressX}
        progressWidth={task.progressWidth}
        barCornerRadius={task.barCornerRadius}
        styles={task.styles}
        isSelected={isSelected}
        onMouseDown={e => {
          isDateChangeable && onEventStart("move", task, e);
        }}
      />
      <g className="handleGroup">
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
      {task.priority === "BLOCKER" && (
        <g>
          <rect x={task.x2 + 3} y={task.y + 1} width="81" height="28" rx="4" fill="none" stroke="#FFD591"
                strokeWidth="1"/>
          <rect x={task.x2 + 3} y={task.y + 1} width="81" height="28" rx="4" fill="#FFF7E6"/>
          <text x={task.x2 + 41} y={task.y + 15} dominantBaseline="middle" textAnchor="middle" fill="#FA8C16">Blocker
          </text>
        </g>
      )}
    </g>
  );
};
