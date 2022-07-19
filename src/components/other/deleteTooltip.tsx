import React, { useRef, useEffect, useState, memo, useMemo } from "react";
import { Task, ConnectionProps } from "../../types/public-types";
import UnconnectionIcon from "../icons/unconnection";
import ConnectionIcon from "../icons/connection";
import { Tooltip } from "antd";
import { dayFormat } from "../../helpers/dicts";
import dayjs from "dayjs";
import useI18n from "../../lib/hooks/useI18n";

import styles from "./deleteTooltip.module.css";

export type TooltipProps = ConnectionProps & {
  tasks: Task[];
  taskListWidth: number;
  currentConnection?: any;
  boundTop: number;
  svgContainerHeight: number;
};
export const DeleteTooltip: React.FC<TooltipProps> = memo(
  ({
    tasks,
    delConnection,
    taskListWidth,
    itemLinks,
    currentConnection,
    boundTop,
    setCurrentConnection,
    svgContainerHeight,
  }) => {
    const { t } = useI18n();
    const path = window.location.origin;
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const [relatedY, setRelatedY] = useState(0);
    const [relatedX, setRelatedX] = useState(0);
    const sourceTask = useMemo(() => {
      return tasks.filter(ele => {
        return ele.id === currentConnection.connection.sourceId;
      });
    }, [currentConnection.connection.sourceId, tasks]);
    const targetTask = useMemo(() => {
      return tasks.filter(
        ele => ele.id === currentConnection.connection.targetId
      );
    }, [currentConnection.connection.targetId, tasks]);
    useEffect(() => {
      if (tooltipRef.current) {
        const tooltipHeight = tooltipRef.current.offsetHeight;
        const newRelatedY =
          currentConnection?.originalEvent?.clientY - boundTop + tooltipHeight >
          svgContainerHeight
            ? currentConnection?.originalEvent?.clientY -
              boundTop -
              tooltipHeight
            : currentConnection?.originalEvent?.clientY - boundTop;
        const newRelatedX =
          currentConnection?.originalEvent?.clientX - taskListWidth;
        setRelatedY(newRelatedY);
        setRelatedX(newRelatedX);
      }
    }, [
      tasks,
      taskListWidth,
      boundTop,
      currentConnection?.originalEvent?.clientX,
      currentConnection?.originalEvent?.clientY,
      svgContainerHeight,
    ]);
    const removeConnection = async () => {
      const currentLink = itemLinks?.filter((ele: any) => {
        return (
          ele.source?.objectId === currentConnection.connection?.sourceId &&
          ele.destination?.objectId ===
            currentConnection.connection?.targetId &&
          ele.linkType?.objectId === currentConnection.connection.getData()
        );
      });
      if (currentLink?.length) {
        await delConnection?.(currentLink?.[0]?.objectId);
        setCurrentConnection?.(null);
      }
    };
    return (
      <div
        ref={tooltipRef}
        className={styles.tooltipDeleteContainer}
        style={{ left: relatedX + 30, top: relatedY < -40 ? -40 : relatedY }}
      >
        {currentConnection && (
          <div className={styles.tooltipDeleteDefaultContainer}>
            <div className={styles.taskInfo}>
              <div className={styles.title}>
                {sourceTask[0]?.item?.itemType?.icon && (
                  <img src={`${path}${sourceTask[0].item.itemType.icon}`} />
                )}

                <span> {sourceTask[0]?.name}</span>
              </div>
              <div className={styles.date}>
                {currentConnection.connection?.endpoints?.[0].anchor
                  ?.cssClass === "Right"
                  ? `${t("fields.startDate")}：${dayjs(
                      sourceTask[0]?.end
                    ).format(dayFormat)}`
                  : `${t("fields.endDate")}：${dayjs(
                      sourceTask[0]?.start
                    ).format(dayFormat)}`}
              </div>
            </div>
            <div className={styles.connect}>
              <div className={styles.connection}>
                <div className={styles.connectionLine} />
                <span className={styles.connectionIcon}>
                  <ConnectionIcon style={{ fontSize: "18px" }} />
                </span>
                <div className={styles.connectionLine} />
              </div>
              <Tooltip
                title={t("fields.release")}
                className={styles.unconnectionIcon}
              >
                <span onClick={removeConnection}>
                  <UnconnectionIcon />
                </span>
              </Tooltip>
            </div>
            <div className={styles.taskInfo}>
              <div className={styles.title}>
                {targetTask[0]?.item?.itemType?.icon && (
                  <img src={`${path}${targetTask[0].item.itemType.icon}`} />
                )}

                <span>{targetTask[0]?.name}</span>
              </div>
              <div className={styles.date}>
                {currentConnection.connection?.endpoints[1]?.anchor
                  ?.cssClass === "Right"
                  ? `${t("fields.endDate")}：${dayjs(targetTask[0]?.end).format(
                      dayFormat
                    )}`
                  : `${t("fields.startDate")}：${dayjs(
                      targetTask[0]?.start
                    ).format(dayFormat)}`}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);
