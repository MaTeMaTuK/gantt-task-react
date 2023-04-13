import React from "react";
import styles from "./task-list-header.module.css";

export const TaskListHeaderDefault: React.FC<{
  headerHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  headerTitle: string;
  headerStartTitle: string;
  headerEndTitle: string;
  isShowStartTime: boolean;
  isShowEndTime: boolean;
}> = ({ headerHeight, fontFamily, fontSize, rowWidth, headerTitle, headerStartTitle, headerEndTitle, isShowStartTime, isShowEndTime}) => {
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
        }}
      >
        <div
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: rowWidth,
          }}
        >
          &nbsp;{headerTitle}
        </div>
        {isShowStartTime && <div>
        <div
          className={styles.ganttTable_HeaderSeparator}
          style={{
            height: headerHeight * 0.5,
            marginTop: headerHeight * 0.2,
          }}
        />
        <div
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: rowWidth,
          }}
        >
          &nbsp;{headerStartTitle}
        </div>
        </div>
}
        {isShowEndTime && <div>
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
            }}
          >
            &nbsp;{headerEndTitle}
          </div>
        </div>
        }
      </div>
    </div>
  );
};
