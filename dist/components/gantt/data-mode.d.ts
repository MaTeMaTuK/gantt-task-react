import React from "react";
import { ViewMode } from "../../types/public-types";
interface DateModeProps {
    toToday: () => void;
    modeChange: (val: ViewMode) => void;
    todayX: number;
    svgContainerWidth: number;
    refScrollX: number;
}
declare const DataMode: React.FC<DateModeProps>;
export default DataMode;
