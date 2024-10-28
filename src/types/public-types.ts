export enum ViewMode {
  Hour = "Hour",
  QuarterDay = "Quarter Day",
  HalfDay = "Half Day",
  Day = "Day",
  /** ISO-8601 week */
  Week = "Week",
  Month = "Month",
  QuarterYear = "QuarterYear",
  Year = "Year",
}
export type TaskType = "task" | "milestone" | "provider";
export type SubType = "red_team" | "live_call" | "dictation";
export type ViewType = "call_type" | "tat";
export type TimeSection = { start: Date; end: Date };
export interface Task {
  id: string;
  type: TaskType;
  subType?: SubType;
  name: string;
  provider?: string;
  start: Date;
  end: Date;
  transcriptionStart?: Date;
  transcriptionEnd?: Date;
  tat_avg?: number;
  tat_min?: number;
  tat_max?: number;
  tat_total?: number;
  red_team_count?: number;
  live_call_count?: number;
  dictation_count?: number;
  total_count?: number;
  hideChildren?: boolean;
  displayOrder?: number;
  sections?: TimeSection[];
  styles?: {
    backgroundColor?: string;
    backgroundSelectedColor?: string;
    redBarColor?: string;
    yellowBarColor?: string;
    greenBarColor?: string;
    dictationBarColor?: string;
    liveCallBarColor?: string;
    redTeamBarColor?: string;
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
   * Invokes on bar click.
   */
  onClick?: (task: Task) => void;
  /**
   * Invokes on end and start time change. Chart undoes operation if method return false or error.
   */
  onDateChange?: (
    task: Task,
    children: Task[]
  ) => void | boolean | Promise<void> | Promise<boolean>;
  /**
   * Invokes on delete selected task. Chart undoes operation if method return false or error.
   */
  onDelete?: (task: Task) => void | boolean | Promise<void> | Promise<boolean>;
  /**
   * Invokes on expander on task list
   */
  onExpanderClick?: (task: Task) => void;
}

export interface DisplayOption {
  viewMode?: ViewMode;
  viewDate?: Date;
  preStepsCount?: number;
  /**
   * Specifies the month name language. Able formats: ISO 639-2, Java Locale
   */
  locale?: string;
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
  /**
   * How many of row width can be taken by task.
   * From 0 to 100
   */
  barFill?: number;
  barBackgroundColor?: string;
  barBackgroundSelectedColor?: string;
  providerBackgroundColor?: string;
  providerBackgroundSelectedColor?: string;
  milestoneBackgroundColor?: string;
  milestoneBackgroundSelectedColor?: string;
  redBarColor?: string;
  yellowBarColor?: string;
  greenBarColor?: string;
  dictationBarColor?: string;
  liveCallBarColor?: string;
  redTeamBarColor?: string;
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
    onExpanderClick: (task: Task) => void;
  }>;
}

export interface GanttProps extends EventOption, DisplayOption, StylingOption {
  tasks: Task[];
  viewType: ViewType;
}
