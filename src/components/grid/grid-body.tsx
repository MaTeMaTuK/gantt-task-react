import React, { ReactChild } from "react";
import { Task, ViewMode } from "../../types/public-types";
import { addToDate } from "../../helpers/date-helper";
import styles from "./grid.module.css";
// import { GanttContext } from "../../contsxt";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
dayjs.extend(weekday);
export type GridBodyProps = {
  tasks: Task[];
  dates: Date[];
  svgWidth: number;
  rowHeight: number;
  columnWidth: number;
  todayColor: string;
  viewMode?: string;
};
// 判断是否为周末
export const isRestDay = (date: Date) => {
  return [0, 6].includes(dayjs(date).weekday());
};
export const GridBody: React.FC<GridBodyProps> = ({
  tasks,
  dates,
  rowHeight,
  svgWidth,
  columnWidth,
  todayColor,
  viewMode,
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
  let today: ReactChild = <rect />;
  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    ticks.push(
      <g>
        <line
          key={date.getTime()}
          x1={tickX}
          y1={0}
          x2={tickX}
          y2={y}
          className={styles.gridTick}
        />
        {isRestDay(date) && viewMode === ViewMode.Day && (
          <rect
            key={date.getTime() + date.getTime()}
            x={tickX + 1}
            y="0"
            width={columnWidth - 1}
            height={y}
            className={styles.gridTickWeekday}
          />
        )}
      </g>
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
      // 当天的零点的时间戳（毫秒）
      const currentStamp = new Date(new Date().toLocaleDateString()).getTime();
      // 当天和上一个时间的差
      const currentMinus =
        (currentStamp + 86400000 - dates[i].getTime()) / 86400000;
      // 前后时间差
      const totalMinus =
        (dates[i + 1].getTime() - dates[i].getTime()) / 86400000;

      const newTickX =
        tickX +
        columnWidth * (currentMinus / totalMinus) -
        columnWidth / totalMinus / 2;
      //解决render报错的问题
      // setTimeout(() => {
      //   setTodayDistance(newTickX);
      // }, 0);
      today = (
        <g>
          {/* <rect
            x={tickX}
            y={0}
            width={columnWidth}
            height={y}
            fill={todayColor}
          /> */}
          <circle
            cx={newTickX}
            cy="15"
            r="15"
            stroke="black"
            strokeWidth="0"
            fill={todayColor}
          />
          <text
            x={newTickX - 10}
            y={15 + 2.5}
            style={{ fontSize: "10px", fill: "#fff" }}
          >
            今日
          </text>
          <line
            x1={newTickX}
            y1="0"
            x2={newTickX}
            y2="500"
            style={{ stroke: todayColor, strokeWidth: "1" }}
          />
        </g>
      );
    }
    tickX += columnWidth;
  }
  return (
    <g className="gridBody">
      {/* <g className="rows">{gridRows}</g>
      <g className="rowLines">{rowLines}</g> */}
      <g className="ticks">{ticks}</g>
      <g className="today">{today}</g>
    </g>
  );
};
