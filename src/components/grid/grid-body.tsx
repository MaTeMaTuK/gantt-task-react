import React, { ReactChild, useState } from "react";
import { Task, ViewMode, EventOption } from "../../types/public-types";
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
  scrollX: number;
} & EventOption;
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
  scrollX,
  onDateChange,
}) => {
  const [translateX, setTranslateX] = useState(-500);
  const [translateY, setTranslateY] = useState(-500);
  const [isShow, setIsShow] = useState(false);
  let y = 0;
  const invalidColumn: ReactChild[] = [];
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
  const handleMouseMove = (event: any, index: number) => {
    const pointerX = event.clientX;
    const date = dayjs(
      dates[0].valueOf() + ((pointerX + scrollX) / columnWidth) * 86400000
    );
    const stAmp = date.startOf("day");
    const dateDuring = (stAmp.valueOf() - dates[0].valueOf()) / 86400000;

    setTranslateX(dateDuring * columnWidth);
    setTranslateY(index * rowHeight);
  };
  const handleInvalidColumnMouseMove = (index: number, row: any) => {
    setTranslateY(index * rowHeight);
    setIsShow(!row.start);
  };
  for (let i = 0; i < tasks.length; i++) {
    gridRows.push(
      <rect
        key={"Row" + tasks[i].id}
        x="0"
        y={y}
        width={svgWidth}
        height={rowHeight}
        className={styles.gridRow}
        onMouseMove={e => {
          handleMouseMove(e, i);
        }}
      />
    );
    invalidColumn.push(
      <rect
        x={translateX + 0.5}
        y={y}
        width={columnWidth - 1}
        height={rowHeight}
        fill="#DAE0FF"
        onMouseMove={() => {
          handleInvalidColumnMouseMove(i, tasks[i]);
        }}
      />
    );
    rowLines.push(
      <line
        key={"RowLine" + tasks[i].id}
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
            y2={y}
            style={{ stroke: todayColor, strokeWidth: "1" }}
          />
        </g>
      );
    }
    tickX += columnWidth;
  }
  const invalidBarClick = () => {
    const taskIndex = translateY / rowHeight;
    const startDate = dayjs(
      dates[0].valueOf() + (translateX / columnWidth) * 86400000
    );
    const endDate = dayjs(
      dates[0].valueOf() + (translateX / columnWidth) * 86400000 + 86400000
    );
    onDateChange?.(
      Object.assign(tasks[taskIndex], {
        start: startDate.startOf("day").toDate(),
        end: endDate.startOf("day").toDate(),
      })
    );
  };
  const invalidBar = (
    <g>
      <rect
        x={translateX}
        y={translateY + rowHeight / 2 - 30 / 2}
        width={columnWidth}
        height={30}
        fill="#7B90FF"
        onClick={invalidBarClick}
        cursor="pointer"
      />
    </g>
  );
  return (
    <g className="gridBody">
      <g className="invalidColumn">{invalidColumn}</g>
      {isShow && <g className="invalidBar">{invalidBar}</g>}
      <g className="today">{today}</g>
    </g>
  );
};
GridBody.defaultProps = {
  scrollX: 0,
};
