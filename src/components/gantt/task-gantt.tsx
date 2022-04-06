import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  SyntheticEvent,
  memo,
} from "react";
import { GridProps, Grid } from "../grid/grid";
import { CalendarProps, Calendar } from "../calendar/calendar";
import { TaskGanttContentProps, TaskGanttContent } from "./task-gantt-content";
import { TaskGanttArrows } from "./task-gantt-arrows";
import { scrollBarHeight } from "../../helpers/dicts";

import styles from "./gantt.module.css";

export type TaskGanttProps = {
  gridProps: GridProps;
  calendarProps: CalendarProps;
  barProps: TaskGanttContentProps;
  ganttHeight: number;
  scrollX: number;
  onScroll: (event: SyntheticEvent<HTMLDivElement>) => void;
  taskListHeight?: number;
  // onMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
};
const TaskGanttComponent: React.ForwardRefRenderFunction<
  any,
  TaskGanttProps
> = (
  { gridProps, calendarProps, barProps, scrollX, onScroll, taskListHeight },
  ref
) => {
  const ganttSVGRef = useRef<SVGSVGElement>(null);
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  const verticalGanttContainerRef = useRef<HTMLDivElement>(null);
  const newBarProps = { ...barProps, svg: ganttSVGRef };
  useImperativeHandle(ref, () => ({
    horizontalContainerRef: horizontalContainerRef.current,
    verticalGanttContainerRef: verticalGanttContainerRef.current,
  }));
  return (
    <div
      className={styles.ganttVerticalContainer}
      ref={verticalGanttContainerRef}
      onScroll={onScroll}
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
        id="horizontalContainer"
        ref={horizontalContainerRef}
        className={styles.horizontalContainer}
        style={{ width: gridProps.svgWidth }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={gridProps.svgWidth}
          height={
            barProps.rowHeight * barProps.tasks.length < Number(taskListHeight)
              ? taskListHeight
              : barProps.rowHeight * barProps.tasks.length + scrollBarHeight
          }
          fontFamily={barProps.fontFamily}
          ref={ganttSVGRef}
          style={{ position: "relative" }}
        >
          <Grid
            {...gridProps}
            viewMode={calendarProps.viewMode}
            scrollX={scrollX}
            taskListHeight={taskListHeight}
          />
          <TaskGanttContent {...newBarProps} taskListHeight={taskListHeight} />
        </svg>

        {false && (
          <div className={styles.contextContainer}>
            {newBarProps.tasks.map(task => {
              if (!task.start || !task.end) {
                return null;
              }
              return (
                <TaskGanttArrows key={task.id} {...newBarProps} task={task} />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export const TaskGantt = memo(forwardRef(TaskGanttComponent));
