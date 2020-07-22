import { Task } from '../types/public-types';

type GanttReduceState = {
  ganttTasks: Task[];
};

export type GanttReduceAction = {
  type: 'update' | 'delete';
  changedTask?: Task;
};

export function ganttReducer(
  state: GanttReduceState,
  action: GanttReduceAction
): GanttReduceState {
  switch (action.type) {
    case 'update': {
      return {
        ganttTasks: state.ganttTasks.map(t =>
          t.id === action.changedTask?.id ? action.changedTask : t
        ),
      };
    }
    case 'delete': {
      return {
        ganttTasks: state.ganttTasks.filter(
          t => t.id !== action.changedTask?.id
        ),
      };
    }
    default:
      return state;
  }
}
