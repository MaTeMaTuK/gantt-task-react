import React, { useRef, useEffect, useState, memo, useMemo } from "react";
import { Task, Assignee, WorkFlowStatusColor } from "../../types/public-types";
import { dayFormat } from "../../helpers/dicts";

import dayjs from "dayjs";
import { BarTask } from "../../types/bar-task";
import useI18n from "../../lib/hooks/useI18n";

import styles from "./tooltip.module.css";

export type TooltipProps = {
  task: BarTask;
  arrowIndent: number;
  svgContainerHeight: number;
  svgContainerWidth: number;
  headerHeight: number;
  taskListWidth: number;
  scrollX: number;
  scrollY: number;
  rowHeight: number;
  fontSize: string;
  fontFamily: string;
  TooltipContent: React.FC<{
    task: Task;
    fontSize: string;
    fontFamily: string;
    userAvatar?: JSX.Element;
    workFlowStatusColor?: WorkFlowStatusColor;
  }>;
  renderUserAvatar?: (assignee: Assignee[]) => JSX.Element;
  workFlowStatusColor?: WorkFlowStatusColor;
};
export const Tooltip: React.FC<TooltipProps> = memo(
  ({
    task,
    rowHeight,
    svgContainerHeight,
    svgContainerWidth,
    scrollX,
    scrollY,
    arrowIndent,
    fontSize,
    fontFamily,
    headerHeight,
    taskListWidth,
    TooltipContent,
    renderUserAvatar,
    workFlowStatusColor,
  }) => {
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const [relatedY, setRelatedY] = useState(0);
    const [relatedX, setRelatedX] = useState(0);
    const UserAvatar = useMemo(() => {
      if (typeof renderUserAvatar === "function") {
        return renderUserAvatar(task?.item?.assignee);
      }
      return <React.Fragment />;
    }, [renderUserAvatar, task?.item?.assignee]);
    useEffect(() => {
      if (tooltipRef.current) {
        let newRelatedX =
          task.x2 + arrowIndent + arrowIndent * 0.5 + taskListWidth - scrollX;
        let newRelatedY = task.index * rowHeight - scrollY + headerHeight;

        const tooltipHeight = tooltipRef.current.offsetHeight * 1.1;
        const tooltipWidth = tooltipRef.current.offsetWidth * 1.1;

        const tooltipLowerPoint = tooltipHeight + newRelatedY - scrollY;
        const tooltipLeftmostPoint = tooltipWidth + newRelatedX;
        const fullChartWidth = taskListWidth + svgContainerWidth;

        if (tooltipLeftmostPoint > fullChartWidth) {
          newRelatedX =
            task.x1 +
            taskListWidth -
            arrowIndent -
            arrowIndent * 0.5 -
            scrollX -
            tooltipWidth;
        }
        if (newRelatedX < taskListWidth) {
          newRelatedX = svgContainerWidth + taskListWidth - tooltipWidth;
          newRelatedY += rowHeight;
        } else if (tooltipLowerPoint > svgContainerHeight - scrollY) {
          newRelatedX = newRelatedX + 50;
          newRelatedY = svgContainerHeight - tooltipHeight;
        }
        setRelatedY(newRelatedY);
        setRelatedX(newRelatedX);
      }
    }, [
      task,
      arrowIndent,
      scrollX,
      scrollY,
      headerHeight,
      taskListWidth,
      rowHeight,
      svgContainerHeight,
      svgContainerWidth,
    ]);
    return (
      <div
        ref={tooltipRef}
        className={
          relatedX
            ? styles.tooltipDetailsContainer
            : styles.tooltipDetailsContainerHidden
        }
        style={{
          left: task?.type === "milestone" ? relatedX + 10 : relatedX + 30,
          top: relatedY < -40 ? -40 : relatedY,
        }}
      >
        <TooltipContent
          task={task}
          fontSize={fontSize}
          fontFamily={fontFamily}
          userAvatar={UserAvatar}
          workFlowStatusColor={workFlowStatusColor}
        />
      </div>
    );
  }
);

export const StandardTooltipContent: React.FC<{
  task: Task;
  fontSize: string;
  fontFamily: string;
  userAvatar?: JSX.Element;
  workFlowStatusColor?: WorkFlowStatusColor;
}> = ({ task, fontSize, fontFamily, userAvatar, workFlowStatusColor }) => {
  const statusColor = useMemo(() => {
    return workFlowStatusColor?.[task?.item?.status?.type];
  }, [task?.item?.status?.type, workFlowStatusColor]);
  const { t } = useI18n();
  const style = {
    fontSize,
    fontFamily,
  };
  return (
    <div className={styles.tooltipDefaultContainer} style={style}>
      {task.type !== "milestone" ? (
        <div className={styles.tooltipId}>{task?.item?.key}</div>
      ) : null}
      <div className={styles.tooltipName}>{task.name}</div>
      {task.type === "milestone" ? (
        <div className={styles.item}>
          <div>
            <span className={styles.lightColor}>{t("fields.status")}：</span>
            <span
              className={styles.status}
              style={{
                backgroundColor: statusColor?.bgColor,
                color: statusColor?.color,
              }}
            >
              {task?.item?.status?.name}
            </span>
          </div>
          <div>
            <span className={styles.lightColor}>{t("fields.charge")}：</span>
            {userAvatar}
          </div>
          <div className={styles.lightColor}>
            <span>{t("fields.completeTime")}：</span>
            <span>{dayjs(task.end).format(dayFormat)}</span>
          </div>
        </div>
      ) : (
        <div className={`${styles.lightColor} ${styles.item}`}>
          <div>
            <span>{t("fields.startDate")}：</span>
            <span>{dayjs(task.start).format(dayFormat)}</span>
          </div>
          <div>
            <span>{t("fields.endDate")}：</span>
            <span>{dayjs(task.end).format(dayFormat)}</span>
          </div>
        </div>
      )}
    </div>
  );
};
