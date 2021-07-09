import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  SyntheticEvent,
} from "react";
import { GridProps, Grid } from "../grid/grid";
import { CalendarProps, Calendar } from "../calendar/calendar";
import { TaskGanttContentProps, TaskGanttContent } from "./task-gantt-content";
import { TaskGanttArrows } from "./task-gantt-arrows";
import styles from "./gantt.module.css";

export type TaskGanttProps = {
  gridProps: GridProps;
  calendarProps: CalendarProps;
  barProps: TaskGanttContentProps;
  ganttHeight: number;
  scrollX: number;
  onScroll: (event: SyntheticEvent<HTMLDivElement>) => void;
  // onMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
};
const TaskGanttComponent: React.ForwardRefRenderFunction<
  any,
  TaskGanttProps
> = (
  { gridProps, calendarProps, barProps, ganttHeight, scrollX, onScroll },
  ref
) => {
  const ganttSVGRef = useRef<SVGSVGElement>(null);
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  const verticalGanttContainerRef = useRef<HTMLDivElement>(null);
  const newBarProps = { ...barProps, svg: ganttSVGRef };

  // const [scrollLeft, setScrollLeft] = useState(0);

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
          className={styles.backgroundSvg}
        >
          <defs>
            <pattern
              id="grid"
              patternUnits="userSpaceOnUse"
              height={gridProps.rowHeight}
              width={gridProps.columnWidth}
            >
              <path
                fill="none"
                d={`m 0 0 h ${gridProps.columnWidth}`}
                strokeWidth="2"
                stroke="#ebecf0"
              />
              <path
                fill="none"
                d={`m 0 0 v ${gridProps.rowHeight}`}
                strokeWidth="2"
                stroke="#ebecf0"
              />
            </pattern>
          </defs>
          <rect
            fill="url(#grid)"
            height={barProps.rowHeight * barProps.tasks.length}
            width={gridProps.svgWidth}
          />
          <Grid
            {...gridProps}
            viewMode={calendarProps.viewMode}
            scrollX={scrollX}
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={gridProps.svgWidth}
          height={barProps.rowHeight * barProps.tasks.length}
          fontFamily={barProps.fontFamily}
          ref={ganttSVGRef}
          style={{ position: "relative" }}
        >
          <TaskGanttContent {...newBarProps} />
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

export const TaskGantt = forwardRef(TaskGanttComponent);
