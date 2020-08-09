import React from "react";
import "gantt-task-react/dist/index.css";
import { Task, ViewMode } from "gantt-task-react";
import { ViewSwitcher } from "./components/view-switcher";
import { GanttTableExample } from "./components/gantt-table";

//Init
const App = () => {
  const currentDate = new Date();
  const [view, setView] = React.useState<ViewMode>(ViewMode.Day);
  let tasks: Task[] = [
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
      progress: 45,
      isDisabled: true,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4, 0, 0),
      name: "Research",
      id: "Task 1",
      progress: 25,
      dependencies: ["Task 0"],
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8, 0, 0),
      name: "Discussion with team",
      id: "Task 2",
      progress: 10,
      dependencies: ["Task 1"],
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9, 0, 0),
      name: "Developing",
      id: "Task 3",
      progress: 2,
      dependencies: ["Task 2"],
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
      name: "Review",
      id: "Task 4",
      progress: 70,
      dependencies: ["Task 2"],
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 16),
      name: "Release & Eat Burgers",
      id: "Task 6",
      progress: currentDate.getMonth(),
      dependencies: ["Task 4"],
      styles: { progressColor: "#ffbb54", progressSelectedColor: "#ff9e0d" },
    },
  ];

  let onTaskChange = (task: Task) => {
    console.log("On date change Id:" + task.id);
  };

  let onTaskDelete = (task: Task) => {
    const conf = window.confirm("Are you sure?");
    if (!conf) throw "No del Id:" + task.id;
  };

  let onProgressChange = (task: Task) => {
    console.log("On progress change Id:" + task.id);
  };

  let onDblClick = (task: Task) => {
    alert("On Double Click event Id:" + task.id);
  };

  return (
    <div>
      <ViewSwitcher onViewChange={viewMode => setView(viewMode)} />
      <GanttTableExample
        tasks={tasks}
        viewMode={view}
        onDateChange={onTaskChange}
        onTaskDelete={onTaskDelete}
        onProgressChange={onProgressChange}
        onDoubleClick={onDblClick}
      />
    </div>
  );
};

export default App;
