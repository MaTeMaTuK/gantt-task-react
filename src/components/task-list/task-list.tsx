import React, { useEffect, useRef } from "react";
import { BarTask } from "../../types/bar-task";
import { Task, ExtraColumn, DateFormat } from "../../types/public-types";

export type TaskListProps = {
  headerHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  rowHeight: number;
  ganttHeight: number;
  scrollY: number;
  locale: string;
  tasks: Task[];
  taskListRef: React.RefObject<HTMLDivElement>;
  horizontalContainerClass?: string;
  selectedTask: BarTask | undefined;
  setSelectedTask: (task: string) => void;
  onExpanderClick: (task: Task) => void;
  extraColumns?: ExtraColumn[];
  nameColumnWidth?: string;
  fromColumnWidth?: string;
  toColumnWidth?: string;
  dateFormat?: DateFormat;
  TaskListHeader: React.FC<{
    headerHeight: number;
    rowWidth: string;
    fontFamily: string;
    fontSize: string;
    extraColumns?: ExtraColumn[];
    nameColumnWidth?: string;
    fromColumnWidth?: string;
    toColumnWidth?: string;
  }>;
  TaskListTable: React.FC<{
    rowHeight: number;
    rowWidth: string;
    fontFamily: string;
    fontSize: string;
    locale: string;
    tasks: Task[];
    selectedTaskId: string;
    setSelectedTask: (taskId: string) => void;
    onExpanderClick: (task: Task) => void;
    extraColumns?: ExtraColumn[];
    nameColumnWidth?: string;
    fromColumnWidth?: string;
    toColumnWidth?: string;
    dateFormat?: DateFormat;
  }>;
};

export const TaskList: React.FC<TaskListProps> = ({
  headerHeight,
  fontFamily,
  fontSize,
  rowWidth,
  rowHeight,
  scrollY,
  tasks,
  selectedTask,
  setSelectedTask,
  onExpanderClick,
  locale,
  ganttHeight,
  taskListRef,
  horizontalContainerClass,
  extraColumns,
  nameColumnWidth,
  fromColumnWidth,
  toColumnWidth,
  dateFormat,
  TaskListHeader,
  TaskListTable,
}) => {
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (horizontalContainerRef.current) {
      horizontalContainerRef.current.scrollTop = scrollY;
    }
  }, [scrollY]);

  const headerProps = {
    headerHeight,
    fontFamily,
    fontSize,
    rowWidth,
    extraColumns,
    nameColumnWidth,
    fromColumnWidth,
    toColumnWidth,
  };
  const selectedTaskId = selectedTask ? selectedTask.id : "";
  const tableProps = {
    rowHeight,
    rowWidth,
    fontFamily,
    fontSize,
    tasks,
    locale,
    selectedTaskId: selectedTaskId,
    setSelectedTask,
    onExpanderClick,
    extraColumns,
    nameColumnWidth,
    fromColumnWidth,
    toColumnWidth,
    dateFormat,
  };

  return (
    <div ref={taskListRef}>
      <TaskListHeader {...headerProps} />
      <div
        ref={horizontalContainerRef}
        className={horizontalContainerClass}
        style={ganttHeight ? { height: ganttHeight } : {}}
      >
        <TaskListTable {...tableProps} />
      </div>
    </div>
  );
};
