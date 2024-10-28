import { Task } from "../types/public-types";
import { BarSection, BarTask, TaskTypeInternal } from "../types/bar-task";
import { BarMoveAction } from "../types/gantt-task-actions";

export const convertToBarTasks = (
  tasks: Task[],
  dates: Date[],
  columnWidth: number,
  rowHeight: number,
  taskHeight: number,
  barCornerRadius: number,
  handleWidth: number,
  barBackgroundColor: string,
  barBackgroundSelectedColor: string,
  providerBackgroundColor: string,
  providerBackgroundSelectedColor: string,
  milestoneBackgroundColor: string,
  milestoneBackgroundSelectedColor: string,
  greenBarColor: string,
  yellowBarColor: string,
  redBarColor: string,
  dictationBarColor: string,
  liveCallBarColor: string,
  redTeamBarColor: string
) => {
  let barTasks = tasks.map((t, i) => {
    return convertToBarTask(
      t,
      i,
      dates,
      columnWidth,
      rowHeight,
      taskHeight,
      barCornerRadius,
      handleWidth,
      barBackgroundColor,
      barBackgroundSelectedColor,
      providerBackgroundColor,
      providerBackgroundSelectedColor,
      milestoneBackgroundColor,
      milestoneBackgroundSelectedColor,
      greenBarColor,
      yellowBarColor,
      redBarColor,
      dictationBarColor,
      liveCallBarColor,
      redTeamBarColor
    );
  });

  // set dependencies
  barTasks = barTasks.map(task => {
    const dependencies: string[] = [];
    for (let j = 0; j < dependencies.length; j++) {
      const dependence = barTasks.findIndex(
        value => value.id === dependencies[j]
      );
      if (dependence !== -1) barTasks[dependence].barChildren.push(task);
    }
    return task;
  });

  return barTasks;
};

const convertToBarTask = (
  task: Task,
  index: number,
  dates: Date[],
  columnWidth: number,
  rowHeight: number,
  taskHeight: number,
  barCornerRadius: number,
  handleWidth: number,
  barBackgroundColor: string,
  barBackgroundSelectedColor: string,
  providerBackgroundColor: string,
  providerBackgroundSelectedColor: string,
  milestoneBackgroundColor: string,
  milestoneBackgroundSelectedColor: string,
  greenBarColor: string,
  yellowBarColor: string,
  redBarColor: string,
  dictationBarColor: string,
  liveCallBarColor: string,
  redTeamBarColor: string
): BarTask => {
  let barTask: BarTask;
  switch (task.type) {
    case "milestone":
      barTask = convertToMilestone(
        task,
        index,
        dates,
        columnWidth,
        rowHeight,
        taskHeight,
        barCornerRadius,
        handleWidth,
        milestoneBackgroundColor,
        milestoneBackgroundSelectedColor
      );
      break;
    case "provider":
      barTask = convertToBar(
        task,
        index,
        dates,
        columnWidth,
        rowHeight,
        taskHeight,
        barCornerRadius,
        handleWidth,
        providerBackgroundColor,
        providerBackgroundSelectedColor,
        greenBarColor,
        yellowBarColor,
        redBarColor,
        dictationBarColor,
        liveCallBarColor,
        redTeamBarColor
      );
      break;
    default:
      barTask = convertToBar(
        task,
        index,
        dates,
        columnWidth,
        rowHeight,
        taskHeight,
        barCornerRadius,
        handleWidth,
        barBackgroundColor,
        barBackgroundSelectedColor,
        greenBarColor,
        yellowBarColor,
        redBarColor,
        dictationBarColor,
        liveCallBarColor,
        redTeamBarColor
      );
      break;
  }
  return barTask;
};

