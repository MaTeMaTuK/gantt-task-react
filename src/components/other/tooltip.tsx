import React, { useRef, useEffect, useState } from "react";
import { Task } from "../../types/public-types";
import { BarTask } from "../../types/bar-task";
import styles from "./tooltip.module.css";

export type TooltipProps = {
  task: BarTask;
  arrowIndent: number;
  svgHeight: number;
  displayXEndpoint: number;
  rowHeight: number;
  fontSize: string;
  fontFamily: string;
  TooltipContent: React.FC<{
    task: Task;
    fontSize: string;
    fontFamily: string;
  }>;
};
export const Tooltip: React.FC<TooltipProps> = ({
  task,
  rowHeight,
  svgHeight,
  displayXEndpoint,
  arrowIndent,
  fontSize,
  fontFamily,
  TooltipContent,
}) => {
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [toolWidth, setToolWidth] = useState(1000);
  const [relatedY, setRelatedY] = useState(task.index * rowHeight);
  const [relatedX, setRelatedX] = useState(displayXEndpoint);
  useEffect(() => {
    if (tooltipRef.current) {
      const tooltipHeight = tooltipRef.current.offsetHeight;
      const tooltipY = task.index * rowHeight;
      if (tooltipY + tooltipHeight > svgHeight) {
        setRelatedY(svgHeight - tooltipHeight * 1.05);
      }
      const newWidth = tooltipRef.current.scrollWidth * 1.1;
      let newRelatedX = task.x2 + arrowIndent + arrowIndent * 0.5;
      if (newWidth + newRelatedX > displayXEndpoint) {
        newRelatedX = task.x1 - arrowIndent - arrowIndent * 0.5 - newWidth;
      }
      setToolWidth(newWidth);
      setRelatedX(newRelatedX);
    }
  }, [tooltipRef, task, arrowIndent, displayXEndpoint]);
  return (
    <foreignObject x={relatedX} y={relatedY} width={toolWidth} height={1000}>
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
