import { Task, ViewMode } from "../types/public-types";
import DateTimeFormatOptions = Intl.DateTimeFormatOptions;
import DateTimeFormat = Intl.DateTimeFormat;

type DateHelperScales =
  | "year"
  | "month"
  | "day"
  | "hour"
  | "minute"
  | "second"
  | "millisecond";

const intlDTCache: Record<string, DateTimeFormat> = {};
export const getCachedDateTimeFormat = (
  locString: string | string[],
  opts: DateTimeFormatOptions = {}
): DateTimeFormat => {
  const key = JSON.stringify([locString, opts]);
  let dtf = intlDTCache[key];
  if (!dtf) {
    dtf = new Intl.DateTimeFormat(locString, opts);
    intlDTCache[key] = dtf;
  }
  return dtf;
};

export const addToDate = (
  date: Date,
  quantity: number,
  scale: DateHelperScales
) => {
  const newDate = new Date(
    date.getFullYear() + (scale === "year" ? quantity : 0),
    date.getMonth() + (scale === "month" ? quantity : 0),
    date.getDate() + (scale === "day" ? quantity : 0),
    date.getHours() + (scale === "hour" ? quantity : 0),
    date.getMinutes() + (scale === "minute" ? quantity : 0),
    date.getSeconds() + (scale === "second" ? quantity : 0),
    date.getMilliseconds() + (scale === "millisecond" ? quantity : 0)
  );
  return newDate;
};

export const startOfDate = (date: Date, scale: DateHelperScales) => {
  const scores = [
    "millisecond",
    "second",
    "minute",
    "hour",
    "day",
    "month",
    "year",
  ];

  const shouldReset = (_scale: DateHelperScales) => {
    const maxScore = scores.indexOf(scale);
    return scores.indexOf(_scale) <= maxScore;
  };
  const newDate = new Date(
    date.getFullYear(),
    shouldReset("year") ? 0 : date.getMonth(),
    shouldReset("month") ? 1 : date.getDate(),
    shouldReset("day") ? 0 : date.getHours(),
    shouldReset("hour") ? 0 : date.getMinutes(),
    shouldReset("minute") ? 0 : date.getSeconds(),
    shouldReset("second") ? 0 : date.getMilliseconds()
  );
  return newDate;
};

export const countSteps = (
  startDate: Date,
  endDate: Date,
  viewMode: ViewMode
) => {
  let count = 0;
  const { scale, count: stepCount } = getScaleAndCount(viewMode);
  while (startDate < endDate) {
    startDate = addToDate(startDate, stepCount, scale);
    count++;
  }
  return count;
};

const getScaleAndCount = (
  viewMode: ViewMode
): { scale: DateHelperScales; count: number } => {
  switch (viewMode) {
    case ViewMode.Year:
      return { scale: "year", count: 1 };
    case ViewMode.QuarterYear:
      return { scale: "month", count: 3 };
    case ViewMode.Month:
      return { scale: "month", count: 1 };
    case ViewMode.Week:
      return { scale: "day", count: 7 };
    case ViewMode.Day:
      return { scale: "day", count: 1 };
    case ViewMode.HalfDay:
      return { scale: "hour", count: 12 };
    case ViewMode.QuarterDay:
      return { scale: "hour", count: 6 };
    case ViewMode.Hour:
      return { scale: "hour", count: 1 };
  }
};

export const ganttDateRange = (
  tasks: Task[],
  viewMode: ViewMode,
  preStepsCount: number,
  minStepsCount: number
): [Date, Date, number, number] => {
  let newStartDate: Date = tasks[0].start;
  let newEndDate: Date = tasks[0].start;
  for (const task of tasks) {
    if (task.start < newStartDate) {
      newStartDate = task.start;
    }
    if (task.end > newEndDate) {
      newEndDate = task.end;
    }
  }

  const { scale, count: stepCount } = getScaleAndCount(viewMode);

  newStartDate = addToDate(newStartDate, -1 * preStepsCount * stepCount, scale);
  newStartDate = startOfDate(newStartDate, scale);

  const stepsBetweenDates = countSteps(newStartDate, newEndDate, viewMode);
  const maxStepsCount = Math.max(stepsBetweenDates, minStepsCount);

  newEndDate = addToDate(
    newStartDate,
    maxStepsCount * stepCount,
    scale
  );
  newEndDate = startOfDate(newEndDate, scale);

  return [newStartDate, newEndDate, minStepsCount, preStepsCount];
};

export const seedDates = (
  startDate: Date,
  endDate: Date,
  viewMode: ViewMode
) => {
  let currentDate: Date = new Date(startDate);
  const dates: Date[] = [currentDate];
  while (currentDate < endDate) {
    switch (viewMode) {
      case ViewMode.Year:
        currentDate = addToDate(currentDate, 1, "year");
        break;
      case ViewMode.QuarterYear:
        currentDate = addToDate(currentDate, 3, "month");
        break;
      case ViewMode.Month:
        currentDate = addToDate(currentDate, 1, "month");
        break;
      case ViewMode.Week:
        currentDate = addToDate(currentDate, 7, "day");
        break;
      case ViewMode.Day:
        currentDate = addToDate(currentDate, 1, "day");
        break;
      case ViewMode.HalfDay:
        currentDate = addToDate(currentDate, 12, "hour");
        break;
      case ViewMode.QuarterDay:
        currentDate = addToDate(currentDate, 6, "hour");
        break;
      case ViewMode.Hour:
        currentDate = addToDate(currentDate, 1, "hour");
        break;
    }
    dates.push(currentDate);
  }
  return dates;
};

export const getLocaleMonth = (date: Date, locale: string) => {
  let bottomValue = getCachedDateTimeFormat(locale, {
    month: "short",
  }).format(date);
  bottomValue = bottomValue.replace(
    bottomValue[0],
    bottomValue[0].toLocaleUpperCase()
  );
  return bottomValue;
};

export const getLocalDayOfWeek = (
  date: Date,
  locale: string,
  format?: "long" | "short" | "narrow" | undefined
) => {
  let bottomValue = getCachedDateTimeFormat(locale, {
    weekday: format,
  }).format(date);
  bottomValue = bottomValue.replace(
    bottomValue[0],
    bottomValue[0].toLocaleUpperCase()
  );
  return bottomValue;
};

/**
 * Returns monday of current week
 * @param date date for modify
 */
export const getMonday = (date: Date) => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(date.setDate(diff));
};

export const getWeekNumberISO8601 = (date: Date) => {
  const tmpDate = new Date(date.valueOf());
  const dayNumber = (tmpDate.getDay() + 6) % 7;
  tmpDate.setDate(tmpDate.getDate() - dayNumber + 3);
  const firstThursday = tmpDate.valueOf();
  tmpDate.setMonth(0, 1);
  if (tmpDate.getDay() !== 4) {
    tmpDate.setMonth(0, 1 + ((4 - tmpDate.getDay() + 7) % 7));
  }
  const weekNumber = (
    1 + Math.ceil((firstThursday - tmpDate.valueOf()) / 604800000)
  ).toString();

  if (weekNumber.length === 1) {
    return `0${weekNumber}`;
  } else {
    return weekNumber;
  }
};

export const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month + 1, 0).getDate();
};
