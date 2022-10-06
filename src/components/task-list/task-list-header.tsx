import React from "react";
import styles from "./task-list-header.module.css";

export const TaskListHeaderDefault: React.FC<{
  headerHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
}> = ({ headerHeight, fontFamily, fontSize }) => {
  return (
    <div
      className={styles.ganttTable}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
      }}
    >
      <div
        className={styles.ganttTable_Header}
        style={{
          height: headerHeight - 2,
          paddingLeft: "10px",
          fontWeight: 700,
          fontSize: "12px",
          lineHeight: "16px",
          alignItems: 'end'
        }}
      > 
      <span style={{ marginBottom: "5px" }}>
        PHASES & ACTIVITIES & OUTCOMES
      </span>
      </div>
    </div>
  );
};
