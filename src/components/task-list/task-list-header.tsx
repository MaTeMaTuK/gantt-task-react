import React from "react";
import styles from "./task-list-header.module.css";
import { ExtraColumn } from "../../types/public-types";

export const TaskListHeaderDefault: React.FC<{
  headerHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  extraColumns?: ExtraColumn[];
  nameColumnWidth?: string;
  fromColumnWidth?: string;
  toColumnWidth?: string;
}> = ({ 
  headerHeight, 
  fontFamily, 
  fontSize, 
  rowWidth, 
  extraColumns = [],
  nameColumnWidth,
  fromColumnWidth,
  toColumnWidth
}) => {
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
            minWidth: nameColumnWidth || rowWidth,
          }}
        >
          &nbsp;Name
        </div>
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
            minWidth: fromColumnWidth || rowWidth,
          }}
        >
          &nbsp;From
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
            minWidth: toColumnWidth || rowWidth,
          }}
        >
          &nbsp;To
        </div>
        {/* Render extra column headers */}
        {extraColumns.map((column) => (
          <React.Fragment key={column.key}>
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
                minWidth: column.width || rowWidth,
              }}
            >
              &nbsp;{column.title}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
