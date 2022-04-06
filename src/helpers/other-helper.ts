import { BarTask } from "../types/bar-task";
import { Task } from "../types/public-types";

interface Assignee {
  enabled: boolean;
  label: string;
  nickname: string;
  username: string;
  value: string;
}

export function isKeyboardEvent(
  event: React.MouseEvent | React.KeyboardEvent | React.FocusEvent
): event is React.KeyboardEvent {
  return (event as React.KeyboardEvent).key !== undefined;
}

export function isMouseEvent(
  event: React.MouseEvent | React.KeyboardEvent | React.FocusEvent
): event is React.MouseEvent {
  return (event as React.MouseEvent).clientX !== undefined;
}

export function isBarTask(task: Task | BarTask): task is BarTask {
  return (task as BarTask).x1 !== undefined;
}
// 判断是平年还是闰年
export function isLeapYear(year: number) {
  if (year % 4 === 0 && year % 100 !== 0) {
    return true;
  } else if (year % 400 === 0) {
    return true;
  } else {
    return false;
  }
}
export function getQuarter(currMonth: number) {
  return Math.floor(currMonth % 3 === 0 ? currMonth / 3 : currMonth / 3 + 1);
}
export const initAssignee = (assignee: Assignee[]): string => {
  let connectName = "";
  if (assignee && assignee.length) {
    connectName = assignee.reduce(
      (str: string, cur: Assignee, index: number) => {
        return index === assignee.length - 1
          ? str + cur.username
          : str + cur.username + "、";
      },
      ""
    );
  }
  return connectName;
};
