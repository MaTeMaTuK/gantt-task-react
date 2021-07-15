import React, { useEffect, useState, useContext } from "react";
import { EventOption } from "../../types/public-types";
import { BarTask } from "../../types/bar-task";
import { Arrow } from "../other/arrow";
import { handleTaskBySVGMouseEvent } from "../../helpers/bar-helper";
import { isKeyboardEvent } from "../../helpers/other-helper";
import { TaskItem } from "../task-item/task-item";
import { GanttConfigContext, ConnectionHandelContext } from "../../contsxt";
import {
  offsetCalculators,
  sizeCalculators,
  relationReverse,
  //commonConfig,
  relationInit,
} from "../../helpers/jsPlumbConfig";
import {
  BarMoveAction,
  GanttContentMoveAction,
  GanttEvent,
} from "../../types/gantt-task-actions";
import { message, Modal } from "antd";
export type TaskGanttContentProps = {
  tasks: BarTask[];
  dates: Date[];
  ganttEvent: GanttEvent;
  selectedTask: BarTask | undefined;
  rowHeight: number;
  columnWidth: number;
  timeStep: number;
  svg?: React.RefObject<SVGSVGElement>;
  svgWidth: number;
  taskHeight: number;
  arrowColor: string;
  arrowIndent: number;
  fontSize: string;
  fontFamily: string;
  setGanttEvent: (value: GanttEvent) => void;
  setFailedTask: (value: BarTask | null) => void;
  setSelectedTask: (taskId: string) => void;
} & EventOption;

