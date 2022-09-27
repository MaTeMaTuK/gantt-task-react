import { MonthFormats, ViewMode } from "./public-types";

export interface DateSetup {
  dates: Date[];
  viewMode: ViewMode;
  monthCalendarFormat: MonthFormats;
}
