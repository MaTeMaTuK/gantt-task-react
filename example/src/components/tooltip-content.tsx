import React from "react";
import useTranslation from "next-translate/useTranslation"
import moment from 'moment'
import { Task } from "nka-gantt-task-react"

import styles from "./tooltip.module.css"

export const TooltipContent: React.FC<{
  task: Task;
  fontSize: string;
  fontFamily: string;
}> = ({ task, fontSize, fontFamily }) => {
  const style = {
    fontSize,
    fontFamily,
  };

  const { t } = useTranslation('common')

  return (
    <div className={styles.tooltipDefaultContainer} style={style}>
      <b style={{ fontSize: fontSize + 6 }}>{`${task.name}`}</b>
      <p className='mt-2'><b style={{ fontSize: fontSize }}>{`${t('inicio')}: `}</b> {moment(task.start).format(process.env.NEXT_PUBLIC_DATE_TIME_FORMAT)}</p>
      <p><b style={{ fontSize: fontSize }}>{`${t('fim')}: `}</b> {moment(task.end).format(process.env.NEXT_PUBLIC_DATE_TIME_FORMAT)}</p>

      <p><b style={{ fontSize: fontSize }}>{`${t('duracao')}: `}</b> {task.duration}</p>
      <p><b style={{ fontSize: fontSize }}>{`${t('progresso')}: `}</b> {task.progress} %</p>
    </div>
  );
};