import React, { useRef, useEffect, useState } from "react";
import { Task } from "../../types/public-types";
import { BarTask } from "../../types/bar-task";
import styles from "./tooltip.module.css";

export type TooltipProps = {
  task: BarTask;
  arrowIndent: number;
  rtl: boolean;
  svgContainerHeight: number;
  svgContainerWidth: number;
  svgWidth: number;
  headerHeight: number;
  taskListWidth: number;
  scrollX: number;
  scrollY: number;
  rowHeight: number;
  fontSize: string;
  fontFamily: string;
  locale: string;
  days: string;
  duration: string;
  progress: string;
  TooltipContent: React.FC<{
    task: Task;
    fontSize: string;
    fontFamily: string;
    locale: string;
    days: string;
    duration: string;
    progress: string;
  }>;
};
export const Tooltip: React.FC<TooltipProps> = ({
  task,
  rowHeight,
  rtl,
  svgContainerHeight,
  svgContainerWidth,
  scrollX,
  scrollY,
  arrowIndent,
  fontSize,
  fontFamily,
  locale,
  days,
  duration,
  progress,
  headerHeight,
  taskListWidth,
  TooltipContent,
}) => {
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [relatedY, setRelatedY] = useState(0);
  const [relatedX, setRelatedX] = useState(0);
  useEffect(() => {
    if (tooltipRef.current) {
      const tooltipHeight = tooltipRef.current.offsetHeight * 1.1;
      const tooltipWidth = tooltipRef.current.offsetWidth * 1.1;

      let newRelatedY = task.index * rowHeight - scrollY + headerHeight;
      let newRelatedX: number;
      if (rtl) {
        newRelatedX = task.x1 - arrowIndent * 1.5 - tooltipWidth - scrollX;
        if (newRelatedX < 0) {
          newRelatedX = task.x2 + arrowIndent * 1.5 - scrollX;
        }
        const tooltipLeftmostPoint = tooltipWidth + newRelatedX;
        if (tooltipLeftmostPoint > svgContainerWidth) {
          newRelatedX = svgContainerWidth - tooltipWidth;
          newRelatedY += rowHeight;
        }
      } else {
        newRelatedX = task.x2 + arrowIndent * 1.5 + taskListWidth - scrollX;
        const tooltipLeftmostPoint = tooltipWidth + newRelatedX;
        const fullChartWidth = taskListWidth + svgContainerWidth;
        if (tooltipLeftmostPoint > fullChartWidth) {
          newRelatedX =
            task.x1 +
            taskListWidth -
            arrowIndent * 1.5 -
            scrollX -
            tooltipWidth;
        }
        if (newRelatedX < taskListWidth) {
          newRelatedX = svgContainerWidth + taskListWidth - tooltipWidth;
          newRelatedY += rowHeight;
        }
      }

      const tooltipLowerPoint = tooltipHeight + newRelatedY - scrollY;
      if (tooltipLowerPoint > svgContainerHeight - scrollY) {
        newRelatedY = svgContainerHeight - tooltipHeight;
      }
      setRelatedY(newRelatedY);
      setRelatedX(newRelatedX);
    }
  }, [
    tooltipRef,
    task,
    arrowIndent,
    scrollX,
    scrollY,
    headerHeight,
    taskListWidth,
    rowHeight,
    svgContainerHeight,
    svgContainerWidth,
    rtl,
  ]);

  return (
    <div
      ref={tooltipRef}
      className={
        relatedX
          ? styles.tooltipDetailsContainer
          : styles.tooltipDetailsContainerHidden
      }
      style={{ left: relatedX, top: relatedY }}
    >
      <TooltipContent 
        task={task} 
        fontSize={fontSize} 
        fontFamily={fontFamily} 
        locale={locale} 
        days={days}
        duration={duration}
        progress={progress} />
    </div>
  );
};

export interface TooltipContentProps {
  task: Task;
  fontSize: string;
  fontFamily: string;
  locale: string;
  days: string;
  duration: string;
  progress: string;
};

export const StandardTooltipContent: React.FC<TooltipContentProps> = ({ 
  task, 
  fontSize, 
  fontFamily, 
  locale,
  days,
  duration,
  progress 
}) => {
  const style = {
    fontSize,
    fontFamily,
  };

  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "numeric",
  };

  const formaDate = (date: Date) => date.toLocaleDateString(locale, dateTimeOptions);

  return (
    <div className={styles.tooltipDefaultContainer} style={style}>
      <b style={{ fontSize: fontSize + 6 }}>{formaDate(task.start)} - {formaDate(task.end)}</b>
      {task.end.getTime() - task.start.getTime() !== 0 && (
        <p className={styles.tooltipDefaultContainerParagraph}>{`${duration}: ${(
          (task.end.getTime() - task.start.getTime()) /
          (1000 * 60 * 60 * 24)
        )} ${days}(s)`}</p>
      )}

      <p className={styles.tooltipDefaultContainerParagraph}>
        {!!task.progress && `${progress}: ${task.progress} %`}
      </p>
    </div>
  );
};