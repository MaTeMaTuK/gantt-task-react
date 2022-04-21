import React, {
  ReactChild,
  useState,
  useEffect,
  useContext,
  memo,
  useCallback,
} from "react";
import { Task, ViewMode, EventOption } from "../../types/public-types";
import { addToDate } from "../../helpers/date-helper";
import { GanttConfigContext } from "../../contsxt";

// import { GanttContext } from "../../contsxt";
import styles from "./grid.module.css";
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
  offsetLeft: number;
  taskListHeight?: number;
} & EventOption;
// 判断是否为周末
// 之前用是dayjs的weekday()方法获取周几，本地运行可以，但是线上包计算有无，具体原因不确定，所以采用getDay方法
const isRestDay = (date: Date) => {
  const dt = new Date(date);
  return [0, 6].includes(dt.getDay());
};
export const GridBody: React.FC<GridBodyProps> = memo(
  ({
    tasks,
    dates,
    rowHeight,
    svgWidth,
    columnWidth,
    todayColor,
    viewMode,
    scrollX,
    offsetLeft,
    taskListHeight,
    onDateChange,
  }) => {
    const { ganttConfig } = useContext(GanttConfigContext);
    const [translateX, setTranslateX] = useState(0);
    const [translateY, setTranslateY] = useState(0);
    const [isShow, setIsShow] = useState(false);
    const [parts, setParts] = useState(1);
    // 余的天数
    const [remainderDays, setRemainderDays] = useState(0);
    //
    const [currentIndex, setCurrentDataIndex] = useState(0);
    useEffect(() => {
      setParts(1);
      setRemainderDays(0);
      setCurrentDataIndex(0);
      // 一个时间刻度分成多少小份： 一月分为28、29、30、31份
    }, [viewMode]);
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
    const handleMouseMove = useCallback(
      (event: any, index: number) => {
        const pointerX = event.clientX - offsetLeft - 24;
        // 整数
        const currentDataIndex = Math.floor((pointerX + scrollX) / columnWidth);
        setCurrentDataIndex(currentDataIndex);
        let translateX = 0;
        // 天或周
        if (viewMode === ViewMode.Day || viewMode === ViewMode.Week) {
          setParts(1);
          setRemainderDays(0);
          translateX = currentDataIndex * columnWidth;
        }
        // 月
        if (viewMode === ViewMode.Month) {
          // 余数
          const dateRemainder =
            pointerX + scrollX - currentDataIndex * columnWidth;
          // 获取当前月下的天数
          const parts = new Date(
            dates[currentDataIndex]?.getFullYear(),
            dates[currentDataIndex]?.getMonth() + 1,
            0
          ).getDate();
          setParts(parts);
          // 一天对应的宽度
          const dayWidth = columnWidth / parts;
          const remainder = Math.floor(dateRemainder / dayWidth);
          setRemainderDays(remainder);
          translateX =
            currentDataIndex * columnWidth + (remainder / parts) * columnWidth;
        }
        // 季度
        if (viewMode === ViewMode.Quarter) {
          const dateRemainder =
            pointerX + scrollX - currentDataIndex * columnWidth;
          const parts = 3;
          setParts(3);
          // 一天对应的宽度
          const dayWidth = columnWidth / parts;
          const remainder = Math.floor(dateRemainder / dayWidth);
          setRemainderDays(remainder);
          translateX =
            currentDataIndex * columnWidth + (remainder / parts) * columnWidth;
        }
        // 年
        if (viewMode === ViewMode.Year) {
          const dateRemainder =
            pointerX + scrollX - currentDataIndex * columnWidth;
          const parts = 12;
          setParts(12);
          // 一天对应的宽度
          const dayWidth = columnWidth / parts;
          const remainder = Math.floor(dateRemainder / dayWidth);
          setRemainderDays(remainder);
          translateX =
            currentDataIndex * columnWidth + (remainder / parts) * columnWidth;
        }
        setTranslateX(translateX);
        setTranslateY(index * rowHeight);
      },
      [columnWidth, dates, offsetLeft, rowHeight, scrollX, viewMode]
    );
    const handleInvalidColumnMouseMove = useCallback(
      (index: number, row: any) => {
        setTranslateY(index * rowHeight);
        setIsShow(!row.start);
      },
      [rowHeight]
    );
    const invalidBarClick = () => {
      const taskIndex = translateY / rowHeight;
      let startDate, endDate;
      if (viewMode === ViewMode.Day) {
        startDate = dayjs(
          dates[0].valueOf() + (translateX / columnWidth) * 86400000
        );
        endDate = dayjs(
          dates[0].valueOf() + (translateX / columnWidth) * 86400000 + 86400000
        );
      }
      if (viewMode === ViewMode.Week) {
        startDate = dayjs(
          dates[0].valueOf() + (translateX / columnWidth) * 86400000 * 7
        );
        endDate = dayjs(
          dates[0].valueOf() +
            (translateX / columnWidth) * 86400000 * 7 +
            86400000 * 7
        );
      }
      if (viewMode === ViewMode.Month) {
        startDate = dayjs(
          dates[currentIndex].valueOf() + remainderDays * 86400000
        );
        endDate = dayjs(
          dates[currentIndex].valueOf() + remainderDays * 86400000 + 86400000
        );
      }
      if (viewMode === ViewMode.Quarter || viewMode === ViewMode.Year) {
        startDate = dayjs(
          new Date(
            dates[currentIndex].getFullYear(),
            dates[currentIndex].getMonth() + remainderDays
          )
        );
        endDate = dayjs(
          new Date(
            dates[currentIndex].getFullYear(),
            dates[currentIndex].getMonth() + remainderDays + 1
          )
        );
      }
      onDateChange?.(
        Object.assign(tasks[taskIndex], {
          start: ganttConfig?.time?.length
            ? startDate?.startOf("day").toDate()
            : null,
          end: ganttConfig?.time?.length
            ? endDate?.startOf("day").toDate()
            : null,
        })
      );
    };
    for (let i = 0; i < tasks.length; i++) {
      gridRows.push(
        <g
          key={`Cell-${i}`}
          onMouseEnter={(e: any) => {
            const ele = e.target.parentNode.firstChild;
            ele && (ele.style.fill = "#f3f3f3");
          }}
          onMouseLeave={(e: any) => {
            const ele = e.target.parentNode.firstChild;
            ele && (ele.style.fill = "");
          }}
          // @ts-ignore
          index={i}
        >
          <rect
            key={"Row" + tasks[i].id + i}
            x="0"
            y={y}
            width={svgWidth}
            height={rowHeight}
            className={styles.gridRow}
            onMouseMove={(e: any) => {
              handleMouseMove(e, i);
            }}
          />
          <rect
            key={"Cell" + tasks[i].id + i}
            x={translateX + 0.5}
            y={y}
            width={columnWidth / parts}
            height={rowHeight}
            fill="transparent"
            ry={4}
            rx={4}
            onMouseMove={() => {
              handleInvalidColumnMouseMove(i, tasks[i]);
            }}
          />
          {/* 卡片为空时不能添加时间 */}
          {tasks[i].id && (
            <rect
              key={"Time" + tasks[i].id + i}
              x={translateX}
              y={y + rowHeight / 2 - 30 / 2}
              width={columnWidth / parts}
              height={30}
              fill="transparent"
              onClick={isShow ? invalidBarClick : () => {}}
              cursor={isShow ? "pointer" : "default"}
              onMouseEnter={(e: any) => {
                const ele = e.target.parentNode;
                const index = ele.getAttribute("index");
                if (isShow && i === Number(index)) {
                  e.target.style.fill = "#AFCBFF";
                }
              }}
              onMouseLeave={(e: any) => {
                e.target.style.fill = "transparent";
              }}
            />
          )}
        </g>
      );
      invalidColumn.push(
        <rect
          key={"invalidColumn" + tasks[i].id + i}
          x={translateX + 0.5}
          y={y}
          width={columnWidth / parts}
          height={rowHeight}
          fill={isShow ? "#DAE0FF" : "transparent"}
          onMouseMove={() => {
            handleInvalidColumnMouseMove(i, tasks[i]);
          }}
        />
      );
      rowLines.push(
        <line
          key={"RowLine" + tasks[i].id + i}
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
        <g key={`${date.getTime()}-${i}-ticks`}>
          <line
            key={`${date.getTime()}-${i}-line`}
            x1={tickX}
            y1={0}
            x2={tickX}
            y2={y < Number(taskListHeight) ? taskListHeight : y}
            className={styles.gridTick}
          />
          {isRestDay(date) && viewMode === ViewMode.Day && (
            <rect
              key={`${date.getTime()}-${date.getTime()}-${i}-restday`}
              x={tickX + 1}
              y="0"
              width={columnWidth - 1}
              height={y < Number(taskListHeight) ? taskListHeight : y}
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
        const currentStamp = new Date(
          new Date().toLocaleDateString()
        ).getTime();
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
              cy="3"
              r="3"
              stroke="black"
              strokeWidth="0"
              fill={todayColor}
            />
            <line
              x1={newTickX}
              y1="0"
              x2={newTickX}
              y2={y < Number(taskListHeight) ? taskListHeight : y}
              style={{ stroke: todayColor, strokeWidth: "1" }}
            />
          </g>
        );
      }
      tickX += columnWidth;
    }
    const invalidBar = (
      <g>
        <rect
          x={translateX}
          y={translateY + rowHeight / 2 - 30 / 2}
          width={columnWidth / parts}
          height={30}
          rx={4}
          ry={4}
          fill="#AFCBFF"
          onClick={invalidBarClick}
          cursor="pointer"
        />
      </g>
    );
    return (
      <g
        className="gridBody"
        onMouseLeave={() => {
          setTranslateX(-500);
        }}
      >
        <g className="ticks">{ticks}</g>

        <g className="rowLines">{rowLines}</g>
        <g className="rows">{gridRows}</g>
        {false && <g className="invalidColumn">{invalidColumn}</g>}
        {false && <g className="invalidBar">{invalidBar}</g>}
        <g className="today">{today}</g>
      </g>
    );
  }
);
GridBody.defaultProps = {
  scrollX: 0,
};
