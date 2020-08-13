# gantt-task-react

## Interactive Gantt Chart for React with TypeScript.

![example](https://user-images.githubusercontent.com/26743903/88215863-f35d5f00-cc64-11ea-81db-e829e6e9b5c8.png)

## [Live Demo](https://matematuk.github.io/gantt-task-react/)

## Install

```
npm install gantt-task-react
```

## How to use it

```javascript
import { Gantt, Task, EventOption, StylingOption, ViewMode, DisplayOption } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";

let tasks: Task[] = [
    {
      start: new Date(2020, 1, 1),
      end: new Date(2020, 1, 2),
      name: 'Idea',
      id: 'Task 0',
      progress: 45,
      isDisabled: true,
      styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
    },
    ...
];
<Gantt tasks={tasks} />
```

You may handle actions

```javascript
<Gantt
  tasks={tasks}
  viewMode={view}
  onDateChange={onTaskChange}
  onTaskDelete={onTaskDelete}
  onProgressChange={onProgressChange}
  onDoubleClick={onDblClick}
/>
```

## How to run example

```
cd ./example
npm install
npm start
```

## Gantt Configuration

### GanttProps

| Parameter Name                  | Type      | Description                                        |
| :------------------------------ | :-------- | :------------------------------------------------- |
| tasks (Required)                | Task      | Tasks array.                                       |
| [EventOption](#EventOption)     | interface | Specifies gantt events.                            |
| [DisplayOption](#DisplayOption) | interface | Specifies view type and display timeline language. |
| StylingOption                   | interface | Specifies chart and global tasks styles            |

### EventOption

| Parameter Name   | Type                              | Description                                                                             |
| :--------------- | :-------------------------------- | :-------------------------------------------------------------------------------------- |
| onDoubleClick    | (task: Task) => any               | Specifies the function to be executed on the taskbar onDoubleClick event.               |
| onTaskDelete     | (task: Task) => void/Promise<any> | Specifies the function to be executed on the taskbar on Delete button press event.      |
| onDateChange     | (task: Task) => void/Promise<any> | Specifies the function to be executed when drag taskbar event on timeline has finished. |
| onProgressChange | (task: Task) => void/Promise<any> | Specifies the function to be executed when drag taskbar progress event has finished.    |
| timeStep         | number                            | A time step value for onDateChange. Specify in milliseconds.                            |

### DisplayOption

| Parameter Name | Type   | Description                                                                                     |
| :------------- | :----- | :---------------------------------------------------------------------------------------------- |
| viewMode       | enum   | Specifies the time scale. Quarter Day, Half Day, Day, Week(ISO-8601, 1st day is Monday), Month. |
| locale         | string | Specifies the month name language. Able formats: ISO 639-2, Java Locale.                        |

### StylingOption

| Parameter Name             | Type   | Description                                                             |
| :------------------------- | :----- | :---------------------------------------------------------------------- |
| headerHeight               | number | Specifies the header height.                                            |
| columnWidth                | number | Specifies the time period width.                                        |
| rowHeight                  | number | Specifies the task row height.                                          |
| barCornerRadius            | number | Specifies the taskbar corner rounding.                                  |
| barFill                    | number | Specifies the taskbar occupation. Sets in percent from 0 to 100.        |
| handleWidth                | number | Specifies width the taskbar drag event control for start and end dates. |
| fontFamily                 | string | Specifies the application font.                                         |
| fontSize                   | string | Specifies the application font size.                                    |
| barProgressColor           | string | Specifies the taskbar progress fill color globally.                     |
| barProgressSelectedColor   | string | Specifies the taskbar progress fill color globally on select.           |
| barBackgroundColor         | string | Specifies the taskbar background fill color globally.                   |
| barBackgroundSelectedColor | string | Specifies the taskbar background fill color globally on select.         |
| arrowColor                 | string | Specifies the relationship arrow fill color.                            |
| arrowIndent                | number | Specifies the relationship arrow right indent. Sets in px               |
| todayColor                 | string | Specifies the current period column fill color.                         |
| getTooltipContent          | \*     | Specifies the Tooltip for selected taskbar.                             |

\*`(task:Task, fontSize:string , fontFamily:string) => JSX.Element;`
