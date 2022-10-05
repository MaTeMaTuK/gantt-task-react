import React from "react";
import style from "./bar.module.css";

type BarDisplayProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected: boolean;
  /* progress start point */
  progressX: number;
  progressWidth: number;
  barCornerRadiusX: string;
  barCornerRadiusY: string;
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
  width,
  height,
  isSelected,
  // progressX,
  // progressWidth,
  barCornerRadiusX,
  barCornerRadiusY,
  styles,
  onMouseDown,
}) => {
  // const getProcessColor = () => {
  //   return isSelected ? styles.progressSelectedColor : styles.progressColor;
  // };

  const getBarColor = () => {
    return isSelected ? styles.backgroundSelectedColor : styles.backgroundColor;
  };

  return (
    <g onMouseDown={onMouseDown}>
      <rect
        x={x}
        width={width}
        y={y}
        height={height}
        ry={barCornerRadiusY}
        rx={barCornerRadiusX}
        fill={getBarColor()}
        className={style.barBackground}
      />

    </g>
  );
};
