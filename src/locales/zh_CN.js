const global = {
  update: "更新",
  create: "创建",
  cancel: "取消",
  back: "返回",
  complete: "完成",
  success: "成功",
  fail: "失败",
  updatedAt: "更新于",
};

const date = {
  DateTime: "日期时间",
  Day: "日",
  Week: "周",
  Month: "月",
  Quarter: "季",
  Year: "年",
  Today: "Today",
};

const zhCN = {
  index: {
    hello: "你好, {{name}}。",
    welcome: "欢迎来到",
  },
  locale: {
    current: "当前语言: ",
    zh: "中文",
    "zh-CN": "中文",
    "zh-HK": "中文",
    "zh-TW": "中文",
    en: "英文",
    "en-US": "英文",
  },
  global,
  date,
  ganttconfiguration: {
    ganttConfigurationTitle: "甘特图设置",
    baseLineConfiguration: {
      baseline: "基线基线",
      baseLineTitleDescription: "点击基线卡片可选择显示基线",
      createBaseline: "创建基线",
      newBaseline: "新建基线",
      editBaseline: "编辑基线",
      baselineName: "基线名称",
      baselineDescription: "描述",
    },
    displayItemsConfiguration: {
      displayItems: "显示项",
      criticalPath: "关键路径",
      overdueItems: "逾期事项",
    },
    timeFieldConfiguration: {
      timeFieldConfigurationTitle: "时间字段配置",
      timeFieldConfigurationDescription:
        "为了让甘特图正确显示，您需要设置甘特图中时间区块的起止时间对应事项的哪个时间字段",
      relatedItems: "关联事项",
      operation: "操作",
      default: "默认",
      configuration: "配置",
      addConfiguration: "新增配置",
      itemType: "事项类型",
      startTime: "开始时间",
      endTime: "结束时间",
      percentageOfCompletion: "完成占比",
      deleteTitle: "确定删除",
      deleteTip: "删除后无法恢复。您确定删除吗?",
      noConfigurationTip: "没有配置的卡片类型将使用默认配置",
    },
    otherConfiguration: {
      otherConfigurationTitle: "其他配置",
      automaticScheduling: "自动编排",
      otherConfigurationDescription:
        "根据卡片之间的关系，自动调整卡片时间，避免出现逻辑错误",
      otherConfigurationTips:
        "When auto-scheduling is turned on, the time of all events is automatically adjusted according to the current event relationship. Confirmation of turning on？",
    },
  },
  errorMessage: {
    baselineNameError: "请输入基线名称",
    nameAlreadyExists: "该名称已存在",
    itemTypeAlreadyExists: "该事项类型已存在",
    itemsTypeError: "请输入事项类型",
    startTimeError: "请选择开始日期字段",
    endTimeError: "请选择结束日期字段",
  },
  placeholder: {
    baselineNamePlaceholder: "请输入基线名称，最大长度32个字符",
    baselineDescriptionPlaceholder: "请输入基线描述",
  },
};

export default zhCN;
