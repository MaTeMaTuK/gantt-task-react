import React, { useEffect, useState } from "react";
import { Task, EventOption } from "../../types/public-types";
import { Bar } from "../Bar/bar";
import { BarTask } from "../../types/bar-task";
import { Arrow } from "../Other/arrow";
import {
  convertToBarTasks,
  handleTaskBySVGMouseEvent,
  BarMoveAction,
} from "../../helpers/bar-helper";
import { Tooltip } from "../Other/tooltip";
import { isKeyboardEvent } from "../../helpers/other-helper";

export type GanttContentMoveAction =
  | "mouseenter"
  | "mouseleave"
  | "delete"
  | BarMoveAction;
export type BarEvent = {
  selectedTask?: BarTask;
  action: GanttContentMoveAction;
};
export type GanttContentProps = {
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
  headerHeight: number;
  handleWidth: number;
  timeStep: number;
  svg: React.RefObject<SVGSVGElement>;
  arrowColor: string;
  arrowIndent: number;
  fontSize: string;
  fontFamily: string;
  getTooltipContent?: (
    task: Task,
    fontSize: string,
    fontFamily: string
  ) => JSX.Element;
} & EventOption;

export const GanttContent: React.FC<GanttContentProps> = ({
  tasks,
  rowHeight,
  barCornerRadius,
  columnWidth,
  dates,
  barFill,
  barProgressColor,
  barProgressSelectedColor,
  barBackgroundColor,
  barBackgroundSelectedColor,
  headerHeight,
  handleWidth,
  arrowColor,
  timeStep,
  fontFamily,
  fontSize,
  arrowIndent,
  svg,
  onDateChange,
  onProgressChange,
  onDoubleClick,
  onTaskDelete,
  getTooltipContent,
}) => {
  const point = svg.current?.createSVGPoint();
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
    if (newXStep !== xStep) {
      setXStep(newXStep);
    }
  }, [columnWidth, dates, timeStep, xStep]);

  // generate tasks
  useEffect(() => {
    const dateDelta =
      dates[1].getTime() -
      dates[0].getTime() -
      dates[1].getTimezoneOffset() * 60 * 1000 +
      dates[0].getTimezoneOffset() * 60 * 1000;
    const taskHeight = (rowHeight * barFill) / 100;

    setBarTasks(
      convertToBarTasks(
        tasks,
        dates,
        dateDelta,
        columnWidth,
        rowHeight,
        taskHeight,
        headerHeight,
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
    headerHeight,
    barProgressColor,
    barProgressSelectedColor,
    barBackgroundColor,
    barBackgroundSelectedColor,
  ]);

  /**
   * Method is Start point of task change
   */
  const handleBarEventStart = (
    event: React.MouseEvent | React.KeyboardEvent,
    action: GanttContentMoveAction,
    selectedTask: BarTask
  ) => {
    if (isKeyboardEvent(event)) {
      if (action === "delete") {
        setBarTasks(barTasks.filter(t => t.id !== barEvent.selectedTask?.id));
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
      if (!svg.current || !point) return;
      point.x = event.clientX;
      const cursor = point.matrixTransform(
        svg.current.getScreenCTM()?.inverse()
      );
      setInitEventX1Delta(cursor.x - selectedTask.x1);
      setBarEvent({ action, selectedTask });
    } else {
      setBarEvent({
        action,
        selectedTask,
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = async (event: MouseEvent) => {
      if (!barEvent.selectedTask || !point || !svg.current) return;
      event.preventDefault();

      point.x = event.clientX;
      const cursor = point.matrixTransform(
        svg.current.getScreenCTM()?.inverse()
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
      if (!selectedTask || !point || !svg.current) return;
      event.preventDefault();

      point.x = event.clientX;
      const cursor = point.matrixTransform(
        svg.current.getScreenCTM()?.inverse()
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
        onDateChange(changedTask);
      } else if (onProgressChange) {
        onProgressChange(changedTask);
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
      svg.current
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
              onDoubleClick={onDoubleClick}
              isDateChangeable={!!onDateChange && !task.isDisabled}
              isDelete={!!onTaskDelete && !task.isDisabled}
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
            y={barEvent.selectedTask.y + rowHeight}
            task={barEvent.selectedTask}
            fontFamily={fontFamily}
            fontSize={fontSize}
            getTooltipContent={getTooltipContent}
          />
        )}
      </g>
    </g>
  );
};
