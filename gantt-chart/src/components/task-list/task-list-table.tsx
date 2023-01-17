import React from "react";
import styles from "./task-list-table.module.css";
import { TableHeader, Task } from "../../types/public-types";

// const localeDateStringCache = {};
// const toLocaleDateStringFactory =
//   (locale: string) =>
//   (date: Date, dateTimeOptions: Intl.DateTimeFormatOptions) => {
//     const key = date.toString();
//     let lds = localeDateStringCache[key];
//     if (!lds) {
//       lds = date.toLocaleDateString(locale, dateTimeOptions);
//       localeDateStringCache[key] = lds;
//     }
//     return lds;
// };
// const dateTimeOptions: Intl.DateTimeFormatOptions = {
//   weekday: "short",
//   year: "numeric",
//   month: "long",
//   day: "numeric",
// };

export const TaskListTableDefault: React.FC<{
  rowHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  locale: string;
  tasks: Task[];
  headers: TableHeader[],
  selectedTaskId: string;
  setSelectedTask: (taskId: string) => void;
  onExpanderClick: (task: Task) => void;
}> = ({
  rowHeight,
  rowWidth,
  tasks,
  fontFamily,
  fontSize,
  headers,
  // locale, 
  onExpanderClick,
}) => {
    // const toLocaleDateString = useMemo(
    //   () => toLocaleDateStringFactory(locale),
    //   [locale]
    // );

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
              {
                headers.map((rowItem, rowItemIndex) => {
                  if (rowItemIndex === 0) {
                    return (
                      <div
                        className={styles.taskListCell}
                        style={{
                          minWidth: rowWidth,
                          maxWidth: rowWidth,
                        }}
                        title={t[rowItem.key]}
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
                          <div>{t[rowItem.key] || ''}</div>
                        </div>
                      </div>
                    )
                  } else {
                    return (
                    <div
                      className={styles.taskListCell}
                      style={{
                        minWidth: rowWidth,
                        maxWidth: rowWidth,
                      }}
                    >
                      &nbsp;{t[rowItem.key] || ''}
                    </div>
                    )
                  }
                })
              }
            </div>
          );
        })}
      </div>
    );
  };
