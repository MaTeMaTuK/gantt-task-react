import React, { useEffect } from "react";
import { TaskItemProps } from "../task-item";
import styles from "./milestone.module.css";
import { commonConfig } from "../../../helpers/jsPlumbConfig";
// import mileStone from "../../../static/img/mile-stone.png";
export const Milestone: React.FC<TaskItemProps> = ({
  task,
  isDateChangeable,
  onEventStart,
  isSelected,
  jsPlumb,
}) => {
  const transform = `rotate(45 ${task.x1 + task.height * 0.356}
    ${task.y + task.height * 0.85})`;
  // const transform = `rotate(0)`;
  const getBarColor = () => {
    return isSelected
      ? task.styles.backgroundSelectedColor
      : task.styles.backgroundColor;
  };
  useEffect(() => {
    if (jsPlumb) {
      // 生成新节点删除旧节点时需设置setIdChanged
      jsPlumb.setIdChanged(task.id, task.id);
      jsPlumb.addEndpoint(
        task.id,
        {
          anchor: [1, 0.5, 1, 0, 22, 4, "Right"],
          uuid: task.id + "-Right",
        },

        commonConfig
      );
      jsPlumb.addEndpoint(
        task.id,
        {
          anchor: [0, 0.5, -1, 0, -22, 4, "Left"],
          uuid: task.id + "-Left",
        },
        commonConfig
      );
    }
    return () => {
      if (jsPlumb) {
        jsPlumb.deleteEndpoint(task.id + "-Left");
        jsPlumb.deleteEndpoint(task.id + "-Right");
      }
    };
  }, [jsPlumb, task.y, task.id]);
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
    <g tabIndex={0} className={styles.milestoneWrapper}>
      <rect
        id={task.id}
        fill={getBarColor()}
        x={task.x1}
        width={task.height}
        y={task.y}
        height={task.height}
        rx={task.barCornerRadius}
        ry={task.barCornerRadius}
        transform={transform}
        className={styles.milestoneBackground}
        onMouseDown={e => {
          isDateChangeable && onEventStart("move", task, e);
        }}
      />
    </g>
  );
};
