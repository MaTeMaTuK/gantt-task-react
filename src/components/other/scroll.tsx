import React, { SyntheticEvent } from "react";
import styles from "./scroll.module.css";

export const Scroll: React.FC<{
  ganttHeight: number;
  ganttFullHeight: number;
  headerHeight: number;
  onScroll: (event: SyntheticEvent<HTMLDivElement>) => void;
}> = ({ ganttHeight, ganttFullHeight, headerHeight, onScroll }) => {
  return (
    <div
      style={{ height: ganttHeight, marginTop: headerHeight }}
      className={styles.scroll}
      onScroll={onScroll}
    >
      <div style={{ height: ganttFullHeight, width: 1 }} />
    </div>
  );
};
