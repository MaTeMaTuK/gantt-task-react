import React from "react";
import { ViewMode } from "../../types/public-types";
import { DateSetup } from "../../types/date-setup";
export declare type CalendarProps = {
    dateSetup: DateSetup;
    locale: string;
    viewMode: ViewMode;
    rtl: boolean;
    headerHeight: number;
    columnWidth: number;
    fontFamily: string;
    fontSize: string;
};
export declare const Calendar: React.FC<CalendarProps>;
