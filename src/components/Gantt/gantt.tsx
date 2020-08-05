import React, { useRef } from "react";
import { ViewMode, GanttProps } from "../../types/public-types";
import { Grid, GridProps } from "../Grid/grid";
import { Calendar, CalendarProps } from "../Calendar/calendar";
import { GanttContent, GanttContentProps } from "./gantt-content";
import { ganttDateRange, seedDates } from "../../helpers/date-helper";

export const Gantt: React.SFC<GanttProps> = ({
  tasks,
  headerHeight = 50,
  columnWidth = 60,
  rowHeight = 50,
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
  onDateChange,
  onProgressChange,
  onDoubleClick,
  onTaskDelete,
  getTooltipContent,
}) => {
  const [startDate, endDate] = ganttDateRange(tasks, viewMode);
  const dates = seedDates(startDate, endDate, viewMode);
  const svg = useRef<SVGSVGElement | null>(null);

  const gridProps: GridProps = {
    columnWidth,
    gridWidth: dates.length * columnWidth,
    tasks,
    rowHeight,
    headerHeight,
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
  const barProps: GanttContentProps = {
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
    timeStep,
    arrowColor,
    svg,
    fontFamily,
    fontSize,
    arrowIndent,
    onDateChange,
    onProgressChange,
    onDoubleClick,
    onTaskDelete,
    getTooltipContent,
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={columnWidth * dates.length}
      height={headerHeight + rowHeight * tasks.length}
      ref={svg}
      fontFamily={fontFamily}
    >
      <Grid {...gridProps} />
      <Calendar {...calendarProps} />
      <GanttContent {...barProps} />
    </svg>
  );
};
