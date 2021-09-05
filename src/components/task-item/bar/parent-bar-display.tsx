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
  const getBarColor = () => {
    return isSelected ? styles.backgroundSelectedColor : styles.backgroundColor;
  };
  const triangleX = task.x2 - task.x1 > 15 ? 15 : 2;
  const triangleY = 2;

  const projectLeftTriangle = [
    task.x1,
    task.y + task.height - triangleY,
    task.x1,
    task.y + task.height + triangleY + 3,
    task.x1 + triangleX,
    task.y + task.height - triangleY,
  ].join(",");
  const projectRightTriangle = [
    task.x2,
    task.y + task.height - triangleY,
    task.x2,
    task.y + task.height + triangleY + 3,
    task.x2 - triangleX,
    task.y + task.height - triangleY,
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
        x={x + progressWidth}
        width={width - progressWidth}
        y={y}
        height={height + 5}
        style={{ opacity: 0.4 }}
        fill="#fff"
      />
    </g>
  );
};
