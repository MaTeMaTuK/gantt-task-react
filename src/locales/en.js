const global = {
  update: "Update",
  create: "Create",
  cancel: "Cancel",
  back: "Back",
  complete: "Complete",
  success: "success",
  fail: "fail",
  updatedAt: "Updated At",
  createdAt: "Created At",
  delete: "Delete",
  default: "Default",
  exit: "Exit",
};

const date = {
  DateTime: "DateTime",
  Day: "Day",
  Week: "Week",
  Month: "Month",
  Quarter: "Quarter",
  Year: "Year",
  format: {
    week: "wo",
    quarter: "qQ",
  },
  Today: "Today",
};
const en = {
  index: {
    hello: "Hello, {{name}}.",
    welcome: "Welcome to ",
  },
  locale: {
    current: "Current locale: ",
    zh: "Chinese",
    "zh-CN": "Chinese",
    "zh-HK": "Chinese",
    "zh-TW": "Chinese",
    en: "English",
    "en-US": "English",
  },
  global,
  date,
  configuration: {
    title: "Gantt config",
    baseLineConfiguration: {
      baseline: "Baseline",
      baseLineTitleDescription:
        "Click the Baseline card to choose to show the baseline",
      createBaseline: "Create baseline",
      newBaseline: "New baseline",
      editBaseline: "Edit baseline",
      baselineName: "Baseline name",
      baselineDescription: "Baseline description",
      loaded: "Loaded",
      deleteBaseline: "Delete baseline",
      deleteDescription:
        "Deleted baselines cannot be recovered, confirm deletion",
    },
    displayItemsConfiguration: {
      displayItems: "Display items",
      criticalPath: "Critical path",
      overdueItems: "Overdue items",
    },
    timeFieldConfiguration: {
      timeFieldConfigurationTitle: "Time field configuration",
      timeFieldConfigurationDescription:
        "In order for the Gantt chart to display correctly, you need to set which time field of the matter corresponds to the start and end time of the time block in the Gantt chart",
      relatedItems: "Related items",
      operation: "Operation",
      default: "Default",
      configuration: "Configuration",
      addConfiguration: "Add configuration",
      itemType: "Item type",
      startTime: "Start time",
      endTime: "End time",
      percentageOfCompletion: "Percentage of completion",
      deleteTitle: "Delete this configuration",
      deleteTip:
        "It cannot be recovered after deletion. Are you sure you want to delete it?",
      noConfigurationTip:
        "Item types that are not configured will use the default configuration",
    },
    otherConfiguration: {
      otherConfigurationTitle: "Other configuration",
      automaticScheduling: "Automatic scheduling",
      otherConfigurationDescription:
        "Automatically adjusts card timing based on the relationship between cards to avoid logical errors",
      otherConfigurationTips:
        "When auto-scheduling is turned on, the time of all events is automatically adjusted according to the current event relationship. Confirmation of turning on？",
    },
    unconfigurationModal: {
      unconfigurationTip:
        "No time fields for the cards in the Gantt chart have been configured yet",
      clickHere: "Click here",
      performConfiguration: "Perform configuration",
    },
  },
  errorMessage: {
    baselineNameError: "Please enter the baseline name",
    nameAlreadyExists: "This name already exists",
    itemTypeAlreadyExists:
      "This item type is already selected, please select again",
    itemsTypeError: "Please select the items type",
    startTimeError: "Please select the start date field",
    endTimeError: "Please select the end date field",
  },
  placeholder: {
    baselineNamePlaceholder:
      "Please enter the baseline name Maximum length 32 characters",
    baselineDescriptionPlaceholder: "Please enter the baseline description",
    pleaseSelect: "Please select",
  },
};

export default en;
