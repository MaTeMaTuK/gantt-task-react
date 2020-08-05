import { Task } from "../types/public-types";
import { BarTask } from "../types/bar-task";

export const convertToBarTasks = (
  tasks: Task[],
  dates: Date[],
  dateDelta: number,
  columnWidth: number,
  rowHeight: number,
  taskHeight: number,
  headerHeight: number,
  barCornerRadius: number,
  handleWidth: number,
  barProgressColor: string,
  barProgressSelectedColor: string,
  barBackgroundColor: string,
  barBackgroundSelectedColor: string
) => {
  let barTasks = tasks.map((t, i) => {
    return convertToBarTask(
      t,
      i,
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
    );
  });

  barTasks = barTasks.map((task, i) => {
    const dependencies = task.dependencies || [];
    for (let j = 0; j < dependencies.length; j++) {
      const dependence = barTasks.findIndex(
        value => value.id === dependencies[j]
      );
      if (dependence !== -1) barTasks[dependence].barChildren.push(i);
    }
    return task;
  });

  return barTasks;
};

export const convertToBarTask = (
  task: Task,
  index: number,
  dates: Date[],
  dateDelta: number,
  columnWidth: number,
  rowHeight: number,
  taskHeight: number,
  headerHeight: number,
  barCornerRadius: number,
  handleWidth: number,
  barProgressColor: string,
  barProgressSelectedColor: string,
  barBackgroundColor: string,
  barBackgroundSelectedColor: string
): BarTask => {
  const x1 = taskXCoordinate(task.start, dates, dateDelta, columnWidth);
  const x2 = taskXCoordinate(task.end, dates, dateDelta, columnWidth);
  const y = taskYCoordinate(index, rowHeight, taskHeight, headerHeight);
  const styles = {
    backgroundColor: barBackgroundColor,
    backgroundSelectedColor: barBackgroundSelectedColor,
    progressColor: barProgressColor,
    progressSelectedColor: barProgressSelectedColor,
    ...task.styles,
  };
  return {
    ...task,
    x1,
    x2,
    y,
    index,
    barCornerRadius,
    handleWidth,
    height: taskHeight,
    barChildren: [],
    styles,
  };
};

export const taskXCoordinate = (
  xDate: Date,
  dates: Date[],
  dateDelta: number,
  columnWidth: number
) => {
  const index = ~~(
    (xDate.getTime() -
      dates[0].getTime() +
      xDate.getTimezoneOffset() -
      dates[0].getTimezoneOffset()) /
    dateDelta
  );
  const x = Math.round(
    (index +
      (xDate.getTime() -
        dates[index].getTime() -
        xDate.getTimezoneOffset() * 60 * 1000 +
        dates[index].getTimezoneOffset() * 60 * 1000) /
        dateDelta) *
      columnWidth
  );
  return x;
};

export const taskYCoordinate = (
  index: number,
  rowHeight: number,
  taskHeight: number,
  headerHeight: number
) => {
  const y = index * rowHeight + headerHeight + (rowHeight - taskHeight) / 2;
  return y;
};

export const progressWithByParams = (
  taskX1: number,
  taskX2: number,
  progress: number
) => {
  return (taskX2 - taskX1) * progress * 0.01;
};

export const progressByProgressWidth = (
  progressWidth: number,
  barTask: BarTask
) => {
  const barWidth = barTask.x2 - barTask.x1;
  const progressPercent = Math.round((progressWidth * 100) / barWidth);
  if (progressPercent >= 100) return 100;
  else if (progressPercent <= 0) return 0;
  else {
    return progressPercent;
  }
};

export const progressByX = (x: number, task: BarTask) => {
  if (x >= task.x2) return 100;
  else if (x <= task.x1) return 0;
  else {
    const barWidth = task.x2 - task.x1;
    const progressPercent = Math.round(((x - task.x1) * 100) / barWidth);
    return progressPercent;
  }
};

export const getProgressPoint = (
  progressX: number,
  taskY: number,
  taskHeight: number
) => {
  const point = [
    progressX - 5,
    taskY + taskHeight,
    progressX + 5,
    taskY + taskHeight,
    progressX,
    taskY + taskHeight - 8.66,
  ];
  return point.join(",");
};

export const startByX = (x: number, xStep: number, task: BarTask) => {
  if (x >= task.x2 - task.handleWidth * 2) {
    x = task.x2 - task.handleWidth * 2;
  }
  const steps = Math.round((x - task.x1) / xStep);
  const additionalXValue = steps * xStep;
  const newX = task.x1 + additionalXValue;
  return newX;
};

export const endByX = (x: number, xStep: number, task: BarTask) => {
  if (x <= task.x1 + task.handleWidth * 2) {
    x = task.x1 + task.handleWidth * 2;
  }
  const steps = Math.round((x - task.x2) / xStep);
  const additionalXValue = steps * xStep;
  const newX = task.x2 + additionalXValue;
  return newX;
};

export const moveByX = (x: number, xStep: number, task: BarTask) => {
  const steps = Math.round((x - task.x1) / xStep);
  const additionalXValue = steps * xStep;
  const newX1 = task.x1 + additionalXValue;
  const newX2 = newX1 + task.x2 - task.x1;
  return [newX1, newX2];
};

export const dateByX = (
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
