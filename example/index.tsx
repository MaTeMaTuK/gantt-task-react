import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  Gantt,
  Task,
  EventOption,
  StylingOption,
  ViewMode,
  DisplayOption,
} from '../src/index';

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
      name: 'Idea',
      id: 'Task 0',
      progress: 45,
      isDisabled: true,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4, 0, 0),
      name: 'Research',
      id: 'Task 1',
      progress: 25,
      dependencies: ['Task 0'],
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8, 0, 0),
      name: 'Discussion with team',
      id: 'Task 2',
      progress: 10,
      dependencies: ['Task 1'],
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9, 0, 0),
      name: 'Developing',
      id: 'Task 3',
      progress: 2,
      dependencies: ['Task 2'],
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
      name: 'Review',
      id: 'Task 4',
      progress: 70,
      dependencies: ['Task 2'],
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 26),
      name: 'Release',
      id: 'Task 6',
      progress: currentDate.getMonth(),
      dependencies: ['Task 4'],
      styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
    },
  ];

  let onTaskChange = (task: Task) => {
    console.log('On date change');
  };

  let onTaskDelete = (task: Task) => {
    const conf = confirm('Are you sure?');
    if (!conf) throw 'No del';
  };

  let onProgressChange = (task: Task) => {
    console.log('On progress change');
  };

  let onDblClick = (task: Task) => {
    alert('On Double Click event');
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

//Gantt with Custom table example
type GanttTableExampleProps = { tasks: Task[] } & EventOption & DisplayOption;
export const GanttTableExample: React.SFC<GanttTableExampleProps> = props => {
  const gridColumnWidth = 150;
  let options: StylingOption = {
    fontSize: '14px',
    fontFamily:
      'Arial, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue',
    headerHeight: 50,
    rowHeight: 50,
  };
  if (props.viewMode === ViewMode.Month) {
    options.columnWidth = 300;
  } else if (props.viewMode === ViewMode.Week) {
    options.columnWidth = 250;
  }

  const [tasks, setTasks] = React.useState(props.tasks);
  const onTaskDateChange = async (task: Task) => {
    if (props.onDateChange) {
      try {
        await props.onDateChange(task);
      } catch (e) {
        throw e;
      }
      setTasks(tasks.map(t => (t.id === task.id ? task : t)));
    }
  };

  const onTaskProgressChange = async (task: Task) => {
    if (props.onProgressChange) {
      try {
        await props.onProgressChange(task);
      } catch (e) {
        setTasks(props.tasks.slice());
        throw e;
      }

      setTasks(tasks.map(t => (t.id === task.id ? task : t)));
    }
  };

  const onTaskItemDelete = async (task: Task) => {
    if (props.onTaskDelete) {
      await props.onTaskDelete(task);
      setTasks(tasks.filter(t => t.id !== task.id));
    }
  };

  return (
    <div className="Wrapper">
      <div
        className="GanttTable"
        style={{
          fontFamily: options.fontFamily,
          fontSize: options.fontSize,
        }}
      >
        <div
          className="GanttTable-header"
          style={{
            height: options.headerHeight,
          }}
        >
          <div
            className="GanttTable-headerItem"
            style={{
              minWidth: gridColumnWidth,
            }}
          >
            <span role="img" aria-label="fromDate" className="GanttTable-icon">
              📃
            </span>
            Name
          </div>
          <div
            className="GanttTable-headerItem"
            style={{
              minWidth: gridColumnWidth,
            }}
          >
            <span role="img" aria-label="fromDate" className="GanttTable-icon">
              📅
            </span>
            From
          </div>
          <div
            className="GanttTable-headerItem"
            style={{
              minWidth: gridColumnWidth,
            }}
          >
            <span role="img" aria-label="toDate" className="GanttTable-icon">
              📅
            </span>
            To
          </div>
        </div>
        {tasks.map(t => {
          return (
            <div
              className="GanttTable-row"
              style={{ height: options.rowHeight }}
            >
              <div className="GanttTable-cell">{t.name}</div>
              <div className="GanttTable-cell">{t.start.toDateString()}</div>
              <div className="GanttTable-cell">{t.end.toDateString()}</div>
            </div>
          );
        })}
      </div>
      <div style={{ overflowX: 'scroll' }}>
        <Gantt
          {...options}
          {...props}
          tasks={tasks}
          onDateChange={onTaskDateChange}
          onTaskDelete={onTaskItemDelete}
          onProgressChange={onTaskProgressChange}
        />
      </div>
    </div>
  );
};

type ViewSwitcherProps = {
  onViewChange: (viewMode: ViewMode) => void;
};
const ViewSwitcher: React.SFC<ViewSwitcherProps> = ({ onViewChange }) => {
  return (
    <div className="ViewContainer">
      <button
        className="Button"
        onClick={() => onViewChange(ViewMode.QuarterDay)}
      >
        Quarter of Day
      </button>
      <button className="Button" onClick={() => onViewChange(ViewMode.HalfDay)}>
        Half of Day
      </button>
      <button className="Button" onClick={() => onViewChange(ViewMode.Day)}>
        Day
      </button>
      <button className="Button" onClick={() => onViewChange(ViewMode.Week)}>
        Week
      </button>
      <button className="Button" onClick={() => onViewChange(ViewMode.Month)}>
        Month
      </button>
    </div>
  );
};
ReactDOM.render(<App />, document.getElementById('root'));
