import React from "react";
// import { getProgressPoint } from "../../../helpers/bar-helper";
import { BarDisplay } from "./bar-display";
import { BarDateHandle } from "./bar-date-handle";
// import { BarProgressHandle } from "./bar-progress-handle";
import { TaskItemProps } from "../task-item";
import styles from "./bar.module.css";

export const BarSmall: React.FC<TaskItemProps> = ({
  task,
  // isProgressChangeable,
  isDateChangeable,
  onEventStart,
  isSelected,
}) => {
  // const progressPoint = getProgressPoint(
  //   task.progressWidth + task.x1,
  //   task.y,
  //   task.height
  // );

  const handleHeight = task.height - 2;  
  return (
    <g className={styles.barWrapper} tabIndex={0}>
      <BarDisplay
        x={task.x1}
        y={task.y}
        width={task.x2 - task.x1}
        height={task.height}
        progressX={task.progressX}
        progressWidth={task.progressWidth}
        barCornerRadiusX='10px'
        barCornerRadiusY='100px'
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
              x={task.x1 + 1}
              y={task.y + 1}
              width={task.handleWidth}
              height={handleHeight}
              barCornerRadius={task.barCornerRadius}
              onMouseDown={e => {
                onEventStart("start", task, e);
              }}
            />
            {/* right */}
            <BarDateHandle
              x={task.x2 - task.handleWidth - 1}
              y={task.y + 1}
              width={task.handleWidth}
              height={handleHeight}
              barCornerRadius={task.barCornerRadius}
              onMouseDown={e => {
                onEventStart("end", task, e);
              }}
            />
          </g>
        )}
      </g>
      {/* <g className="handleGroup">
        {isProgressChangeable && (
          <BarProgressHandle
            progressPoint={progressPoint}
            onMouseDown={e => {
              onEventStart("progress", task, e);
            }}
          />
        )}
      </g> */}
    </g>
  );
};
