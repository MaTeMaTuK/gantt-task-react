const global = {
  update: "Update",
  create: "Create",
  cancel: "Cancel",
  back: "Back",
  complete: "OK",
  success: "success",
  fail: "Fail",
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
    title: "Gantt Config",
    baseLineConfiguration: {
      baseline: "Baseline",
      baseLineTitleDescription:
        "Click the Baseline card to choose to show the baseline",
      createBaseline: "Create Baseline",
      newBaseline: "New Baseline",
      editBaseline: "Edit Baseline",
      baselineName: "Baseline Name",
      baselineDescription: "Baseline Description",
      loaded: "Loaded",
      deleteBaseline: "Delete Baseline",
      deleteDescription:
        "Deleted baselines cannot be recovered, confirm deletion",
    },
    displayItemsConfiguration: {
      displayItems: "Display Items",
      criticalPath: "Critical Path",
      overdueItems: "Overdue Items",
    },
    timeFieldConfiguration: {
      timeFieldConfigurationTitle: "Time Field Configuration",
      timeFieldConfigurationDescription:
        "In order for the Gantt chart to display correctly, you need to set which time field of the matter corresponds to the start and end time of the time block in the Gantt chart",
      relatedItems: "Related Items",
      operation: "Operation",
      default: "Default",
      configuration: "Configuration",
      addConfiguration: "Add Configuration",
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
      otherConfigurationTitle: "Other Configuration",
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
    commonError: "Unexpected operation, please try again later",
    baselineNameError: "Please enter the baseline name",
    nameAlreadyExists: "This name already exists",
    itemTypeAlreadyExists:
      "This item type is already selected, please select again",
    itemsTypeError: "Please select the items type",
    startTimeError: "Please select the start date field",
    endTimeError: "Please select the end date field",
    noRelation: "No association configured",
    connectionError: "The connection is wrong",
    connectionErrorParent:
      "There can be no relationship between parent and child items",
    disabledConnectMessage: "Disconnected",
  },
  placeholder: {
    baselineNamePlaceholder:
      "Please enter the baseline name Maximum length 32 characters",
    baselineDescriptionPlaceholder: "Please enter the baseline description",
    pleaseSelect: "Please select",
  },
  fields: {
    startDate: "Start date",
    endDate: "End date",
    release: "Release item link",
    status: "status",
    charge: "Person in charge",
    completeTime: "Planned completion time",
  },
};

export default en;
