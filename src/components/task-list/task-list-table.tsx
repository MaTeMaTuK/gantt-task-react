import React from "react";
import styles from "./task-list-table.module.css";
import { TaskListItemComponent } from "./task-list-item-component";
import { Task } from "../../types/public-types";

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
        <div className={styles.taskListEmptyContentWrapper}>
          <div style={{ padding: "50px" }}>
            <img src="/assets/Ganttgx.png" alt="gantt-img"/>
            <h5>No Items</h5>
            <p>
              No items have been added to this gantt plan yet. Start planning your project using the <button>+</button> button
            </p>
          </div>
        </div>
      }
      {tasks.length && tasks.map(t => {
        return (
          <div style={{ maxHeight: '32px', width: '359px', display: 'flex',  height: "100%", marginLeft: '10px', borderLeft:  t.hideChildren === undefined ? '1px solid #F4F4F4' : 'none', borderBottom: '2px solid white', borderTop: '2px solid white'}}>
             <TaskListItemComponent task={t} handleExpand={onExpanderClick}/>
          </div>
        );
      })
    }
    </div>
  )
};


