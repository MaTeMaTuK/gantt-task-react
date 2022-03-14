import React, { useEffect, useRef, useState } from "react";
import { BarTask } from "../../types/bar-task";
import { GanttContentMoveAction } from "../../types/gantt-task-actions";
import { ViewMode } from "../../types/public-types";
import { Bar } from "./bar/bar";
import { BarSmall } from "./bar/bar-small";
import { Milestone } from "./milestone/milestone";
import { Project } from "./project/project";
import style from "./task-list.module.css";

export type TaskItemProps = {
  columnWidth: number;
  viewMode: ViewMode | string;
  task: BarTask;
  arrowIndent: number;
  taskHeight: number;
  isProgressChangeable: boolean;
  isDateChangeable: boolean;
  isDelete: boolean;
  isSelected: boolean;
  rtl: boolean;
  rightLabelColor: string;
  leftLabelColor: string;
  onEventStart: (
    action: GanttContentMoveAction,
    selectedTask: BarTask,
    event?: React.MouseEvent | React.KeyboardEvent
  ) => any;
};

export const TaskItem: React.FC<TaskItemProps> = props => {
  const {
    task,
    arrowIndent,
    isDelete,
    taskHeight,
    isSelected,
    rtl,
    rightLabelColor,
    leftLabelColor,
    onEventStart,
  } = {
    ...props,
  };
  // const [newProps, setNewProps] = useState(props)
  const wrapperRef = useRef<SVGAElement>(null)
  const textRef = useRef<SVGTextElement>(null);
  const rightTextRef = useRef<SVGTextElement>(null);
  const leftTextRef = useRef<SVGTextElement>(null);
  const [taskItem, setTaskItem] = useState<JSX.Element>(<div />);
  const [isTextInside, setIsTextInside] = useState(true);
  const [beforeX, setBeforeX] = useState<undefined | number>(undefined)
  const [beforeY, setBeforeY] = useState<undefined | number>(undefined)
  const [afterX, setAfterX] = useState<undefined | number>(undefined)
  const [afterY, setAfterY] = useState<undefined | number>(undefined)

  useEffect(() => {
    switch (task.typeInternal) {
      case "milestone":
        setTaskItem(<Milestone {...props} />);
        break;
      case "project":
        setTaskItem(<Project {...props} />);
        break;
      case "smalltask":
        setTaskItem(<BarSmall {...props} />);
        break;
      default:
        setTaskItem(<Bar {...props} />);
        break;
    }
  }, [task, isSelected]);

  useEffect(() => {
    if (textRef.current) {
      setIsTextInside(textRef.current.getBBox().width < task.x2 - task.x1);
    }
  }, [textRef, task]);

  const getX = () => {
    const width = task.x2 - task.x1;
    const hasChild = task.barChildren.length > 0;
    if (isTextInside) {
      return task.x1 + width * 0.5;
    }
    if (rtl && textRef.current) {
      return (
        task.x1 -
        textRef.current.getBBox().width -
        arrowIndent * +hasChild -
        arrowIndent * 0.2
      );
    } else {
      return task.x1 + width + arrowIndent * +hasChild + arrowIndent * 0.2;
    }
  };


  const geRightX = () => {
    if (isTextInside) {
      return task.x2 + arrowIndent
    }
    if (rtl && rightTextRef.current) {
      return (
        task.x2 + 40
      );
    } else {
      return task.x2 + arrowIndent + ((textRef.current && textRef.current?.getBBox().width) || 40) + 20
    }
  };

  const getLeftX = () => {
    if (isTextInside) {
      return task.x1 - arrowIndent
    }
    if (rtl && rightTextRef.current) {
      return (
        task.x1 - ((textRef.current && textRef.current?.getBBox().width) || 40) - arrowIndent - 20
      );
    } else {
      return task.x1 - 20
    }
  };

  wrapperRef.current?.addEventListener('mousedown', (e) => {
    setBeforeX(e.offsetX)
    setBeforeY(e.offsetY)
  })

  wrapperRef.current?.addEventListener('mouseup', (e) => {
    setAfterX(e.offsetX)
    setAfterY(e.offsetY)
  })
  return (
    <g
      ref={wrapperRef}
      onKeyDown={e => {
        switch (e.key) {
          case "Delete": {
            if (isDelete) onEventStart("delete", task, e);
            break;
          }
        }
        e.stopPropagation();
      }}
      onMouseEnter={e => {
        onEventStart("mouseenter", task, e);
      }}
      onMouseLeave={e => {
        onEventStart("mouseleave", task, e);
      }}
      onDoubleClick={e => {
        onEventStart("dblclick", task, e);
      }}
      onFocus={() => {
        onEventStart("select", task);
      }}
      onClick={(e) => {
        if(beforeX === afterX && beforeY === afterY){
          onEventStart('click', task, e)
        }
      }}
    >
      {taskItem}
      {/* 左侧文字 */}
      {/* task.rightLabel &&  */}
      <text
        x={getLeftX()}
        y={task.y + taskHeight * 0.5}
        className={style.barLeftLabel}
        style={{fill:leftLabelColor}}
        ref={leftTextRef}
      >
        {task.leftLabel}
      </text>
      {/* 进度条文字 */}
      <text
        x={getX()}
        y={task.y + taskHeight * 0.5}
        className={
          isTextInside
            ? style.barLabel
            : style.barLabel && style.barLabelOutside
        }
        ref={textRef}
      >
        {task.name}
      </text>
      {/* 右侧文字 */}
       {/* task.rightLabel &&  */}
      <text
        x={geRightX()}
        y={task.y + taskHeight * 0.5}
        className={style.barRightLabel}
        style={{fill:rightLabelColor}}
        ref={rightTextRef}
      >
        {task.rightLabel || ''}
      </text>
    </g>
  );
};
