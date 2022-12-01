import { Gantt, ViewMode } from "gantt-task-react/dist/index";
import "gantt-task-react/dist/index.css";
import "./App.css";

function App() {
  // return <>Dashboard</>;
  const tasks: any = [
    {
      start: new Date(2022, 1, 1),
      end: new Date(2022, 1, 2),
      stageName: "Grooming",
      subStageName: "Test",
      team: "FrontEnd",
      jiraEpics: "JiraHere",
      id: "Task 0",
      type: "task",
      progress: 45,
      isDisabled: true,
      styles: { progressColor: "#ffbb54", progressSelectedColor: "#ff9e0d" },
    },
    {
      start: new Date(2022, 1, 2),
      end: new Date(2022, 1, 8),
      stageName: "Development",

      team: "FrontEnd",
      jiraEpics: "JiraHere",
      id: "Task 1",
      type: "task",
      progress: 50,
      dependencies: ["Task 0"],
      // isDisabled: true,
      styles: { progressColor: "#ffbb54", progressSelectedColor: "#ff9e0d" },
    },
    {
      start: new Date(2022, 1, 2),
      end: new Date(2022, 1, 15),
      stageName: "Quality Assurance",
      subStageName: "Test",
      team: "FrontEnd",
      jiraEpics: "JiraHere",
      id: "Task 2",
      type: "task",
      progress: 50,
      dependencies: ["Task 1"],
      isDisabled: true,
      styles: { progressColor: "#ffbb54", progressSelectedColor: "#ff9e0d" },
    },
    {
      start: new Date(2022, 1, 2),
      end: new Date(2022, 1, 6),
      stageName: "Quality Assurance",
      subStageName: "Test",
      team: "FrontEnd",
      jiraEpics: "JiraHere",
      id: "Task 3",
      type: "task",
      progress: 50,
      dependencies: ["Task 0"],
      isDisabled: true,
      styles: { progressColor: "#ffbb54", progressSelectedColor: "#ff9e0d" },
    },
  ];

  return (
    <Gantt
      tasks={tasks}
      viewMode={ViewMode.Day}
      fontFamily="Consolas, Monaco, 'Andale Mono', monospace"
      columnWidth={114}
    />
  );
}

export default App;
