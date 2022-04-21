import React, { useEffect, useRef } from "react";
import { TaskItemProps } from "../task-item";
import styles from "./milestone.module.css";
import { useHover, useAddPoint } from "../../task-item/hook";
import { base64Milestone } from "./utils";
export const Milestone: React.FC<TaskItemProps> = ({
  task,
  isDateChangeable,
  onEventStart,
  // isSelected,
  jsPlumb,
}) => {
  const barRef = useRef<any>(null);
  // 设置端点
  useAddPoint(jsPlumb, task, barRef, "milestone");
  useHover(barRef, jsPlumb, task.id);
  useEffect(() => {
    if (jsPlumb) {
      // 重绘元素，解决拖动时间块连接点跟随
      jsPlumb.revalidate(task.id);
    }
  }, [jsPlumb, task]);
  useEffect(() => {
    return () => {
      if (jsPlumb) {
        jsPlumb.deleteEndpoint(task.id + "-Left");
        jsPlumb.deleteEndpoint(task.id + "-Right");
      }
    };
  }, [jsPlumb, task.id]);
  // const points = useMemo(() => {
  //   return `${task.x1},${task.y + 12.5} ${task.x1 + 12.5},${task.y - 12.5} ${
  //     task.x1 + 25
  //   },${task.y - 12.5} ${task.x1 + 25},${task.y + 12.5}`;
  // }, [task]);
  return (
    <g ref={barRef} tabIndex={0} className={styles.milestoneWrapper}>
      {/* TODO:里程碑的竖线由于层级显示有问题，暂时去掉 */}
      {/* <line
        x1={task.x1 + task.height / 2}
        y1="0"
        x2={task.x1 + task.height / 2}
        y2={task.y < Number(taskListHeight) ? taskListHeight : task.y}
        style={{ stroke: "#5B42FF", strokeWidth: ".5" }}
      /> */}
      <rect
        id={task.id}
        fill="transparent"
        x={task.x1}
        width={task.height}
        y={task.y}
        height={task.height}
        className={styles.milestoneBackground}
        onMouseDown={e => {
          isDateChangeable && onEventStart("move", task, e);
        }}
      />
      <image
        href={base64Milestone}
        x={task.x1}
        y={task.y}
        width={task.height}
        height={task.height}
        onMouseDown={e => {
          isDateChangeable && onEventStart("move", task, e);
        }}
      />
    </g>
  );
};
