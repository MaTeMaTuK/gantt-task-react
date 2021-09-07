import React from "react";
import styles from "./bar.module.css";

type BarDateHandleProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  onMouseDown: (event: React.MouseEvent<SVGRectElement, MouseEvent>) => void;
};
export const BarDateHandle: React.FC<BarDateHandleProps> = ({
  x,
  y,
  width,
  height,
  type,
  onMouseDown,
}) => {
  return (
    <g onMouseDown={onMouseDown}>
      <rect
        x={type === "left" ? x - 11 : x + 11}
        y={y + 6}
        width={width}
        height={height}
        className={`${styles.barHandle} ${styles.barHandleDate}`}
        ry={1}
        rx={1}
      />
      <rect
        x={type === "left" ? x - 7 : x + 7}
        y={y + 6}
        width={width}
        height={height}
        className={`${styles.barHandle} ${styles.barHandleDate}`}
        ry={1}
        rx={1}
      />
    </g>
  );
};
