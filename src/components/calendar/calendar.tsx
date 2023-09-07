import React, { ReactChild, useEffect, useState } from "react";
import { EventOption, ViewMode } from "../../types/public-types";
import { TopPartOfCalendar } from "./top-part-of-calendar";
import {
  getCachedDateTimeFormat,
  getDaysInMonth,
  getLocalDayOfWeek,
  getLocaleMonth,
  getWeekNumberISO8601,
} from "../../helpers/date-helper";
import { DateSetup } from "../../types/date-setup";
import styles from "./calendar.module.css";
import { rulerTask } from "../../types/ruler";
import {
  BarMoveAction,
  GanttContentMoveAction,
  GanttRulerEvent,
} from "../../types/gantt-task-actions";
import { isKeyboardEvent } from "../../helpers/other-helper";
import { handleTaskBySVGMouseRulerEvent } from "../../helpers/ruler-helper";

export type CalendarProps = {
  dateSetup: DateSetup;
  locale: string;
  viewMode: ViewMode;
  rtl: boolean;
  timeStep: number;
  headerHeight: number;
  columnWidth: number;
  fontFamily: string;
  fontSize: string;
  rulerTasks: rulerTask[];
  ganttRulerEvent: GanttRulerEvent;
  setGanttRulerEvent: (value: GanttRulerEvent) => void;
  svg?: React.RefObject<SVGSVGElement>;
} & EventOption;

