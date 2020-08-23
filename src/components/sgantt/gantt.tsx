import React, { useState, SyntheticEvent } from "react";
import { ViewMode, GanttProps, Task } from "../../types/public-types";
import { GridProps } from "../grid/grid";
import { ganttDateRange, seedDates } from "../../helpers/date-helper";
import { CalendarProps } from "../calendar/calendar";
import { TaskGanttContentProps } from "./task-gantt-content";
import { TaskListHeaderDefault } from "../task-list/task-list-header";
import { TaskListTableDefault } from "../task-list/task-list-table";
import { StandardTooltipContent } from "../other/tooltip";
import { Scroll } from "../other/scroll";
import { TaskListProps, TaskList } from "../task-list/task-list";
import styles from "./gantt.module.css";
import { TaskGantt } from "./task-gantt";

export const Gantt: React.SFC<GanttProps> = ({
  tasks,
  headerHeight = 50,
  columnWidth = 60,
  listCellWidth = "150px",
  rowHeight = 50,
  ganttHeight = 0,
  viewMode = ViewMode.Day,
  locale = "en-GB",
  barFill = 60,
  barCornerRadius = 3,
  barProgressColor = "#a3a3ff",
  barProgressSelectedColor = "#8282f5",
  barBackgroundColor = "#b8c2cc",
  barBackgroundSelectedColor = "#aeb8c2",
  handleWidth = 8,
  timeStep = 300000,
  arrowColor = "grey",
  fontFamily = "Arial, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue",
  fontSize = "14px",
  arrowIndent = 20,
  todayColor = "rgba(252, 248, 227, 0.5)",
  TooltipContent = StandardTooltipContent,
  TaskListHeader = TaskListHeaderDefault,
  TaskListTable = TaskListTableDefault,
  onDateChange,
  onProgressChange,
  onDoubleClick,
  onTaskDelete,
}) => {
  const [ganttTasks, setGanttTasks] = useState<Task[]>(tasks);
  const [scroll, setScroll] = useState(0);

  const [startDate, endDate] = ganttDateRange(ganttTasks, viewMode);
  const dates = seedDates(startDate, endDate, viewMode);

  const svgHeight = rowHeight * tasks.length;
  const gridWidth = dates.length * columnWidth;

  const onTasksDateChange = (tasks: Task[]) => {
    setGanttTasks(tasks);
  };

  const handleScroll = (event: SyntheticEvent<HTMLDivElement>) => {
    setScroll(event.currentTarget.scrollTop);
  };

  const gridProps: GridProps = {
    columnWidth,
    gridWidth,
    tasks: ganttTasks,
    rowHeight,
    dates,
    todayColor,
  };
  const calendarProps: CalendarProps = {
    dates,
    locale,
    viewMode,
    headerHeight,
    columnWidth,
    fontFamily,
    fontSize,
  };
  const barProps: TaskGanttContentProps = {
    tasks: ganttTasks,
    rowHeight,
    barCornerRadius,
    columnWidth,
    dates,
    barFill,
    barProgressColor,
    barProgressSelectedColor,
    barBackgroundColor,
    barBackgroundSelectedColor,
    handleWidth,
    arrowColor,
    timeStep,
    fontFamily,
    fontSize,
    arrowIndent,
    svgHeight,
    onTasksDateChange: onTasksDateChange,
    onDateChange,
    onProgressChange,
    onDoubleClick,
    onTaskDelete,
    TooltipContent,
  };

  const tableProps: TaskListProps = {
    rowHeight,
    rowWidth: listCellWidth,
    fontFamily,
    fontSize,
    tasks: ganttTasks,
    locale,
    headerHeight,
    scroll,
    ganttHeight,
    horizontalContainerClass: styles.horizontalContainer,
    TaskListHeader,
    TaskListTable,
  };

  return (
    <div className={styles.wrapper}>
      {listCellWidth && <TaskList {...tableProps} />}
      <TaskGantt
        gridProps={gridProps}
        calendarProps={calendarProps}
        barProps={barProps}
        ganttHeight={ganttHeight}
        scroll={scroll}
      />
      <Scroll
        ganttFullHeight={ganttTasks.length * rowHeight}
        ganttHeight={ganttHeight}
        headerHeight={headerHeight}
        onScroll={handleScroll}
      />
    </div>
  );
};
