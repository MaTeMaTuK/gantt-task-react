export function foo() {
  return 1;
}
// import { BarTask } from "../types/bar-task";
// export type TaskListAction =
//   | { type: GanttContentMoveAction; task: BarTask }
//   | { type: "update"; tasks: BarTask[] };

// export type TaskListState = {
//   tasks: BarTask[];
//   changedTask?: BarTask;
//   originalTask?: BarTask;
//   selectedTask?: BarTask;
//   activeAction: GanttContentMoveAction;
// };

// export function taskListReducer(state: TaskListState, action: TaskListAction) {
//   switch (action.type) {
//     case "update":
//       return { ...state, tasks: action.tasks };
//     case "select":
//       return { ...state, selectedTask: action.task };
//     default:
//       return state;
//   }
// }
