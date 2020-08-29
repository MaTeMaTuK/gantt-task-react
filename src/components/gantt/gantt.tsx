import React, { useState, SyntheticEvent, useRef, useEffect } from "react";
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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [ganttTasks, setGanttTasks] = useState<Task[]>(tasks);
  const [scrollY, setScrollY] = useState(0);
  const [scrollX, setScrollX] = useState(0);
  const [ignoreScrollEvent, setIgnoreScrollEvent] = useState(false);
  const [startDate, endDate] = ganttDateRange(ganttTasks, viewMode);
  const dates = seedDates(startDate, endDate, viewMode);

  const svgHeight = rowHeight * tasks.length;
  const gridWidth = dates.length * columnWidth;
  const ganttFullHeight = ganttTasks.length * rowHeight;

  // scroll events
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const newScrollY = scrollY + event.deltaY;
      if (newScrollY < 0) {
        setScrollY(0);
      } else if (newScrollY > ganttFullHeight - ganttHeight) {
        setScrollY(ganttFullHeight - ganttHeight);
      } else {
        setScrollY(newScrollY);
      }
      setIgnoreScrollEvent(true);
    };

    // subscribe if scroll is necessary
    if (
      wrapperRef.current &&
      ganttHeight &&
      ganttHeight < ganttTasks.length * rowHeight
    ) {
      wrapperRef.current.addEventListener("wheel", handleWheel, {
        passive: false,
      });
    }
    return () => {
      if (wrapperRef.current) {
        wrapperRef.current.removeEventListener("wheel", handleWheel);
      }
    };
  }, [wrapperRef.current, scrollY, ganttHeight, ganttTasks, rowHeight]);

  const handleScrollY = (event: SyntheticEvent<HTMLDivElement>) => {
    if (scrollY !== event.currentTarget.scrollTop && !ignoreScrollEvent) {
      setScrollY(event.currentTarget.scrollTop);
    }
    setIgnoreScrollEvent(false);
  };

  const handleScrollX = (event: SyntheticEvent<HTMLDivElement>) => {
    if (scrollX !== event.currentTarget.scrollLeft)
      setScrollX(event.currentTarget.scrollLeft);
  };

  /**
   * Handles arrow keys events and transform it to new scroll
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    let newScrollY = scrollY;
    let newScrollX = scrollX;
    let isX = true;
    switch (event.key) {
      case "Down": // IE/Edge specific value
      case "ArrowDown":
        newScrollY += rowHeight;
        isX = false;
        break;
      case "Up": // IE/Edge specific value
      case "ArrowUp":
        newScrollY -= rowHeight;
        isX = false;
        break;
      case "Left":
      case "ArrowLeft":
        newScrollX -= columnWidth;
        break;
      case "Right": // IE/Edge specific value
      case "ArrowRight":
        newScrollX += columnWidth;
        break;
    }
    if (isX) {
      if (newScrollX < 0) {
        setScrollX(0);
      } else if (newScrollX > gridWidth) {
        setScrollX(gridWidth);
      } else {
        setScrollX(newScrollX);
      }
    } else {
      if (newScrollY < 0) {
        setScrollY(0);
      } else if (newScrollY > ganttFullHeight - ganttHeight) {
        setScrollY(ganttFullHeight - ganttHeight);
      } else {
        setScrollY(newScrollY);
      }
    }
    setIgnoreScrollEvent(true);
  };

  // task change event
  const onTasksDateChange = (tasks: Task[]) => {
    setGanttTasks(tasks);
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
    scrollY,
    ganttHeight,
    horizontalContainerClass: styles.horizontalContainer,
    TaskListHeader,
    TaskListTable,
  };

  return (
    <div
      className={styles.wrapper}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      ref={wrapperRef}
    >
      {listCellWidth && <TaskList {...tableProps} />}
      <TaskGantt
        gridProps={gridProps}
        calendarProps={calendarProps}
        barProps={barProps}
        ganttHeight={ganttHeight}
        scrollY={scrollY}
        scrollX={scrollX}
        onScroll={handleScrollX}
      />
      <Scroll
        ganttFullHeight={ganttFullHeight}
        ganttHeight={ganttHeight}
        headerHeight={headerHeight}
        scroll={scrollY}
        onScroll={handleScrollY}
      />
    </div>
  );
};
