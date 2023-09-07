import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BarTask } from "../../types/bar-task";
import { GanttContentMoveAction } from "../../types/gantt-task-actions";
import { Bar } from "./bar/bar";
import { BarSmall } from "./bar/bar-small";
import { Milestone } from "./milestone/milestone";
import { Project } from "./project/project";
import style from "./task-list.module.css";
import { getLocaleMonth } from "../../helpers/date-helper";

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

export const TaskItem: React.FC<TaskItemProps> = props => {
  const {
    task,
    arrowIndent,
    isDelete,
    taskHeight,
    isSelected,
    rtl,
    onEventStart,
  } = {
    ...props,
  };
  const textRef = useRef<SVGTextElement>(null);
  const text2Ref = useRef<SVGTextElement>(null);
  const [taskItem, setTaskItem] = useState<JSX.Element>(<div />);

  const DateFormateText = (start: Date, end: Date) => {
    return ` ${getLocaleMonth(
      start,
      "en-GB",
      "short"
    )} ${start.getDate()} - ${getLocaleMonth(
      end,
      "en-GB",
      "short"
    )} ${end.getDate()}`;
  };

  const rightTextDate = useMemo(() => {
    const dateStringText = DateFormateText(task.start, task.end);
    return dateStringText;
  }, [task]);

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
  }, [task, isSelected, props]);

  // const textEllipsis = (el: SVGTextElement, text: string, width: number) => {
  //   if (typeof el.getSubStringLength !== "undefined") {
  //     el.textContent = text;
  //     var len = text.length;
  //     while (el.getSubStringLength(0, len--) > width) {
  //         el.textContent = text.slice(0, len) + "...";
  //     }
  //   } else if (typeof el.getComputedTextLength !== "undefined") {
  //     while (el.getComputedTextLength() > width) {
  //       text = text.slice(0,-1);
  //       el.textContent = text + "...";
  //     }
  //   } else {
  //     // the last fallback
  //     while (el.getBBox().width > width) {
  //       text = text.slice(0,-1);
  //       // we need to update the textContent to update the boundary width
  //       el.textContent = text + "...";
  //     }
  //   }
  // }

  const textEllipsis = useCallback(
    (
      el: SVGTextElement,
      text: string,
      preGap: number = 2,
      flag: number = 0
    ) => {
      let length: number = text.length;
      let newTextString: string = "..";
      while (length > 0) {
        length--;
        newTextString = `${text.slice(0, length)}..`;
        el.textContent = newTextString;
        if (textRef.current && text2Ref.current) {
          const labelElement = textRef.current;
          const labelEndElement = text2Ref.current;
          const labelBoundingBox = labelElement.getBBox();
          const labelEndBoundingBox = labelEndElement.getBBox();
          if (
            labelEndBoundingBox.width +
              labelBoundingBox.width +
              arrowIndent * preGap +
              flag <
            task.x2 - task.x1
          ) {
            length = -1;
            break;
          }
        }
      }
    },
    [arrowIndent, task.x1, task.x2]
  );

  const isFlagShow = useMemo(() => {
    return task.x2 - task.x1 > 70;
  }, [task]);

  useEffect(() => {
    if (textRef.current && text2Ref.current) {
      const labelElement = textRef.current;
      const labelEndElement = text2Ref.current;
      const labelBoundingBox = labelElement.getBBox();
      const labelEndBoundingBox = labelEndElement.getBBox();

      if (
        labelEndBoundingBox.width + labelBoundingBox.width + arrowIndent + 20 >
        task.x2 - task.x1
      ) {
        textEllipsis(labelEndElement, rightTextDate, 1, 20);
        textEllipsis(labelElement, task.name, 1);
      } else {
        if (
          task.name !== labelElement.textContent ||
          rightTextDate !== labelEndElement.textContent
        ) {
          labelElement.textContent = task.name;
        }
      }
    }
  }, [
    textRef,
    text2Ref,
    arrowIndent,
    task.x2,
    task.x1,
    task.name,
    textEllipsis,
    rightTextDate,
  ]);

  const getX = () => {
    const width = task.x2 - task.x1;
    const hasChild = task.barChildren.length > 0;
    if (!rtl && textRef.current) {
      return task.x1 + arrowIndent * 0.5;
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
  const getX2 = () => {
    const width = task.x2 - task.x1;
    const hasChild = task.barChildren.length > 0;
    if (!rtl && textRef.current) {
      return task.x2 - arrowIndent * 0.5;
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

  return (
    <g
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
      onClick={e => {
        onEventStart("click", task, e);
      }}
      onFocus={() => {
        onEventStart("select", task);
      }}
    >
      {taskItem}
      <text
        x={getX()}
        width={"50px"}
        y={task.y + taskHeight * 0.5}
        className={style.barLabel}
        ref={textRef}
      >
        {task.name}
      </text>
      {/* <svg
        fill="#000000"
        width="10px"
        height="10px"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        
      </svg> */}
      <g id="Propositions">
        {isFlagShow && (
          <svg
            fill="#000000"
            width="16px"
            height="16px"
            viewBox="0 0 24 24"
            x={
              text2Ref?.current
                ? getX2() - text2Ref?.current?.getBBox().width - 20
                : getX2()
            }
            y={task.y + taskHeight * 0.5 - 8}
            xmlns="http://www.w3.org/2000/svg"
          >
            <g x={100} y={200} data-name="Layer 2">
              <g data-name="flag">
                <polyline points="24 24 0 24 0 0" opacity="0" />

                <path d="M19.27 4.68a1.79 1.79 0 0 0-1.6-.25 7.53 7.53 0 0 1-2.17.28 8.54 8.54 0 0 1-3.13-.78A10.15 10.15 0 0 0 8.5 3c-2.89 0-4 1-4.2 1.14a1 1 0 0 0-.3.72V20a1 1 0 0 0 2 0v-4.3a6.28 6.28 0 0 1 2.5-.41 8.54 8.54 0 0 1 3.13.78 10.15 10.15 0 0 0 3.87.93 7.66 7.66 0 0 0 3.5-.7 1.74 1.74 0 0 0 1-1.55V6.11a1.77 1.77 0 0 0-.73-1.43zM18 14.59a6.32 6.32 0 0 1-2.5.41 8.36 8.36 0 0 1-3.13-.79 10.34 10.34 0 0 0-3.87-.92 9.51 9.51 0 0 0-2.5.29V5.42A6.13 6.13 0 0 1 8.5 5a8.36 8.36 0 0 1 3.13.79 10.34 10.34 0 0 0 3.87.92 9.41 9.41 0 0 0 2.5-.3z" />
              </g>
            </g>
          </svg>
        )}

        <text
          x={getX2()}
          y={task.y + taskHeight * 0.5}
          className={style.barLabelEnd}
          ref={text2Ref}
        >
          {rightTextDate}
        </text>
      </g>
    </g>
  );
};
