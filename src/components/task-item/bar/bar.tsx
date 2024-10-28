import React from "react";
import { BarDisplay } from "./bar-display";
import { TaskItemProps } from "../task-item";
import styles from "./bar.module.css";

const defaultStyles = {
  backgroundColor: "#ffffff",
  backgroundSelectedColor: "#000000",
  greenBarColor: "#27a38a",
  yellowBarColor: "#d1a215",
  redBarColor: "#bf0808",
  dictationBarColor: "#1e90ff",
  liveCallBarColor: "#00ff00",
  redTeamBarColor: "#ff0000",
};

export const Bar: React.FC<TaskItemProps> = ({
  task,
  viewType,
  onEventStart,
  isSelected,
}) => {
  const isDateChangeable = false;
  const taskStyles = { ...defaultStyles, ...task.styles };

  return (
    <g className={styles.barWrapper} tabIndex={0}>
      <BarDisplay
        x={task.x1}
        x2={task.x2}
        x3={task.x3 || -1}
        x4={task.x4 || -1}
        y={task.y}
        tat_total={task.tat_total || 0}
        viewType={viewType}
        subType={task.subType ?? "dictation"}
        width={task.x2 - task.x1}
        height={task.height}
        barCornerRadius={task.barCornerRadius}
        styles={taskStyles}
        isSelected={isSelected}
        onMouseDown={(e: React.MouseEvent) => {
          isDateChangeable && onEventStart("move", task, e);
        }}
      />
    </g>
  );
};
