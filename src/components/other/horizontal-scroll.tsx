import React, { SyntheticEvent, forwardRef } from "react";
import styles from "./horizontal-scroll.module.css";

export const HorizontalScrollComponent: React.ForwardRefRenderFunction<
  any,
  {
    svgWidth: number;
    taskListWidth: number;
    listBottomHeight: number;
    onScroll: (event: SyntheticEvent<HTMLDivElement>) => void;
  }
> = ({ svgWidth, taskListWidth, onScroll, listBottomHeight }, ref) => {
  const dividerWidth = 15;

  return (
    <div
      style={{
        marginLeft: taskListWidth + dividerWidth,
        width: `calc(100% - ${taskListWidth}px)`,
        bottom: `${listBottomHeight}px`,
      }}
      className={styles.scroll}
      onScroll={onScroll}
      ref={ref}
    >
      <div style={{ width: svgWidth, height: 1 }} />
    </div>
  );
};

export const HorizontalScroll = forwardRef(HorizontalScrollComponent);