export const TaskGanttContent: React.FC<TaskGanttContentProps> = ({
  tasks,
  dates,
  ganttEvent,
  selectedTask,
  rowHeight,
  columnWidth,
  timeStep,
  svg,
  taskHeight,
  arrowColor,
  arrowIndent,
  fontFamily,
  fontSize,
  setGanttEvent,
  setFailedTask,
  setSelectedTask,
  onDateChange,
  onProgressChange,
  onDoubleClick,
  onDelete,
}) => {
  const point = svg?.current?.createSVGPoint();
  const [xStep, setXStep] = useState(0);
  const [initEventX1Delta, setInitEventX1Delta] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [jsPlumbInstance, setJsPlumbInstance] = useState(null);
  const { ganttConfig } = useContext(GanttConfigContext);
  const { itemLinks } = useContext(GanttConfigContext);
  const { delConnection } = useContext(ConnectionHandelContext);
  const { addConnection } = useContext(ConnectionHandelContext);
  // create xStep
  useEffect(() => {
    const dateDelta =
      dates[1].getTime() -
      dates[0].getTime() -
      dates[1].getTimezoneOffset() * 60 * 1000 +
      dates[0].getTimezoneOffset() * 60 * 1000;
    const newXStep = (timeStep * columnWidth) / dateDelta;
    setXStep(newXStep);
  }, [columnWidth, dates, timeStep]);

  useEffect(() => {
    const handleMouseMove = async (event: MouseEvent) => {
      if (!ganttEvent.changedTask || !point || !svg?.current) return;
      event.preventDefault();

      point.x = event.clientX;
      const cursor = point.matrixTransform(
        svg?.current.getScreenCTM()?.inverse()
      );

      const { isChanged, changedTask } = handleTaskBySVGMouseEvent(
        cursor.x,
        ganttEvent.action as BarMoveAction,
        ganttEvent.changedTask,
        xStep,
        timeStep,
        initEventX1Delta
      );
      if (isChanged) {
        setGanttEvent({ action: ganttEvent.action, changedTask });
      }
    };

    const handleMouseUp = async (event: MouseEvent) => {
      const { action, originalSelectedTask, changedTask } = ganttEvent;
      if (!changedTask || !point || !svg?.current || !originalSelectedTask)
        return;
      event.preventDefault();

      point.x = event.clientX;
      const cursor = point.matrixTransform(
        svg?.current.getScreenCTM()?.inverse()
      );
      const { changedTask: newChangedTask } = handleTaskBySVGMouseEvent(
        cursor.x,
        action as BarMoveAction,
        changedTask,
        xStep,
        timeStep,
        initEventX1Delta
      );

      const isNotLikeOriginal =
        originalSelectedTask.start !== newChangedTask.start ||
        originalSelectedTask.end !== newChangedTask.end ||
        originalSelectedTask.progress !== newChangedTask.progress;

      // remove listeners
      svg.current.removeEventListener("mousemove", handleMouseMove);
      svg.current.removeEventListener("mouseup", handleMouseUp);
      setGanttEvent({ action: "" });
      setIsMoving(false);

      // custom operation start
      let operationSuccess = true;
      if (
        (action === "move" || action === "end" || action === "start") &&
        onDateChange &&
        isNotLikeOriginal
      ) {
        try {
          const result = await onDateChange(newChangedTask);
          if (result !== undefined) {
            operationSuccess = result;
          }
        } catch (error) {
          operationSuccess = false;
        }
      } else if (onProgressChange && isNotLikeOriginal) {
        try {
          const result = await onProgressChange(newChangedTask);
          if (result !== undefined) {
            operationSuccess = result;
          }
        } catch (error) {
          operationSuccess = false;
        }
      }

      // If operation is failed - return old state
      if (!operationSuccess) {
        setFailedTask(originalSelectedTask);
      }
    };

    if (
      !isMoving &&
      (ganttEvent.action === "move" ||
        ganttEvent.action === "end" ||
        ganttEvent.action === "start" ||
        ganttEvent.action === "progress") &&
      svg?.current
    ) {
      svg.current.addEventListener("mousemove", handleMouseMove);
      svg.current.addEventListener("mouseup", handleMouseUp);
      setIsMoving(true);
    }
  }, [
    ganttEvent,
    xStep,
    initEventX1Delta,
    onProgressChange,
    timeStep,
    onDateChange,
    svg,
    isMoving,
  ]);

  /**
   * Method is Start point of task change
   */
  const handleBarEventStart = async (
    action: GanttContentMoveAction,
    task: BarTask,
    event?: React.MouseEvent | React.KeyboardEvent
  ) => {
    if (!event) {
      if (action === "select") {
        setSelectedTask(task.id);
      }
    }
    // Keyboard events
    else if (isKeyboardEvent(event)) {
      if (action === "delete") {
        if (onDelete) {
          try {
            const result = await onDelete(task);
            if (result !== undefined && result) {
              setGanttEvent({ action, changedTask: task });
            }
          } catch (error) {
            console.error("Error on Delete. " + error);
          }
        }
      }
    }
    // Mouse Events
    else if (action === "mouseenter") {
      if (!ganttEvent.action) {
        setGanttEvent({
          action,
          changedTask: task,
          originalSelectedTask: task,
        });
      }
    } else if (action === "mouseleave") {
      if (ganttEvent.action === "mouseenter") {
        setGanttEvent({ action: "" });
      }
    } else if (action === "dblclick") {
      !!onDoubleClick && onDoubleClick(task);
    }
    // Change task event start
    else if (action === "move") {
      if (!svg?.current || !point) return;
      point.x = event.clientX;
      const cursor = point.matrixTransform(
        svg.current.getScreenCTM()?.inverse()
      );
      setInitEventX1Delta(cursor.x - task.x1);
      setGanttEvent({
        action,
        changedTask: task,
        originalSelectedTask: task,
      });
    } else {
      setGanttEvent({
        action,
        changedTask: task,
        originalSelectedTask: task,
      });
    }
  };
  const getLinkTypeId = (start: string, end: string) => {
    const linkType = relationReverse(start, end);
    return ganttConfig.relation[linkType];
  };
  useEffect(() => {
    import("jsplumb").then(({ jsPlumb }: any) => {
      jsPlumb.ready(() => {
        const instance = jsPlumb.getInstance();
        instance.fire("jsPlumbDemoLoaded", instance);
        setJsPlumbInstance(instance);
      });
    });
  }, []);
  useEffect(() => {
    if (jsPlumbInstance) {
      // @ts-ignore
      jsPlumbInstance.unbind("click");
      // @ts-ignore
      jsPlumbInstance.unbind("beforeDrop");
      // @ts-ignore
      jsPlumbInstance.unbind("connection");
      // @ts-ignore
      const originalOffset = jsPlumbInstance.getOffset;
      // @ts-ignore
      const originalSize = jsPlumbInstance.getSize;
      // @ts-ignore
      jsPlumbInstance.getOffset = function (el: any) {
        const tn = el.tagName.toUpperCase();
        if (offsetCalculators[tn]) {
          return offsetCalculators[tn](el);
        } else return originalOffset.apply(this, [el]);
      };
      // @ts-ignore
      jsPlumbInstance.getSize = function (el: any) {
        const tn = el.tagName.toUpperCase();
        if (sizeCalculators[tn]) {
          return sizeCalculators[tn](el);
        } else return originalSize.apply(this, [el]);
      };
      // @ts-ignore
      jsPlumbInstance.setContainer("horizontalContainer");
      // 删除连线
      // @ts-ignore
      jsPlumbInstance.bind("click", function (conn: any) {
        const currentLink = itemLinks.filter((ele: any) => {
          return (
            ele.source.objectId === conn.sourceId &&
            ele.destination.objectId === conn.targetId &&
            ele.linkType.objectId === conn.getData()
          );
        });
        if (currentLink.length) {
          Modal.confirm({
            title: "解除关联关系",
            content: "确定要解除卡片的关联关系吗？",
            okText: "确认",
            cancelText: "取消",
            onOk: () => delConnection(currentLink[0].objectId),
          });
        }
      });
      // 连线前校验
      // @ts-ignore
      jsPlumbInstance.bind("beforeDrop", (conn: any) => {
        if (conn.targetId === conn.sourceId) {
          message.warning("连线有误");
          return false;
        }
        const linkTypeId = getLinkTypeId(
          conn.connection.endpoints[0].anchor.type,
          conn.dropEndpoint.anchor.type
        );
        const currentLink = itemLinks.filter((ele: any) => {
          return (
            ele.source.objectId === conn.sourceId &&
            ele.destination.objectId === conn.targetId &&
            ele.linkType.objectId === linkTypeId
          );
        });
        if (currentLink.length) {
          message.warning("连线有误");
          return false;
        }
        return true;
      });
      // @ts-ignore
      jsPlumbInstance.bind("connection", (infor: any, originalEvent: any) => {
        const linkTypeId = getLinkTypeId(
          infor.connection.endpoints[0].anchor.type,
          infor.connection.endpoints[1].anchor.type
        );
        const params = {
          source: infor.sourceId,
          destination: infor.targetId,
          linkType: linkTypeId,
        };
        if (originalEvent) {
          infor.connection.setData(linkTypeId);
          addConnection(params);
        }
      });
    }
  }, [jsPlumbInstance, itemLinks]);
  useEffect(() => {
    if (itemLinks.length && tasks.length && jsPlumbInstance) {
      // 删除所有连线
      // @ts-ignore
      jsPlumbInstance.deleteEveryConnection();
      tasks.forEach((task: any) => {
        // 找到需要连线的卡片
        const itemFilter = itemLinks?.filter((ele: any) => {
          return ele.source.objectId === task.id;
        });
        itemFilter.forEach((ele: any) => {
          let relationType = "";
          for (const key in ganttConfig.relation) {
            if (ganttConfig.relation[key] === ele.linkType.objectId) {
              relationType = key;
              continue;
            }
          }
          setTimeout(() => {
            // @ts-ignore
            const connect = jsPlumbInstance.connect({
              uuids: [
                `${ele.source.objectId}-${relationInit[relationType][0]}`,
                `${ele.destination.objectId}-${relationInit[relationType][1]}`,
              ],
            });
            // 给连线设置linkType
            connect.setData(ganttConfig.relation[relationType]);
          }, 20);
        });
      });
    }
  }, [itemLinks, jsPlumbInstance]);
  return (
    <g className="content">
      <g className="arrows" fill={arrowColor} stroke={arrowColor}>
        {tasks.map(task => {
          return task.barChildren.map(child => {
            return (
              <Arrow
                key={`Arrow from ${task.id} to ${tasks[child].id}`}
                taskFrom={task}
                taskTo={tasks[child]}
                rowHeight={rowHeight}
                taskHeight={taskHeight}
                arrowIndent={arrowIndent}
              />
            );
          });
        })}
      </g>
      <g className="bar" fontFamily={fontFamily} fontSize={fontSize}>
        {tasks.map(task => {
          if (!task.start || !task.end) {
            return null;
          }
          return (
            <TaskItem
              jsPlumb={jsPlumbInstance}
              task={task}
              arrowIndent={arrowIndent}
              taskHeight={taskHeight}
              isProgressChangeable={!!onProgressChange && !task.isDisabled}
              isDateChangeable={!!onDateChange && !task.isDisabled}
              isDelete={!task.isDisabled}
              onEventStart={handleBarEventStart}
              key={task.id}
              isSelected={!!selectedTask && task.id === selectedTask.id}
            />
          );
        })}
      </g>
    </g>
  );
};
