import React, { useRef, useEffect, useState } from "react";
import { Task } from "../../types/public-types";
import { BarTask } from "../../types/bar-task";
import styles from "./tooltip.module.css";

export type TooltipProps = {
  x: number;
  svgHeight: number;
  rowHeight: number;
  task: BarTask;
  fontSize: string;
  fontFamily: string;
  TooltipContent: React.FC<{
    task: Task;
    fontSize: string;
    fontFamily: string;
  }>;
};
export const Tooltip: React.FC<TooltipProps> = ({
  x,
  rowHeight,
  svgHeight,
  task,
  fontSize,
  fontFamily,
  TooltipContent,
}) => {
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [toolWidth, setToolWidth] = useState(1000);
  const [relatedY, setRelatedY] = useState((task.index - 1) * rowHeight);
  useEffect(() => {
    if (tooltipRef.current) {
      const tooltipHeight = tooltipRef.current.offsetHeight;
      const tooltipY = task.index * rowHeight + rowHeight;
      if (tooltipHeight > tooltipY) {
        setRelatedY(tooltipHeight * 0.5);
      } else if (tooltipY + tooltipHeight > svgHeight) {
        setRelatedY(svgHeight - tooltipHeight * 1.05);
      }
      setToolWidth(tooltipRef.current.scrollWidth * 1.1);
    }
  }, [tooltipRef, task]);
  return (
    <foreignObject x={x} y={relatedY} width={toolWidth} height={1000}>
      <div ref={tooltipRef} className={styles.tooltipDetailsContainer}>
        <TooltipContent
          task={task}
          fontSize={fontSize}
          fontFamily={fontFamily}
        />
      </div>
    </foreignObject>
  );
};

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
      <b style={{ fontSize: fontSize + 6 }}>{`${
        task.name
      }: ${task.start.getDate()}-${
        task.start.getMonth() + 1
      }-${task.start.getFullYear()} - ${task.end.getDate()}-${
        task.end.getMonth() + 1
      }-${task.end.getFullYear()}`}</b>
      {task.end.getTime() - task.start.getTime() !== 0 && (
        <p className={styles.tooltipDefaultContainerParagraph}>{`Duration: ${~~(
          (task.end.getTime() - task.start.getTime()) /
          (1000 * 60 * 60 * 24)
        )} day(s)`}</p>
      )}

      <p className={styles.tooltipDefaultContainerParagraph}>
        {!!task.progress && `Progress: ${task.progress} %`}
      </p>
    </div>
  );
};
