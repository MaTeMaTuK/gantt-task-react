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
import { useHover, useAddPoint } from "../hook";
export const Bar: React.FC<TaskItemProps> = ({
  task,
  isProgressChangeable,
  isDateChangeable,
  onEventStart,
  isSelected,
  jsPlumb,
  isLog,
  setPointInited,
}) => {
  const barRef = useRef<any>(null);
  const progressWidth = progressWithByParams(task.x1, task.x2, task.progress);
  const progressPoint = getProgressPoint(
    progressWidth + task.x1,
    task.y,
    task.height
  );
  const handleHeight = task.height - 12;
  // 设置端点
  const addPointFinished = useAddPoint(jsPlumb, task, barRef);
  useEffect(() => {
    if (addPointFinished) {
      setPointInited?.(addPointFinished);
    }
  }, [addPointFinished, setPointInited]);
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
  useHover(barRef, jsPlumb, task.id);
  return (
    <svg>
      <g ref={barRef} className={styles.barWrapper} tabIndex={0}>
        {!isLog && (
          <g className="barHandle">
            <rect
              x={task.x1 - 20}
              y={task.y - 3}
              width={task.x2 - task.x1 + 40}
              height={task.height + 6}
              className={`barHandle ${styles.barHandleBackground}`}
              ry={task.barCornerRadius}
              rx={task.barCornerRadius}
            />
          </g>
        )}

        <BarDisplay
          x={task.x1}
          y={task.y}
          task={task}
          width={task.x2 - task.x1}
          height={task.height}
          progressWidth={progressWidth}
          barCornerRadius={task.barCornerRadius}
          styles={!isLog ? task.styles : { ...task.styles, opacity: 0.5 }}
          isSelected={isSelected}
          id={isLog ? `${task.id}-log` : task.id}
          isLog={isLog}
          onMouseDown={e => {
            isDateChangeable && !isLog && onEventStart("move", task, e);
          }}
        />
        <g className="handleGroup">
          {isDateChangeable && !isLog && (
            <g>
              {/* left */}
              <BarDateHandle
                x={task.x1}
                y={task.y}
                width={task.handleWidth}
                height={handleHeight}
                type="left"
                onMouseDown={e => {
                  onEventStart("start", task, e);
                }}
              />
              {/* right */}
              <BarDateHandle
                x={task.x2 - task.handleWidth}
                y={task.y}
                width={task.handleWidth}
                height={handleHeight}
                type="right"
                onMouseDown={e => {
                  onEventStart("end", task, e);
                }}
              />
            </g>
          )}
          {isProgressChangeable && !isLog && (
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
