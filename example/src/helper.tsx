import { Task } from "../../dist/types/public-types";

export function initTasks() {
  const currentDate = new Date();
  const tasks: Task[] = [
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1, 0, 0, 0),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1, 0, 0, 10),
      name: "Test Project",
      id: "TestProjectSample",
      progress: 10,
      type: "project",                                                                                                                                                              
      hideChildren: false,
      displayOrder: 1,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1, 10, 0, 0),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1, 10, 10, 0),
      name: "Some Project",
      id: "ProjectSample",
      progress: 110,
      type: "project",
      hideChildren: false,
      displayOrder: 2,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1, 11, 0, 0),
      end: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
        12,
        0,
        0
      ),
      name: "Idea",
      id: "Task 0",
      progress: 60,
      type: "task",
      project: "ProjectSample",
      displayOrder: 3,
    },
  ];
  return tasks;
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
