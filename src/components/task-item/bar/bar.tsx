import React, {
  useCallback,
} from "react";

import cx from "classnames";

import { getProgressPoint } from "../../../helpers/bar-helper";
import { BarDisplay } from "./bar-display";
import { BarDateHandle } from "./bar-date-handle";
import { BarRelationHandle } from "./bar-relation-handle";
import { BarProgressHandle } from "./bar-progress-handle";
import { TaskItemProps } from "../task-item";

import styles from "./bar.module.css";
import stylesRelationHandle from "./bar-relation-handle.module.css";

export const Bar: React.FC<TaskItemProps> = ({
  task,
  taskHalfHeight,
  relationCircleOffset,
  relationCircleRadius,
  isProgressChangeable,
  isDateChangeable,
  isRelationChangeable,
  isRelationDrawMode,
  rtl,
  onEventStart,
  onRelationStart,
  isSelected,
}) => {
  const onLeftRelationTriggerMouseDown = useCallback(() => {
    onRelationStart(
      rtl ? "endOfTask" : "startOfTask",
      task,
    );
  }, [
    onRelationStart,
    rtl,
    task,
  ]);

  const onRightRelationTriggerMouseDown = useCallback(() => {
    onRelationStart(
      rtl ? "startOfTask" : "endOfTask",
      task,
    );
  }, [
    onRelationStart,
    rtl,
    task,
  ]);

  const progressPoint = getProgressPoint(
    +!rtl * task.progressWidth + task.progressX,
    task.y,
    task.height
  );
  const handleHeight = task.height - 2;
  return (
    <g
      className={cx(styles.barWrapper, stylesRelationHandle.barRelationHandleWrapper)}
      tabIndex={0}
    >
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

        {isRelationChangeable && (
          <g>
            {/* left */}
            <BarRelationHandle
              isRelationDrawMode={isRelationDrawMode}
              x={task.x1 - relationCircleOffset}
              y={task.y + taskHalfHeight}
              radius={relationCircleRadius}
              onMouseDown={onLeftRelationTriggerMouseDown}
            />
            {/* right */}
            <BarRelationHandle
              isRelationDrawMode={isRelationDrawMode}
              x={task.x2 + relationCircleOffset}
              y={task.y + taskHalfHeight}
              radius={relationCircleRadius}
              onMouseDown={onRightRelationTriggerMouseDown}
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
