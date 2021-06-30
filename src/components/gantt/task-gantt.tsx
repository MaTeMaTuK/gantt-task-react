import React, { useRef, forwardRef, useImperativeHandle } from "react";
import { GridProps, Grid } from "../grid/grid";
import { CalendarProps, Calendar } from "../calendar/calendar";
import { TaskGanttContentProps, TaskGanttContent } from "./task-gantt-content";
import styles from "./gantt.module.css";

export type TaskGanttProps = {
  gridProps: GridProps;
  calendarProps: CalendarProps;
  barProps: TaskGanttContentProps;
  ganttHeight: number;
};
const TaskGanttComponent: React.ForwardRefRenderFunction<any, TaskGanttProps> = ({
  gridProps,
  calendarProps,
  barProps,
  ganttHeight
}, ref) => {
  const ganttSVGRef = useRef<SVGSVGElement>(null);
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  const verticalGanttContainerRef = useRef<HTMLDivElement>(null);
  const newBarProps = { ...barProps, svg: ganttSVGRef };

  useImperativeHandle(ref, () => ({
    horizontalContainerRef: horizontalContainerRef.current,
    verticalGanttContainerRef: verticalGanttContainerRef.current
  }));

  return (
    <div
      className={styles.ganttVerticalContainer}
      ref={verticalGanttContainerRef}
    >
      <div className={styles.calendarWrapper}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={gridProps.svgWidth}
          height={calendarProps.headerHeight}
          fontFamily={barProps.fontFamily}
        >
          <Calendar {...calendarProps} />
        </svg>
      </div>
      <div
        ref={horizontalContainerRef}
        className={styles.horizontalContainer}
        style={
          ganttHeight
            ? { height: ganttHeight, width: gridProps.svgWidth }
            : { width: gridProps.svgWidth }
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={gridProps.svgWidth}
          height={barProps.rowHeight * barProps.tasks.length}
          fontFamily={barProps.fontFamily}
          ref={ganttSVGRef}
        >
          <Grid {...gridProps} viewMode={calendarProps.viewMode} />
          <TaskGanttContent {...newBarProps} />
        </svg>
      </div>
    </div>
  );
};

export const TaskGantt = forwardRef(TaskGanttComponent);
