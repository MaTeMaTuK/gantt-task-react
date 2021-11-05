import React, { useEffect, useState } from "react";
import { BarTask } from "../../types/bar-task";
import { GanttContentMoveAction } from "../../types/gantt-task-actions";
import { Bar } from "./bar/bar";
import { BarSmall } from "./bar/bar-small";
import { BarParent } from "./bar/bar-parent";
import { Milestone } from "./milestone/milestone";
import { Project } from "./project/project";

export type TaskItemProps = {
  task: BarTask;
  arrowIndent: number;
  taskHeight: number;
  isProgressChangeable: boolean;
  isDateChangeable: boolean;
  isDelete: boolean;
  isSelected: boolean;
  onEventStart: (
    action: GanttContentMoveAction,
    selectedTask: BarTask,
    event?: React.MouseEvent | React.KeyboardEvent
  ) => any;
  jsPlumb?: any;
  isLog?: boolean | undefined;
};

export const TaskItemLog: React.FC<TaskItemProps> = props => {
  const { task, isSelected, jsPlumb } = {
    ...props,
  };

  const [taskItem, setTaskItem] = useState<JSX.Element>(<div />);

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
      case "parent":
        setTaskItem(<BarParent {...props} />);
        break;
      default:
        setTaskItem(<Bar {...props} />);
        break;
    }
  }, [task, isSelected, jsPlumb]);

  return <g>{taskItem}</g>;
};
