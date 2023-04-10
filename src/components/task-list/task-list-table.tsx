import React, { Fragment, useMemo } from "react";
import styles from "./task-list-table.module.css";
import { Task } from "../../types/public-types";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Input } from "reactstrap";
import { Edit2 } from 'react-feather';

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
  onInputPro?: (task: Task, progress: number) => boolean | Promise<boolean> | undefined;
  onEditNameTask?: (task: Task) => boolean | undefined;
  showProgress?: boolean;

}> = ({
  rowHeight,
  rowWidth,
  tasks,
  fontFamily,
  fontSize,
  locale,
  // onExpanderClick,
  onInputPro,
  onEditNameTask,
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
          // let expanderSymbol = "";
          // if (t.hideChildren === false) {
          //   expanderSymbol = "▼";
          // } else if (t.hideChildren === true) {
          //   expanderSymbol = "▶";
          // }

          return (
            <div
              className={styles.taskListTableRow}
              style={{ height: rowHeight, fontSize: 12 }}
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
                  {/* <div
                    className={
                      expanderSymbol
                        ? styles.taskListExpander
                        : styles.taskListEmptyExpander
                    }
                    onClick={() => onExpanderClick(t)}
                  >
                    {expanderSymbol}
                  </div> */}

                  <div style={{ display: "flex", alignItems: 'center', paddingLeft: 5}}>
                    {(t.type != "project") &&
                      <Edit2
                        color={'#a3a3ff'}
                        size={12}
                        className='mx-0'
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          // alert(`${t.id}row`);
                          onEditNameTask ? onEditNameTask(t) : null
                        }}
                      />
                    }
                    <div style={{ marginLeft: 3}}>{t.name}</div>
                  </div>
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
                      minWidth: 90,
                      maxWidth: rowWidth,
                    }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      {showProgress &&
                        <Fragment>
                          <Input
                            style={{ width: 85, fontSize: 12 }}
                            type="select" onChange={(e) => {
                              // console.log(e.target.value)
                              onInputPro ? onInputPro(t, parseInt(e?.target?.value)) : null
                            }}
                          >
                            <option selected={t.progress == 0} value={0}>0 %</option>
                            <option selected={t.progress == 25} value={25}>25 %</option>
                            <option selected={t.progress == 50} value={50}>50 %</option>
                            <option selected={t.progress == 75} value={75}>75 %</option>
                            <option selected={t.progress == 100} value={100}>100 %</option>
                          </Input>
                        </Fragment>
                      }
                    </div>

                  </div>) : null

              }
            </div>
          );
        })}
      </div >
    );
  };
