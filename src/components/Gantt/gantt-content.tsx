import React, { useState, useEffect } from 'react';
import { Task, EventOption } from '../../types/public-types';
import { Bar } from '../Bar/bar';
import { BarTask } from '../../types/bar-task';
import { Arrow } from '../Other/arrow';
import {
  convertToBarTasks,
  progressByX,
  startByX,
  endByX,
  moveByX,
  dateByX,
} from '../../helpers/bar-helper';
import { Tooltip } from '../Other/tooltip';
export interface GanttTask extends Task {
  x1: number;
  x2: number;
  y: number;
  width: number;
  height: number;
}
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
  svg: React.MutableRefObject<SVGSVGElement | null>;
  timeStep: number;
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

export type BarEvent =
  | 'progress'
  | 'end'
  | 'start'
  | 'move'
  | 'mouseenter'
  | 'mouseleave'
  | '';
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
  svg,
  timeStep,
  fontFamily,
  fontSize,
  arrowIndent,
  onDateChange,
  onProgressChange,
  onDoubleClick,
  onTaskDelete,
  getTooltipContent,
}) => {
  const [barEvent, setBarEvent] = useState<BarEvent>('');
  const [selectedTask, setSelectedTask] = useState<BarTask | null>(null);
  const [barTasks, setBarTasks] = useState<BarTask[]>([]);
  const [xStep, setXStep] = useState(0);
  const [initEventX1Delta, setInitEventX1Delta] = useState(0);
  const [isSVGListen, setIsSVGListen] = useState(false);

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
  }, [tasks, rowHeight, barCornerRadius, columnWidth, dates, timeStep, xStep]);

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
    timeStep,
    barFill,
    handleWidth,
    headerHeight,
  ]);

  useEffect(() => {
    /**
     * Method handles event in real time(mousemove) and on finish(mouseup)
     */
    const handleMouseSVGChangeEventsSubscribe = async (event: MouseEvent) => {
      if (!selectedTask || !barEvent) return;
      const changedTask = { ...selectedTask } as BarTask;
      switch (event.type) {
        //On Event changing
        case 'mousemove': {
          switch (barEvent) {
            case 'progress':
              changedTask.progress = progressByX(event.offsetX, selectedTask);
              break;
            case 'start':
              let newX1 = startByX(event.offsetX, xStep, selectedTask);
              changedTask.x1 = newX1;
              changedTask.start = dateByX(
                newX1,
                selectedTask.x1,
                selectedTask.start,
                xStep,
                timeStep
              );
              break;
            case 'end':
              let newX2 = endByX(event.offsetX, xStep, selectedTask);
              changedTask.x2 = newX2;
              changedTask.end = dateByX(
                newX2,
                selectedTask.x2,
                selectedTask.end,
                xStep,
                timeStep
              );
              break;
            case 'move':
              const [newMoveX1, newMoveX2] = moveByX(
                event.offsetX - initEventX1Delta,
                xStep,
                selectedTask
              );
              changedTask.start = dateByX(
                newMoveX1,
                selectedTask.x1,
                selectedTask.start,
                xStep,
                timeStep
              );
              changedTask.end = dateByX(
                newMoveX2,
                selectedTask.x2,
                selectedTask.end,
                xStep,
                timeStep
              );
              changedTask.x1 = newMoveX1;
              changedTask.x2 = newMoveX2;
              break;
          }
          //Update internal state
          setBarTasks(
            barTasks.map(t => (t.id === changedTask.id ? changedTask : t))
          );
          setSelectedTask(changedTask);
          break;
        }
        //On finish Event
        case 'mouseup': {
          let eventForExecution: (
            task: Task
          ) => void | Promise<void> = () => {};
          switch (barEvent) {
            case 'progress':
              changedTask.progress = progressByX(event.offsetX, selectedTask);
              if (onProgressChange) {
                eventForExecution = onProgressChange;
              }
              break;
            case 'start':
              const newX1 = startByX(event.offsetX, xStep, selectedTask);
              changedTask.start = dateByX(
                newX1,
                selectedTask.x1,
                selectedTask.start,
                xStep,
                timeStep
              );
              if (onDateChange && newX1 !== selectedTask.x1) {
                eventForExecution = onDateChange;
              }
              break;
            case 'end':
              const newX2 = endByX(event.offsetX, xStep, selectedTask);
              changedTask.end = dateByX(
                newX2,
                selectedTask.x2,
                selectedTask.end,
                xStep,
                timeStep
              );

              if (onDateChange && newX2 !== selectedTask.x2) {
                eventForExecution = onDateChange;
              }
              break;
            case 'move':
              const [newMoveX1, newMoveX2] = moveByX(
                event.offsetX - initEventX1Delta,
                xStep,
                selectedTask
              );
              changedTask.start = dateByX(
                newMoveX1,
                selectedTask.x1,
                selectedTask.start,
                xStep,
                timeStep
              );
              changedTask.end = dateByX(
                newMoveX2,
                selectedTask.x2,
                selectedTask.end,
                xStep,
                timeStep
              );
              if (
                onDateChange &&
                newMoveX1 !== selectedTask.x1 &&
                newMoveX2 !== selectedTask.x2
              ) {
                eventForExecution = onDateChange;
              }
              break;
          }

          setBarEvent('');
          setSelectedTask(null);
          setIsSVGListen(false);
          svg.current?.removeEventListener(
            'mousemove',
            handleMouseSVGChangeEventsSubscribe
          );
          svg.current?.removeEventListener(
            'mouseup',
            handleMouseSVGChangeEventsSubscribe
          );

          //If update successful - update Gantt state, otherwise we shell back old Bar state
          await eventForExecution(changedTask);
          break;
        }
      }
    };

    if (selectedTask && barEvent && !isSVGListen) {
      svg.current?.addEventListener(
        'mousemove',
        handleMouseSVGChangeEventsSubscribe
      );
      svg.current?.addEventListener(
        'mouseup',
        handleMouseSVGChangeEventsSubscribe
      );
      setIsSVGListen(true);
    }
  }, [
    barEvent,
    selectedTask,
    xStep,
    svg,
    initEventX1Delta,
    barTasks,
    onProgressChange,
    timeStep,
    onDateChange,
    isSVGListen,
  ]);

  /**
   * Method is Start point of task change
   * @param event init mouse event
   * @param eventType
   * @param task events task
   */
  const handleMouseEvents = (
    event:
      | React.MouseEvent<SVGPolygonElement, MouseEvent>
      | React.MouseEvent<SVGRectElement, MouseEvent>
      | React.MouseEvent<SVGGElement, MouseEvent>,
    eventType: BarEvent,
    task: BarTask
  ) => {
    switch (event.type) {
      case 'mousedown':
        setBarEvent(eventType);
        setSelectedTask(task);
        setInitEventX1Delta(event.nativeEvent.offsetX - task.x1);
        event.stopPropagation();
        break;
      case 'mouseleave':
        if (!barEvent) setSelectedTask(null);
        break;
      case 'mouseenter':
        if (!selectedTask) {
          setSelectedTask(task);
        }
        break;
    }
  };

  /**
   * Method handles Bar keyboard events
   * @param event
   * @param task
   */
  const handleButtonSVGEvents = async (
    event: React.KeyboardEvent<SVGGElement>,
    task: BarTask
  ) => {
    if (task.isDisabled) return;
    switch (event.key) {
      case 'Delete': {
        if (onTaskDelete) {
          onTaskDelete(task);
        }
        break;
      }
    }
  };

  return (
    <>
      <g className="arrow" fill={arrowColor} stroke={arrowColor}>
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
              onDoubleClick={onDoubleClick}
              isDateChangeable={!!onDateChange && !task.isDisabled}
              handleMouseEvents={handleMouseEvents}
              handleButtonSVGEvents={handleButtonSVGEvents}
              key={task.id}
            />
          );
        })}
      </g>
      <g className="toolTip">
        {selectedTask && barEvent !== 'end' && barEvent !== 'start' && (
          <Tooltip
            x={selectedTask.x2 + columnWidth + arrowIndent}
            y={selectedTask.y + rowHeight}
            task={selectedTask}
            fontFamily={fontFamily}
            fontSize={fontSize}
            getTooltipContent={getTooltipContent}
          />
        )}
      </g>
    </>
  );
};
