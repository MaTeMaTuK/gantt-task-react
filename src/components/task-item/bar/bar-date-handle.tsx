import React from "react";
// import styles from "./bar.module.css";

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
        x={type === "left" ? x - 18 : x + 18}
        y={y + 3}
        width={12}
        height={20}
        className="barHandle barHandleBg"
      />
      <rect
        x={type === "left" ? x - 14 : x + 14}
        y={y + 6}
        width={width}
        height={height}
        className="barHandle barHandleDate"
        ry={1}
        rx={1}
      />
      <rect
        x={type === "left" ? x - 10 : x + 10}
        y={y + 6}
        width={width}
        height={height}
        className="barHandle barHandleDate"
        ry={1}
        rx={1}
      />
    </g>
  );
};
