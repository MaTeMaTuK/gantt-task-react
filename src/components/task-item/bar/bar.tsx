import React, { useEffect, useRef } from "react";
import {
  progressWithByParams,
  getProgressPoint,
} from "../../../helpers/bar-helper";
import { BarDisplay } from "./bar-display";
import { BarDateHandle } from "./bar-date-handle";
import { BarProgressHandle } from "./bar-progress-handle";
import { TaskItemProps } from "../task-item";
import styles from "./bar.module.css";
import { commonConfig } from "../../../helpers/jsPlumbConfig";
export const Bar: React.FC<TaskItemProps> = ({
  task,
  isProgressChangeable,
  isDateChangeable,
  onEventStart,
  isSelected,
  jsPlumb,
}) => {
  const barRef = useRef(null);
  const progressWidth = progressWithByParams(task.x1, task.x2, task.progress);
  const progressPoint = getProgressPoint(
    progressWidth + task.x1,
    task.y,
    task.height
  );
  const handleHeight = task.height - 2;
  useEffect(() => {
    if (jsPlumb) {
      // 生成新节点删除旧节点时需设置setIdChanged
      jsPlumb.setIdChanged(task.id, task.id);
      jsPlumb.addEndpoint(
        task.id,
        {
          anchors: "Right",
          uuid: task.id + "-Right",
        },

        commonConfig
      );
      // @ts-ignore
      jsPlumb.addEndpoint(
        task.id,
        {
          anchor: "Left",
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
  }, [jsPlumb, task.y]);
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
  }, [jsPlumb]);
  useEffect(() => {}, [barRef, jsPlumb]);
  return (
    <svg ref={barRef}>
      <g className={styles.barWrapper} tabIndex={0}>
        <BarDisplay
          x={task.x1}
          y={task.y}
          task={task}
          width={task.x2 - task.x1}
          height={task.height}
          progressWidth={progressWidth}
          barCornerRadius={task.barCornerRadius}
          styles={task.styles}
          isSelected={isSelected}
          id={task.id}
          onMouseDown={e => {
            isDateChangeable && onEventStart("move", task, e);
          }}
        />
        <g className="handleGroup">
          {isDateChangeable && (
            <g>
              {/* left */}
              <BarDateHandle
                x={task.x1 + 1}
                y={task.y + 1}
                width={task.handleWidth}
                height={handleHeight}
                barCornerRadius={task.barCornerRadius}
                onMouseDown={e => {
                  onEventStart("start", task, e);
                }}
              />
              {/* right */}
              <BarDateHandle
                x={task.x2 - task.handleWidth - 1}
                y={task.y + 1}
                width={task.handleWidth}
                height={handleHeight}
                barCornerRadius={task.barCornerRadius}
                onMouseDown={e => {
                  onEventStart("end", task, e);
                }}
              />
            </g>
          )}
          {isProgressChangeable && (
            <BarProgressHandle
              progressPoint={progressPoint}
              onMouseDown={e => {
                onEventStart("progress", task, e);
              }}
            />
          )}
        </g>
      </g>
    </svg>
  );
};