const convertToBar = (
  task: Task,
  index: number,
  dates: Date[],
  columnWidth: number,
  rowHeight: number,
  taskHeight: number,
  barCornerRadius: number,
  handleWidth: number,
  barBackgroundColor: string,
  barBackgroundSelectedColor: string,
  greenBarColor: string,
  yellowBarColor: string,
  redBarColor: string,
  dictationBarColor: string,
  liveCallBarColor: string,
  redTeamBarColor: string
): BarTask => {
  let x1: number;
  let x2: number;
  let x3: number;
  let x4: number;

  let barSections: BarSection[] = [];

  if (task.sections) {
    let currentSectionIndex = 0;
    const sectionsLength = task.sections.length;
    let totalBarSectionCount = 0;
    for (const section of task.sections) {
      const x1 = taskXCoordinate(section.start, dates, columnWidth);
      const x2 = taskXCoordinate(section.end, dates, columnWidth);
      const y = taskYCoordinate(index, rowHeight, taskHeight);
      const height = taskHeight;
      barSections.push({
        sectionIndex: totalBarSectionCount,
        sectionType: "task",
        x1,
        x2,
        y,
        height,
        barCornerRadius,
      });
      totalBarSectionCount++;
      if (currentSectionIndex < sectionsLength - 1) {
        barSections.push({
          sectionIndex: totalBarSectionCount,
          sectionType: "gap",
          x1: x2,
          x2: taskXCoordinate(
            task.sections[currentSectionIndex + 1].start,
            dates,
            columnWidth
          ),
          y,
          height,
          barCornerRadius,
        });
        totalBarSectionCount++;
      }
      currentSectionIndex++;
    }
  }

  x1 = taskXCoordinate(task.start, dates, columnWidth);
  x2 = taskXCoordinate(task.end, dates, columnWidth);
  if (task.transcriptionStart) {
    x3 = taskXCoordinate(task.transcriptionStart, dates, columnWidth);
  } else {
    x3 = -1;
  }
  if (task.transcriptionEnd) {
    x4 = taskXCoordinate(task.transcriptionEnd, dates, columnWidth);
  } else {
    x4 = -1;
  }
  let typeInternal: TaskTypeInternal = task.type;
  // if (typeInternal === "task" && x2 - x1 < handleWidth * 2) {
  //   typeInternal = "smalltask";
  //   x2 = x1 + handleWidth * 2;
  // }

  const y = taskYCoordinate(index, rowHeight, taskHeight);
  const hideChildren = task.type === "provider" ? task.hideChildren : undefined;

  const styles = {
    backgroundColor: barBackgroundColor,
    backgroundSelectedColor: barBackgroundSelectedColor,
    greenColor: greenBarColor,
    yellowColor: yellowBarColor,
    redColor: redBarColor,
    dictationBarColor: dictationBarColor,
    liveCallBarColor: liveCallBarColor,
    redTeamBarColor: redTeamBarColor,
    ...task.styles,
  };
  return {
    ...task,
    typeInternal,
    x1,
    x2,
    x3,
    x4,
    y,
    index,
    barCornerRadius,
    handleWidth,
    hideChildren,
    height: taskHeight,
    barChildren: [],
    barSections,
    styles,
  };
};

const convertToMilestone = (
  task: Task,
  index: number,
  dates: Date[],
  columnWidth: number,
  rowHeight: number,
  taskHeight: number,
  barCornerRadius: number,
  handleWidth: number,
  milestoneBackgroundColor: string,
  milestoneBackgroundSelectedColor: string
): BarTask => {
  const x = taskXCoordinate(task.start, dates, columnWidth);
  const y = taskYCoordinate(index, rowHeight, taskHeight);

  const x1 = x - taskHeight * 0.5;
  const x2 = x + taskHeight * 0.5;

  const rotatedHeight = taskHeight / 1.414;
  const styles = {
    backgroundColor: milestoneBackgroundColor,
    backgroundSelectedColor: milestoneBackgroundSelectedColor,
    ...task.styles,
  };
  return {
    ...task,
    end: task.start,
    x1,
    x2,
    y,
    index,
    barCornerRadius,
    handleWidth,
    typeInternal: task.type,
    height: rotatedHeight,
    hideChildren: undefined,
    barChildren: [],
    styles,
  };
};

const taskXCoordinate = (xDate: Date, dates: Date[], columnWidth: number) => {
  const index = dates.findIndex(d => d.getTime() >= xDate.getTime()) - 1;

  const remainderMillis = xDate.getTime() - dates[index].getTime();
  const percentOfInterval =
    remainderMillis / (dates[index + 1].getTime() - dates[index].getTime());
  const x = index * columnWidth + percentOfInterval * columnWidth;
  return x;
};

const taskYCoordinate = (
  index: number,
  rowHeight: number,
  taskHeight: number
) => {
  const y = index * rowHeight + (rowHeight - taskHeight) / 2;
  return y;
};

