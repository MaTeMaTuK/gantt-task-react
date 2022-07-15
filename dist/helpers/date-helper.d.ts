import { ViewMode } from "../types/public-types";
declare type DateHelperScales = "year" | "month" | "day" | "hour" | "minute" | "second" | "millisecond";
export declare const addToDate: (date: Date, quantity: number, scale: DateHelperScales) => Date;
export declare const startOfDate: (date: Date, scale: DateHelperScales) => Date;
export declare const ganttDateRange: (viewMode: ViewMode) => Date[];
export declare const seedDates: (startDate: Date, endDate: Date, viewMode: ViewMode) => Date[];
export declare const getLocaleMonth: (date: Date, locale: string) => string;
export declare const getWeekNumberISO8601: (date: Date) => string;
export {};
