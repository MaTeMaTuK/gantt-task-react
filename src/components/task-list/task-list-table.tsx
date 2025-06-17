import React, { useMemo } from "react";
import styles from "./task-list-table.module.css";
import { Task, ExtraColumn, DateFormat } from "../../types/public-types";

const localeDateStringCache = {};
const toLocaleDateStringFactory =
  (locale: string) =>
  (date: Date, dateTimeOptions: Intl.DateTimeFormatOptions) => {
    const key = date.toString();
    let lds = localeDateStringCache[key];
    if (!lds) {
      lds = date.toLocaleDateString(locale, dateTimeOptions);
      localeDateStringCache[key] = lds;
    }
    return lds;
  };

const toISODateString = (date: Date): string => {
  return date.toISOString().split("T")[0]; // Returns yyyy-MM-dd format
};

const dateTimeOptions: Intl.DateTimeFormatOptions = {
  weekday: "short",
  year: "numeric",
  month: "long",
  day: "numeric",
};

export const TaskListTableDefault: React.FC<{
  rowHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  locale: string;
  tasks: Task[];
  selectedTaskId: string;
  setSelectedTask: (taskId: string) => void;
  onExpanderClick: (task: Task) => void;
  extraColumns?: ExtraColumn[];
  nameColumnWidth?: string;
  fromColumnWidth?: string;
  toColumnWidth?: string;
  dateFormat?: DateFormat;
}> = ({
  rowHeight,
  rowWidth,
  tasks,
  fontFamily,
  fontSize,
  locale,
  onExpanderClick,
  extraColumns = [],
  nameColumnWidth,
  fromColumnWidth,
  toColumnWidth,
  dateFormat = "locale",
}) => {
  const toLocaleDateString = useMemo(
    () => toLocaleDateStringFactory(locale),
    [locale]
  );

  const formatDate = useMemo(() => {
    if (dateFormat === "iso8601") {
      return toISODateString;
    }
    return (date: Date) => toLocaleDateString(date, dateTimeOptions);
  }, [dateFormat, toLocaleDateString]);

  return (
    <div
      className={styles.taskListWrapper}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
      }}
    >
      {tasks.map(t => {
        let expanderSymbol = "";
        if (t.hideChildren === false) {
          expanderSymbol = "▼";
        } else if (t.hideChildren === true) {
          expanderSymbol = "▶";
        }

        return (
          <div
            className={styles.taskListTableRow}
            style={{ height: rowHeight }}
            key={`${t.id}row`}
          >
            <div
              className={styles.taskListCell}
              style={{
                minWidth: nameColumnWidth || rowWidth,
                maxWidth: nameColumnWidth || rowWidth,
              }}
              title={t.name}
            >
              <div className={styles.taskListNameWrapper}>
                <div
                  className={
                    expanderSymbol
                      ? styles.taskListExpander
                      : styles.taskListEmptyExpander
                  }
                  onClick={() => onExpanderClick(t)}
                >
                  {expanderSymbol}
                </div>
                <div>{t.name}</div>
              </div>
            </div>
            <div
              className={styles.taskListCell}
              style={{
                minWidth: fromColumnWidth || rowWidth,
                maxWidth: fromColumnWidth || rowWidth,
              }}
            >
              &nbsp;{formatDate(t.start)}
            </div>
            <div
              className={styles.taskListCell}
              style={{
                minWidth: toColumnWidth || rowWidth,
                maxWidth: toColumnWidth || rowWidth,
              }}
            >
              &nbsp;{formatDate(t.end)}
            </div>
            {/* Render extra column values */}
            {extraColumns.map((column) => (
              <div
                key={column.key}
                className={styles.taskListCell}
                style={{
                  minWidth: column.width || rowWidth,
                  maxWidth: column.width || rowWidth,
                }}
                title={column.render ? undefined : String(t.extraColumns?.[column.key] || "")}
              >
                {column.render 
                  ? column.render(t)
                  : t.extraColumns?.[column.key] || ""
                }
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};
