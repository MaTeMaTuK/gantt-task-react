import { Task } from "../../dist/types/public-types";

export function initTasks(): Task[] {
  const currentDate = new Date();
  return [
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      name: "Some Project",
      id: "ProjectSample",
      progress: 0,
      type: "project",
      hideChildren: false,
    },
    {
      start: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
        12,
        28,
        20
      ),
      end: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
        12,
        29,
        50
      ),
      name: "Idea",
      id: "Task 0",
      progress: 0,
      isDisabled: true,
      type: "task",
      project: "ProjectSample",
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4, 0, 0),
      name: "Research",
      id: "Task 1",
      progress: 0,
      isDisabled: true,
      dependencies: ["Task 0"],
      type: "task",
      project: "ProjectSample",
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8, 0, 0),
      name: "Discussion with team",
      id: "Task 2",
      progress: 0,
      isDisabled: true,
      dependencies: ["Task 0", "Task 1"],
      type: "task",
      project: "ProjectSample",
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
      end: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        11,
        0,
        0
      ),
      name: "Developing",
      id: "Task 3",
      progress: 0,
      isDisabled: true,
      dependencies: ["Task 2"],
      type: "task",
      project: "ProjectSample",
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
      name: "Review",
      id: "Task 4",
      type: "task",
      progress: 0,
      isDisabled: true,
      dependencies: ["Task 2"],
      project: "ProjectSample",
    },
  ];
}

export function getStartEndDateForProject(tasks: Task[], projectId: string) {
  const projectTasks = tasks.filter(t => t.project === projectId);
  let start = projectTasks[0].start;
  let end = projectTasks[0].end;

  for (let i = 0; i < projectTasks.length; i++) {
    const task = projectTasks[i];
    if (start.getTime() > task.start.getTime()) {
      start = task.start;
    }
    if (end.getTime() < task.end.getTime()) {
      end = task.end;
    }
  }
  return [start, end];
}
