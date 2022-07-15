import React, { useEffect, useState, useRef } from "react";
import { EventOption } from "../../types/public-types";
import { BarTask } from "../../types/bar-task";
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
  task: BarTask;
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

export const TaskGanttArrows: React.FC<TaskGanttContentProps> = ({
  task,
  dates,
  ganttEvent,
  selectedTask,
  svgWidth,
  rowHeight,
  columnWidth,
  timeStep,
  taskHeight,
  arrowIndent,
  fontFamily,
  fontSize,
  setGanttEvent,
  setFailedTask,
  setSelectedTask,
  onDateChange,
  onProgressChange,
  onDoubleClick,
  onDelete,
}) => {
  const svg = useRef<SVGSVGElement>(null);
  const point = svg?.current?.createSVGPoint();
  const [xStep, setXStep] = useState(0);
  const [initEventX1Delta, setInitEventX1Delta] = useState(0);
  // const [isMoving, setIsMoving] = useState(false);

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

  const handleMouseMove = (event: MouseEvent) => {
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
      originalSelectedTask.end !== newChangedTask.end ||
      originalSelectedTask.progress !== newChangedTask.progress;
    setGanttEvent({ action: "" });
    // setIsMoving(false);

    // custom operation start
    let operationSuccess = true;
    if (
      (action === "move" || action === "end" || action === "start") &&
      onDateChange &&
      isNotLikeOriginal
    ) {
      try {
        const result = await onDateChange(newChangedTask);
        if (result !== undefined) {
          operationSuccess = result;
        }
      } catch (error) {
        operationSuccess = false;
      }
    } else if (onProgressChange && isNotLikeOriginal) {
      try {
        const result = await onProgressChange(newChangedTask);
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

  // useEffect(() => {
  //   if (
  //     !isMoving &&
  //     (ganttEvent.action === "move" ||
  //       ganttEvent.action === "end" ||
  //       ganttEvent.action === "start" ||
  //       ganttEvent.action === "progress") &&
  //     svg?.current
  //   ) {
  //     svg.current.addEventListener("mousemove", handleMouseMove, false);
  //     svg.current.addEventListener("mouseup", handleMouseUp, false);
  //     setIsMoving(true);
  //   }
  // }, [
  //   ganttEvent,
  //   xStep,
  //   initEventX1Delta,
  //   onProgressChange,
  //   timeStep,
  //   onDateChange,
  //   svg,
  //   isMoving,
  // ]);

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
      if (action === "delete") {
        if (onDelete) {
          try {
            const result = await onDelete(task);
            if (result !== undefined && result) {
              setGanttEvent({ action, changedTask: task });
            }
          } catch (error) {
            console.error("Error on Delete. " + error);
          }
        }
      }
    }
    // Mouse Events
    else if (action === "mouseenter") {
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
    }
    // Change task event start
    else if (action === "move") {
      if (!svg?.current || !point) return;
      point.x = event.clientX;
      const cursor = point.matrixTransform(
        svg.current.getScreenCTM()?.inverse()
      );
      setInitEventX1Delta(cursor.x - task.x1);
      setGanttEvent({
        action,
        changedTask: task,
        originalSelectedTask: task,
      });
    } else {
      setGanttEvent({
        action,
        changedTask: task,
        originalSelectedTask: task,
      });
    }
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={svgWidth}
      height={rowHeight}
      fontFamily={fontFamily}
      ref={svg}
      key={task.id}
      onMouseMove={(event: any) => {
        if (["move", "end", "start", "progress"].includes(ganttEvent.action)) {
          handleMouseMove(event);
        }
      }}
      onMouseUp={(event: any) => {
        handleMouseUp(event);
      }}
    >
      <g className="content">
        <g className="bar" fontFamily={fontFamily} fontSize={fontSize}>
          <TaskItem
            task={task}
            arrowIndent={arrowIndent}
            taskHeight={taskHeight}
            isProgressChangeable={!!onProgressChange && !task.isDisabled}
            isDateChangeable={!!onDateChange && !task.isDisabled}
            isDelete={!task.isDisabled}
            onEventStart={handleBarEventStart}
            key={task.id}
            isSelected={!!selectedTask && task.id === selectedTask.id}
          />
        </g>
      </g>
    </svg>
  );
};
