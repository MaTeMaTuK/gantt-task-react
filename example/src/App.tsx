import React from "react";
import { Task, ViewMode, Gantt, OnRelationChange } from "gantt-task-react";
import { ViewSwitcher } from "./components/view-switcher";
import { getStartEndDateForProject, initTasks } from "./helper";
import "gantt-task-react/dist/index.css";

// Init
const App = () => {
  const [view, setView] = React.useState<ViewMode>(ViewMode.Day);
  const [tasks, setTasks] = React.useState<Task[]>(initTasks());
  const [isChecked, setIsChecked] = React.useState(true);
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
    if (task.project) {
      const [start, end] = getStartEndDateForProject(newTasks, task.project);
      const project = newTasks[newTasks.findIndex(t => t.id === task.project)];
      if (
        project.start.getTime() !== start.getTime() ||
        project.end.getTime() !== end.getTime()
      ) {
        const changedProject = { ...project, start, end };
        newTasks = newTasks.map(t =>
          t.id === task.project ? changedProject : t
        );
      }
    }
    setTasks(newTasks);
  };

  const handleRelationChange: OnRelationChange = ([taskFrom, targetFrom], [taskTo]) => {
    setTasks(tasks.map(t => {
      if (targetFrom === 'startOfTask') {
        if (t.id === taskFrom.id) {
          if (!t.dependencies) {
            return {
              ...t,
              dependencies: [taskTo.id],
            };
          }

          const hasDependency = t.dependencies.some((dependencyId) => dependencyId === taskTo.id);

          if (hasDependency) {
            return {
              ...t,
              dependencies: t.dependencies.filter((dependencyId) => dependencyId !== taskTo.id),
            };
          }

          return {
            ...t,
            dependencies: [...t.dependencies, taskTo.id],
          };
        }
      }

      if (targetFrom === 'endOfTask') {
        if (t.id === taskTo.id) {
          if (!t.dependencies) {
            return {
              ...t,
              dependencies: [taskFrom.id],
            };
          }

          const hasDependency = t.dependencies.some((dependencyId) => dependencyId === taskFrom.id);

          if (hasDependency) {
            return {
              ...t,
              dependencies: t.dependencies.filter((dependencyId) => dependencyId !== taskFrom.id),
            };
          }

          return {
            ...t,
            dependencies: [...t.dependencies, taskFrom.id],
          };
        }
      }

      return t;
    }));
  };

  const handleTaskDelete = (task: Task) => {
    const conf = window.confirm("Are you sure about " + task.name + " ?");
    if (conf) {
      setTasks(tasks.filter(t => t.id !== task.id));
    }
    return conf;
  };

  const handleProgressChange = async (task: Task) => {
    setTasks(tasks.map(t => (t.id === task.id ? task : t)));
    console.log("On progress change Id:" + task.id);
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
      <ViewSwitcher
        onViewModeChange={viewMode => setView(viewMode)}
        onViewListChange={setIsChecked}
        isChecked={isChecked}
      />
      <h3>Gantt With Unlimited Height</h3>
      <Gantt
        tasks={tasks}
        viewMode={view}
        onDateChange={handleTaskChange}
        onRelationChange={handleRelationChange}
        onDelete={handleTaskDelete}
        onProgressChange={handleProgressChange}
        onDoubleClick={handleDblClick}
        onClick={handleClick}
        onSelect={handleSelect}
        onExpanderClick={handleExpanderClick}
        listCellWidth={isChecked ? "155px" : ""}
        columnWidth={columnWidth}
      />
      <h3>Gantt With Limited Height</h3>
      <Gantt
        tasks={tasks}
        viewMode={view}
        monthCalendarFormat={"2-digit"}
        monthTaskListFormat={"short"}
        onDateChange={handleTaskChange}
        onRelationChange={handleRelationChange}
        onDelete={handleTaskDelete}
        onProgressChange={handleProgressChange}
        onDoubleClick={handleDblClick}
        onClick={handleClick}
        onSelect={handleSelect}
        onExpanderClick={handleExpanderClick}
        listCellWidth={isChecked ? "155px" : ""}
        ganttHeight={300}
        columnWidth={columnWidth}
      />
    </div>
  );
};

export default App;
