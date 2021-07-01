import { ViewMode } from "../types/public-types";

type DateHelperScales =
  | "year"
  | "month"
  | "day"
  | "hour"
  | "minute"
  | "second"
  | "millisecond";

export const addToDate = (
  date: Date,
  quantity: number,
  scale: DateHelperScales
) => {
  // debugger
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
export const ganttDateRange = (viewMode: ViewMode) => {
  let newStartDate: Date = new Date(Date.now());
  let newEndDate: Date = new Date(Date.now());
  const Years = 1; // 前后10年
  switch (viewMode) {
    case ViewMode.Month:
      newStartDate = addToDate(newStartDate, -Years, "year");
      newStartDate = startOfDate(newStartDate, "month");
      newEndDate = addToDate(newEndDate, Years, "year");
      newEndDate = startOfDate(newEndDate, "year");
      break;
    case ViewMode.Week:
    case ViewMode.Day:
      newStartDate = startOfDate(newStartDate, "day");
      newEndDate = startOfDate(newEndDate, "day");
      newStartDate = addToDate(newStartDate, -Years * 12 * 30, "day");
      newEndDate = addToDate(newEndDate, Years * 12 * 30, "day");
      break;
    case ViewMode.Year:
      newStartDate = addToDate(newStartDate, -Years, "year");
      newStartDate = startOfDate(newStartDate, "year");
      newEndDate = addToDate(newEndDate, Years, "year");
      newEndDate = startOfDate(newEndDate, "year");
      break;
    case ViewMode.Quarter:
      newStartDate = addToDate(newStartDate, -Years, "year");
      newStartDate = startOfDate(newStartDate, "year");
      newEndDate = addToDate(newEndDate, Years, "year");
      newEndDate = startOfDate(newEndDate, "year");
      break;
    default:
      newStartDate = startOfDate(newStartDate, "day");
      newEndDate = startOfDate(newEndDate, "day");
      newStartDate = addToDate(newStartDate, -Years * 12 * 30, "day");
      newEndDate = addToDate(newEndDate, Years * 12 * 30, "day");
      break;
  }
  return [newStartDate, newEndDate];
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
      case ViewMode.Quarter:
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
    }
    dates.push(currentDate);
  }
  return dates;
};

export const getLocaleMonth = (date: Date, locale: string) => {
  let bottomValue = new Intl.DateTimeFormat(locale, {
    month: "long",
  }).format(date);
  bottomValue = bottomValue.replace(
    bottomValue[0],
    bottomValue[0].toLocaleUpperCase()
  );
  return bottomValue;
};
// const getMonday = (date: Date) => {
//   const day = date.getDay();
//   const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
//   return new Date(date.setDate(diff));
// };
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
