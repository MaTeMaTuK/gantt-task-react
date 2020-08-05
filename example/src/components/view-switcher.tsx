import React from "react";
import "gantt-task-react/dist/index.css";
import { ViewMode } from "gantt-task-react";
type ViewSwitcherProps = {
  onViewChange: (viewMode: ViewMode) => void;
};
export const ViewSwitcher: React.SFC<ViewSwitcherProps> = ({
  onViewChange,
}) => {
  return (
    <div className="ViewContainer">
      <button
        className="Button"
        onClick={() => onViewChange(ViewMode.QuarterDay)}
      >
        Quarter of Day
      </button>
      <button className="Button" onClick={() => onViewChange(ViewMode.HalfDay)}>
        Half of Day
      </button>
      <button className="Button" onClick={() => onViewChange(ViewMode.Day)}>
        Day
      </button>
      <button className="Button" onClick={() => onViewChange(ViewMode.Week)}>
        Week
      </button>
      <button className="Button" onClick={() => onViewChange(ViewMode.Month)}>
        Month
      </button>
    </div>
  );
};
