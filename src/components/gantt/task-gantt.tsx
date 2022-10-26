import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  SyntheticEvent,
  useContext,
  memo,
} from "react";
import { GridProps, Grid } from "../grid/grid";
import { CalendarProps, Calendar } from "../calendar/calendar";
import { TaskGanttContentProps, TaskGanttContent } from "./task-gantt-content";
import { TaskGanttArrows } from "./task-gantt-arrows";
import { scrollBarHeight, daySeconds } from "../../helpers/dicts";
import { ViewMode } from "../../types/public-types";
import { GanttConfigContext } from "../../contsxt";
import { BarTask } from "../../types/bar-task";
import dayjs from "dayjs";

import styles from "./gantt.module.css";

export type TaskGanttProps = {
  gridProps: GridProps;
  calendarProps: CalendarProps;
  barProps: TaskGanttContentProps;
  ganttHeight: number;
  scrollX: number;
  onScroll: (event: SyntheticEvent<HTMLDivElement>) => void;
  taskListHieght?: number;
  listBottomHeight?: number;
  taskListHeight?: number;
  headerHeight: number;
  // onMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
};
const TaskGanttComponent: React.ForwardRefRenderFunction<
  any,
  TaskGanttProps
> = (
  {
    gridProps,
    calendarProps,
    barProps,
    scrollX,
    onScroll,
    taskListHeight,
    listBottomHeight,
    headerHeight,
  },

  ref
) => {
  const { dates, onDateChange, columnWidth } = gridProps;
  const { viewMode } = calendarProps;
  const { ganttConfig } = useContext(GanttConfigContext);
  const ganttSVGRef = useRef<SVGSVGElement>(null);
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  const verticalGanttContainerRef = useRef<HTMLDivElement>(null);
  const newBarProps = { ...barProps, svg: ganttSVGRef };
  useImperativeHandle(ref, () => ({
    horizontalContainerRef: horizontalContainerRef.current,
    verticalGanttContainerRef: verticalGanttContainerRef.current,
  }));
  const clickBaselineItem = (offsetX: number, currentLogItem: BarTask) => {
    let startDate, endDate;
    if (viewMode === ViewMode.Day) {
      startDate = dayjs(
        dates[0].valueOf() + (offsetX / columnWidth) * daySeconds
      );
      endDate = dayjs(
        dates[0].valueOf() + (offsetX / columnWidth) * daySeconds + daySeconds
      );
      onDateChange?.(
        Object.assign(currentLogItem, {
          start: ganttConfig?.time?.length
            ? startDate?.startOf("day").toDate()
            : null,
          end: ganttConfig?.time?.length
            ? endDate?.startOf("day").toDate()
            : null,
        })
      );
    }
  };
  return (
    <div
      className={styles.ganttVerticalContainer}
      ref={verticalGanttContainerRef}
      onScroll={onScroll}
      style={{
        marginBottom: `${listBottomHeight}px`,
      }}
    >
      <div style={{ height: `${headerHeight}px` }}>
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
          <TaskGanttContent
            {...newBarProps}
            taskListHeight={taskListHeight}
            clickBaselineItem={clickBaselineItem}
            containerRef={horizontalContainerRef}
          />
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
