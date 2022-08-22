import React from "react";

type TaskLeftBarProps = {
  x: number;
  y: number;
  title?: string;
  width: number;
  height: number;
  barCornerRadius: number;
  fill: string;
  leftBarColor: string;
};
export const TaskLeftBar: React.FC<TaskLeftBarProps> = ({
  x,
  y,
  height,
  barCornerRadius,
  leftBarColor,
}) => {
  const leftBarWidth = 3;
  return (
    <foreignObject x={x} width={leftBarWidth} y={y} height={height}>
      <div
        style={{
          width: `${leftBarWidth}px`,
          overflow: "hidden",
          height: `${height}px`,
        }}
      >
        <div
          style={{
            lineHeight: `${Math.round(height)}px`,
            backgroundColor: leftBarColor,
            width: barCornerRadius * 2,
            borderRadius: barCornerRadius,
            height: `${height}px`,
          }}
        />
      </div>
    </foreignObject>
  );
};
export default TaskLeftBar;
