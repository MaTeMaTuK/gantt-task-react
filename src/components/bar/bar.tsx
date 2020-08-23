import React, { useState } from "react";
import { BarTask } from "../../types/bar-task";
import {
  progressWithByParams,
  getProgressPoint,
} from "../../helpers/bar-helper";
import styles from "./bar.module.css";
import { GanttContentMoveAction } from "../gantt/task-gantt-content";
import { BarDisplay } from "./bar-display";
import { BarDateHandle } from "./bar-date-handle";
import { BarProgressHandle } from "./bar-progress-handle";

export type BarProps = {
  task: BarTask;
  arrowIndent: number;
  isProgressChangeable: boolean;
  isDateChangeable: boolean;
  isDelete: boolean;
  onEventStart: (
    event: React.MouseEvent | React.KeyboardEvent,
    action: GanttContentMoveAction,
    selectedTask: BarTask
  ) => any;
};

export const Bar: React.FC<BarProps> = ({
  task,
  arrowIndent,
  isProgressChangeable,
  isDateChangeable,
  onEventStart,
  isDelete,
}) => {
  const [isSelected, setIsSelected] = useState(false);

  const progressWidth = progressWithByParams(task.x1, task.x2, task.progress);
  const progressPoint = getProgressPoint(
    progressWidth + task.x1,
    task.y,
    task.height
  );

  return (
    <g
      className={styles.barWrapper}
      onDoubleClick={e => {
        onEventStart(e, "dblclick", task);
      }}
      tabIndex={0}
      onKeyDown={e => {
        switch (e.key) {
          case "Delete": {
            if (isDelete) onEventStart(e, "delete", task);
            break;
          }
        }
      }}
      onMouseEnter={e => {
        onEventStart(e, "mouseenter", task);
      }}
      onMouseLeave={e => {
        onEventStart(e, "mouseleave", task);
      }}
      onFocus={() => setIsSelected(true)}
      onBlur={() => setIsSelected(false)}
    >
      <BarDisplay
        x={task.x1}
        y={task.y}
        width={task.x2 - task.x1}
        height={task.height}
        progressWidth={progressWidth}
        barCornerRadius={task.barCornerRadius}
        text={task.name}
        hasChild={task.barChildren.length > 0}
        arrowIndent={arrowIndent}
        styles={task.styles}
        isSelected={isSelected}
        onMouseDown={e => {
          isDateChangeable && onEventStart(e, "move", task);
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
              height={task.height - 2}
              barCornerRadius={task.barCornerRadius}
              onMouseDown={e => {
                onEventStart(e, "start", task);
              }}
            />
            {/* right */}
            <BarDateHandle
              x={task.x2 - task.handleWidth - 1}
              y={task.y + 1}
              width={task.handleWidth}
              height={task.height - 2}
              barCornerRadius={task.barCornerRadius}
              onMouseDown={e => {
                onEventStart(e, "end", task);
              }}
            />
          </g>
        )}
        {isProgressChangeable && (
          <BarProgressHandle
            progressPoint={progressPoint}
            onMouseDown={e => {
              onEventStart(e, "progress", task);
            }}
          />
        )}
      </g>
    </g>
  );
};
