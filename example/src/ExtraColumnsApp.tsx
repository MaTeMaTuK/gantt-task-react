import React, { useState } from "react";
import { ViewMode, Gantt, DateFormat } from "gantt-task-react";
import { ViewSwitcher } from "./components/view-switcher";
import { initTasksWithExtraColumns, extraColumns } from "./extra-columns-helper";
import "gantt-task-react/dist/index.css";

//Init
const ExtraColumnsApp: React.FC = () => {
  const [tasks, setTasks] = useState(initTasksWithExtraColumns());
  const [view, setView] = useState<ViewMode>(ViewMode.Day);
  const [dateFormat, setDateFormat] = useState<DateFormat>("locale");
  
  let columnWidth = 65;
  if (view === ViewMode.Year) {
    columnWidth = 350;
  } else if (view === ViewMode.Month) {
    columnWidth = 300;
  } else if (view === ViewMode.Week) {
    columnWidth = 250;
  }

  return (
    <div className="Wrapper">
      <h2>Gantt Chart with Extra Columns Example</h2>
      <p>This example demonstrates how to add custom columns to the Gantt chart task list.</p>
      
      <div style={{ display: "flex", gap: "20px", alignItems: "center", marginBottom: "10px" }}>
        <ViewSwitcher
          onViewModeChange={(viewMode) => setView(viewMode)}
          onViewListChange={() => {}}
          isChecked={true}
        />
        
        <div>
          <label style={{ marginRight: "10px" }}>Date Format:</label>
          <select 
            value={dateFormat} 
            onChange={(e) => setDateFormat(e.target.value as DateFormat)}
            style={{ padding: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            <option value="locale">Locale Format (e.g., Fri, June 15, 2025)</option>
            <option value="iso8601">ISO 8601 Format (YYYY-MM-DD)</option>
          </select>
        </div>
      </div>
      
      <div style={{ marginTop: "20px" }}>
        <Gantt
          tasks={tasks}
          viewMode={view}
          extraColumns={extraColumns}
          nameColumnWidth="180px"
          fromColumnWidth="120px"
          toColumnWidth="120px"
          dateFormat={dateFormat}
          onDateChange={(task, _children) => {
            console.log("On date change Id:" + task.id);
            setTasks(tasks);
          }}
          onDelete={(task) => {
            const conf = window.confirm("Are you sure about " + task.name + " ?");
            if (conf) {
              setTasks(tasks.filter((t) => t.id !== task.id));
            }
            return conf;
          }}
          onProgressChange={(task, _children) => {
            console.log("On progress change Id:" + task.id);
            setTasks(tasks);
          }}
          onDoubleClick={(task) => {
            console.log("On Double Click event Id:" + task.id);
          }}
          onClick={(task) => {
            console.log("On Click event Id:" + task.id);
          }}
          columnWidth={columnWidth}
          listCellWidth="180px"
        />
      </div>
      
      <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "5px" }}>
        <h3>Features Demonstrated:</h3>
        <ul>
          <li><strong>Status Column:</strong> Shows task status with colored badges</li>
          <li><strong>Assignee Column:</strong> Displays who is responsible for each task</li>
          <li><strong>Priority Column:</strong> Shows task priority with colored indicators</li>
          <li><strong>Budget Column:</strong> Displays formatted budget amounts</li>
          <li><strong>Custom Column Widths:</strong> Name, From, and To columns have custom widths</li>
          <li><strong>Date Format Options:</strong> Toggle between locale and ISO (YYYY-MM-DD) date formats</li>
        </ul>
        
        <h4>How to Use:</h4>
        <ol>
          <li>Define your extra columns configuration with <code>ExtraColumn[]</code></li>
          <li>Add <code>extraColumns</code> data to your task objects</li>
          <li>Pass the columns configuration to the <code>Gantt</code> component</li>
          <li>Optionally use custom render functions for complex column content</li>
          <li>Set custom widths using <code>nameColumnWidth</code>, <code>fromColumnWidth</code>, <code>toColumnWidth</code></li>
          <li>Choose date format with <code>dateFormat</code> prop: "locale" or "iso"</li>
        </ol>
      </div>
    </div>
  );
};

export default ExtraColumnsApp;
