import React from "react";
import { TableHeader } from "../../types/public-types";
import styles from "./task-list-header.module.css";

export const TaskListHeaderDefault: React.FC<{
  headerHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  headers: TableHeader[],
}> = ({ headerHeight, fontFamily, fontSize, rowWidth, headers }) => {

  return (
    <div
      className={styles.ganttTable}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
        backgroundColor: 'gray',
      }}
    >
      <div
        className={styles.ganttTable_Header}
        style={{
          height: headerHeight - 2,
        }}
      >
        {
          headers.map((headerItem, headerIndex) => {
            return (
              <React.Fragment key={headerItem.title}>
                <div
                  className={styles.ganttTable_HeaderItem}
                  style={{
                    minWidth: rowWidth,
                  }}
                >
                  &nbsp;{headerItem.title}
                </div>
                {
                  headerIndex !== headers.length - 1 && (
                    <div
                      className={styles.ganttTable_HeaderSeparator}
                      style={{
                        height: headerHeight * 0.5,
                        marginTop: headerHeight * 0.2,
                      }}
                    />
                  )
                }
              </React.Fragment>
            )
          })
        }
      </div>
    </div>
  );
};
