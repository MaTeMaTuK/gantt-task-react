import React, { ReactChild } from "react";
import { Task } from "../../types/public-types";
import { addToDate } from "../../helpers/date-helper";
import styles from "./grid.module.css";
import {ViewMode} from '../../types/public-types'

export type GridBodyProps = {
  tasks: Task[];
  dates: Date[];
  svgWidth: number;
  rowHeight: number;
  columnWidth: number;
  todayColor: string;
  rtl: boolean;
  handleTodayTooltip: (clientX:number, clientY:number) => void;
  handleLeaveToday: () => void;
  type?: string;
};
export const GridBody: React.FC<GridBodyProps> = ({
  tasks,
  dates,
  rowHeight,
  svgWidth,
  columnWidth,
  // todayColor,
  rtl,
  handleTodayTooltip,
  handleLeaveToday,
  type
}) => {
  let y = 0;
  const gridRows: ReactChild[] = [];
  const rowLines: ReactChild[] = [
    <line
      key="RowLineFirst"
      x="0"
      y1={0}
      x2={svgWidth}
      y2={0}
      className={styles.gridRowLine}
    />,
  ];
  for (const task of tasks) {
    gridRows.push(
      <rect
        key={"Row" + task.id}
        x="0"
        y={y}
        width={svgWidth}
        height={rowHeight}
        className={styles.gridRow}
      />
    );
    rowLines.push(
      <line
        key={"RowLine" + task.id}
        x="0"
        y1={y + rowHeight}
        x2={svgWidth}
        y2={y + rowHeight}
        className={styles.gridRowLine}
      />
    );
    y += rowHeight;
  }

  const now = new Date();
  let tickX = 0;
  const ticks: ReactChild[] = [];
  // let today: ReactChild = <rect />;
  let weeks: ReactChild[] = [];
  let todayLine: ReactChild = <line />
  let todayLineOffset:number = 0
  switch(type) {
    case ViewMode.Day:
      todayLineOffset = columnWidth/2
      break
    case ViewMode.HalfDay:
      todayLineOffset = 0
      break
    case ViewMode.QuarterDay:
      todayLineOffset = 0
      break
  }
  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    
    ticks.push(
      <line
        key={date.getTime()}
        x1={tickX}
        y1={0}
        x2={tickX}
        y2={y}
        className={styles.gridTick}
      />
    );
    if (
      (i + 1 !== dates.length &&
        date.getTime() < now.getTime() &&
        dates[i + 1].getTime() >= now.getTime()) ||
      // if current date is last
      (i !== 0 &&
        i + 1 === dates.length &&
        date.getTime() < now.getTime() &&
        addToDate(
          date,
          date.getTime() - dates[i - 1].getTime(),
          "millisecond"
        ).getTime() >= now.getTime())
    ) {
      // today = (
      //   <rect
      //     x={tickX}
      //     y={0}
      //     width={columnWidth}
      //     height={y}
      //     fill={todayColor}
      //   />
      // );

      todayLine = (
        <line 
          x1={tickX + todayLineOffset}
          x2 = {tickX + todayLineOffset}
          y1 = '0'
          y2 = {y}
          className={styles.gridRowTodayLine}
        >
        </line>
      )
    }
    // rtl for today
    
    if (
      rtl &&
      i + 1 !== dates.length &&
      date.getTime() >= now.getTime() &&
      dates[i + 1].getTime() < now.getTime()
    ) {
      // today = (
      //   <rect
      //     x={tickX + columnWidth}
      //     y={0}
      //     width={columnWidth}
      //     height={y}
      //     fill={todayColor}
      //   />
      // );
      todayLine = (
        <line
          x1={tickX + todayLineOffset}
          x2 = {tickX + todayLineOffset}
          y1 = '0'
          y2 = {y}
          className={styles.gridRowTodayLine}
        >
        </line>
      )
    }
    if (
      type === ViewMode.Day && (new Date(date).getDay() == 5 || new Date(date).getDay() == 6)
    ) {
      weeks.push(
        <rect
          x={tickX + columnWidth}
          y={0}
          width={columnWidth}
          height={y}
          fill='#f5f5f5'
        />
      );
    }
    if (
      type === ViewMode.HalfDay && (new Date(date).getDay() == 6 || new Date(date).getDay() == 0)
    ) {
      weeks.push(
        <rect
          x={tickX}
          y={0}
          width={columnWidth}
          height={y}
          fill='#f5f5f5'
        />
      );
    }
    if (
      type === ViewMode.QuarterDay && (new Date(date).getDay() == 6 || new Date(date).getDay() == 0)
    ) {
      weeks.push(
        <rect
          x={tickX}
          y={0}
          width={columnWidth}
          height={y}
          fill='#f5f5f5'
        />
      );
    }
    tickX += columnWidth;
  }
  const isShowWeek = type === ViewMode.Day || type === ViewMode.HalfDay || type === ViewMode.QuarterDay
  return (
    <g className="gridBody">
      <g className="rows">{gridRows}</g>
      <g className="rowLines">{rowLines}</g>
      <g className="ticks">{ticks}</g>
      {/* <g className="today">{today}</g> */}
      {isShowWeek && <g className="week">{weeks}</g>}
      {isShowWeek && <g className="todayLine" 
         onMouseOver={(e) => handleTodayTooltip(e.clientX, e.clientY)}
         onMouseLeave={() => handleLeaveToday()}
      >
        {todayLine}
      </g>}
    </g>
  );
};
