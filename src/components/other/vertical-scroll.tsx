import React, { SyntheticEvent, forwardRef, memo } from "react";
import styles from "./vertical-scroll.module.css";

const VerticalScrollComponent: React.ForwardRefRenderFunction<
  any,
  {
    ganttHeight: number;
    ganttFullHeight: number;
    headerHeight: number;
    listBottomHeight: number;
    onScroll: (event: SyntheticEvent<HTMLDivElement>) => void;
  }
> = (
  { ganttHeight, ganttFullHeight, headerHeight, onScroll, listBottomHeight },
  ref
) => {
  const scrollHeight = 16;
  return (
    <div
      style={{
        height: ganttHeight || "auto",
        marginTop: headerHeight,
        marginBottom: `${listBottomHeight + scrollHeight}px`,
      }}
      className={styles.scroll}
      onScroll={onScroll}
      ref={ref}
    >
      <div style={{ height: ganttFullHeight, width: 1 }} />
    </div>
  );
};

export const VerticalScroll = memo(forwardRef(VerticalScrollComponent));
