import React, {
  useState,
  SyntheticEvent,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { ViewMode, GanttProps } from "../../types/public-types";
import { GridProps } from "../grid/grid";
import {
  ganttDateRange,
  seedDates,
  addToDate,
} from "../../helpers/date-helper";
import { CalendarProps } from "../calendar/calendar";
import { TaskGanttContentProps } from "./task-gantt-content";
import { StandardTooltipContent, Tooltip } from "../other/tooltip";
import { DeleteTooltip } from "../other/deleteTooltip";

import { VerticalScroll } from "../other/vertical-scroll";
import { TaskGantt } from "./task-gantt";
import { BarTask } from "../../types/bar-task";
import { convertToBarTasks } from "../../helpers/bar-helper";
import { GanttEvent } from "../../types/gantt-task-actions";
import { DateSetup } from "../../types/date-setup";
import styles from "./gantt.module.css";
import { HorizontalScroll } from "../other/horizontal-scroll";
import GanttConfig from "../gantt-config/index";
import GuideModal from "./guide-modal";
import { Button } from "antd";
import ArrowIcon from "../icons/arrow";
import utils from "../../helpers/utils";
import { scrollBarHeight } from "../../helpers/dicts";
import DataMode from "./data-mode";

import "./gantt.css";

import {
  GanttConfigContext,
  ConfigHandleContext,
  BaseLineContext,
} from "../../contsxt";
const widthData = {
  [ViewMode.Month]: 300,
  [ViewMode.Week]: 210,
  [ViewMode.Year]: 240,
  [ViewMode.Quarter]: 180,
};
export const Gantt: React.FunctionComponent<GanttProps> = ({
  tasks,
  baseLineLog,
  isUpdate,
  headerHeight = 41,
  // columnWidth = 60,
  listCellWidth = "155px",
  listWidth = 496,
  listBottomHeight = 48,
  rowHeight = 41,
  // viewMode = ViewMode.Day,
  // locale = "en-GB",
  locale = "zh-cn",
  barFill = 60, // bar占的百分比
  barCornerRadius = 4,
  barProgressColor = "#4B8BFF",
  barProgressSelectedColor = "#4B8BFF",
  barBackgroundColor = "#4B8BFF",
  barBackgroundSelectedColor = "#4B8BFF",
  projectProgressColor = "#7db59a",
  projectProgressSelectedColor = "#59a985",
  projectBackgroundColor = "#fac465",
  projectBackgroundSelectedColor = "#f7bb53",
  milestoneBackgroundColor = "#f1c453",
  milestoneBackgroundSelectedColor = "#f29e4c",
  handleWidth = 2,
  timeStep = 300000,
  arrowColor = "grey",
  fontFamily = "Arial, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue",
  fontSize = "14px",
  arrowIndent = 20,
  todayColor = "#FFAB00",
  TooltipContent = StandardTooltipContent,
  onDateChange,
  onProgressChange,
  onDoubleClick,
  onDelete,
  onSelect,
  renderTaskListComponent,
  renderOverflowTooltip,
  renderUserAvatar,
  itemTypeData, // 卡片类型
  configHandle, // 配置事件
  baseLineHandle, // 基线事件
  setCurrentLog, // 选择基线log
  ganttConfig = {}, // 配置详情
  itemLinks = [], // 卡片关联
  addConnection,
  delConnection,
  baselineList,
  currentLog,
  actionRef,
  workspaceId,
  getCustomFields, // 获取字段
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const taskListRef = useRef<HTMLDivElement>(null);
  const taskGanttContainerRef = useRef<any>({});
  const verticalScrollContainerRef = useRef<HTMLDivElement>(null);
  const horizontalScrollContainerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState(ViewMode.Day);
  const [columnWidth, setColumnWidth] = useState(60);
  const [dateSetup, setDateSetup] = useState<DateSetup>(() => {
    const [startDate, endDate] = ganttDateRange(viewMode);
    return { viewMode, dates: seedDates(startDate, endDate, viewMode) };
  });
  const CACHE_LIST_WIDTH_KEY = "gantt-cache-list-width";
  const cacheListWidth = utils.getLocalStorageItem(CACHE_LIST_WIDTH_KEY);
  const initListWidth = useMemo(() => {
    return cacheListWidth || listWidth;
  }, [listWidth, cacheListWidth]);

  const [taskHeight, setTaskHeight] = useState((rowHeight * barFill) / 100);
  const [taskListWidth, setTaskListWidth] = useState(initListWidth);
  const [svgContainerWidth, setSvgContainerWidth] = useState(0);
  const [ganttHeight, setGanttHeight] = useState(0);
  const [svgContainerHeight, setSvgContainerHeight] = useState(ganttHeight);
  const [barTasks, setBarTasks] = useState<BarTask[]>([]);
  const [logTasks, setLogTasks] = useState<BarTask[]>([]);
  // 定义列表是否有横向滚动条，以适配甘特图的横向滚动条
  const [isTableScrollX, setIsTableScrollX] = useState(true);
  const [ganttEvent, setGanttEvent] = useState<GanttEvent>({
    action: "",
  });
  const [currentConnection, setCurrentConnection] = useState(null);
  const [selectedTask, setSelectedTask] = useState<BarTask>();
  const [failedTask, setFailedTask] = useState<BarTask | null>(null);

  const eleListTableBodyRef = useRef<any>(null);
  const [scrollY, setScrollY] = useState(0);
  const [scrollX, setScrollX] = useState(0);
  const refScrollY: any = useRef(0);
  const refScrollX: any = useRef(0);
  const [visible, setVisible] = useState(false);
  const [ignoreScrollEvent, setIgnoreScrollEvent] = useState(false);
  const [guideModalVisible, setGuideModalVisible] = useState(false);
  const [currentPanel, setCurrentPanel] = useState("");

  const dividerPositionRef = useRef({ left: 0 });
  // 到今天移动的距离
  // const [todayDistance, setTodayDistance] = useState(0);
  const svgWidth = dateSetup.dates.length * columnWidth;
  const ganttFullHeight = barTasks.length * rowHeight;
  const minWidth = 2; // 面板折叠后，taskListWidth 设置成2（设置成0后，dom节点会移除）
  const paddingLeft = 38; // wrapper的padding值， 用于dividerWrapper定位
  // task change events
  useEffect(() => {
    const [startDate, endDate] = ganttDateRange(viewMode);
    const newDates = seedDates(startDate, endDate, viewMode);
    setDateSetup({ dates: newDates, viewMode });
    setBarTasks(
      convertToBarTasks(
        tasks,
        newDates,
        columnWidth,
        rowHeight,
        taskHeight,
        barCornerRadius,
        handleWidth,
        barProgressColor,
        barProgressSelectedColor,
        barBackgroundColor,
        barBackgroundSelectedColor,
        projectProgressColor,
        projectProgressSelectedColor,
        projectBackgroundColor,
        projectBackgroundSelectedColor,
        milestoneBackgroundColor,
        milestoneBackgroundSelectedColor,
        viewMode
      )
    );
  }, [
    tasks,
    isUpdate,
    viewMode,
    rowHeight,
    barCornerRadius,
    columnWidth,
    taskHeight,
    handleWidth,
    barProgressColor,
    barProgressSelectedColor,
    barBackgroundColor,
    barBackgroundSelectedColor,
    projectProgressColor,
    projectProgressSelectedColor,
    projectBackgroundColor,
    projectBackgroundSelectedColor,
    milestoneBackgroundColor,
    milestoneBackgroundSelectedColor,
  ]);
  useEffect(() => {
    const [startDate, endDate] = ganttDateRange(viewMode);
    const newDates = seedDates(startDate, endDate, viewMode);
    setLogTasks(
      convertToBarTasks(
        // @ts-ignore
        (tasks = baseLineLog),
        newDates,
        columnWidth,
        rowHeight,
        taskHeight,
        barCornerRadius,
        handleWidth,
        barProgressColor,
        barProgressSelectedColor,
        barBackgroundColor,
        barBackgroundSelectedColor,
        projectProgressColor,
        projectProgressSelectedColor,
        projectBackgroundColor,
        projectBackgroundSelectedColor,
        milestoneBackgroundColor,
        milestoneBackgroundSelectedColor,
        viewMode
      )
    );
  }, [
    baseLineLog,
    isUpdate,
    viewMode,
    rowHeight,
    barCornerRadius,
    columnWidth,
    taskHeight,
    handleWidth,
    barProgressColor,
    barProgressSelectedColor,
    barBackgroundColor,
    barBackgroundSelectedColor,
    projectProgressColor,
    projectProgressSelectedColor,
    projectBackgroundColor,
    projectBackgroundSelectedColor,
    milestoneBackgroundColor,
    milestoneBackgroundSelectedColor,
  ]);
  useEffect(() => {
    const { changedTask, action } = ganttEvent;
    if (changedTask) {
      if (action === "delete") {
        setGanttEvent({ action: "" });
        setBarTasks(barTasks.filter(t => t.id !== changedTask.id));
      } else if (
        action === "move" ||
        action === "end" ||
        action === "start" ||
        action === "progress"
      ) {
        const prevStateTask = barTasks.find(t => t.id === changedTask.id);
        if (
          prevStateTask &&
          (prevStateTask.start.getTime() !== changedTask.start.getTime() ||
            prevStateTask.end.getTime() !== changedTask.end.getTime() ||
            prevStateTask.progress !== changedTask.progress)
        ) {
          // actions for change
          const newTaskList = barTasks.map(t =>
            t.id === changedTask.id ? changedTask : t
          );
          setBarTasks(newTaskList);
        }
      }
    }
  }, [ganttEvent, barTasks]);

  useEffect(() => {
    if (failedTask) {
      setBarTasks(barTasks.map(t => (t.id !== failedTask.id ? t : failedTask)));
      setFailedTask(null);
    }
  }, [failedTask, barTasks]);

  useEffect(() => {
    const newTaskHeight = (rowHeight * barFill) / 100;
    if (newTaskHeight !== taskHeight) {
      setTaskHeight(newTaskHeight);
    }
  }, [rowHeight, barFill, taskHeight]);

  useEffect(() => {
    if (!listCellWidth) {
      setTaskListWidth(0);
    }
    if (taskListRef.current) {
      setTaskListWidth(taskListRef.current.offsetWidth);
    }
  }, [taskListRef, listCellWidth]);
  // 在数据为空时宽度设为100%，和structure保持一致
  useEffect(() => {
    if (wrapperRef.current) {
      if (tasks.length) {
        setTaskListWidth(initListWidth);
      } else {
        setTaskListWidth(wrapperRef?.current?.offsetWidth);
      }
    }
  }, [tasks.length, initListWidth]);
  useEffect(() => {
    if (wrapperRef.current) {
      setSvgContainerWidth(wrapperRef.current.offsetWidth - taskListWidth);
    }
  }, [wrapperRef, taskListWidth]);

  useEffect(() => {
    if (ganttHeight) {
      setSvgContainerHeight(ganttHeight + headerHeight);
    } else {
      setSvgContainerHeight(tasks.length * rowHeight + headerHeight);
    }
  }, [ganttHeight, tasks, headerHeight, rowHeight]);
  useEffect(() => {
    const ele = taskGanttContainerRef?.current?.horizontalContainerRef;
    if (ele) {
      setGanttHeight(ele.offsetHeight);
    }
  }, [taskGanttContainerRef?.current?.horizontalContainerRef]);

  const setElementsScrollY = useCallback(() => {
    eleListTableBodyRef.current &&
      (eleListTableBodyRef.current.scrollTop = refScrollY.current);
    taskGanttContainerRef?.current?.horizontalContainerRef &&
      (taskGanttContainerRef.current.horizontalContainerRef.scrollTop =
        refScrollY.current);
    verticalScrollContainerRef?.current &&
      (verticalScrollContainerRef.current.scrollTop = refScrollY.current);
  }, []);

  const setElementsScrollX = useCallback(() => {
    taskGanttContainerRef?.current?.verticalGanttContainerRef &&
      (taskGanttContainerRef.current.verticalGanttContainerRef.scrollLeft =
        refScrollX.current);
    horizontalScrollContainerRef?.current &&
      (horizontalScrollContainerRef.current.scrollLeft = refScrollX.current);
  }, []);

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      if (Math.abs(event.deltaX) >= Math.abs(event.deltaY)) {
        if (event.deltaX !== 0) {
          // @ts-ignore
          const path = event.path || [];
          const filterData = path.filter(
            (ele: HTMLDivElement) => ele.id === "ganttTaskListWrapper"
          );
          if (filterData?.length) {
            return;
          }
          event.preventDefault();
          event.stopPropagation();
          const scrollX = refScrollX.current;
          const scrollMove = event.deltaX;
          let newScrollX = scrollX + scrollMove;
          if (newScrollX < 0) {
            newScrollX = 0;
          } else if (newScrollX > svgWidth) {
            newScrollX = svgWidth;
          }
          refScrollX.current = newScrollX;
          setElementsScrollX();
          setScrollX(refScrollX.current);
        }
      } else {
        event.preventDefault();
        event.stopPropagation();
        if (event.deltaY !== 0) {
          // Y轴滚动处理
          // 判断列表是否有横向滚动条
          const isScroll =
            eleListTableBodyRef?.current?.clientWidth !==
            eleListTableBodyRef?.current?.scrollWidth;
          setIsTableScrollX(isScroll);
          const max = ganttFullHeight - ganttHeight;
          const scrollY = refScrollY.current;
          let newScrollY = scrollY + event.deltaY;
          if (newScrollY < 0) {
            newScrollY = 0;
          } else if (newScrollY > max) {
            if (isTableScrollX) {
              // 16为横向滚动条的高度
              newScrollY = max + scrollBarHeight;
            } else {
              newScrollY = max;
            }
          }
          refScrollY.current = newScrollY;
          setElementsScrollY();
          setScrollY(refScrollY.current);
        }
      }
      setIgnoreScrollEvent(true);
    },
    [
      ganttFullHeight,
      ganttHeight,
      setElementsScrollX,
      setElementsScrollY,
      svgWidth,
      isTableScrollX,
    ]
  );

  useEffect(() => {
    // subscribe if scroll is necessary
    if (wrapperRef.current) {
      wrapperRef.current.addEventListener("wheel", handleWheel, {
        passive: false,
      });
    }
    return () => {
      if (wrapperRef.current) {
        wrapperRef?.current?.removeEventListener("wheel", handleWheel);
      }
    };
  }, [handleWheel]);

  const handleScrollY = useCallback(
    (event: SyntheticEvent<HTMLDivElement>) => {
      const scrollY = refScrollY.current;
      if (scrollY !== event.currentTarget.scrollTop && !ignoreScrollEvent) {
        refScrollY.current = event.currentTarget.scrollTop;
        setElementsScrollY();
        setScrollY(refScrollY.current);
      }
      setIgnoreScrollEvent(false);
      setCurrentConnection(null);
    },
    [ignoreScrollEvent, setElementsScrollY]
  );

  const handleScrollX = useCallback(
    (event: SyntheticEvent<HTMLDivElement>) => {
      const scrollX = refScrollX.current;
      if (scrollX !== event.currentTarget.scrollLeft && !ignoreScrollEvent) {
        refScrollX.current = event.currentTarget.scrollLeft;
        setElementsScrollX();
        setScrollX(refScrollX.current);
      }
      setIgnoreScrollEvent(false);
      setCurrentConnection(null);
    },
    [ignoreScrollEvent, setElementsScrollX]
  );

  /**
   * Handles arrow keys events and transform it to new scroll
   */
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (
        [
          "Down",
          "ArrowDown",
          "Up",
          "ArrowUp",
          "Left",
          "ArrowLeft",
          "Right",
          "ArrowRight",
        ].includes(event.key)
      ) {
        event.preventDefault();
        event.stopPropagation();
        const scrollY = refScrollY.current;
        const scrollX = refScrollX.current;
        let newScrollY = scrollY;
        let newScrollX = scrollX;
        let isX = true;
        switch (event.key) {
          case "Down": // IE/Edge specific value
          case "ArrowDown":
            newScrollY += rowHeight;
            isX = false;
            break;
          case "Up": // IE/Edge specific value
          case "ArrowUp":
            newScrollY -= rowHeight;
            isX = false;
            break;
          case "Left":
          case "ArrowLeft":
            newScrollX -= columnWidth;
            break;
          case "Right": // IE/Edge specific value
          case "ArrowRight":
            newScrollX += columnWidth;
            break;
        }
        if (isX) {
          if (newScrollX < 0) {
            newScrollX = 0;
          } else if (newScrollX > svgWidth) {
            newScrollX = svgWidth;
          }
          refScrollX.current = newScrollX;
          setElementsScrollX();
          setScrollX(refScrollX.current);
        } else {
          if (newScrollY < 0) {
            newScrollY = 0;
          } else if (newScrollY > ganttFullHeight - ganttHeight) {
            newScrollY = ganttFullHeight - ganttHeight;
          }
          refScrollY.current = newScrollY;
          setElementsScrollY();
          setScrollY(refScrollY.current);
        }
        setIgnoreScrollEvent(true);
      }
    },
    [
      columnWidth,
      ganttFullHeight,
      ganttHeight,
      rowHeight,
      setElementsScrollX,
      setElementsScrollY,
      svgWidth,
    ]
  );

  /**
   * Task select event
   */
  const handleSelectedTask = useCallback(
    (taskId: string) => {
      const newSelectedTask = barTasks.find(t => t.id === taskId);
      const oldSelectedTask = barTasks.find(
        t => !!selectedTask && t.id === selectedTask.id
      );
      if (onSelect) {
        if (oldSelectedTask) {
          onSelect(oldSelectedTask, false);
        }
        if (newSelectedTask) {
          onSelect(newSelectedTask, true);
        }
      }
      setSelectedTask(newSelectedTask);
    },
    [barTasks, onSelect, selectedTask]
  );
  const boundLeft = wrapperRef.current?.getBoundingClientRect().left || 0;
  const boundTop = wrapperRef.current?.getBoundingClientRect().top || 0;
  const offsetLeft = taskListRef.current?.clientWidth || 0;
  const gridProps: GridProps = useMemo(() => {
    return {
      columnWidth,
      svgWidth,
      tasks: tasks,
      rowHeight,
      dates: dateSetup.dates,
      todayColor,
      scrollX,
      // offsetLeft: 750,
      offsetLeft: boundLeft + offsetLeft,
      onDateChange,
    };
  }, [
    boundLeft,
    columnWidth,
    dateSetup.dates,
    offsetLeft,
    onDateChange,
    rowHeight,
    scrollX,
    svgWidth,
    tasks,
    todayColor,
  ]);
  const calendarProps: CalendarProps = useMemo(() => {
    return {
      dateSetup,
      locale,
      viewMode,
      headerHeight,
      columnWidth,
      fontFamily,
      fontSize,
    };
  }, [
    columnWidth,
    dateSetup,
    fontFamily,
    fontSize,
    headerHeight,
    locale,
    viewMode,
  ]);
  const barProps: TaskGanttContentProps = useMemo(() => {
    return {
      tasks: barTasks,
      logTasks: logTasks,
      dates: dateSetup.dates,
      ganttEvent,
      selectedTask,
      rowHeight,
      taskHeight,
      columnWidth,
      arrowColor,
      timeStep,
      fontFamily,
      fontSize,
      arrowIndent,
      svgWidth,
      setGanttEvent,
      setFailedTask,
      setSelectedTask: handleSelectedTask,
      onDateChange,
      onProgressChange,
      onDoubleClick,
      onDelete,
      delConnection,
      addConnection,
      itemLinks,
      setCurrentConnection,
      currentConnection,
    };
  }, [
    barTasks,
    logTasks,
    dateSetup.dates,
    ganttEvent,
    selectedTask,
    rowHeight,
    taskHeight,
    columnWidth,
    arrowColor,
    timeStep,
    fontFamily,
    fontSize,
    arrowIndent,
    svgWidth,
    setGanttEvent,
    setFailedTask,
    onDateChange,
    onProgressChange,
    onDoubleClick,
    onDelete,
    delConnection,
    addConnection,
    itemLinks,
    handleSelectedTask,
    currentConnection,
  ]);
  const TaskListComponent = useMemo(() => {
    if (typeof renderTaskListComponent === "function") {
      return renderTaskListComponent();
    }
    return null;
  }, [renderTaskListComponent]);

  useEffect(() => {
    if (TaskListComponent) {
      eleListTableBodyRef.current = document.querySelector(
        ".BaseTable__table-main .BaseTable__body"
      );
    }
  }, [TaskListComponent]);
  const todayX = useMemo(() => {
    // 之前考虑通过context， 在grid-body中setState 传递移动的距离，但是页面会抖动
    const now = new Date();
    let tickX = 0;
    let newTickX = 0;
    for (let i = 0; i < dateSetup.dates.length; i++) {
      const date = dateSetup.dates[i];
      if (
        (i + 1 !== dateSetup.dates.length &&
          date.getTime() < now.getTime() &&
          dateSetup.dates[i + 1].getTime() >= now.getTime()) ||
        // if current date is last
        (i !== 0 &&
          i + 1 === dateSetup.dates.length &&
          date.getTime() < now.getTime() &&
          addToDate(
            date,
            date.getTime() - dateSetup.dates[i - 1].getTime(),
            "millisecond"
          ).getTime() >= now.getTime())
      ) {
        // 当天的零点的时间戳（毫秒）
        const currentStamp = new Date(
          new Date().toLocaleDateString()
        ).getTime();
        // 当天和上一个时间的差
        const currentMinus =
          (currentStamp + 86400000 - dateSetup.dates[i].getTime()) / 86400000;
        // 前后时间差
        const totalMinus =
          (dateSetup.dates[i + 1].getTime() - dateSetup.dates[i].getTime()) /
          86400000;
        newTickX =
          tickX +
          columnWidth * (currentMinus / totalMinus) -
          columnWidth / totalMinus / 2;
      }
      tickX += columnWidth;
    }
    return newTickX;
  }, [columnWidth, dateSetup.dates]);
  const toToday = useCallback(() => {
    refScrollX.current = todayX - svgContainerWidth / 2;
    setElementsScrollX();
    setScrollX(refScrollX.current);
  }, [setElementsScrollX, svgContainerWidth, todayX]);

  useEffect(() => {
    toToday();
  }, [toToday]);

  const toConfig = useCallback(() => {
    setVisible(true);
  }, []);
  const toGantt = useCallback(() => {
    setVisible(false);
  }, []);
  const modeChange = useCallback((val: ViewMode) => {
    setViewMode(val);
    setColumnWidth(widthData[val] || 60);
  }, []);
  const handleDividerMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const handleMouseMove = (event: MouseEvent) => {
        const distance = event.clientX - dividerPositionRef.current.left;
        const minWidth = 220; // 拖动时，列表最小宽度为220
        const width =
          taskListWidth + distance > minWidth
            ? taskListWidth + distance
            : minWidth;
        setTaskListWidth(width);
        utils.setLocalStorageItem(CACHE_LIST_WIDTH_KEY, width);
      };
      const handleMouseUp = () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        const isScroll =
          eleListTableBodyRef?.current?.clientWidth !==
          eleListTableBodyRef?.current?.scrollWidth;
        setIsTableScrollX(isScroll);
      };
      dividerPositionRef.current.left = event.clientX;
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [taskListWidth]
  );

  const handleDividerClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      let width;
      if (taskListWidth > minWidth) {
        dividerPositionRef.current.left = taskListWidth;
        width = minWidth;
      } else {
        width = dividerPositionRef.current.left || listWidth;
      }
      setTaskListWidth(width);
      utils.setLocalStorageItem(CACHE_LIST_WIDTH_KEY, width);
      event.stopPropagation();
    },
    [listWidth, taskListWidth]
  );
  // 退出基线
  const baselineExit = () => {
    setCurrentLog?.({});
    setLogTasks([]);
  };
  const toPanel = useCallback(() => {
    setGuideModalVisible(false);
    toConfig();
  }, [toConfig]);
  React.useImperativeHandle(actionRef, () => ({
    openGuide(type: string) {
      setCurrentPanel(type);
      setGuideModalVisible(true);
    },
    toPanel: toPanel,
  }));

  const panelCanel = useCallback(() => {
    setGuideModalVisible(false);
  }, []);
  const OverflowTooltip = useCallback(
    (value: string) => {
      if (typeof renderOverflowTooltip === "function") {
        return renderOverflowTooltip(value);
      }
      return <React.Fragment />;
    },
    [renderOverflowTooltip]
  );
  return (
    <div className={styles.box}>
      <GuideModal
        visible={guideModalVisible}
        toPanel={toPanel}
        toCancel={panelCanel}
      />
      <GanttConfigContext.Provider
        value={{
          ganttConfig,
        }}
      >
        <ConfigHandleContext.Provider
          value={{
            configHandle,
            itemTypeData,
            workspaceId,
            getCustomFields,
          }}
        >
          <BaseLineContext.Provider
            value={{
              baseLineHandle,
              baselineList,
              setCurrentLog,
              currentLog,
              OverflowTooltip,
            }}
          >
            <GanttConfig
              toGantt={toGantt}
              visible={visible}
              currentPanel={currentPanel}
              configHandle={configHandle}
              ganttConfig={ganttConfig}
            />
          </BaseLineContext.Provider>
        </ConfigHandleContext.Provider>
        <div
          className={styles.wrapper}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          ref={wrapperRef}
        >
          {currentLog?.name && (
            <div className={styles.choosedBaselIne}>
              <span className={styles.loaded}>
                {OverflowTooltip(`已加载：${currentLog?.name}`)}
              </span>
              <Button size="small" onClick={baselineExit}>
                退出
              </Button>
            </div>
          )}

          {listCellWidth && TaskListComponent && (
            <div
              ref={taskListRef}
              className={styles.taskListWrapper}
              id="ganttTaskListWrapper"
              style={{
                width: `${taskListWidth}px`,
                visibility: tasks?.length ? "visible" : "hidden",
              }}
            >
              {TaskListComponent}
            </div>
          )}
          {tasks.length > 0 && (
            <TaskGantt
              ref={taskGanttContainerRef}
              gridProps={gridProps}
              calendarProps={calendarProps}
              barProps={barProps}
              ganttHeight={ganttHeight}
              scrollX={scrollX}
              onScroll={handleScrollX}
              taskListHeight={taskListRef?.current?.offsetHeight}
            />
          )}
          <div
            className={
              taskListWidth <= minWidth
                ? `${styles.dividerWrapper} ${styles.reverse}`
                : styles.dividerWrapper
            }
            style={{
              left: `${
                taskListWidth - minWidth > 0
                  ? taskListWidth + paddingLeft
                  : paddingLeft
              }px`,
              visibility: tasks?.length ? "visible" : "hidden",
              height: `calc(100% - ${listBottomHeight}px)`,
            }}
          >
            <div className={styles.dividerContainer}>
              <hr
                onMouseDown={
                  taskListWidth <= minWidth ? undefined : handleDividerMouseDown
                }
              />
              <hr className={styles.maskLine} />
              <hr className={styles.maskLineTop} />
              <span
                className={styles.dividerIconWarpper}
                onMouseDown={e => e.stopPropagation()}
                onClick={handleDividerClick}
              >
                <ArrowIcon />
              </span>
            </div>
          </div>
          <DataMode
            toToday={toToday}
            modeChange={modeChange}
            todayX={todayX}
            svgContainerWidth={svgContainerWidth}
            refScrollX={refScrollX.current}
          />
          {ganttEvent.changedTask && (
            <Tooltip
              arrowIndent={arrowIndent}
              rowHeight={rowHeight}
              svgContainerHeight={svgContainerHeight}
              svgContainerWidth={svgContainerWidth}
              fontFamily={fontFamily}
              fontSize={fontSize}
              scrollX={scrollX}
              scrollY={scrollY}
              task={ganttEvent.changedTask}
              headerHeight={headerHeight}
              taskListWidth={taskListWidth}
              TooltipContent={TooltipContent}
              renderUserAvatar={renderUserAvatar}
            />
          )}
          {currentConnection && (
            <DeleteTooltip
              tasks={tasks}
              taskListWidth={taskListWidth}
              currentConnection={currentConnection}
              boundTop={boundTop}
              itemLinks={itemLinks}
              delConnection={delConnection}
              setCurrentConnection={setCurrentConnection}
              svgContainerHeight={svgContainerHeight}
            />
          )}
          {tasks.length > 0 && (
            <VerticalScroll
              ref={verticalScrollContainerRef}
              ganttFullHeight={ganttFullHeight}
              ganttHeight={ganttHeight}
              headerHeight={headerHeight}
              listBottomHeight={listBottomHeight}
              onScroll={handleScrollY}
            />
          )}
          {tasks.length > 0 && (
            <HorizontalScroll
              ref={horizontalScrollContainerRef}
              listBottomHeight={
                isTableScrollX
                  ? listBottomHeight
                  : listBottomHeight - scrollBarHeight
              }
              svgWidth={svgWidth}
              taskListWidth={taskListWidth}
              onScroll={handleScrollX}
            />
          )}
        </div>
      </GanttConfigContext.Provider>
    </div>
  );
};
