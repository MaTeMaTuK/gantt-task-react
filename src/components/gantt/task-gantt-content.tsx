import React, { useEffect, useState } from "react";
import { Task, EventOption } from "../../types/public-types";
import { Bar } from "../bar/bar";
import { BarTask } from "../../types/bar-task";
import { Arrow } from "../other/arrow";
import {
  convertToBarTasks,
  handleTaskBySVGMouseEvent,
  BarMoveAction,
} from "../../helpers/bar-helper";
import { Tooltip } from "../other/tooltip";
import { isKeyboardEvent } from "../../helpers/other-helper";

export type GanttContentMoveAction =
  | "mouseenter"
  | "mouseleave"
  | "delete"
  | "dblclick"
  | "select"
  | BarMoveAction;
export type BarEvent = {
  changedTask?: BarTask;
  originalTask?: BarTask;
  action: GanttContentMoveAction;
};
export type TaskGanttContentProps = {
  tasks: Task[];
  dates: Date[];
  selectedTask: string;
  rowHeight: number;
  barCornerRadius: number;
  columnWidth: number;
  barFill: number;
  barProgressColor: string;
  barProgressSelectedColor: string;
  barBackgroundColor: string;
  barBackgroundSelectedColor: string;
  handleWidth: number;
  timeStep: number;
  svg?: React.RefObject<SVGSVGElement>;
  svgHeight: number;
  arrowColor: string;
  arrowIndent: number;
  fontSize: string;
  fontFamily: string;
  setSelectedTask: (taskId: string) => void;
  TooltipContent: React.FC<{
    task: Task;
    fontSize: string;
    fontFamily: string;
  }>;
  onTasksChange: (tasks: Task[]) => void;
} & EventOption;

