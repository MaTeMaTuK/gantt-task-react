import React from "react";
import { Task } from "../../dist/types/public-types";

export function initTasks() {
  // const currentDate = new Date();
  const tasks = [
    {
      start: new Date(2023, 12, 1),
      end: new Date(2024, 10, 30),
      name: 'External Wall Insulation (EWI)',
      id: '0',
      type: 'project',
      progress: 20,
      isDisabled: true
    },
    {
      start: new Date(2023, 12, 1),
      end: new Date(2024, 5, 30),
      name: 'Survey',
      id: '1',
      type: 'task',
      isDisabled: true,
      icon: <svg width="15" height="18" viewBox="1 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.883883" y="7" width="8.75" height="8.75" rx="1.375" transform="rotate(-45 0.883883 7)" stroke="#EDFF00" stroke-width="1.25" />
      </svg>
    },
    {
      start: new Date(2024, 3, 1),
      end: new Date(2024, 8, 30),
      name: 'Measure Wall Dimension',
      id: '2',
      type: 'task',
      isDisabled: true,
      dependencies: ['1'],
      icon: <svg width="15" height="18" viewBox="0 -1 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="6" cy="6" r="5.375" stroke="#EDFF00" stroke-width="1.25" />
      </svg>
    },
    {
      start: new Date(2024, 5, 1),
      end: new Date(2024, 10, 30),
      name: 'Energy Usage Analysis',
      id: '3',
      type: 'task',
      dependencies: ['1'],
      isDisabled: true,
      icon: <svg width="15" height="18" viewBox="0 -1 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="6" cy="6" r="5.375" stroke="#EDFF00" stroke-width="1.25" />
      </svg>
    },
    {
      start: new Date(2024, 7, 1),
      end: new Date(2024, 10, 30),
      name: 'Energy Usage Analysis',
      id: '4',
      type: 'task',
      dependencies: ['3'],
      isDisabled: true,
      icon: <svg width="15" height="18" viewBox="0 -1 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="6" cy="6" r="5.375" stroke="#EDFF00" stroke-width="1.25" />
      </svg>
    },
    {
      start: new Date(2023, 12, 1),
      end: new Date(2024, 5, 30),
      name: 'Energy Usage Analysis',
      id: '5',
      type: 'task',
      isDisabled: true,
      icon: <svg width="15" height="18" viewBox="1 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.883883" y="7" width="8.75" height="8.75" rx="1.375" transform="rotate(-45 0.883883 7)" stroke="#EDFF00" stroke-width="1.25" />
      </svg>
    },
    {
      start: new Date(2023, 12, 1),
      end: new Date(2024, 5, 30),
      name: 'Variation',
      id: '6',
      type: 'task',
      isDisabled: true,
      icon: <>
        <g clip-path="url(#clip0_2_2423)">
          <path d="M7.33337 2.99999H12.2C12.9468 2.99999 13.3201 3 13.6054 3.14532C13.8562 3.27315 14.0602 3.47712 14.188 3.72801C14.3334 4.01322 14.3334 4.38659 14.3334 5.13333V6C14.3334 6.62125 14.3334 6.93188 14.2319 7.17691C14.0966 7.50361 13.837 7.76318 13.5103 7.8985C13.2653 8 12.9546 8 12.3334 8M8.66671 13H3.80004C3.0533 13 2.67994 13 2.39472 12.8547C2.14384 12.7268 1.93986 12.5229 1.81203 12.272C1.66671 11.9868 1.66671 11.6134 1.66671 10.8667V10C1.66671 9.37874 1.66671 9.06811 1.7682 8.82308C1.90353 8.49638 2.16309 8.23681 2.4898 8.10149C2.73482 7.99999 3.04545 8 3.66671 8M6.86671 9.66666H9.13337C9.32006 9.66666 9.4134 9.66666 9.4847 9.63033C9.54743 9.59837 9.59842 9.54738 9.63038 9.48466C9.66671 9.41335 9.66671 9.32001 9.66671 9.13333V6.86666C9.66671 6.67998 9.66671 6.58664 9.63038 6.51533C9.59842 6.45261 9.54743 6.40162 9.4847 6.36966C9.4134 6.33333 9.32006 6.33333 9.13337 6.33333H6.86671C6.68002 6.33333 6.58668 6.33333 6.51538 6.36966C6.45266 6.40162 6.40166 6.45261 6.36971 6.51533C6.33337 6.58664 6.33337 6.67998 6.33337 6.86666V9.13333C6.33337 9.32001 6.33337 9.41335 6.36971 9.48466C6.40166 9.54738 6.45266 9.59837 6.51538 9.63033C6.58668 9.66666 6.68002 9.66666 6.86671 9.66666ZM11.8667 14.6667H14.1334C14.3201 14.6667 14.4134 14.6667 14.4847 14.6303C14.5474 14.5984 14.5984 14.5474 14.6304 14.4847C14.6667 14.4134 14.6667 14.32 14.6667 14.1333V11.8667C14.6667 11.68 14.6667 11.5866 14.6304 11.5153C14.5984 11.4526 14.5474 11.4016 14.4847 11.3697C14.4134 11.3333 14.3201 11.3333 14.1334 11.3333H11.8667C11.68 11.3333 11.5867 11.3333 11.5154 11.3697C11.4527 11.4016 11.4017 11.4526 11.3697 11.5153C11.3334 11.5866 11.3334 11.68 11.3334 11.8667V14.1333C11.3334 14.32 11.3334 14.4134 11.3697 14.4847C11.4017 14.5474 11.4527 14.5984 11.5154 14.6303C11.5867 14.6667 11.68 14.6667 11.8667 14.6667ZM1.86671 4.66666H4.13337C4.32006 4.66666 4.4134 4.66666 4.4847 4.63033C4.54743 4.59837 4.59842 4.54738 4.63038 4.48466C4.66671 4.41335 4.66671 4.32001 4.66671 4.13333V1.86666C4.66671 1.67998 4.66671 1.58664 4.63038 1.51533C4.59842 1.45261 4.54743 1.40162 4.4847 1.36966C4.4134 1.33333 4.32006 1.33333 4.13337 1.33333H1.86671C1.68002 1.33333 1.58668 1.33333 1.51538 1.36966C1.45266 1.40162 1.40166 1.45261 1.36971 1.51533C1.33337 1.58664 1.33337 1.67998 1.33337 1.86666V4.13333C1.33337 4.32001 1.33337 4.41335 1.36971 4.48466C1.40166 4.54738 1.45266 4.59837 1.51538 4.63033C1.58668 4.66666 1.68002 4.66666 1.86671 4.66666Z" stroke="#EDFF00" stroke-linecap="round" stroke-linejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_2_2423">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </>
    },
    {
      start: new Date(2023, 12, 1),
      end: new Date(2024, 5, 30),
      name: 'Energy Usage Analysis',
      id: '7',
      type: 'task',
      isDisabled: true,
      icon: <svg width="15" height="18" viewBox="1 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.883883" y="7" width="8.75" height="8.75" rx="1.375" transform="rotate(-45 0.883883 7)" stroke="#EDFF00" stroke-width="1.25" />
      </svg>
    },
    {
      start: new Date(2023, 12, 1),
      end: new Date(2024, 5, 30),
      name: 'Energy Usage Analysis',
      id: '8',
      type: 'task',
      isDisabled: true,
      icon: <svg width="15" height="18" viewBox="1 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.883883" y="7" width="8.75" height="8.75" rx="1.375" transform="rotate(-45 0.883883 7)" stroke="#EDFF00" stroke-width="1.25" />
      </svg>
    },
    {
      start: new Date(2024, 5, 1),
      end: new Date(2025, 5, 30),
      name: 'Internal Wall Insulation (IWI)',
      id: '9',
      type: 'project',
      progress: 20,
      isDisabled: true,
    },
    {
      start: new Date(2024, 9, 1),
      end: new Date(2025, 5, 30),
      name: 'Loft Insulation',
      id: '10',
      type: 'project',
      progress: 20,
      isDisabled: true
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
