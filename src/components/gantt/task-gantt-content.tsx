import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  memo,
} from "react";
import { EventOption, ConnectionProps } from "../../types/public-types";
import { BarTask } from "../../types/bar-task";
import { Arrow } from "../other/arrow";
import { handleTaskBySVGMouseEvent } from "../../helpers/bar-helper";
import { isKeyboardEvent } from "../../helpers/other-helper";
import {
  errorLinkBorderColor,
  pivotalPathLinkBorderColor,
} from "../../helpers/dicts";
import { TaskItem } from "../task-item/task-item";
import { TaskItemLog } from "../task-item/task-item-log";
import { GanttConfigContext } from "../../contsxt";
import { filter, isEqual } from "lodash";
import {
  offsetCalculators,
  sizeCalculators,
  relationReverse,
  relationInit,
} from "../../helpers/jsPlumbConfig";
import {
  BarMoveAction,
  GanttContentMoveAction,
  GanttEvent,
} from "../../types/gantt-task-actions";
import { message } from "antd";

export type TaskGanttContentProps = {
  tasks: BarTask[];
  logTasks: BarTask[];
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
  taskListHeight?: number;
  clickBaselineItem?: (offsetX: number, currentLogItem: BarTask) => void;
  containerRef?: React.MutableRefObject<any>;
} & EventOption &
  ConnectionProps;

