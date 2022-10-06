import React from "react";
import styles from "./task-list-table.module.css";
import { Task } from "../../types/public-types";

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
//   };
// const dateTimeOptions: Intl.DateTimeFormatOptions = {
//   weekday: "short",
//   year: "numeric",
//   month: "long",
//   day: "numeric",
// };

const getDateDelta = (dateFrom: Date, dateTo: Date) => {
  const differenceInTime = dateTo.getTime() - dateFrom.getTime() 
  const differenceInDays = differenceInTime / (1000 * 3600 * 24)
  
  if(differenceInDays < 7 ){
    return <p>{`${Math.floor(differenceInDays)} ds`}</p>
  } else if ( differenceInDays >= 7 ){
    return <p>{`${Math.floor(differenceInDays/7)} Wks`}</p>
  }

  return ''
}

export const TaskListTableDefault: React.FC<{
  // rowHeight: number;
  // rowWidth: string;
  fontFamily: string;
  fontSize: string;
  locale: string;
  tasks: Task[];
  selectedTaskId: string;
  setSelectedTask: (taskId: string) => void;
  onExpanderClick: (task: Task) => void;
}> = ({
  // rowHeight,
  // rowWidth,
  tasks,
  fontFamily,
  fontSize,
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
        let expanderSymbol = <div className={styles.taskListCircle}></div>;

        
        return (
          <div style={{ maxHeight: '44px', display: 'flex', marginLeft: t.hideChildren === undefined ? '20px' : '0px', borderLeft:  t.hideChildren === undefined ? '1px solid #F4F4F4' : 'none', borderBottom: '5px solid white'}}>
            { t.hideChildren === undefined ? 
            <span style={{ display: 'flex', alignItems: 'center'}}>
               <hr className={styles.taskListLine}/> 
            </span>
             : '' }
            <div
              className={styles.taskListTableRow}
              style={{ padding: '12px 10px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              key={`${t.id}row`}
              onClick={() => onExpanderClick(t)}
            >
              <div className={ expanderSymbol ? styles.taskListExpander : styles.taskListEmptyExpander} style={{ display: 'flex' }}>
                  {expanderSymbol}
                  <div style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth:'400px', fontWeight: t.hideChildren === undefined ? 'lighter' : 'bold', fontSize: '13px' }}>
                    {t.name}
                  </div>
              </div>
              <span style={{marginRight: '5px', display: 'flex', alignItems: 'center'}}>
                <span style={{ padding: '5px', backgroundColor: 'blue', color: 'white', display:'flex', justifyContent: 'center', maxHeight:'30px', borderRadius:'5px', marginRight: '10px', width: '50p', fontSize: '13px' }}>DEC</span>
                <span style={{ width: '50px', fontSize: '13px' }}>{getDateDelta(t.start, t.end)}</span>
              </span>
            </div>
          </div>
        );
      })
    }
    </div>
  )
};


