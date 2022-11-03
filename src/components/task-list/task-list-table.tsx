import React from "react";
import styles from "./task-list-table.module.css";
import { TaskListItemComponent } from "./task-list-item-component";
import { Task } from "../../types/public-types";
// import GanttImg from '../../assets/images/Ganttgx.png'

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

// const getDateDelta = (dateFrom: Date, dateTo: Date) => {
//   const differenceInTime = dateTo.getTime() - dateFrom.getTime() 
//   const differenceInDays = differenceInTime / (1000 * 3600 * 24)
  
//   if(differenceInDays < 7 ){
//     return <p>{`${Math.floor(differenceInDays)} ds`}</p>
//   } else if ( differenceInDays >= 7 ){
//     return <p>{`${Math.floor(differenceInDays/7)} Wks`}</p>
//   }

//   return ''
// }

export const TaskListTableDefault: React.FC<{
  fontFamily: string;
  fontSize: string;
  locale: string;
  tasks: Task[];
  selectedTaskId: string;
  setSelectedTask: (taskId: string) => void;
  onExpanderClick: (task: Task) => void;
}> = ({
  tasks,
  fontFamily,
  fontSize,
  onExpanderClick,
}) => {

  return (
    <div
      className={styles.taskListWrapper}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
        width: '100%',
        padding: '0px 16px 16px 0',
      }}
    > 
      {!tasks.length && 
        <div style={{ height: '100%', width: '374px', display: 'flex', justifyContent: 'center', borderBottom: '2px solid white', borderTop: '2px solid white', textAlign: 'center', alignItems: 'center', borderRight: '1px solid #F2F2F2' }}>
          <div style={{ padding: "50px" }}>
            <span style={{ display: 'flex', justifyContent: 'center'}}>
              <img src="/assets/Ganttgx.png" alt="gantt-img" style={{ height: '75px', width: '75px'}}/>
              {/* <div style={{ height: '75px', width: '75px', borderRadius: '500px', backgroundColor:'#673F73', opacity: "0.1", }}/> */}
            </span>
            <strong><h5 style={{ fontSize: '18px' }}>No Items</h5></strong>
            <p style={{ fontSize: '13px', padding: '0 20% 10% 20%' }} >No items have been added to this gantt plan yet. Start planning your project using the <button>+</button> button</p>
          </div>
        </div>
      }
      {tasks.length && tasks.map(t => {
        // let expanderSymbol = <div className={styles.taskListCircle}></div>;

        return (
          <div style={{ maxHeight: '32px', width: '374px', display: 'flex',  height: "100%", marginLeft: '10px', borderLeft:  t.hideChildren === undefined ? '1px solid #F4F4F4' : 'none', borderBottom: '2px solid white', borderTop: '2px solid white'}}>
             <TaskListItemComponent task={t} handleExpand={onExpanderClick}/>
          </div>
        );
      })
    }
    </div>
  )
};