export const TaskGanttContent: React.FC<TaskGanttContentProps> = ({
  tasks,
  dates,
  selectedTask,
  rowHeight,
  barCornerRadius,
  columnWidth,
  barFill,
  barProgressColor,
  barProgressSelectedColor,
  barBackgroundColor,
  barBackgroundSelectedColor,
  handleWidth,
  timeStep,
  svg,
  svgHeight,
  arrowColor,
  arrowIndent,
  fontFamily,
  fontSize,
  setSelectedTask,
  onTasksChange,
  onDateChange,
  onProgressChange,
  onDoubleClick,
  onTaskDelete,
  TooltipContent,
}) => {
  const point = svg?.current?.createSVGPoint();
  const [barEvent, setBarEvent] = useState<BarEvent>({
    action: "",
  });
  const [barTasks, setBarTasks] = useState<BarTask[]>([]);
  const [failedTask, setFailedTask] = useState<BarTask | null>(null);
  const [xStep, setXStep] = useState(0);
  const [initEventX1Delta, setInitEventX1Delta] = useState(0);
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

  // generate tasks
  useEffect(() => {
    setBarTasks(
      convertToBarTasks(
        tasks,
        dates,
        columnWidth,
        rowHeight,
        barFill,
        barCornerRadius,
        handleWidth,
        barProgressColor,
        barProgressSelectedColor,
        barBackgroundColor,
        barBackgroundSelectedColor
      )
    );
  }, [
    tasks,
    rowHeight,
    barCornerRadius,
    columnWidth,
    dates,
    barFill,
    handleWidth,
    barProgressColor,
    barProgressSelectedColor,
    barBackgroundColor,
    barBackgroundSelectedColor,
  ]);

  // on failed task update
  useEffect(() => {
    if (failedTask) {
      const newTasks = barTasks.map(t =>
        t.id === failedTask.id ? failedTask : t
      );
      onTasksChange(newTasks);
      setFailedTask(null);
    }
  }, [failedTask, barTasks]);

  useEffect(() => {
    const handleMouseMove = async (event: MouseEvent) => {
      if (!barEvent.changedTask || !point || !svg?.current) return;
      event.preventDefault();

      point.x = event.clientX;
      const cursor = point.matrixTransform(
        svg?.current.getScreenCTM()?.inverse()
      );

      const { isChanged, changedTask } = handleTaskBySVGMouseEvent(
        cursor.x,
        barEvent.action as BarMoveAction,
        barEvent.changedTask,
        xStep,
        timeStep,
        initEventX1Delta
      );
      if (isChanged) {
        setBarTasks(
          barTasks.map(t => (t.id === changedTask.id ? changedTask : t))
        );
        setBarEvent({ ...barEvent, changedTask: changedTask });
      }
    };

    const handleMouseUp = async (event: MouseEvent) => {
      const { changedTask: selectedTask, action, originalTask } = barEvent;

      if (!selectedTask || !point || !svg?.current || !originalTask) return;
      event.preventDefault();

      point.x = event.clientX;
      const cursor = point.matrixTransform(
        svg?.current.getScreenCTM()?.inverse()
      );

      const { changedTask } = handleTaskBySVGMouseEvent(
        cursor.x,
        action as BarMoveAction,
        selectedTask,
        xStep,
        timeStep,
        initEventX1Delta
      );

      const isNotLikeOriginal =
        originalTask.start !== changedTask.start ||
        originalTask.end !== changedTask.end ||
        originalTask.progress !== changedTask.progress;

      // remove listeners
      svg.current.removeEventListener("mousemove", handleMouseMove);
      svg.current.removeEventListener("mouseup", handleMouseUp);
      setBarEvent({ action: "" });
      setIsMoving(false);
      const newTasks = barTasks.map(t =>
        t.id === changedTask.id ? changedTask : t
      );
      onTasksChange(newTasks);

      // custom operation start
      let operationSuccess = true;
      if (
        (action === "move" || action === "end" || action === "start") &&
        onDateChange &&
        isNotLikeOriginal
      ) {
        try {
          const result = await onDateChange(changedTask);
          if (result !== undefined) {
            operationSuccess = result;
          }
        } catch (error) {
          operationSuccess = false;
        }
      } else if (onProgressChange && isNotLikeOriginal) {
        try {
          const result = await onProgressChange(changedTask);
          if (result !== undefined) {
            operationSuccess = result;
          }
        } catch (error) {
          operationSuccess = false;
        }
      }

      // If operation is failed - return old state
      if (!operationSuccess) {
        setFailedTask(originalTask);
      }
    };

    if (
      !isMoving &&
      (barEvent.action === "move" ||
        barEvent.action === "end" ||
        barEvent.action === "start" ||
        barEvent.action === "progress") &&
      svg?.current
    ) {
      svg.current.addEventListener("mousemove", handleMouseMove);
      svg.current.addEventListener("mouseup", handleMouseUp);
      setIsMoving(true);
    }
  }, [
    barTasks,
    barEvent,
    xStep,
    initEventX1Delta,
    onProgressChange,
    timeStep,
    onDateChange,
    svg,
    isMoving,
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
      if (action === "delete") {
        if (onTaskDelete) {
          try {
            const result = await onTaskDelete(task);
            if (result !== undefined && result) {
              const newTasks = barTasks.filter(t => t.id !== task.id);
              onTasksChange(newTasks);
              setSelectedTask("");
            }
          } catch (error) {
            console.error("Error on Delete. " + error);
          }
        }
      }
    }
    // Mouse Events
    else if (action === "mouseenter") {
      if (!barEvent.action) {
        setBarEvent({
          action,
          changedTask: task,
          originalTask: task,
        });
      }
    } else if (action === "mouseleave") {
      if (barEvent.action === "mouseenter") {
        setBarEvent({ action: "" });
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
      setBarEvent({
        action,
        changedTask: task,
        originalTask: task,
      });
    } else {
      setBarEvent({
        action,
        changedTask: task,
        originalTask: task,
      });
    }
  };

  return (
    <g className="content">
      <g className="arrows" fill={arrowColor} stroke={arrowColor}>
        {barTasks.map(task => {
          return task.barChildren.map(child => {
            return (
              <Arrow
                key={`Arrow from ${task.id} to ${barTasks[child].id}`}
                taskFrom={task}
                taskTo={barTasks[child]}
                rowHeight={rowHeight}
                arrowIndent={arrowIndent}
              />
            );
          });
        })}
      </g>
      <g className="bar" fontFamily={fontFamily} fontSize={fontSize}>
        {barTasks.map(task => {
          return (
            <Bar
              task={task}
              arrowIndent={arrowIndent}
              isProgressChangeable={!!onProgressChange && !task.isDisabled}
              isDateChangeable={!!onDateChange && !task.isDisabled}
              isDelete={!task.isDisabled}
              onEventStart={handleBarEventStart}
              key={task.id}
              isSelected={task.id === selectedTask}
            />
          );
        })}
      </g>
      <g className="toolTip">
        {barEvent.changedTask && (
          <Tooltip
            x={barEvent.changedTask.x2 + arrowIndent + arrowIndent * 0.5}
            rowHeight={rowHeight}
            svgHeight={svgHeight}
            task={barEvent.changedTask}
            fontFamily={fontFamily}
            fontSize={fontSize}
            TooltipContent={TooltipContent}
          />
        )}
      </g>
    </g>
  );
};
