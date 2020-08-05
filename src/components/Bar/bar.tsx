import React, { useState } from "react";
import { Task } from "../../types/public-types";
import { BarProgressHandle } from "./bar-progress-handle";
import { BarDateHandle } from "./bar-date-handle";
import { BarDisplay } from "./bar-display";
import { BarTask } from "../../types/bar-task";
import { BarAction } from "../Gantt/gantt-content";
import {
  progressWithByParams,
  getProgressPoint,
} from "../../helpers/bar-helper";
import styles from "./bar.module.css";

export type BarProps = {
  task: BarTask;
  arrowIndent: number;
  onDoubleClick?: (task: Task) => any;
  isProgressChangeable: boolean;
  isDateChangeable: boolean;
  handleMouseEvents: (
    event:
      | React.MouseEvent<SVGPolygonElement, MouseEvent>
      | React.MouseEvent<SVGGElement, MouseEvent>
      | React.MouseEvent<SVGRectElement, MouseEvent>,
    eventType: BarAction,
    task: BarTask
  ) => void;
  handleButtonSVGEvents: (
    event: React.KeyboardEvent<SVGGElement>,
    task: BarTask
  ) => void;
};

export const Bar: React.FC<BarProps> = ({
  task,
  arrowIndent,
  onDoubleClick,
  isProgressChangeable,
  isDateChangeable,
  handleMouseEvents,
  handleButtonSVGEvents,
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
      onDoubleClick={() => {
        !!onDoubleClick && onDoubleClick(task);
      }}
      tabIndex={0}
      onKeyDown={e => {
        handleButtonSVGEvents(e, task);
      }}
      onMouseEnter={e => {
        handleMouseEvents(e, "mouseenter", task);
      }}
      onMouseLeave={e => {
        handleMouseEvents(e, "mouseleave", task);
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
          isDateChangeable && handleMouseEvents(e, "move", task);
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
                handleMouseEvents(e, "start", task);
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
                handleMouseEvents(e, "end", task);
              }}
            />
          </g>
        )}
        {isProgressChangeable && (
          <BarProgressHandle
            progressPoint={progressPoint}
            onMouseDown={e => {
              handleMouseEvents(e, "progress", task);
            }}
          />
        )}
      </g>
    </g>
  );
};
