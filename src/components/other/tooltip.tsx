import React, { useRef, useEffect, useState, memo } from "react";
import { Task } from "../../types/public-types";
import { BarTask } from "../../types/bar-task";
import styles from "./tooltip.module.css";

export type TooltipProps = {
  task: BarTask;
  arrowIndent: number;
  svgContainerHeight: number;
  svgContainerWidth: number;
  headerHeight: number;
  taskListWidth: number;
  scrollX: number;
  scrollY: number;
  rowHeight: number;
  fontSize: string;
  fontFamily: string;
  TooltipContent: React.FC<{
    task: Task;
    fontSize: string;
    fontFamily: string;
  }>;
};
export const Tooltip: React.FC<TooltipProps> = memo(
  ({
    task,
    rowHeight,
    svgContainerHeight,
    svgContainerWidth,
    scrollX,
    scrollY,
    arrowIndent,
    fontSize,
    fontFamily,
    headerHeight,
    taskListWidth,
    TooltipContent,
  }) => {
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const [relatedY, setRelatedY] = useState(0);
    const [relatedX, setRelatedX] = useState(0);
    useEffect(() => {
      if (tooltipRef.current) {
        let newRelatedX =
          task.x2 + arrowIndent + arrowIndent * 0.5 + taskListWidth - scrollX;
        let newRelatedY = task.index * rowHeight - scrollY + headerHeight;

        const tooltipHeight = tooltipRef.current.offsetHeight * 1.1;
        const tooltipWidth = tooltipRef.current.offsetWidth * 1.1;

        const tooltipLowerPoint = tooltipHeight + newRelatedY - scrollY;
        const tooltipLeftmostPoint = tooltipWidth + newRelatedX;
        const fullChartWidth = taskListWidth + svgContainerWidth;

        if (tooltipLeftmostPoint > fullChartWidth) {
          newRelatedX =
            task.x1 +
            taskListWidth -
            arrowIndent -
            arrowIndent * 0.5 -
            scrollX -
            tooltipWidth;
        }
        if (newRelatedX < taskListWidth) {
          newRelatedX = svgContainerWidth + taskListWidth - tooltipWidth;
          newRelatedY += rowHeight;
        } else if (tooltipLowerPoint > svgContainerHeight - scrollY) {
          newRelatedX = newRelatedX + 50;
          newRelatedY = svgContainerHeight - tooltipHeight;
        }
        setRelatedY(newRelatedY);
        setRelatedX(newRelatedX);
      }
    }, [
      tooltipRef.current,
      task,
      arrowIndent,
      scrollX,
      scrollY,
      headerHeight,
      taskListWidth,
      rowHeight,
      svgContainerHeight,
      svgContainerWidth,
    ]);
    return (
      <div
        ref={tooltipRef}
        className={
          relatedX
            ? styles.tooltipDetailsContainer
            : styles.tooltipDetailsContainerHidden
        }
        style={{ left: relatedX + 30, top: relatedY < -40 ? -40 : relatedY }}
      >
        <TooltipContent
          task={task}
          fontSize={fontSize}
          fontFamily={fontFamily}
        />
      </div>
    );
  }
);

export const StandardTooltipContent: React.FC<{
  task: Task;
  fontSize: string;
  fontFamily: string;
}> = ({ task, fontSize, fontFamily }) => {
  const style = {
    fontSize,
    fontFamily,
  };
  return (
    <div className={styles.tooltipDefaultContainer} style={style}>
      <div className={styles.tooltipId}>{task?.item?.key}</div>
      <div className={styles.tooltipName}>{task.name}</div>
      <div>
        <span className={styles.tooltipTimeBefor}>开始日期：</span>
        <span className={styles.tooltipTime}>
          {task.start.getFullYear()}/{task.start.getMonth() + 1}/
          {task.start.getDate()}
        </span>
      </div>
      <div>
        <span className={styles.tooltipTimeBefor}>结束日期：</span>
        <span className={styles.tooltipTime}>
          {task.end.getFullYear()}/{task.end.getMonth() + 1}/
          {task.end.getDate()}
        </span>
      </div>
    </div>
  );
};
