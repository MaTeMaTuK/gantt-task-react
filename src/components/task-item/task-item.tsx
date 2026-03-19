import React, { useEffect, useRef, useState } from "react";
import { BarTask } from "../../types/bar-task";
import { GanttContentMoveAction } from "../../types/gantt-task-actions";
import { Bar } from "./bar/bar";
import { BarSmall } from "./bar/bar-small";
import { Milestone } from "./milestone/milestone";
import { Project } from "./project/project";
import style from "./task-list.module.css";

export type TaskItemProps = {
  task: BarTask;
  arrowIndent: number;
  taskHeight: number;
  isProgressChangeable: boolean;
  isDateChangeable: boolean;
  isDelete: boolean;
  isSelected: boolean;
  rtl: boolean;
  onEventStart: (
    action: GanttContentMoveAction,
    selectedTask: BarTask,
    event?: React.MouseEvent | React.KeyboardEvent
  ) => any;
};

// 1.2 — calcula luminância relativa do hex e decide fill do label
function getLabelFill(backgroundColor: string): string {
  const hex = backgroundColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const L = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  return L > 0.35 ? "#1a1a1a" : "#ffffff";
}

// 1.4 — função pura no lugar do useState+useEffect para decidir o shape
function renderTaskShape(props: TaskItemProps): JSX.Element {
  switch (props.task.typeInternal) {
    case "milestone":
      return <Milestone {...props} />;
    case "project":
      return <Project {...props} />;
    case "smalltask":
      return <BarSmall {...props} />;
    default:
      return <Bar {...props} />;
  }
}

export const TaskItem: React.FC<TaskItemProps> = props => {
  const {
    task,
    arrowIndent,
    isDelete,
    taskHeight,
    isSelected,
    rtl,
    onEventStart,
  } = props;

  const textRef = useRef<SVGTextElement>(null);
  const [isTextInside, setIsTextInside] = useState(true);

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
    }
    return task.x1 + width + arrowIndent * +hasChild + arrowIndent * 0.2;
  };

  // 1.2 — fill dinâmico baseado na cor de fundo da tarefa
  const labelFill = isTextInside
    ? getLabelFill(task.styles.backgroundColor)
    : "var(--gantt-label-outside-color, #555)";

  // 1.1 — className correto: usar array + filter ao invés de `&&`
  const labelClassName = [
    style.barLabel,
    !isTextInside && style.barLabelOutside,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <g
      onKeyDown={e => {
        if (e.key === "Delete" && isDelete) onEventStart("delete", task, e);
        e.stopPropagation();
      }}
      onMouseEnter={e => onEventStart("mouseenter", task, e)}
      onMouseLeave={e => onEventStart("mouseleave", task, e)}
      onDoubleClick={e => onEventStart("dblclick", task, e)}
      onClick={e => onEventStart("click", task, e)}
      onFocus={() => onEventStart("select", task)}
    >
      {/* 1.4 — função pura, zero re-render extra */}
      {renderTaskShape(props)}

      <text
        x={getX()}
        y={task.y + taskHeight * 0.5}
        className={labelClassName}
        fill={labelFill}
        ref={textRef}
      >
        {task.name}
      </text>
    </g>
  );
};
