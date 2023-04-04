import React, { Fragment, useMemo } from "react";
import styles from "./task-list-table.module.css";
import { Task } from "../../types/public-types";

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
  onInputPro?: (task: Task, nort: string) => boolean | Promise<boolean> | undefined;
  showProgress?: boolean;

}> = ({
  rowHeight,
  rowWidth,
  tasks,
  fontFamily,
  fontSize,
  locale,
  onExpanderClick,
  onInputPro,
  showProgress
}) => {



    const toLocaleDateString = useMemo(
      () => toLocaleDateStringFactory(locale),
      [locale]
    );


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
                  minWidth: rowWidth,
                  maxWidth: rowWidth,
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
                  minWidth: rowWidth,
                  maxWidth: rowWidth,
                }}
              >
                &nbsp;{toLocaleDateString(t.start, dateTimeOptions)}
              </div>

              <div
                className={styles.taskListCell}
                style={{
                  minWidth: rowWidth,
                  maxWidth: rowWidth,
                }}
              >
                &nbsp;{toLocaleDateString(t.end, dateTimeOptions)}
              </div>

              {
                (t.type != "project") ?
                  (<div className={styles.taskListCell}
                    style={{
                      minWidth: rowWidth,
                      maxWidth: rowWidth,
                    }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      {showProgress &&
                        <Fragment>
                          <button
                            className={styles.btn_style}
                            onClick={() => {
                              onInputPro ? onInputPro(t, "left5") : null
                            }}>
                            {"-5"}
                          </button>
                          <button
                            className={styles.btn_style}
                            onClick={() => {
                              onInputPro ? onInputPro(t, "left") : null
                            }}>
                            {"<"}
                          </button>
                        </Fragment>
                      }


                      <input
                        type="text"
                        style={{ width: 33, textAlign: 'center', paddingLeft: 3, paddingRight: 3 }}
                        value={t.progress}
                      />

                      {showProgress &&
                        <Fragment>
                          <button
                            className={styles.btn_style}
                            onClick={() => {
                              onInputPro ? onInputPro(t, "right") : null
                            }}>
                            {">"}
                          </button>
                          <button
                            className={styles.btn_style}
                            onClick={() => {
                              onInputPro ? onInputPro(t, "right5") : null
                            }}>
                            {"+5"}
                          </button>
                        </Fragment>
                      }
                    </div>

                  </div>) : null

              }
            </div>
          );
        })}
      </div>
    );
  };
