import React, { Fragment } from 'react';
import styles from "./task-list-table.module.css"
import { Task } from "../../types/public-types";;


type Props = {
    task: Task,
    handleExpand: (task: Task) => void;
}

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


const Expander = ({task} : {task:Task}) => (
    <Fragment>
        {task.hideChildren === undefined && 
        task.project &&
        <div className={task.type === "milestone" ? styles.taskListLineWrapperHalfBorder : styles.taskListLineWrapperFullBorder} >
            <hr className={styles.taskListLine}/> 
        </div> 
        }
    </Fragment>

)

export const TaskListItemComponent = ({task, handleExpand} : Props ) => {

    const onExpand = (task:Task) => handleExpand(task);
    
    const expanderSymbol = <div className={styles.taskListCircle}></div>;

    console.log(task)

    return(
        <Fragment>
            <Expander task={task}/>
            <div
                className={styles.taskListTableRow}
                key={`${task.id}row`}
                onClick={() => onExpand(task)}>
            <div 
                className={ expanderSymbol ? styles.taskListExpander : styles.taskListEmptyExpander}
                style={{ display: 'flex', alignItems: 'center' }}>
                {expanderSymbol}
                <div className={ styles.taskListTableRowTitle } style={{fontWeight: task.hideChildren === undefined ? '400' : '700'}} >
                    {task.name}
                </div>
            </div>
            <span className={ styles.taskListTableRowMetaWrapper }>
                <span className={ styles.taskListTableRowMetaItem } style={{backgroundColor: '#330066', visibility: (task.type !== 'milestone' && task.workStream) ? 'visible' : 'hidden'}}>
                        {task.workStream}
                </span>
                <span className={ styles.taskListTableRowMetaTime }>
                    {getDateDelta(task.start, task.end)}
                </span>
            </span>
        </div>
      </Fragment>
    )
}