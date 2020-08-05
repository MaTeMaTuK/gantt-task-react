export enum ViewMode {
  QuarterDay = "Quarter Day",
  HalfDay = "Half Day",
  Day = "Day",
  /** ISO-8601 week */
  Week = "Week",
  Month = "Month",
}
export interface Task {
  id: string;
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
  dependencies?: string[];
}

export interface EventOption {
  /**
   * Time step value for date changes.
   */
  timeStep?: number;
  onDoubleClick?: (task: Task) => any;
  onDateChange?: (task: Task) => void | Promise<any>;
  onProgressChange?: (task: Task) => void | Promise<any>;
  onTaskDelete?: (task: Task) => void | Promise<any>;
}

export interface DisplayOption {
  viewMode?: ViewMode;
  /**
   * Specifies the month name language. Able formats: ISO 639-2, Java Locale
   */
  locale?: string;
}

export interface StylingOption {
  headerHeight?: number;
  columnWidth?: number;
  rowHeight?: number;
  barCornerRadius?: number;
  handleWidth?: number;
  fontFamily?: string;
  fontSize?: string;
  /**
   * How many of row width can be taken by task.
   * From 0 to 100
   */
  barFill?: number;
  barProgressColor?: string;
  barProgressSelectedColor?: string;
  barBackgroundColor?: string;
  barBackgroundSelectedColor?: string;
  arrowColor?: string;
  arrowIndent?: number;
  todayColor?: string;
  getTooltipContent?: (
    task: Task,
    fontSize: string,
    fontFamily: string
  ) => JSX.Element;
}

export interface GanttProps extends EventOption, DisplayOption, StylingOption {
  tasks: Task[];
}
