import React, { ReactChild } from 'react';
import { Task } from '../../types/public-types';
import { addToDate } from '../../helpers/date-helper';
import '../../style.css';

export type GridBodyProps = {
  tasks: Task[];
  dates: Date[];
  gridWidth: number;
  rowHeight: number;
  headerHeight: number;
  columnWidth: number;
  todayColor: string;
};
export const GridBody: React.FC<GridBodyProps> = ({
  tasks,
  dates,
  rowHeight,
  headerHeight,
  gridWidth,
  columnWidth,
  todayColor,
}) => {
  let y = headerHeight;
  let gridRows: ReactChild[] = [];
  let rowLines: ReactChild[] = [];
  for (const task of tasks) {
    gridRows.push(
      <rect
        key={'Row' + task.id}
        x="0"
        y={y}
        width={gridWidth}
        height={rowHeight}
        className="GanttGrid-row"
      ></rect>
    );
    rowLines.push(
      <line
        key={'RowLine' + task.id}
        x="0"
        y1={y + rowHeight}
        x2={gridWidth}
        y2={y + rowHeight}
        className="GanttGrid-rowLine"
      ></line>
    );
    y += rowHeight;
  }

  const now = new Date();
  let tickX = 0;
  let ticks: ReactChild[] = [];
  let today: ReactChild = <></>;
  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    ticks.push(
      <line
        key={date.getTime()}
        x1={tickX}
        y1={headerHeight}
        x2={tickX}
        y2={y}
        className="GanttGrid-tick"
      ></line>
    );
    if (
      (i + 1 !== dates.length &&
        date.getTime() < now.getTime() &&
        dates[i + 1].getTime() >= now.getTime()) ||
      //if current date is last
      (i !== 0 &&
        i + 1 === dates.length &&
        date.getTime() < now.getTime() &&
        addToDate(
          date,
          date.getTime() - dates[i - 1].getTime(),
          'millisecond'
        ).getTime() >= now.getTime())
    ) {
      today = (
        <rect
          x={tickX}
          y={0}
          width={columnWidth}
          height={y}
          fill={todayColor}
        ></rect>
      );
    }
    tickX += columnWidth;
  }
  return (
    <>
      <g className="rows">{gridRows}</g>
      <g className="rowLines">{rowLines}</g>
      <g className="ticks">{ticks}</g>
      <g className="today">{today}</g>
    </>
  );
};
