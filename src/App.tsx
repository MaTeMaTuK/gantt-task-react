import { Gantt, Task, ViewMode } from "gantt-task-react/dist/index";
import "gantt-task-react/dist/index.css";
import { useState } from "react";
import "./App.css";

function initTasks() {
  const currentDate = new Date();
  const tasks: any[] = [
    {
      // Project
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      stageName: "Some Project",
      id: "ProjectSample",
      progress: 25,
      type: "project",
      hideChildren: false,
      displayOrder: 1,
      team: 'sadasds'
    },
    {
      // Task
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      end: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        2,
        12,
        28
      ),
      stageName: "Idea",
      id: "Task 0",
      progress: 45,
      type: "task",
      project: "ProjectSample",
      displayOrder: 2,
      team: "asdasdas"
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4, 0, 0),
      stageName: "Research",
      id: "Task 1",
      progress: 25,
      dependencies: ["Task 0"],
      type: "task",
      project: "ProjectSample",
      displayOrder: 3,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8, 0, 0),
      stageName: "Discussion with team",
      id: "Task 2",
      progress: 10,
      dependencies: ["Task 1"],
      type: "task",
      project: "ProjectSample",
      displayOrder: 4,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9, 0, 0),
      stageName: "Developing",
      id: "Task 3",
      progress: 2,
      dependencies: ["Task 2"],
      type: "task",
      project: "ProjectSample",
      displayOrder: 5,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
      stageName: "Review",
      id: "Task 4",
      type: "task",
      progress: 70,
      dependencies: ["Task 2"],
      project: "ProjectSample",
      displayOrder: 6,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      stageName: "Release",
      id: "Task 6",
      progress: currentDate.getMonth(),
      type: "task",
      dependencies: ["Task 4"],
      project: "ProjectSample",
      displayOrder: 7,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19),
      stageName: "Party Time",
      id: "Task 9",
      progress: 0,
      isDisabled: true,
      type: "project",
    },
  ];
  return tasks;
}
function App() {
  const [tasks, setTasks] = useState(initTasks());

  const handleExpanderClick = (task: Task) => {
    setTasks(tasks.map(t => (t.id === task.id ? task : t)));
  };
  return (
    <Gantt
      tasks={tasks}
      viewMode={ViewMode.Range}
      fontFamily="Consolas, Monaco, 'Andale Mono', monospace"
      columnWidth={380}
      headerHeight={80}
      listCellWidth='200px'
      ranges={{
        "1": {
          startDate: '1/1/2023',
          endDate: '1/15/2023'
        },
        "2": {
          startDate: '01/16/2023',
          endDate: '01/30/2023'
        },
        "3": {
          startDate: '01/31/2023',
          endDate: '02/10/2023'
        },
        "4": {
          startDate: '02/11/2023',
          endDate: '02/20 /2023'
        },
      }}

      headers={[{ key: 'stageName', title: 'Stage Name' }, { key: 'team', title: 'Team Name' }]}
      onExpanderClick={handleExpanderClick}
    />
  );
}

export default App;
