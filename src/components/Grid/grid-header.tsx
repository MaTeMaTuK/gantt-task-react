import React from "react";
import styles from "./grid.module.css";

export type GridHeaderProps = {
  gridWidth: number;
  headerHeight: number;
};
export const GridHeader: React.FC<GridHeaderProps> = ({
  gridWidth,
  headerHeight,
}) => {
  return (
    <rect
      x="0"
      y="0"
      width={gridWidth}
      height={headerHeight}
      className={styles.gridHeader}
    />
  );
};
