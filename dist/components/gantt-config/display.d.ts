import React from "react";
import { GanttConfigProps } from "../../types/public-types";
interface DisplayProps {
    ganttConfig?: GanttConfigProps;
    configHandle?: (value: GanttConfigProps) => void;
    visibleChange?: (value: GanttConfigProps) => void;
}
export declare const Display: React.FC<DisplayProps>;
export default Display;
