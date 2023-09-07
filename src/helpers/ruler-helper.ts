import { BarMoveAction } from "../types/gantt-task-actions";
import { rulerLine } from "../types/public-types";
import { rulerTask } from "../types/ruler";

const moveByX = (x: number, xStep: number, task: rulerTask) => {
  const steps = Math.round((x - task.x1) / xStep);
  const additionalXValue = steps * xStep;
  const newX1 = task.x1 + additionalXValue;
  const newX2 = newX1 + task.x2 - task.x1;
  return [newX1, newX2];
};

const dateByX = (
  x: number,
  taskX: number,
  taskDate: Date,
  xStep: number,
  timeStep: number
) => {
  let newDate = new Date(((x - taskX) / xStep) * timeStep + taskDate.getTime());
  newDate = new Date(
    newDate.getTime() +
      (newDate.getTimezoneOffset() - taskDate.getTimezoneOffset()) * 60000
  );
  return newDate;
};

const handleTaskBySVGMouseEventForRuler = (
  svgX: number,
  action: BarMoveAction,
  selectedTask: rulerTask,
  xStep: number,
  timeStep: number,
  initEventX1Delta: number
): { isChanged: boolean; changedTask: rulerTask } => {
  const changedTask: rulerTask = { ...selectedTask };
  let isChanged = false;
  switch (action) {
    case "move": {
      const [newMoveX1, newMoveX2] = moveByX(
        svgX - initEventX1Delta,
        xStep,
        selectedTask
      );
      isChanged = newMoveX1 !== selectedTask.x1;
      if (isChanged) {
        changedTask.start = dateByX(
          newMoveX1,
          selectedTask.x1,
          selectedTask.start,
          xStep,
          timeStep
        );
        changedTask.end = changedTask.start;
        changedTask.x1 = newMoveX1;
        changedTask.x2 = newMoveX2;
      }
    }
  }
  return { isChanged, changedTask };
};

export const handleTaskBySVGMouseRulerEvent = (
  svgX: number,
  action: BarMoveAction,
  selectedTask: rulerTask,
  xStep: number,
  timeStep: number,
  initEventX1Delta: number,
): { isChanged: boolean; changedTask: rulerTask } => {
  let result: { isChanged: boolean; changedTask: rulerTask } =
    handleTaskBySVGMouseEventForRuler(
      svgX,
      action,
      selectedTask,
      xStep,
      timeStep,
      initEventX1Delta
    );
  return result;
};

export const taskXCoordinate = (
  xDate: Date,
  dates: Date[],
  columnWidth: number
) => {
  const index =
    dates.findIndex(d => {
      return d.getTime() >= xDate.getTime();
    }) - 1;

  const remainderMillis = xDate.getTime() - dates[index].getTime();
  const percentOfInterval =
    remainderMillis / (dates[index + 1].getTime() - dates[index].getTime());
  const x = index * columnWidth + percentOfInterval * columnWidth;
  return x;
};

export const convertToRulerLine = (
  rulerLines: rulerLine[],
  dates: Date[],
  columnWidth: number,
  taskHeight: number
) => {
  let rulerLinesData = rulerLines.map((ruler, index) => {
    return convertToRuler(ruler, index, dates, columnWidth, taskHeight);
  });
  return rulerLinesData;
};

export const convertToRuler = (
  rulerLine: rulerLine,
  index: number,
  dates: Date[],
  columnWidth: number,
  taskHeight: number
): rulerTask => {
  const x = taskXCoordinate(rulerLine.start, dates, columnWidth);
  const x1 = x - taskHeight * 0.5;
  const x2 = x + taskHeight * 0.5;

  return {
    ...rulerLine,
    index,
    end: rulerLine.start,
    x,
    x1,
    x2,
  };
};
