import React from "react";
import style from "./bar.module.css";
import { BarTask } from "../../../types/bar-task";

type BarDisplayProps = {
  x: number;
  y: number;
  task?: BarTask;
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
    barBackgroundColorTimeError?: string;
    opacity?: number;
  };
  onMouseDown: (event: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void;
  id: string;
  isLog?: boolean | undefined;
};
export const BarDisplay: React.FC<BarDisplayProps> = ({
  x,
  y,
  width,
  height,
  isSelected,
  progressWidth,
  barCornerRadius,
  styles,
  onMouseDown,
  id,
  task,
  isLog,
}) => {
  const getBarColor = () => {
    return task?.isTimeErrorItem || task?.isDelayItem
      ? styles.barBackgroundColorTimeError
      : isSelected
      ? styles.backgroundSelectedColor
      : styles.backgroundColor;
  };
  return (
    <g onMouseDown={onMouseDown}>
      <rect
        id={id}
        x={x}
        width={width}
        y={y}
        height={height}
        ry={barCornerRadius}
        rx={barCornerRadius}
        fill={getBarColor()}
        className={style.barBackground}
      />
      <rect
        x={x + progressWidth}
        width={width - progressWidth}
        y={y}
        height={height}
        style={{ opacity: isLog ? 0.8 : 0.4 }}
        fill="#fff"
      />
    </g>
  );
};
