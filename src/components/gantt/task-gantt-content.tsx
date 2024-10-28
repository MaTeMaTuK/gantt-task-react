import React, { useEffect, useState } from "react";
import { EventOption, ViewType } from "../../types/public-types";
import { BarTask } from "../../types/bar-task";
// import { Arrow } from "../other/arrow";
import { handleTaskBySVGMouseEvent } from "../../helpers/bar-helper";
import { isKeyboardEvent } from "../../helpers/other-helper";
import { TaskItem } from "../task-item/task-item";
import {
  BarMoveAction,
  GanttContentMoveAction,
  GanttEvent,
} from "../../types/gantt-task-actions";

export type TaskGanttContentProps = {
  tasks: BarTask[];
  viewType: ViewType;
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
  viewType,
  dates,
  ganttEvent,
  selectedTask,
  // rowHeight,
  columnWidth,
  timeStep,
  svg,
  taskHeight,
  // arrowColor,
  arrowIndent,
  fontFamily,
  fontSize,
  setGanttEvent,
  setFailedTask,
  setSelectedTask,
  onDateChange,
  onDoubleClick,
  onClick,
}) => {
  const point = svg?.current?.createSVGPoint();
  const [xStep, setXStep] = useState(0);
  const [initEventX1Delta] = useState(0);
  const [isMoving, setIsMoving] = useState(false);

  // create xStep
  useEffect(() => {
    const dateDelta =
      dates[1].getTime() -
      dates[0].getTime() -
      dates[1].getTimezoneOffset() * 60 * 1000 +
      dates[0].getTimezoneOffset() * 60 * 1000;
    const newXStep = (timeStep * columnWidth) / dateDelta;
    setXStep(newXStep);
  }, [columnWidth, dates, timeStep]);

  useEffect(() => {
    const handleMouseMove = async (event: MouseEvent) => {
      if (!ganttEvent.changedTask || !point || !svg?.current) return;
      event.preventDefault();

      point.x = event.clientX;
      const cursor = point.matrixTransform(
        svg?.current.getScreenCTM()?.inverse()
      );

      const { isChanged, changedTask } = handleTaskBySVGMouseEvent(
        cursor.x,
        ganttEvent.action as BarMoveAction,
        ganttEvent.changedTask,
        xStep,
        timeStep,
        initEventX1Delta
      );
      if (isChanged) {
        setGanttEvent({ action: ganttEvent.action, changedTask });
      }
    };

    const handleMouseUp = async (event: MouseEvent) => {
      const { action, originalSelectedTask, changedTask } = ganttEvent;
      if (!changedTask || !point || !svg?.current || !originalSelectedTask)
        return;
      event.preventDefault();

      point.x = event.clientX;
      const cursor = point.matrixTransform(
        svg?.current.getScreenCTM()?.inverse()
      );
      const { changedTask: newChangedTask } = handleTaskBySVGMouseEvent(
        cursor.x,
        action as BarMoveAction,
        changedTask,
        xStep,
        timeStep,
        initEventX1Delta
      );

      const isNotLikeOriginal =
        originalSelectedTask.start !== newChangedTask.start ||
        originalSelectedTask.end !== newChangedTask.end;

      // remove listeners
      svg.current.removeEventListener("mousemove", handleMouseMove);
      svg.current.removeEventListener("mouseup", handleMouseUp);
      setGanttEvent({ action: "" });
      setIsMoving(false);

      // custom operation start
      let operationSuccess = true;
      if (
        (action === "end" || action === "start") &&
        onDateChange &&
        isNotLikeOriginal
      ) {
        try {
          const result = await onDateChange(
            newChangedTask,
            newChangedTask.barChildren
          );
          if (result !== undefined) {
            operationSuccess = result;
          }
        } catch (error) {
          operationSuccess = false;
        }
      }

      // If operation is failed - return old state
      if (!operationSuccess) {
        setFailedTask(originalSelectedTask);
      }
    };

    if (
      !isMoving &&
      (ganttEvent.action === "end" || ganttEvent.action === "start") &&
      svg?.current
    ) {
      svg.current.addEventListener("mousemove", handleMouseMove);
      svg.current.addEventListener("mouseup", handleMouseUp);
      setIsMoving(true);
    }
  }, [
    ganttEvent,
    xStep,
    initEventX1Delta,
    timeStep,
    onDateChange,
    svg,
    isMoving,
    point,
    setFailedTask,
    setGanttEvent,
  ]);

  /**
   * Method is Start point of task change
   */
  const handleBarEventStart = async (
    action: GanttContentMoveAction,
    task: BarTask,
    event?: React.MouseEvent | React.KeyboardEvent
  ) => {
    if (!event) {
      if (action === "select") {
        setSelectedTask(task.id);
      }
    }
    // Keyboard events
    else if (isKeyboardEvent(event)) {
      // Mouse Events
      if (action === "mouseenter") {
        if (!ganttEvent.action) {
          setGanttEvent({
            action,
            changedTask: task,
            originalSelectedTask: task,
          });
        }
      } else if (action === "mouseleave") {
        if (ganttEvent.action === "mouseenter") {
          setGanttEvent({ action: "" });
        }
      } else if (action === "dblclick") {
        !!onDoubleClick && onDoubleClick(task);
      } else if (action === "click") {
        !!onClick && onClick(task);
      }
    }
  };

  return (
    <g className="content">
      <g className="bar" fontFamily={fontFamily} fontSize={fontSize}>
        {tasks.map(task => {
          return (
            <TaskItem
              task={task}
              viewType={viewType}
              arrowIndent={arrowIndent}
              taskHeight={taskHeight}
              onEventStart={handleBarEventStart}
              key={task.id}
              isSelected={!!selectedTask && task.id === selectedTask.id}
            />
          );
        })}
      </g>
    </g>
  );
};
