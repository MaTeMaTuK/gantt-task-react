import React from "react";
import styles from "./task-list-header.module.css";

export const TaskListHeaderDefault: React.FC<{
  headerHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  textAlign?: 'left' | 'center' | 'right';
  labels?: {
    name?: string,
    from?: string,
    to?: string;
  };
}> = ({ headerHeight, fontFamily, fontSize, rowWidth, textAlign, labels }) => {
  return (
    <div
      className={styles.ganttTable}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize
      }}
    >
      <div
        className={styles.ganttTable_Header}
        style={{
          height: headerHeight - 2,
        }}
      >
        <div
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: rowWidth,
            textAlign
          }}
        >
          &nbsp;{labels?.name ?? 'Name'}
        </div>
        <div
          className={styles.ganttTable_HeaderSeparator}
          style={{
            height: headerHeight * 0.5,
            marginTop: headerHeight * 0.2,
            textAlign
          }}
        />
        <div
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: rowWidth,
            textAlign
          }}
        >
          &nbsp;{labels?.from ?? 'From'}
        </div>
        <div
          className={styles.ganttTable_HeaderSeparator}
          style={{
            height: headerHeight * 0.5,
            marginTop: headerHeight * 0.25,
          }}
        />
        <div
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: rowWidth,
            textAlign
          }}
        >
          &nbsp;{labels?.to ?? 'To'}
        </div>
      </div>
    </div>
  );
};
