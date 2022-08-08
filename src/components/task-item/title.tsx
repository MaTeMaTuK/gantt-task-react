import React from "react";
import styles from "./title.module.css";

type TitleProps = {
  x: number;
  y: number;
  title?: string;
  width: number;
  height: number;
  color: string;
};
export const BarTitle: React.FC<TitleProps> = ({
  x,
  y,
  width,
  height,
  title,
  color,
}) => {
  return (
    <foreignObject x={x} width={width} y={y} height={height}>
      <div
        className={styles.overflow_ellipsis}
        style={{
          lineHeight: `${height}px`,
          color: color,
        }}
      >
        {title}
      </div>
    </foreignObject>
  );
};
export default BarTitle;
