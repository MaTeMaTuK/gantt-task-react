import React from "react";

import cx from "classnames";

import styles from "./bar.module.css";

type BarRelationHandleProps = {
  x: number;
  y: number;
  radius: number;
  isRelationDrawMode: boolean;
  onMouseDown: (event: React.MouseEvent<SVGCircleElement, MouseEvent>) => void;
};
export const BarRelationHandle: React.FC<BarRelationHandleProps> = ({
  x,
  y,
  radius,
  isRelationDrawMode,
  onMouseDown,
}) => {
  return (
    <circle
      cx={x}
      cy={y}
      r={radius}
      className={cx(styles.barRelationHandle, {
        [styles.barRelationHandle_drawMode]: isRelationDrawMode,
      })}
      onMouseDown={onMouseDown}
      data-draw-mode={isRelationDrawMode}
    />
  );
};
