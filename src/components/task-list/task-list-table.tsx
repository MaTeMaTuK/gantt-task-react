import React, { useEffect, useMemo, useState } from "react";
import styles from "./task-list-table.module.css";
import { Task } from "../../types/public-types";
import cloneDeep from 'lodash/cloneDeep'

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
  isShowEndTime: boolean;
  isShowStartTime: boolean;
  setSelectedTask: (taskId: string) => void;
  onExpanderClick: (task: Task) => void;
}> = ({
  rowHeight,
  rowWidth,
  tasks,
  fontFamily,
  fontSize,
  locale,
  onExpanderClick,
  isShowEndTime,
  isShowStartTime
}) => {
    const _tasks = cloneDeep(tasks)
    const [currentTask, setCurrentTask] = useState(_tasks)
    useEffect(()=>{
      setCurrentTask(tasks)
    }, [tasks])
    const toLocaleDateString = useMemo(
      () => toLocaleDateStringFactory(locale),
      [locale]
    );
    const handleMouseOver = (index:number) => {
      const arr = _tasks.map((item, i) => {
        return i === index ? {...item, isShowTableTooltip:true} : {...item}
      })
      setCurrentTask(arr)
    }
    const handleMouseLeave = () => {
      setCurrentTask(_tasks) 
    }
    return (
      <div
        className={styles.taskListWrapper}
        style={{
          fontFamily: fontFamily,
          fontSize: fontSize,
        }}
      >
        {currentTask.map((t, index) => {
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
                  <div style={expanderSymbol ? {} : {margin:'0 1rem'}} onMouseOver={() => handleMouseOver(index)} onMouseLeave={() => handleMouseLeave()}>
                    {t.name}
                  </div>
                </div>
              </div>
              {
              t?.isShowTableTooltip && 
              <div className={styles.tooltipDefaultContainer} style={{top:`${index * rowHeight}px`}}>
                <div className={styles.tooltipText}>
                  {t.name}
                </div>
              </div>
              }
              {isShowStartTime && <div
                className={styles.taskListCell}
                style={{
                  minWidth: rowWidth,
                  maxWidth: rowWidth,
                }}
              >
                &nbsp;{toLocaleDateString(t.start, dateTimeOptions)}
              </div>
              }
              {isShowEndTime && <div
                className={styles.taskListCell}
                style={{
                  minWidth: rowWidth,
                  maxWidth: rowWidth,
                }}
              >
                &nbsp;{toLocaleDateString(t.end, dateTimeOptions)}
              </div>
              }
            </div>
          );
        })}
      </div>
    );
  };
