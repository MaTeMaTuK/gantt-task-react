import React from "react";

export enum ViewMode {
  QuarterDay = "Quarter Day",
  HalfDay = "Half Day",
  Day = "Day",
  /** ISO-8601 week */
  Week = "Week",
  Month = "Month",
  Year = "Year",
  Quarter = "Quarter",
}
export const viewModeOptions = [
  {
    label: "日",
    value: "Day",
  },
  {
    label: "周",
    value: "Week",
  },
  {
    label: "月",
    value: "Month",
  },
  {
    label: "季",
    value: "Quarter",
  },

  {
    label: "年",
    value: "Year",
  },
];
export type TaskType = "task" | "milestone" | "project" | "parent";

export interface OptionsProp {
  label: string;
  value: string;
  objectId?: string;
}
export interface Task {
  id: string;
  type: TaskType;
  name: string;
  start: Date;
  end: Date;
  /**
   * From 0 to 100
   */
  progress: number;
  styles?: {
    backgroundColor?: string;
    backgroundSelectedColor?: string;
    progressColor?: string;
    progressSelectedColor?: string;
  };
  isDisabled?: boolean;
  project?: string;
  dependencies?: string[];
  item?: {
    [propName: string]: any;
  };
}

export interface EventOption {
  /**
   * Time step value for date changes.
   */
  timeStep?: number;
  /**
   * Invokes on bar select on unselect.
   */
  onSelect?: (task: Task, isSelected: boolean) => void;
  /**
   * Invokes on bar double click.
   */
  onDoubleClick?: (task: Task) => void;
  /**
   * Invokes on end and start time change. Chart undoes operation if method return false or error.
   */
  onDateChange?: (
    task: Task
  ) => void | boolean | Promise<void> | Promise<boolean>;
  /**
   * Invokes on progress change. Chart undoes operation if method return false or error.
   */
  onProgressChange?: (
    task: Task
  ) => void | boolean | Promise<void> | Promise<boolean>;
  /**
   * Invokes on delete selected task. Chart undoes operation if method return false or error.
   */
  onDelete?: (task: Task) => void | boolean | Promise<void> | Promise<boolean>;
}

export interface DisplayOption {
  viewMode?: ViewMode;
  /**
   * Specifies the month name language. Able formats: ISO 639-2, Java Locale
   */
  locale?: string;
}
export interface ConfigOption {
  isBaseLine?: boolean; // 是否显示基线
  isDisplayConfig?: boolean; // 是否有显示配置
  isSetting?: boolean; // 是否显示配置按钮
}
export interface StylingOption {
  headerHeight?: number;
  columnWidth?: number;
  listCellWidth?: string;
  rowHeight?: number;
  ganttHeight?: number;
  barCornerRadius?: number;
  handleWidth?: number;
  fontFamily?: string;
  fontSize?: string;
  listWidth?: number;
  listBottomHeight?: number;
  /**
   * How many of row width can be taken by task.
   * From 0 to 100
   */
  barFill?: number;
  barProgressColor?: string;
  barProgressSelectedColor?: string;
  barBackgroundColor?: string;
  barBackgroundSelectedColor?: string;
  projectProgressColor?: string;
  projectProgressSelectedColor?: string;
  projectBackgroundColor?: string;
  projectBackgroundSelectedColor?: string;
  milestoneBackgroundColor?: string;
  milestoneBackgroundSelectedColor?: string;
  arrowColor?: string;
  arrowIndent?: number;
  todayColor?: string;
  TooltipContent?: React.FC<{
    task: Task;
    fontSize: string;
    fontFamily: string;
  }>;
  TaskListHeader?: React.FC<{
    headerHeight: number;
    rowWidth: string;
    fontFamily: string;
    fontSize: string;
  }>;
  TaskListTable?: React.FC<{
    rowHeight: number;
    rowWidth: string;
    fontFamily: string;
    fontSize: string;
    locale: string;
    tasks: Task[];
    selectedTaskId: string;
    /**
     * Sets selected task by id
     */
    setSelectedTask: (taskId: string) => void;
  }>;
}

