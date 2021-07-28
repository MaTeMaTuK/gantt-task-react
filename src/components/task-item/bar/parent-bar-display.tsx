import React from "react";
import style from "./bar.module.css";
import { BarTask } from "../../../types/bar-task";

type BarDisplayProps = {
  x: number;
  y: number;
  task: BarTask;
  width: number;
  height: number;
  isSelected: boolean;
  progressWidth: number;
  barCornerRadius: number;
  styles: {
    backgroundColor: string;
    backgroundSelectedColor: string;
    progressColor: string;
    progressSelectedColor: string;
  };
  onMouseDown: (event: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void;
};
export const BarDisplay: React.FC<BarDisplayProps> = ({
  x,
  y,
  task,
  width,
  height,
  isSelected,
  progressWidth,
  barCornerRadius,
  styles,
  onMouseDown,
}) => {
  const getProcessColor = () => {
    return isSelected ? styles.progressSelectedColor : styles.progressColor;
  };

  const getBarColor = () => {
    return isSelected ? styles.backgroundSelectedColor : styles.backgroundColor;
  };

  const projectLeftTriangle = [
    task.x1,
    task.y + task.height - 1,
    task.x1,
    task.y + task.height + 5,
    task.x1 + 5,
    task.y + task.height - 1,
  ].join(",");
  const projectRightTriangle = [
    task.x2,
    task.y + task.height - 1,
    task.x2,
    task.y + task.height + 5,
    task.x2 - 5,
    task.y + task.height - 1,
  ].join(",");

  return (
    <g onMouseDown={onMouseDown}>
      <rect
        x={x}
        width={width}
        y={y}
        height={height}
        ry={barCornerRadius}
        rx={barCornerRadius}
        fill={getBarColor()}
        className={style.barBackground}
      />
      <polygon points={projectLeftTriangle} fill={getBarColor()} />
      <polygon points={projectRightTriangle} fill={getBarColor()} />
      <rect
        x={x}
        width={progressWidth}
        y={y}
        height={height}
        ry={barCornerRadius}
        rx={barCornerRadius}
        style={{ opacity: 0.6 }}
        fill={getProcessColor()}
      />
    </g>
  );
};
