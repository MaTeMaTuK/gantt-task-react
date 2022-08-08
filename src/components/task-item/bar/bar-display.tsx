import React, { useMemo } from "react";
import style from "./bar.module.css";
import { BarTask } from "../../../types/bar-task";
import TaskLeftBar from "../task-left-bar";

import {
  barBackgroundColorPivotalPath,
  barBackgroundColorTimeError,
  defaultColor,
  defaultLeftBarColor,
} from "../../../helpers/dicts";
import { TaskDisplayProps } from "../../../../src/types/public-types";

import BarTitle from "../title";

interface BarDisplayProps extends TaskDisplayProps {
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
    color?: string;
    leftBarColor?: string;
    progressSelectedColor: string;
    opacity?: number;
  };
  onMouseDown: (event: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void;
  id: string;
  isLog?: boolean | undefined;
}
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
  isShowTaskTitle,
  isShowTaskLeftBar,
}) => {
  const getBarColor = () => {
    return task?.isTimeErrorItem || task?.isOverdueItem
      ? barBackgroundColorTimeError
      : task?.isPivotalPathItem
      ? barBackgroundColorPivotalPath
      : isSelected
      ? styles.backgroundSelectedColor
      : styles.backgroundColor;
  };
  const getColor = useMemo(() => {
    return styles?.color ?? defaultColor;
  }, [styles?.color]);
  const getLeftBarColor = useMemo(() => {
    return styles?.leftBarColor ?? defaultLeftBarColor;
  }, [styles?.leftBarColor]);
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
      {isShowTaskTitle && (
        <TaskLeftBar
          x={x}
          y={y}
          width={width}
          height={height}
          fill={getBarColor()}
          barCornerRadius={barCornerRadius}
          leftBarColor={getLeftBarColor}
        />
      )}
      {isShowTaskLeftBar && (
        <BarTitle
          x={x}
          y={y}
          width={width}
          height={height}
          title={task?.name}
          color={getColor}
        />
      )}

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