export interface ConnectionProps {
  delConnection: (value: string) => void;
  addConnection: (params: {
    source: string;
    destination: string;
    linkType: string;
  }) => void;
  itemLinks: any[];
}
export interface TimeItemProps {
  itemType?: string;
  startDate?: string;
  endDate?: string;
  baseLineStartDate?: string;
  baseLineEndDate?: string;
  percentage?: string;
  isDefault?: boolean;
}
export interface FieldsTypeProps extends OptionsProp {
  [propName: string]: any;
}
export interface FieldAndItemProps extends OptionsProp {
  fieldType?: FieldsTypeProps;
  icon?: string;
}

export interface MilestoneProps {
  itemType: string;
  startDate: string;
}
export interface OtherConfigProps {
  overdue?: boolean;
  autoPatch?: boolean;
  pivotalPath?: boolean;
  [propName: string]: any;
}
export interface GanttConfigProps {
  time?: TimeItemProps[];
  milestone?: MilestoneProps;
  otherConfig?: OtherConfigProps;
  [propName: string]: any;
}
export interface BaselineProps {
  name?: string;
  description?: string;
  [propName: string]: any;
}
export interface GanttProps
  extends EventOption,
    DisplayOption,
    StylingOption,
    ConfigOption,
    ConnectionProps {
  tasks: Task[];
  baseLineLog?: Task[];
  itemTypeData?: OptionsProp[];
  customeFieldData?: OptionsProp[];
  ganttConfig?: GanttConfigProps;
  baselineList?: BaselineProps[];
  configHandle?: (value: GanttConfigProps) => void;
  baseLineHandle?: (
    value?: BaselineProps,
    type?: "add" | "edit" | "delete"
  ) => void;
  setItemTypeValue?: (value: string) => void;
  setCurrentLog?: (value: BaselineProps) => void;
  renderTaskListComponent?: () => JSX.Element;
  renderUserAvatar?: (assignee: Assignee[]) => JSX.Element;
  renderOverflowTooltip?: (value: string) => JSX.Element;
  isUpdate?: boolean;
  currentLog?: BaselineProps;
  actionRef?: React.MutableRefObject<any>;
  workspaceId?: string;
  getCustomFields?: (val: TimeItemProps) => Promise<any>;
  isConnect?: boolean; // 是否允许连线
}

export interface TabConfigProps {
  currentTab: string;
}
// 特殊时间精度
export const DateDeltaInit = {
  [ViewMode.Month]: {
    1: 31 * 24 * 3600 * 1000,
    2: 28 * 24 * 3600 * 1000,
    3: 31 * 24 * 3600 * 1000,
    4: 30 * 24 * 3600 * 1000,
    5: 31 * 24 * 3600 * 1000,
    6: 30 * 24 * 3600 * 1000,
    7: 31 * 24 * 3600 * 1000,
    8: 31 * 24 * 3600 * 1000,
    9: 30 * 24 * 3600 * 1000,
    10: 31 * 24 * 3600 * 1000,
    11: 30 * 24 * 3600 * 1000,
    12: 31 * 24 * 3600 * 1000,
  },
  [ViewMode.Year]: {
    common: 365 * 24 * 3600 * 1000,
    leap: 366 * 24 * 3600 * 1000,
  },
  [ViewMode.Quarter]: {
    1: (31 + 28 + 31) * 24 * 3600 * 1000,
    2: (30 + 31 + 30) * 24 * 3600 * 1000,
    3: (31 + 31 + 30) * 24 * 3600 * 1000,
    4: (30 + 30 + 31) * 24 * 3600 * 1000,
  },
  LeapMounth: 29 * 24 * 3600 * 1000,
  LeapQuarter: (31 + 29 + 31) * 24 * 3600 * 1000,
};
export interface Assignee {
  enabled?: boolean;
  label: string;
  nickname: string;
  username: string;
  value: string;
}
