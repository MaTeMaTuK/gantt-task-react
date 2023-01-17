import { ViewMode } from "./public-types";

export interface DateSetup {
  dates: Date[];
  ranges: CalendarDateRange[],
  viewMode: ViewMode;
}

export interface CalendarDateRange {
  startDate: Date;
  endDate: Date;
  sprint: string;
};
export interface CalendarRanges {
  ranges?: {
    [key: string]: {
      startDate: string,
      endDate: string
    }
  }
}
