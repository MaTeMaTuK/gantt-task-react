import React from "react";
import { Task, ViewMode, Gantt } from "gantt-task-react";
import { ViewSwitcher } from "./components/view-switcher";
import { getStartEndDateForProvider, initTasks } from "./helper";
import "gantt-task-react/dist/index.css";

// Main entry point for the example
const App = () => {
  const [view, setView] = React.useState<ViewMode>(ViewMode.Hour);
  const [tasks, setTasks] = React.useState<Task[]>(initTasks());
  const [viewType, setViewType] = React.useState<"call_type" | "tat">("tat");

  let columnWidth = 65;
  if (view === ViewMode.Year) {
    columnWidth = 350;
  } else if (view === ViewMode.Month) {
    columnWidth = 300;
  } else if (view === ViewMode.Week) {
    columnWidth = 250;
  }

  const handleTaskChange = (task: Task) => {
    console.log("On date change Id:" + task.id);
    let newTasks = tasks.map(t => (t.id === task.id ? task : t));
    if (task.provider) {
      const [start, end] = getStartEndDateForProvider(newTasks, task.provider);
      const provider =
        newTasks[newTasks.findIndex(t => t.id === task.provider)];
      if (
        provider.start.getTime() !== start.getTime() ||
        provider.end.getTime() !== end.getTime()
      ) {
        const changedProvider = { ...provider, start, end };
        newTasks = newTasks.map(t =>
          t.id === task.provider ? changedProvider : t
        );
      }
    }
    setTasks(newTasks);
  };

  const handleDblClick = (task: Task) => {
    alert("On Double Click event Id:" + task.id);
  };

  const handleClick = (task: Task) => {
    console.log("On Click event Id:" + task.id);
  };

  const handleSelect = (task: Task, isSelected: boolean) => {
    console.log(task.name + " has " + (isSelected ? "selected" : "unselected"));
  };

  const handleExpanderClick = (task: Task) => {
    setTasks(tasks.map(t => (t.id === task.id ? task : t)));
    console.log("On expander click Id:" + task.id);
  };

  return (
    <div className="Wrapper">
      <h3>Timeline: {viewType === "tat" ? "Turn Around Time" : "Call Type"}</h3>
      <ViewSwitcher
        onViewModeChange={viewMode => setView(viewMode)}
        setViewType={setViewType}
      />
      <Gantt
        tasks={tasks}
        viewMode={view}
        viewType={viewType}
        onDateChange={handleTaskChange}
        onDoubleClick={handleDblClick}
        onClick={handleClick}
        onSelect={handleSelect}
        onExpanderClick={handleExpanderClick}
        listCellWidth="50px"
        ganttHeight={600}
        columnWidth={columnWidth}
        barFill={25}
      />
    </div>
  );
};

export default App;
