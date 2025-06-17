import React from "react";
import { Task, ExtraColumn } from "../../dist/types/public-types";

export function initTasksWithExtraColumns() {
  const currentDate = new Date();
  const tasks: Task[] = [
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      name: "Website Redesign",
      id: "ProjectSample",
      progress: 25,
      type: "project",
      hideChildren: false,
      displayOrder: 1,
      extraColumns: {
        status: "In Progress",
        assignee: "Project Team",
        priority: "High",
        budget: 50000,
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
      name: "Initial Planning",
      id: "Task 0",
      progress: 45,
      type: "task",
      project: "ProjectSample",
      displayOrder: 2,
      extraColumns: {
        status: "Completed",
        assignee: "John Doe",
        priority: "High",
        budget: 5000,
      },
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4, 0, 0),
      name: "Market Research",
      id: "Task 1",
      progress: 25,
      dependencies: ["Task 0"],
      type: "task",
      project: "ProjectSample",
      displayOrder: 3,
      extraColumns: {
        status: "In Progress",
        assignee: "Jane Smith",
        priority: "Medium",
        budget: 8000,
      },
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8, 0, 0),
      name: "Design Mockups",
      id: "Task 2",
      progress: 10,
      dependencies: ["Task 1"],
      type: "task",
      project: "ProjectSample",
      displayOrder: 4,
      extraColumns: {
        status: "Not Started",
        assignee: "Bob Wilson",
        priority: "High",
        budget: 12000,
      },
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9, 0, 0),
      name: "Client Review",
      id: "Task 3",
      progress: 0,
      dependencies: ["Task 2"],
      type: "milestone",
      project: "ProjectSample",
      displayOrder: 5,
      extraColumns: {
        status: "Pending",
        assignee: "Client",
        priority: "Critical",
        budget: 0,
      },
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      name: "Development",
      id: "Task 4",
      progress: 0,
      dependencies: ["Task 3"],
      type: "task",
      project: "ProjectSample",
      displayOrder: 6,
      extraColumns: {
        status: "Not Started",
        assignee: "Dev Team",
        priority: "High",
        budget: 25000,
      },
    },
  ];
  return tasks;
}

export const extraColumns: ExtraColumn[] = [
  {
    key: "status",
    title: "Status",
    width: "120px",
    render: (task) => {
      const status = task.extraColumns?.status as string;
      const statusClass = {
        "Completed": "status-completed",
        "In Progress": "status-in-progress", 
        "Not Started": "status-not-started",
        "Pending": "status-pending"
      }[status] || "";
      
      return (
        <span className={`status-badge ${statusClass}`}>
          {status}
        </span>
      );
    },
  },
  {
    key: "assignee",
    title: "Assignee",
    width: "140px",
  },
  {
    key: "priority",
    title: "Priority",
    width: "100px",
    render: (task) => {
      const priority = task.extraColumns?.priority as string;
      const priorityClass = {
        "Critical": "priority-critical",
        "High": "priority-high",
        "Medium": "priority-medium",
        "Low": "priority-low"
      }[priority] || "";
      
      return (
        <span className={`priority-badge ${priorityClass}`}>
          {priority}
        </span>
      );
    },
  },
  {
    key: "budget",
    title: "Budget",
    width: "100px",
    render: (task) => {
      const budget = task.extraColumns?.budget as number;
      return budget > 0 ? `$${budget.toLocaleString()}` : "-";
    },
  },
];