export const progressWithByParams = (
  taskX1: number,
  taskX2: number,
  progress: number,
  rtl: boolean
) => {
  const progressWidth = (taskX2 - taskX1) * progress * 0.01;
  let progressX: number;
  if (rtl) {
    progressX = taskX2 - progressWidth;
  } else {
    progressX = taskX1;
  }
  return [progressWidth, progressX];
};

export const progressByProgressWidth = (
  progressWidth: number,
  barTask: BarTask
) => {
  const barWidth = barTask.x2 - barTask.x1;
  const progressPercent = Math.round((progressWidth * 100) / barWidth);
  if (progressPercent >= 100) return 100;
  else if (progressPercent <= 0) return 0;
  else return progressPercent;
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

const startByX = (x: number, xStep: number, task: BarTask) => {
  if (x >= task.x2 - task.handleWidth * 2) {
    x = task.x2 - task.handleWidth * 2;
  }
  const steps = Math.round((x - task.x1) / xStep);
  const additionalXValue = steps * xStep;
  const newX = task.x1 + additionalXValue;
  return newX;
};

const endByX = (x: number, xStep: number, task: BarTask) => {
  if (x <= task.x1 + task.handleWidth * 2) {
    x = task.x1 + task.handleWidth * 2;
  }
  const steps = Math.round((x - task.x2) / xStep);
  const additionalXValue = steps * xStep;
  const newX = task.x2 + additionalXValue;
  return newX;
};

const moveByX = (x: number, xStep: number, task: BarTask) => {
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

/**
 * Method handles event in real time(mousemove) and on finish(mouseup)
 */
export const handleTaskBySVGMouseEvent = (
  svgX: number,
  action: BarMoveAction,
  selectedTask: BarTask,
  xStep: number,
  timeStep: number,
  initEventX1Delta: number
): { isChanged: boolean; changedTask: BarTask } => {
  let result: { isChanged: boolean; changedTask: BarTask };
  switch (selectedTask.type) {
    case "milestone":
      result = handleTaskBySVGMouseEventForMilestone(
        svgX,
        action,
        selectedTask,
        xStep,
        timeStep,
        initEventX1Delta
      );
      break;
    default:
      result = handleTaskBySVGMouseEventForBar(
        svgX,
        action,
        selectedTask,
        xStep,
        timeStep,
        initEventX1Delta
      );
      break;
  }
  return result;
};

const handleTaskBySVGMouseEventForBar = (
  svgX: number,
  action: BarMoveAction,
  selectedTask: BarTask,
  xStep: number,
  timeStep: number,
  initEventX1Delta: number
): { isChanged: boolean; changedTask: BarTask } => {
  const changedTask: BarTask = { ...selectedTask };
  let isChanged = false;
  switch (action) {
    case "start": {
      const newX1 = startByX(svgX, xStep, selectedTask);
      changedTask.x1 = newX1;
      isChanged = changedTask.x1 !== selectedTask.x1;
      if (isChanged) {
        changedTask.start = dateByX(
          newX1,
          selectedTask.x1,
          selectedTask.start,
          xStep,
          timeStep
        );
      }
      break;
    }
    case "end": {
      const newX2 = endByX(svgX, xStep, selectedTask);
      changedTask.x2 = newX2;
      isChanged = changedTask.x2 !== selectedTask.x2;
      if (isChanged) {
        changedTask.end = dateByX(
          newX2,
          selectedTask.x2,
          selectedTask.end,
          xStep,
          timeStep
        );
      }
      break;
    }
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
        changedTask.end = dateByX(
          newMoveX2,
          selectedTask.x2,
          selectedTask.end,
          xStep,
          timeStep
        );
        changedTask.x1 = newMoveX1;
        changedTask.x2 = newMoveX2;
      }
      break;
    }
  }
  return { isChanged, changedTask };
};

const handleTaskBySVGMouseEventForMilestone = (
  svgX: number,
  action: BarMoveAction,
  selectedTask: BarTask,
  xStep: number,
  timeStep: number,
  initEventX1Delta: number
): { isChanged: boolean; changedTask: BarTask } => {
  const changedTask: BarTask = { ...selectedTask };
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
      break;
    }
  }
  return { isChanged, changedTask };
};
