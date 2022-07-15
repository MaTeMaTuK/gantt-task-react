import React from "react";
export declare enum ViewMode {
    QuarterDay = "Quarter Day",
    HalfDay = "Half Day",
    Day = "Day",
    /** ISO-8601 week */
    Week = "Week",
    Month = "Month",
    Year = "Year",
    Quarter = "Quarter"
}
export declare const viewModeOptions: {
    label: string;
    value: string;
}[];
export declare type TaskType = "task" | "milestone" | "project" | "parent";
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
export interface ItemLink {
    objectId: string;
    destination: object;
    linkType: object;
    source: object;
    [propName: string]: any;
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
    onDateChange?: (task: Task) => void | boolean | Promise<void> | Promise<boolean>;
    /**
     * Invokes on progress change. Chart undoes operation if method return false or error.
     */
    onProgressChange?: (task: Task) => void | boolean | Promise<void> | Promise<boolean>;
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
    isBaseLine?: boolean;
    isDisplayConfig?: boolean;
    isSetting?: boolean;
    isViewModeChange?: boolean;
    isToToday?: boolean;
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
    delConnection?: (value: string) => void;
    addConnection?: (params: {
        source: string;
        destination: string;
        linkType: string;
    }) => void;
    itemLinks?: ItemLink[];
    setCurrentConnection?: (connection: any) => void;
    currentConnection?: any;
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
    currentPanel?: string;
    otherConfig?: OtherConfigProps;
    [propName: string]: any;
}
export interface BaselineProps {
    name?: string;
    description?: string;
    [propName: string]: any;
}
export interface GanttProps extends EventOption, DisplayOption, StylingOption, ConfigOption, ConnectionProps {
    tasks: Task[];
    baseLineLog?: Task[];
    itemTypeData?: OptionsProp[];
    customeFieldData?: OptionsProp[];
    ganttConfig?: GanttConfigProps;
    baselineList?: BaselineProps[];
    configHandle?: (value: GanttConfigProps) => void;
    baseLineHandle?: (value?: BaselineProps, type?: "add" | "edit" | "delete") => void;
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
    isConnect?: boolean;
    onMouseEvent?: (type?: string, task?: Task) => void;
    onClickEvent?: (type?: string, task?: Task) => void;
    configVisibleChange?: (val: boolean) => void;
    tableQuerySelector?: string;
}
export interface TabConfigProps {
    currentTab: string;
}
export declare const DateDeltaInit: {
    Month: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
        6: number;
        7: number;
        8: number;
        9: number;
        10: number;
        11: number;
        12: number;
    };
    Year: {
        common: number;
        leap: number;
    };
    Quarter: {
        1: number;
        2: number;
        3: number;
        4: number;
    };
    LeapMounth: number;
    LeapQuarter: number;
};
export interface Assignee {
    enabled?: boolean;
    label: string;
    nickname: string;
    username: string;
    value: string;
}
