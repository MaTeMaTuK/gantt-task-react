import React, { ReactChild, memo, useCallback, useMemo } from "react";
import { ViewMode } from "../../types/public-types";
import { TopPartOfCalendar } from "./top-part-of-calendar";
import { getLocaleMonth, getLocalYearMonth } from "../../helpers/date-helper";
import { DateSetup } from "../../types/date-setup";
import dayjs from "../../lib/day";
import useI18n from "../../lib/hooks/useI18n";
import debug from "debug";

import styles from "./calendar.module.css";

const logger = debug("calender:week");

export type CalendarProps = {
  dateSetup: DateSetup;
  locale: string;
  viewMode: ViewMode;
  headerHeight: number;
  columnWidth: number;
  fontFamily: string;
  fontSize: string;
};
export const Calendar: React.FC<CalendarProps> = memo(
  ({
    dateSetup,
    locale,
    viewMode,
    headerHeight,
    columnWidth,
    fontFamily,
    fontSize,
  }) => {
    const { t } = useI18n();
    logger(dayjs.locale(), "date-locale");
    const bottomValuesInit = useCallback(
      (bottomValue, date, headerHeight, i, type) => {
        return (
          <text
            key={
              ["Day", "Other", "Week"].includes(type)
                ? date.getTime()
                : bottomValue + date.getFullYear()
            }
            y={
              ["Day", "Week"].includes(type)
                ? headerHeight * 0.6 + 6
                : headerHeight * 0.6
            }
            x={columnWidth * i + columnWidth * 0.5}
            className={styles.calendarBottomText}
          >
            {bottomValue}
          </text>
        );
      },
      [columnWidth]
    );
    const getCalendarValuesForYear = useCallback(() => {
      const topValues: ReactChild[] = [];
      const bottomValues: ReactChild[] = [];
      for (let i = 0; i < dateSetup.dates.length; i++) {
        const date = dateSetup.dates[i];
        const bottomValue = date.getFullYear().toString();
        bottomValues.push(
          bottomValuesInit(bottomValue, date, headerHeight, i, "year")
        );
      }
      return [topValues, bottomValues];
    }, [dateSetup.dates, headerHeight, bottomValuesInit]);
    const getCalendarValuesForQuarter = useCallback(() => {
      const topValues: ReactChild[] = [];
      const bottomValues: ReactChild[] = [];
      const topDefaultWidth = columnWidth * 3;
      const topDefaultHeight = headerHeight * 0.5;
      for (let i = 0; i < dateSetup.dates.length; i++) {
        const date = dateSetup.dates[i];
        const currentQuarter = Math.floor(
          date.getMonth() % 3 === 0
            ? date.getMonth() / 3 + 1
            : date.getMonth() / 3 + 1
        );
        const bottomValue = dayjs(date).format(t("date.format.quarter"));
        bottomValues.push(
          bottomValuesInit(bottomValue, date, headerHeight, i, "Quarter")
        );
        if (
          i === 0 ||
          date.getFullYear() !== dateSetup.dates[i - 1].getFullYear()
        ) {
          const topValue = date.getFullYear().toString();
          topValues.push(
            <TopPartOfCalendar
              key={topValue}
              value={topValue}
              x1Line={columnWidth * i}
              y1Line={0}
              y2Line={topDefaultHeight}
              xText={
                topDefaultWidth + columnWidth * i - currentQuarter * columnWidth
              }
              yText={topDefaultHeight * 0.9}
            />
          );
        }
      }
      return [topValues, bottomValues];
    }, [columnWidth, dateSetup.dates, headerHeight, bottomValuesInit, t]);
    const getCalendarValuesForMonth = useCallback(() => {
      const topValues: ReactChild[] = [];
      const bottomValues: ReactChild[] = [];
      const topDefaultWidth = columnWidth * 6;
      const topDefaultHeight = headerHeight * 0.5;
      for (let i = 0; i < dateSetup.dates.length; i++) {
        const date = dateSetup.dates[i];
        const bottomValue = getLocaleMonth(date, locale);
        bottomValues.push(
          bottomValuesInit(bottomValue, date, headerHeight, i, "Month")
        );
        if (
          i === 0 ||
          date.getFullYear() !== dateSetup.dates[i - 1].getFullYear()
        ) {
          const topValue = date.getFullYear().toString();
          topValues.push(
            <TopPartOfCalendar
              key={topValue}
              value={topValue}
              x1Line={columnWidth * i}
              y1Line={0}
              y2Line={topDefaultHeight}
              xText={
                topDefaultWidth +
                columnWidth * i -
                date.getMonth() * columnWidth
              }
              yText={topDefaultHeight * 0.9}
            />
          );
        }
      }
      return [topValues, bottomValues];
    }, [columnWidth, dateSetup.dates, headerHeight, locale, bottomValuesInit]);

    const getCalendarValuesForWeek = useCallback(() => {
      const topValues: ReactChild[] = [];
      const bottomValues: ReactChild[] = [];
      let weeksCount: number = 1;
      const topDefaultHeight = headerHeight * 0.5;
      const dates = dateSetup.dates;
      for (let i = dates.length - 1; i >= 0; i--) {
        const date = dates[i];
        let topValue = "";
        if (i === 0 || date.getMonth() !== dates[i - 1].getMonth()) {
          topValue = getLocalYearMonth(date, locale);
        }
        const bottomValue = dayjs(date).format(t("date.format.week"));
        bottomValues.push(
          bottomValuesInit(bottomValue, date, headerHeight, i, "Week")
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
                yText={topDefaultHeight * 0.9 - 4}
              />
            );
          }
          weeksCount = 0;
        }
        weeksCount++;
      }
      return [topValues, bottomValues];
    }, [
      columnWidth,
      dateSetup.dates,
      headerHeight,
      bottomValuesInit,
      locale,
      t,
    ]);

    const getCalendarValuesForDay = useCallback(() => {
      const topValues: ReactChild[] = [];
      const bottomValues: ReactChild[] = [];
      const topDefaultHeight = headerHeight * 0.5;
      const dates = dateSetup.dates;
      for (let i = 0; i < dates.length; i++) {
        const date = dates[i];
        const bottomValue = date.getDate().toString();

        bottomValues.push(
          bottomValuesInit(bottomValue, date, headerHeight, i, "Day")
        );
        if (
          i + 1 !== dates.length &&
          date.getMonth() !== dates[i + 1].getMonth()
        ) {
          const topValue = getLocalYearMonth(date, locale);
          topValues.push(
            <TopPartOfCalendar
              key={topValue + date.getFullYear()}
              value={topValue}
              x1Line={columnWidth * (i + 1)}
              y1Line={0}
              y2Line={topDefaultHeight}
              xText={columnWidth * (i + 1) - date.getDate() * columnWidth * 0.5}
              yText={topDefaultHeight * 0.9 - 4}
            />
          );
        }
      }
      return [topValues, bottomValues];
    }, [columnWidth, dateSetup.dates, headerHeight, bottomValuesInit, locale]);

    const getCalendarValuesForOther = useCallback(() => {
      const topValues: ReactChild[] = [];
      const bottomValues: ReactChild[] = [];
      const ticks = viewMode === ViewMode.HalfDay ? 2 : 4;
      const topDefaultHeight = headerHeight * 0.5;
      const dates = dateSetup.dates;
      for (let i = 0; i < dates.length; i++) {
        const date = dates[i];
        const bottomValue = Intl.DateTimeFormat(locale, {
          hour: "numeric",
        }).format(date);

        bottomValues.push(
          bottomValuesInit(bottomValue, date, headerHeight, i, "Other")
        );
        if (i === 0 || date.getDate() !== dates[i - 1].getDate()) {
          const topValue = `${date.getDate()} ${getLocaleMonth(date, locale)}`;
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
    }, [
      columnWidth,
      dateSetup.dates,
      headerHeight,
      locale,
      viewMode,
      bottomValuesInit,
    ]);
    const [topValues, bottomValues] = useMemo(() => {
      let topValues: ReactChild[] = [];
      let bottomValues: ReactChild[] = [];
      switch (dateSetup.viewMode) {
        case ViewMode.Month:
          [topValues, bottomValues] = getCalendarValuesForMonth();
          break;
        case ViewMode.Week:
          [topValues, bottomValues] = getCalendarValuesForWeek();
          break;
        case ViewMode.Day:
          [topValues, bottomValues] = getCalendarValuesForDay();
          break;
        case ViewMode.Year:
          [topValues, bottomValues] = getCalendarValuesForYear();
          break;
        case ViewMode.Quarter:
          [topValues, bottomValues] = getCalendarValuesForQuarter();
          break;
        default:
          [topValues, bottomValues] = getCalendarValuesForOther();
          break;
      }
      return [topValues, bottomValues];
    }, [
      dateSetup.viewMode,
      getCalendarValuesForDay,
      getCalendarValuesForMonth,
      getCalendarValuesForOther,
      getCalendarValuesForQuarter,
      getCalendarValuesForWeek,
      getCalendarValuesForYear,
    ]);
    return (
      <g className="calendar" fontSize={fontSize} fontFamily={fontFamily}>
        <rect
          x={0}
          y={0}
          width={columnWidth * dateSetup.dates.length}
          height={headerHeight}
          className={styles.calendarHeader}
        />
        {bottomValues}
        {topValues}
      </g>
    );
  }
);