export const TaskGanttContent: React.FC<TaskGanttContentProps> = memo(
  ({
    tasks,
    logTasks,
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
    addConnection,
    itemLinks,
    taskListHeight,
    clickBaselineItem,
    setCurrentConnection,
    currentConnection,
    containerRef,
  }) => {
    const [connectUuids, setConnectUuids] = useState([]);
    const point = svg?.current?.createSVGPoint();
    const [xStep, setXStep] = useState(0);
    const [initEventX1Delta, setInitEventX1Delta] = useState(0);
    // 是否正在拖动时间bar
    const [isMoving, setIsMoving] = useState(false);
    // 是否正在连线
    const [jsPlumbInstance, setJsPlumbInstance] = useState<any>(null);
    const { ganttConfig } = useContext(GanttConfigContext);
    const [pointInited, setPointInited] = useState(false);

    useEffect(() => {
      const connectClickHandle = () => {
        if (currentConnection) {
          currentConnection?.connection?.removeClass("select-connection");
          setCurrentConnection?.(null);
        }
      };
      const container = containerRef?.current;
      container?.addEventListener("click", connectClickHandle, true);
      return () => {
        container?.removeEventListener("click", connectClickHandle, true);
      };
    }, [containerRef, setCurrentConnection, currentConnection]);
    useEffect(() => {
      if (!currentConnection && jsPlumbInstance) {
        const connections = jsPlumbInstance.getConnections();
        connections.forEach((ele: any) => {
          ele.removeClass("select-connection");
        });
      }
    }, [currentConnection, jsPlumbInstance]);
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
        ["move", "end", "start", "progress"].includes(ganttEvent.action) &&
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
      point,
      setFailedTask,
      setGanttEvent,
    ]);

    /**
     * Method is Start point of task change
     */
    const handleBarEventStart = useCallback(
      async (
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
        } else if (action === "click") {
          const offsetX = event?.nativeEvent?.offsetX;
          // 当前基线时间块对应的item
          const currentLogItem = tasks.filter(
            (ele: BarTask) => ele.id === task.id
          );
          // item的开始时间和结束时间为空时，点击基线时间块可以添加时间
          if (!(currentLogItem?.[0]?.end && currentLogItem?.[0]?.start)) {
            clickBaselineItem?.(offsetX, currentLogItem[0]);
          }
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
      },
      [
        ganttEvent.action,
        onDelete,
        onDoubleClick,
        point,
        setGanttEvent,
        setSelectedTask,
        svg,
        clickBaselineItem,
        tasks,
      ]
    );
    const getLinkTypeId = useCallback(
      (start: string, end: string) => {
        const linkType = relationReverse(start, end);
        return ganttConfig.relation[linkType];
      },
      [ganttConfig.relation]
    );

    const getHasLinkItems = useCallback(task => {
      // 获取与当前事项有关联关系的事项列表
      const hasLinkItems = task?.link || {};
      let needUpdateItems: string[] = [];
      Object.keys(hasLinkItems).map(type => {
        if (hasLinkItems[type]) {
          Object.keys(hasLinkItems[type]).map(linkType => {
            if (hasLinkItems[type][linkType]) {
              needUpdateItems = needUpdateItems.concat(
                hasLinkItems[type][linkType]
              );
            }
          });
        }
      });
      return needUpdateItems;
    }, []);

    const checkIsPivotalPathLink = useCallback(
      (task, target, tasks, relationType) => {
        const targetPivotalPathItem = tasks.filter(
          (ele: BarTask) => ele.id === target && ele?.isPivotalPathItem
        );
        if (
          task?.isPivotalPathItem &&
          targetPivotalPathItem?.length &&
          relationType === "FS"
        ) {
          return true;
        }
        return false;
      },
      []
    );

    const checkIsErrorLink = useCallback(
      (task, target) => {
        // 获取与当前事项有关联关系的事项列表
        const needUpdateItems = getHasLinkItems(task);
        // 获取当前事项的子代事项
        const subItems: string[] = task?.item?.subItem || [];

        let flag = false;
        // 关联关系为目标节点的事项
        const targetItems = needUpdateItems.filter(id => id === target);
        if (targetItems?.length > 1) {
          flag = true;
          return flag;
        }
        // 父子存在关联关系
        if ((task?.item?.ancestors || []).includes(target)) {
          flag = true;
          return flag;
        }
        subItems.forEach(item => {
          if (needUpdateItems.includes(item)) {
            flag = true;
          }
        });
        return flag;
      },
      [getHasLinkItems]
    );
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
        const originalOffset = jsPlumbInstance.getOffset;
        const originalSize = jsPlumbInstance.getSize;
        jsPlumbInstance.getOffset = function (el: any) {
          const tn = el.tagName.toUpperCase();
          if (offsetCalculators[tn]) {
            return offsetCalculators[tn](el);
          } else return originalOffset.apply(this, [el]);
        };
        jsPlumbInstance.getSize = function (el: any) {
          const tn = el.tagName.toUpperCase();
          if (sizeCalculators[tn]) {
            return sizeCalculators[tn](el);
          } else return originalSize.apply(this, [el]);
        };
        jsPlumbInstance.setContainer("horizontalContainer");
        // 连线前校验
        jsPlumbInstance.bind("beforeDrop", (conn: any) => {
          const taskSource = filter(tasks, { id: conn.sourceId })[0];
          const taskTarget = filter(tasks, { id: conn.targetId })[0];
          if (!ganttConfig.relation) {
            message.warning("未配置关联关系");
            return;
          }
          if (conn.targetId === conn.sourceId) {
            message.warning("连线有误");
            return;
          }
          // 父卡片和子卡片不能相互连接，其他类型待定
          if (
            (taskSource?.item?.subItem || []).includes(taskTarget?.id) ||
            (taskTarget?.item?.subItem || []).includes(taskSource?.id)
          ) {
            message.warning("父子卡片之间不能存在关联关系");
            return;
          }
          // 两个卡片只能存在一种关联关系
          const linkTypeId = getLinkTypeId(
            conn.connection.endpoints[0].anchor.cssClass,
            conn.dropEndpoint.anchor.cssClass
          );
          const currentLink = itemLinks?.filter((ele: any) => {
            return (
              ele.source?.objectId === conn?.sourceId &&
              ele.destination?.objectId === conn?.targetId &&
              ele.linkType?.objectId === linkTypeId
            );
          });
          if (currentLink?.length) {
            message.warning("连线有误");
            return false;
          }
          let sourceTask: BarTask | undefined;
          let desinationTask: BarTask | undefined;
          tasks.map(task => {
            if (task.id === conn.sourceId) {
              sourceTask = task;
            }
            if (task.id === conn.sourceId) {
              desinationTask = task;
            }
          });
          const hasLinkItems = getHasLinkItems(sourceTask);
          // 两个事项有多条关联关系
          if (hasLinkItems.includes(conn.targetId)) {
            message.warning("连线有误");
            return false;
          }
          if (
            desinationTask?.item?.subItem.includes(conn.sourceId) ||
            sourceTask?.item?.subItem.includes(conn.targetId)
          ) {
            message.warning("连线有误");
            return false;
          }
          return true;
        });
        jsPlumbInstance.bind("connection", (infor: any, originalEvent: any) => {
          const linkTypeId = getLinkTypeId(
            infor.connection.endpoints[0].anchor.cssClass,
            infor.connection.endpoints[1].anchor.cssClass
          );
          const params = {
            source: infor?.sourceId,
            destination: infor?.targetId,
            linkType: linkTypeId,
          };
          // init(infor.connection);
          if (originalEvent) {
            infor.connection.setData(linkTypeId);
            addConnection?.(params);
          }
        });
        jsPlumbInstance.bind("click", (connection: any, originalEvent: any) => {
          jsPlumbInstance.select().removeClass("select-connection");
          connection.addClass("select-connection");
          setCurrentConnection?.({
            originalEvent: originalEvent,
            connection: connection,
          });
        });
      }
      return () => {
        if (jsPlumbInstance) {
          jsPlumbInstance.unbind("beforeDrop");
          jsPlumbInstance.unbind("connection");
        }
      };
    }, [
      jsPlumbInstance,
      itemLinks,
      tasks,
      getHasLinkItems,
      addConnection,
      ganttConfig.relation,
      getLinkTypeId,
      setCurrentConnection,
    ]);
    useEffect(() => {
      if (!itemLinks?.length) {
        if (!isEqual(connectUuids, [])) {
          setConnectUuids([]);
        }
      }

      if (itemLinks?.length && tasks.length && jsPlumbInstance) {
        const newConnectUuids: any = [];
        tasks.forEach((task: any) => {
          // 找到需要连线的卡片
          const itemFilter = itemLinks?.filter((ele: any) => {
            return ele.source?.objectId === task?.id;
          });
          itemFilter.forEach((ele: any) => {
            let relationType = "";
            for (const key in ganttConfig.relation) {
              if (ganttConfig.relation[key] === ele.linkType?.objectId) {
                relationType = key;
                continue;
              }
            }
            const isErrorLink = checkIsErrorLink(
              task,
              ele.destination?.objectId
            );
            const isPivotalPathLink = checkIsPivotalPathLink(
              task,
              ele.destination?.objectId,
              tasks,
              relationType
            );
            newConnectUuids.push({
              source: ele.source?.objectId,
              destination: ele.destination?.objectId,
              relationType: relationType,
              isErrorLink: isErrorLink,
              isPivotalPathLink: isPivotalPathLink,
            });
          });
        });
        if (!isEqual(connectUuids, newConnectUuids)) {
          setConnectUuids(newConnectUuids);
        }
      }
    }, [
      jsPlumbInstance,
      itemLinks,
      tasks,
      connectUuids,
      checkIsErrorLink,
      checkIsPivotalPathLink,
      ganttConfig.relation,
      ganttConfig,
    ]);
    useEffect(() => {
      // pointInited是连接点初始化完成的标志，解决jsPlumbInstance.connect连线时，由于连接点未初始化完成导致连线加载不出来
      if (jsPlumbInstance && connectUuids.length && pointInited) {
        jsPlumbInstance.setSuspendDrawing(true);
        for (let i = 0; i < connectUuids.length; i++) {
          const uuidObj = connectUuids[i];
          const {
            source,
            destination,
            relationType,
            isErrorLink,
            isPivotalPathLink,
          } = uuidObj;
          if (source && destination && relationType) {
            const uuid = [
              `${source}-${relationInit[relationType]?.[0]}`,
              `${destination}-${relationInit[relationType]?.[1]}`,
            ];
            const connect = jsPlumbInstance.connect({
              uuids: uuid,
            });
            // 给连线设置linkType
            if (connect) {
              if (isErrorLink) {
                // 设置连线错误的颜色
                connect.setPaintStyle({
                  stroke: errorLinkBorderColor,
                });
              }
              if (isPivotalPathLink) {
                // 设置关键路径连线的颜色
                connect.setPaintStyle({
                  stroke: pivotalPathLinkBorderColor,
                });
              }
              connect.setData(ganttConfig?.relation?.[relationType]);
            }
          }
        }
        jsPlumbInstance.setSuspendDrawing(false, true);
      }

      return () => {
        if (jsPlumbInstance) {
          jsPlumbInstance.deleteEveryConnection();
        }
      };
    }, [jsPlumbInstance, ganttConfig?.relation, connectUuids, pointInited]);
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
            const cuttentLog = logTasks.find(ele => ele.id === task.id);
            if (cuttentLog) {
              cuttentLog.y = task.y;
            }
            return (
              <g key={`g-${task.id}`}>
                {!cuttentLog?.start || !cuttentLog?.end ? null : (
                  <TaskItemLog
                    task={cuttentLog}
                    arrowIndent={arrowIndent}
                    taskHeight={taskHeight}
                    isProgressChangeable={
                      !!onProgressChange && !task.isDisabled
                    }
                    isDateChangeable={!!onDateChange && !task.isDisabled}
                    isDelete={!task.isDisabled}
                    onEventStart={handleBarEventStart}
                    key={`${task.id}-log`}
                    isSelected={!!selectedTask && task.id === selectedTask.id}
                    isLog
                  />
                )}
                {!task.start || !task.end ? null : (
                  <TaskItem
                    jsPlumb={jsPlumbInstance}
                    task={task}
                    arrowIndent={arrowIndent}
                    taskHeight={taskHeight}
                    isProgressChangeable={
                      !!onProgressChange && !task.isDisabled
                    }
                    isDateChangeable={!!onDateChange && !task.isDisabled}
                    isDelete={!task.isDisabled}
                    onEventStart={handleBarEventStart}
                    key={task.id}
                    isSelected={!!selectedTask && task.id === selectedTask.id}
                    taskListHeight={taskListHeight}
                    setPointInited={setPointInited}
                    isMoving={isMoving}
                    ganttEvent={ganttEvent}
                  />
                )}
              </g>
            );
          })}
        </g>
      </g>
    );
  }
);
