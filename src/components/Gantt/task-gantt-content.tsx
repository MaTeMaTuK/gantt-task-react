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
  | BarMoveAction;
export type BarEvent = {
  selectedTask?: BarTask;
  action: GanttContentMoveAction;
};
export type TaskGanttContentProps = {
  tasks: Task[];
  dates: Date[];
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
  TooltipContent: React.FC<{
    task: Task;
    fontSize: string;
    fontFamily: string;
  }>;
  onTasksDateChange: (tasks: Task[]) => void;
} & EventOption;

export const TaskGanttContent: React.FC<TaskGanttContentProps> = ({
  tasks,
  dates,
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
  onTasksDateChange,
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

  /**
   * Method is Start point of task change
   */
  const handleBarEventStart = async (
    event: React.MouseEvent | React.KeyboardEvent,
    action: GanttContentMoveAction,
    selectedTask: BarTask
  ) => {
    if (isKeyboardEvent(event)) {
      if (action === "delete") {
        if (onTaskDelete) {
          await onTaskDelete(selectedTask);
          const newTasks = barTasks.filter(t => t.id !== selectedTask.id);
          onTasksDateChange(newTasks);
        }
      }
    } else if (action === "mouseenter") {
      if (!barEvent.action) {
        setBarEvent({ action, selectedTask });
      }
    } else if (action === "mouseleave") {
      if (barEvent.action === "mouseenter") {
        setBarEvent({ action: "" });
      }
    } else if (action === "move") {
      if (!svg?.current || !point) return;
      point.x = event.clientX;
      const cursor = point.matrixTransform(
        svg.current.getScreenCTM()?.inverse()
      );
      setInitEventX1Delta(cursor.x - selectedTask.x1);
      setBarEvent({ action, selectedTask });
    } else if (action === "dblclick") {
      !!onDoubleClick && onDoubleClick(selectedTask);
    } else {
      setBarEvent({
        action,
        selectedTask,
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = async (event: MouseEvent) => {
      if (!barEvent.selectedTask || !point || !svg?.current) return;
      event.preventDefault();

      point.x = event.clientX;
      const cursor = point.matrixTransform(
        svg?.current.getScreenCTM()?.inverse()
      );

      const { isChanged, changedTask } = handleTaskBySVGMouseEvent(
        cursor.x,
        barEvent.action as BarMoveAction,
        barEvent.selectedTask,
        xStep,
        timeStep,
        initEventX1Delta
      );
      if (isChanged) {
        setBarTasks(
          barTasks.map(t => (t.id === changedTask.id ? changedTask : t))
        );
        setBarEvent({ ...barEvent, selectedTask: changedTask });
      }
    };

    const handleMouseUp = async (event: MouseEvent) => {
      const { selectedTask, action } = barEvent;
      if (!selectedTask || !point || !svg?.current) return;
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
      if (
        (action === "move" || action === "end" || action === "start") &&
        onDateChange
      ) {
        await onDateChange(changedTask);
        const newTasks = barTasks.map(t =>
          t.id === changedTask.id ? changedTask : t
        );
        onTasksDateChange(newTasks);
      } else if (onProgressChange) {
        await onProgressChange(changedTask);
      }
      svg.current.removeEventListener("mousemove", handleMouseMove);
      svg.current.removeEventListener("mouseup", handleMouseUp);
      setBarEvent({ action: "" });
      setIsMoving(false);
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

  return (
    <g className="content">
      <g className="arrows" fill={arrowColor} stroke={arrowColor}>
        {barTasks.map(task => {
          return task.barChildren.map(child => {
            return (
              <Arrow
                key={`Arrow from ${task.id} to ${tasks[child].id}`}
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
            />
          );
        })}
      </g>
      <g className="toolTip">
        {barEvent.selectedTask && (
          <Tooltip
            x={barEvent.selectedTask.x2 + arrowIndent + arrowIndent * 0.5}
            rowHeight={rowHeight}
            svgHeight={svgHeight}
            task={barEvent.selectedTask}
            fontFamily={fontFamily}
            fontSize={fontSize}
            TooltipContent={TooltipContent}
          />
        )}
      </g>
    </g>
  );
};
