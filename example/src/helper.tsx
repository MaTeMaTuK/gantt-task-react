import { Task, rulerLine } from "../../dist/types/public-types";

export function rulerInitTask() {
  const currentDate = new Date();
  const rulerLines: rulerLine[] = [
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 3),
      title: "1.5 Engine relese",
      id: "1"
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4, 0, 0),
      title: "1 Engine relese",
      id: "2"
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      title: "2 Engine relese",
      id: "3"
    },
  ];
  return rulerLines;
}

export function initTasks() {
  const currentDate = new Date();
  const tasks: Task[] = [
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      name: "Some Project",
      id: "ProjectSample",
      progress: 25,
      type: "task",
      hideChildren: false,
      displayOrder: 1,
      styles: {
        backgroundColor: "#49AE8C",
        progressColor: "#49AE8C",
      },
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      end: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        2,
        12,
        28
      ),
      name: "Idea",
      id: "Task 0",
      dependenciesNumber: 2,
      progress: 45,
      type: "task",
      project: "ProjectSample",
      displayOrder: 2,
      styles: {
        backgroundColor: "#B7D9F8",
        backgroundSelectedColor: "#B7D9F8",
        progressColor: "#1EA1F1",
        progressSelectedColor: "#1EA1F1",
      },
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4, 0, 0),
      name: "Research",
      id: "Task 1",
      progress: 25,
      dependencies: ["Task 0"],
      dependenciesNumber: 2,
      type: "task",
      project: "ProjectSample",
      displayOrder: 3,
      styles: {
        backgroundColor: "#F68E86",
        backgroundSelectedColor: "#F68E86",
        progressColor: "#F16064",
        progressSelectedColor: "#F16064",
      },
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8, 0, 0),
      name: "Discussion with team",
      id: "Task 2",
      progress: 10,
      type: "task",
      dependenciesNumber: 4,
      project: "ProjectSample",
      displayOrder: 4,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9, 0, 0),
      name: "Developing",
      id: "Task 3",
      progress: 2,
      dependencies: ["Task 2"],
      dependenciesNumber: 1,

      type: "task",
      project: "ProjectSample",
      displayOrder: 5,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
      name: "Review",
      id: "Task 4",
      type: "task",
      progress: 70,
      dependencies: ["Task 6"],
      project: "ProjectSample",
      dependenciesNumber: 6,

      displayOrder: 6,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      name: "Release",
      id: "Task 6",
      progress: currentDate.getMonth(),
      type: "task",
      dependenciesNumber: 6,
      project: "ProjectSample",
      displayOrder: 7,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19),
      name: "Party Time",
      id: "Task 9",
      progress: 1,
      type: "task",
      styles: {
        backgroundColor: "#FF7E51",
        backgroundSelectedColor: "#FF7E51",
        progressColor: "#FF4201",
        progressSelectedColor: "#FF4201",
      },
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
