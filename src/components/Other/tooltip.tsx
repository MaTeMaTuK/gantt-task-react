import React, { useRef, useEffect, useState } from "react";
import { Task } from "../../types/public-types";
import styles from "./tooltip.module.css";

export type TooltipProps = {
  x: number;
  y: number;
  task: Task;
  fontSize: string;
  fontFamily: string;
  getTooltipContent?: (
    task: Task,
    fontSize: string,
    fontFamily: string
  ) => JSX.Element;
};
export const Tooltip: React.FC<TooltipProps> = ({
  x,
  y,
  task,
  fontSize,
  fontFamily,

  getTooltipContent = getStandardTooltipContent,
}) => {
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [toolWidth, setToolWidth] = useState(1000);
  const [relatedY, setRelatedY] = useState(y);
  useEffect(() => {
    if (tooltipRef.current) {
      const height =
        tooltipRef.current.offsetHeight +
        tooltipRef.current.offsetHeight * 0.15;
      setRelatedY(y - height);
      setToolWidth(tooltipRef.current.scrollWidth * 1.1);
    }
  }, [tooltipRef, y]);
  return (
    <foreignObject x={x} y={relatedY} width={toolWidth} height={1000}>
      <div ref={tooltipRef} className={styles.tooltipDetailsContainer}>
        {getTooltipContent(task, fontSize, fontFamily)}
      </div>
    </foreignObject>
  );
};

const getStandardTooltipContent = (
  task: Task,
  fontSize: string,
  fontFamily: string
) => {
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
      <p className={styles.tooltipDefaultContainerParagraph}>{`Duration: ${~~(
        (task.end.getTime() - task.start.getTime()) /
        (1000 * 60 * 60 * 24)
      )} day(s)`}</p>
      <p
        className={styles.tooltipDefaultContainerParagraph}
      >{`Progress: ${task.progress} %`}</p>
    </div>
  );
};