export const Calendar: React.FC<CalendarProps> = ({
  dateSetup,
  locale,
  viewMode,
  rtl,
  timeStep,
  headerHeight,
  columnWidth,
  fontFamily,
  ganttRulerEvent,
  onRulerDateChange,
  setGanttRulerEvent,
  fontSize,
  rulerTasks,
  svg,
}) => {
  const [isMoving, setIsMoving] = useState(false);
  const [initEventX1Delta, setInitEventX1Delta] = useState(0);
  const [xStep, setXStep] = useState(0);

  // create xStep
  useEffect(() => {
    const dateDelta =
      dateSetup.dates[1].getTime() -
      dateSetup.dates[0].getTime() -
      dateSetup.dates[1].getTimezoneOffset() * 60 * 1000 +
      dateSetup.dates[0].getTimezoneOffset() * 60 * 1000;
    const newXStep = (timeStep * columnWidth) / dateDelta;
    setXStep(newXStep);
  }, [columnWidth, dateSetup.dates, timeStep]);

  const getCalendarValuesForYear = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const topDefaultHeight = headerHeight * 0.5;
    for (let i = 0; i < dateSetup.dates.length; i++) {
      const date = dateSetup.dates[i];
      const bottomValue = date.getFullYear();
      bottomValues.push(
        <text
          key={date.getTime()}
          y={headerHeight * 0.8}
          x={columnWidth * i + columnWidth * 0.5}
          className={styles.calendarBottomText}
        >
          {bottomValue}
        </text>
      );
      if (
        i === 0 ||
        date.getFullYear() !== dateSetup.dates[i - 1].getFullYear()
      ) {
        const topValue = date.getFullYear().toString();
        let xText: number;
        if (rtl) {
          xText = (6 + i + date.getFullYear() + 1) * columnWidth;
        } else {
          xText = (6 + i - date.getFullYear()) * columnWidth;
        }
        topValues.push(
          <TopPartOfCalendar
            key={topValue}
            value={topValue}
            x1Line={columnWidth * i}
            y1Line={0}
            y2Line={headerHeight}
            xText={xText}
            yText={topDefaultHeight * 0.9}
          />
        );
      }
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForQuarterYear = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const topDefaultHeight = headerHeight * 0.5;
    for (let i = 0; i < dateSetup.dates.length; i++) {
      const date = dateSetup.dates[i];
      // const bottomValue = getLocaleMonth(date, locale);
      const quarter = "Q" + Math.floor((date.getMonth() + 3) / 3);
      bottomValues.push(
        <text
          key={date.getTime()}
          y={headerHeight * 0.8}
          x={columnWidth * i + columnWidth * 0.5}
          className={styles.calendarBottomText}
        >
          {quarter}
        </text>
      );
      if (
        i === 0 ||
        date.getFullYear() !== dateSetup.dates[i - 1].getFullYear()
      ) {
        const topValue = date.getFullYear().toString();
        let xText: number;
        if (rtl) {
          xText = (6 + i + date.getMonth() + 1) * columnWidth;
        } else {
          xText = (6 + i - date.getMonth()) * columnWidth;
        }
        topValues.push(
          <TopPartOfCalendar
            key={topValue}
            value={topValue}
            x1Line={columnWidth * i}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={Math.abs(xText)}
            yText={topDefaultHeight * 0.9}
          />
        );
      }
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForMonth = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const topDefaultHeight = headerHeight * 0.5;
    for (let i = 0; i < dateSetup.dates.length; i++) {
      const date = dateSetup.dates[i];
      const bottomValue = Math.floor((date.getDay() + 4) / 4);
      const totalDay = getDaysInMonth(date.getMonth(), date.getFullYear());

      // const quarter = "Q" + Math.floor((date.getMonth() + 3) / 3);
      bottomValues.push(
        <g>
          <text
            key={bottomValue + 0 + date.getMonth()}
            y={headerHeight * 0.8}
            x={columnWidth * i + 0}
            className={styles.calendarBottomText}
          >
            {0}
          </text>
          <text
            key={bottomValue + 10 + date.getMonth()}
            y={headerHeight * 0.8}
            x={columnWidth * i + columnWidth * (10 / totalDay)}
            className={styles.calendarBottomText}
          >
            {10}
          </text>
          <text
            key={bottomValue + 20 + date.getMonth()}
            y={headerHeight * 0.8}
            x={columnWidth * i + columnWidth * (20 / totalDay)}
            className={styles.calendarBottomText}
          >
            {20}
          </text>
          <text
            key={bottomValue + 30 + date.getMonth()}
            y={headerHeight * 0.8}
            x={columnWidth * i + columnWidth - 20}
            className={styles.calendarBottomText}
          >
            {totalDay}
          </text>
        </g>
      );

      if (i === 0 || date.getMonth() !== dateSetup.dates[i - 1].getMonth()) {
        const topValue = getLocaleMonth(date, locale);
        // let xText: number;
        // if (rtl) {
        //   xText = (6 + i + date.getMonth() + 1) * columnWidth;
        // } else {
        //   xText = (6 + i - date.getMonth()) * columnWidth;
        // }

        topValues.push(
          <TopPartOfCalendar
            key={`${topValue}-${i}-${date.getFullYear()}`}
            value={topValue}
            x1Line={columnWidth * i + 4 * columnWidth}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={columnWidth * i + 40}
            yText={topDefaultHeight * 0.9}
          />
        );
      }
    }

    return [topValues, bottomValues];
  };

  const getCalendarValuesForWeek = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    let weeksCount: number = 1;
    const topDefaultHeight = headerHeight * 0.5;
    const dates = dateSetup.dates;
    for (let i = dates.length - 1; i >= 0; i--) {
      const date = dates[i];
      let topValue = "";
      if (i === 0 || date.getMonth() !== dates[i - 1].getMonth()) {
        // top
        topValue = `${getLocaleMonth(date, locale)}, ${date.getFullYear()}`;
      }
      // bottom
      const bottomValue = `W${getWeekNumberISO8601(date)}`;

      bottomValues.push(
        <text
          key={date.getTime()}
          y={headerHeight * 0.8}
          x={columnWidth * (i + +rtl)}
          className={styles.calendarBottomText}
        >
          {bottomValue}
        </text>
      );

      if (topValue) {
        // if last day is new month
        if (i !== dates.length - 1) {
          topValues.push(
            <TopPartOfCalendar
              key={topValue}
              value={topValue}
              x1Line={columnWidth * i + weeksCount * columnWidth}
              y1Line={0}
              y2Line={topDefaultHeight}
              xText={columnWidth * i + columnWidth * weeksCount * 0.5}
              yText={topDefaultHeight * 0.9}
            />
          );
        }
        weeksCount = 0;
      }
      weeksCount++;
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForDay = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const topDefaultHeight = headerHeight * 0.5;
    const dates = dateSetup.dates;
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const bottomValue = `${getLocalDayOfWeek(date, locale, "short")}, ${date
        .getDate()
        .toString()}`;

      bottomValues.push(
        <text
          key={date.getTime()}
          y={headerHeight * 0.8}
          x={columnWidth * i + columnWidth * 0.5}
          className={styles.calendarBottomText}
        >
          {bottomValue}
        </text>
      );
      if (
        i + 1 !== dates.length &&
        date.getMonth() !== dates[i + 1].getMonth()
      ) {
        const topValue = getLocaleMonth(date, locale);

        topValues.push(
          <TopPartOfCalendar
            key={topValue + date.getFullYear()}
            value={topValue}
            x1Line={columnWidth * (i + 1)}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={
              columnWidth * (i + 1) -
              getDaysInMonth(date.getMonth(), date.getFullYear()) *
                columnWidth *
                0.5
            }
            yText={topDefaultHeight * 0.9}
          />
        );
      }
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForPartOfDay = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const ticks = viewMode === ViewMode.HalfDay ? 2 : 4;
    const topDefaultHeight = headerHeight * 0.5;
    const dates = dateSetup.dates;
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const bottomValue = getCachedDateTimeFormat(locale, {
        hour: "numeric",
      }).format(date);

      bottomValues.push(
        <text
          key={date.getTime()}
          y={headerHeight * 0.8}
          x={columnWidth * (i + +rtl)}
          className={styles.calendarBottomText}
          fontFamily={fontFamily}
        >
          {bottomValue}
        </text>
      );
      if (i === 0 || date.getDate() !== dates[i - 1].getDate()) {
        const topValue = `${getLocalDayOfWeek(
          date,
          locale,
          "short"
        )}, ${date.getDate()} ${getLocaleMonth(date, locale)}`;
        topValues.push(
          <TopPartOfCalendar
            key={topValue + date.getFullYear()}
            value={topValue}
            x1Line={columnWidth * i + ticks * columnWidth}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={columnWidth * i + ticks * columnWidth * 0.5}
            yText={topDefaultHeight * 0.9}
          />
        );
      }
    }

    return [topValues, bottomValues];
  };

  const getCalendarValuesForHour = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const topDefaultHeight = headerHeight * 0.5;
    const dates = dateSetup.dates;
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const bottomValue = getCachedDateTimeFormat(locale, {
        hour: "numeric",
      }).format(date);

      bottomValues.push(
        <text
          key={date.getTime()}
          y={headerHeight * 0.8}
          x={columnWidth * (i + +rtl)}
          className={styles.calendarBottomText}
          fontFamily={fontFamily}
        >
          {bottomValue}
        </text>
      );

      if (i !== 0 && date.getDate() !== dates[i - 1].getDate()) {
        const displayDate = dates[i - 1];
        const topValue = `${getLocalDayOfWeek(
          displayDate,
          locale,
          "long"
        )}, ${displayDate.getDate()} ${getLocaleMonth(displayDate, locale)}`;
        const topPosition = (date.getHours() - 24) / 2;
        topValues.push(
          <TopPartOfCalendar
            key={topValue + displayDate.getFullYear()}
            value={topValue}
            x1Line={columnWidth * i}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={columnWidth * (i + topPosition)}
            yText={topDefaultHeight * 0.9}
          />
        );
      }
    }

    return [topValues, bottomValues];
  };

  let topValues: ReactChild[] = [];
  let bottomValues: ReactChild[] = [];
  switch (dateSetup.viewMode) {
    case ViewMode.Year:
      [topValues, bottomValues] = getCalendarValuesForYear();
      break;
    case ViewMode.QuarterYear:
      [topValues, bottomValues] = getCalendarValuesForQuarterYear();
      break;
    case ViewMode.Month:
      [topValues, bottomValues] = getCalendarValuesForMonth();
      break;
    case ViewMode.Week:
      [topValues, bottomValues] = getCalendarValuesForWeek();
      break;
    case ViewMode.Day:
      [topValues, bottomValues] = getCalendarValuesForDay();
      break;
    case ViewMode.QuarterDay:
    case ViewMode.HalfDay:
      [topValues, bottomValues] = getCalendarValuesForPartOfDay();
      break;
    case ViewMode.Hour:
      [topValues, bottomValues] = getCalendarValuesForHour();
  }

  const point = svg?.current?.createSVGPoint();

  useEffect(() => {
    const handleMouseMove = async (event: MouseEvent) => {
      if (!ganttRulerEvent.changedTask || !point || !svg?.current) return;
      event.preventDefault();

      point.x = event.clientX;
      const cursor = point.matrixTransform(
        svg?.current.getScreenCTM()?.inverse()
      );
      const { isChanged, changedTask } = handleTaskBySVGMouseRulerEvent(
        cursor.x,
        ganttRulerEvent.action as BarMoveAction,
        ganttRulerEvent.changedTask,
        xStep,
        timeStep,
        initEventX1Delta
      );

      if (isChanged) {
        setGanttRulerEvent({ action: ganttRulerEvent.action, changedTask });
      }
    };

    const handleMouseUp = async (event: MouseEvent) => {

      const { action, originalSelectedTask, changedTask } = ganttRulerEvent;
      if (!changedTask || !point || !svg?.current || !originalSelectedTask)
        return;
      event.preventDefault();
      point.x = event.clientX;
      const cursor = point.matrixTransform(
        svg?.current.getScreenCTM()?.inverse()
      );
      const { changedTask: newChangedTask } = handleTaskBySVGMouseRulerEvent(
        cursor.x,
        action as BarMoveAction,
        changedTask,
        xStep,
        timeStep,
        initEventX1Delta
      );

      const isNotLikeOriginal =
        originalSelectedTask.start !== newChangedTask.start ||
        originalSelectedTask.end !== newChangedTask.end;

      // remove listeners
      svg.current.removeEventListener("mousemove", handleMouseMove);
      svg.current.removeEventListener("mouseup", handleMouseUp);
      setGanttRulerEvent({ action: "" });
      setIsMoving(false);

      // custom operation start
      let operationSuccess = true;

      if (
        (action === "move" || action === "end" || action === "start") &&
        onRulerDateChange &&
        isNotLikeOriginal
      ) {
        try {
          const result = await onRulerDateChange(newChangedTask);
          if (result !== undefined) {
            operationSuccess = result;
          }
        } catch (error) {
          operationSuccess = false;
        }
      }

      // If operation is failed - return old state
      if (!operationSuccess) {
        console.log("ruler task fail");
      }
    };

    if (
      !isMoving &&
      (ganttRulerEvent.action === "move" ||
        ganttRulerEvent.action === "end" ||
        ganttRulerEvent.action === "start" ||
        ganttRulerEvent.action === "progress") &&
      svg?.current
    ) {
      svg.current.addEventListener("mousemove", handleMouseMove);
      svg.current.addEventListener("mouseup", handleMouseUp);
      setIsMoving(true);
    }
  }, [
    ganttRulerEvent,
    ganttRulerEvent.action,
    initEventX1Delta,
    isMoving,
    point,
    svg,
  ]);

  const handleRulerEventStart = async (
    action: GanttContentMoveAction,
    task: rulerTask,
    event?: React.MouseEvent | React.KeyboardEvent
  ) => {
    if (action === "move") {
      if (event) {
        if (!svg?.current || !point) return;
        if (isKeyboardEvent(event)) {
        } else {
          point.x = event.clientX;
          const cursor = point.matrixTransform(
            svg.current.getScreenCTM()?.inverse()
          );
          setInitEventX1Delta(cursor.x - task.x1);
          setGanttRulerEvent({
            action,
            changedTask: task,
            originalSelectedTask: task,
          });
        }
      }
    }
  };

  return (
    <g className="calendar" fontSize={fontSize} fontFamily={fontFamily}>
      <rect
        x={0}
        y={0}
        width={columnWidth * dateSetup.dates.length}
        height={headerHeight}
        className={styles.calendarHeader}
      />
      {bottomValues} {topValues}
      {rulerTasks.map((rulerTask: rulerTask, index: number) => {
        return (
          <g
            style={{ cursor: "pointer" }}
            key={index}
            onMouseDown={e => {
              handleRulerEventStart("move", rulerTask, e);
            }}
          >
            <rect
              x={rulerTask.x}
              y={0}
              ry={10}
              width={150}
              height={headerHeight + 20}
              className={styles.calendarHeaderIndicator}
            />
            <text
              fill="#fff"
              fontSize={12}
              fontWeight={600}
              x={rulerTask.x + 10}
              y={(headerHeight - 5) * 0.5}
            >
              {rulerTask.title}
            </text>
            <text
              fill="#fff"
              fontSize={10}
              x={rulerTask.x + 10}
              y={(headerHeight + 25) * 0.5}
            >
              {rulerTask?.start
                ? rulerTask.start.getDate() +
                  " " +
                  getLocaleMonth(rulerTask.start, "en-GB") +
                  " " +
                  rulerTask.start.getFullYear()
                : ""}
            </text>
          </g>
        );
      })}
    </g>
  );
};
