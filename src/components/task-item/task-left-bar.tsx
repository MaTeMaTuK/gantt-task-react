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
  return (
    <g>
      <rect
        x={x}
        width={3} // 3为TaskLeftBar的固定宽度
        y={y}
        height={height}
        ry={barCornerRadius}
        rx={barCornerRadius}
        fill={leftBarColor}
      />
      {/* 用一个没有圆角的矩形盖住上一个矩形的右上和右下的圆角 */}
      <rect x={x + 2} width={1} y={y} height={height} fill={leftBarColor} />
    </g>
  );
};
export default TaskLeftBar;
