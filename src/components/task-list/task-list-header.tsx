import React from "react";
import styles from "./task-list-header.module.css";

export const TaskListHeaderDefault: React.FC<{
  headerHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  headersList: [string];
}> = ({ headerHeight, fontFamily, fontSize, rowWidth, headersList }) => {
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
        {headersList.map((e, i, array) => {
          <>
            <div
              className={styles.ganttTable_HeaderItem}
              style={{
                minWidth: rowWidth,
              }}
            >
              &nbsp;{e}
            </div>

            {array.length !== i + 1 && (
              <div
                className={styles.ganttTable_HeaderSeparator}
                style={{
                  height: headerHeight * 0.5,
                  marginTop: headerHeight * 0.25,
                }}
              />
            )}
          </>;
        })}
      </div>
    </div>
  );
};
