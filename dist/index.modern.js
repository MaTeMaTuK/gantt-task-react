import React, { memo, useRef, useState, useMemo, useEffect, forwardRef, createContext, useContext, useCallback, useImperativeHandle } from 'react';
import dayjs from 'dayjs';
import Icon, { PlusOutlined, QuestionCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Tooltip as Tooltip$1, message, Form, Modal, Select, Table, Button, Space, Switch, Input, Row, Col, Drawer, Collapse, Tabs } from 'antd';
import weekday from 'dayjs/plugin/weekday';
import { filter, isEqual, find, omit, isArray } from 'lodash';

var ViewMode;

(function (ViewMode) {
  ViewMode["QuarterDay"] = "Quarter Day";
  ViewMode["HalfDay"] = "Half Day";
  ViewMode["Day"] = "Day";
  ViewMode["Week"] = "Week";
  ViewMode["Month"] = "Month";
  ViewMode["Year"] = "Year";
  ViewMode["Quarter"] = "Quarter";
})(ViewMode || (ViewMode = {}));

const viewModeOptions = [{
  label: "日",
  value: "Day"
}, {
  label: "周",
  value: "Week"
}, {
  label: "月",
  value: "Month"
}, {
  label: "季",
  value: "Quarter"
}, {
  label: "年",
  value: "Year"
}];
const DateDeltaInit = {
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
    12: 31 * 24 * 3600 * 1000
  },
  [ViewMode.Year]: {
    common: 365 * 24 * 3600 * 1000,
    leap: 366 * 24 * 3600 * 1000
  },
  [ViewMode.Quarter]: {
    1: (31 + 28 + 31) * 24 * 3600 * 1000,
    2: (30 + 31 + 30) * 24 * 3600 * 1000,
    3: (31 + 31 + 30) * 24 * 3600 * 1000,
    4: (30 + 30 + 31) * 24 * 3600 * 1000
  },
  LeapMounth: 29 * 24 * 3600 * 1000,
  LeapQuarter: (31 + 29 + 31) * 24 * 3600 * 1000
};

const intlDTCache = {};

const getCachedDateTimeFormat = (locString, opts = {}) => {
  const key = JSON.stringify([locString, opts]);
  let dtf = intlDTCache[key];

  if (!dtf) {
    dtf = new Intl.DateTimeFormat(locString, opts);
    intlDTCache[key] = dtf;
  }

  return dtf;
};

const addToDate = (date, quantity, scale) => {
  const newDate = new Date(date.getFullYear() + (scale === "year" ? quantity : 0), date.getMonth() + (scale === "month" ? quantity : 0), date.getDate() + (scale === "day" ? quantity : 0), date.getHours() + (scale === "hour" ? quantity : 0), date.getMinutes() + (scale === "minute" ? quantity : 0), date.getSeconds() + (scale === "second" ? quantity : 0), date.getMilliseconds() + (scale === "millisecond" ? quantity : 0));
  return newDate;
};
const startOfDate = (date, scale) => {
  const scores = ["millisecond", "second", "minute", "hour", "day", "month", "year"];

  const shouldReset = _scale => {
    const maxScore = scores.indexOf(scale);
    return scores.indexOf(_scale) <= maxScore;
  };

  const newDate = new Date(date.getFullYear(), shouldReset("year") ? 0 : date.getMonth(), shouldReset("month") ? 1 : date.getDate(), shouldReset("day") ? 0 : date.getHours(), shouldReset("hour") ? 0 : date.getMinutes(), shouldReset("minute") ? 0 : date.getSeconds(), shouldReset("second") ? 0 : date.getMilliseconds());
  return newDate;
};
const ganttDateRange = viewMode => {
  let newStartDate = new Date(Date.now());
  let newEndDate = new Date(Date.now());
  const year = 10;
  const oneYear = 1;

  switch (viewMode) {
    case ViewMode.Month:
      newStartDate = addToDate(newStartDate, -year * 12 - 1, "month");
      newStartDate = startOfDate(newStartDate, "month");
      newEndDate = addToDate(newEndDate, year + 1, "year");
      newEndDate = startOfDate(newEndDate, "year");
      break;

    case ViewMode.Week:
      newStartDate = startOfDate(newStartDate, "day");
      newEndDate = startOfDate(newEndDate, "day");
      newStartDate = addToDate(getMonday(newStartDate), -7 * 52 * oneYear, "day");
      newEndDate = addToDate(newEndDate, oneYear + 1, "year");
      break;

    case ViewMode.Day:
      newStartDate = startOfDate(newStartDate, "day");
      newEndDate = startOfDate(newEndDate, "day");
      newStartDate = addToDate(newStartDate, -oneYear, "year");
      newEndDate = addToDate(newStartDate, oneYear + 1, "year");
      break;

    case ViewMode.Quarter:
    case ViewMode.Year:
      newStartDate = addToDate(newStartDate, -year, "year");
      newEndDate = addToDate(newEndDate, year + 1, "year");
      newStartDate = startOfDate(newStartDate, "year");
      newEndDate = startOfDate(newEndDate, "year");
      break;

    default:
      newStartDate = startOfDate(newStartDate, "day");
      newEndDate = startOfDate(newEndDate, "day");
      newStartDate = addToDate(newStartDate, -1, "day");
      newEndDate = addToDate(newEndDate, 5, "day");
      break;
  }

  return [newStartDate, newEndDate];
};
const seedDates = (startDate, endDate, viewMode) => {
  let currentDate = new Date(startDate);
  const dates = [currentDate];

  while (currentDate < endDate) {
    switch (viewMode) {
      case ViewMode.Year:
        currentDate = addToDate(currentDate, 1, "year");
        break;

      case ViewMode.Quarter:
        currentDate = addToDate(currentDate, 3, "month");
        break;

      case ViewMode.Month:
        currentDate = addToDate(currentDate, 1, "month");
        break;

      case ViewMode.Week:
        currentDate = addToDate(currentDate, 7, "day");
        break;

      case ViewMode.Day:
        currentDate = addToDate(currentDate, 1, "day");
        break;

      case ViewMode.HalfDay:
        currentDate = addToDate(currentDate, 12, "hour");
        break;

      case ViewMode.QuarterDay:
        currentDate = addToDate(currentDate, 6, "hour");
        break;
    }

    dates.push(currentDate);
  }

  return dates;
};
const getLocaleMonth = (date, locale) => {
  let bottomValue = getCachedDateTimeFormat(locale, {
    month: "long"
  }).format(date);
  bottomValue = bottomValue.replace(bottomValue[0], bottomValue[0].toLocaleUpperCase());
  return bottomValue;
};

const getMonday = date => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
};

const getWeekNumberISO8601 = date => {
  const tmpDate = new Date(date.valueOf());
  const dayNumber = (tmpDate.getDay() + 6) % 7;
  tmpDate.setDate(tmpDate.getDate() - dayNumber + 3);
  const firstThursday = tmpDate.valueOf();
  tmpDate.setMonth(0, 1);

  if (tmpDate.getDay() !== 4) {
    tmpDate.setMonth(0, 1 + (4 - tmpDate.getDay() + 7) % 7);
  }

  const weekNumber = (1 + Math.ceil((firstThursday - tmpDate.valueOf()) / 604800000)).toString();

  if (weekNumber.length === 1) {
    return `0${weekNumber}`;
  } else {
    return weekNumber;
  }
};

const barBackgroundColorPivotalPath = "#8777D9";
const barBackgroundColorTimeError = "#FF8F73";
const errorLinkBorderColor = "#FF8F73";
const pivotalPathLinkBorderColor = "#6554C0";
const scrollBarHeight = 4;
const dayFormat = "YYYY-MM-DD";
const dayTimeFormat = " YYYY-MM-DD HH:mm:ss";
const drawerWidth = 600;
const daySeconds = 24 * 60 * 60 * 1000;

var styles = {"tooltipDefaultContainer":"_tooltip-module__tooltipDefaultContainer__3T42e","tooltipDefaultContainerParagraph":"_tooltip-module__tooltipDefaultContainerParagraph__29NTg","tooltipDetailsContainer":"_tooltip-module__tooltipDetailsContainer__25P-K","tooltipDetailsContainerHidden":"_tooltip-module__tooltipDetailsContainerHidden__3gVAq","tooltipId":"_tooltip-module__tooltipId__1089R","tooltipName":"_tooltip-module__tooltipName__1LUF2","lightColor":"_tooltip-module__lightColor__3fzTV","status":"_tooltip-module__status__1FA7R","item":"_tooltip-module__item__3WF3F"};

const Tooltip = memo(({
  task,
  rowHeight,
  svgContainerHeight,
  svgContainerWidth,
  scrollX,
  scrollY,
  arrowIndent,
  fontSize,
  fontFamily,
  headerHeight,
  taskListWidth,
  TooltipContent,
  renderUserAvatar
}) => {
  var _task$item2;

  const tooltipRef = useRef(null);
  const [relatedY, setRelatedY] = useState(0);
  const [relatedX, setRelatedX] = useState(0);
  const UserAvatar = useMemo(() => {
    if (typeof renderUserAvatar === "function") {
      var _task$item;

      return renderUserAvatar(task === null || task === void 0 ? void 0 : (_task$item = task.item) === null || _task$item === void 0 ? void 0 : _task$item.assignee);
    }

    return React.createElement(React.Fragment, null);
  }, [renderUserAvatar, task === null || task === void 0 ? void 0 : (_task$item2 = task.item) === null || _task$item2 === void 0 ? void 0 : _task$item2.assignee]);
  useEffect(() => {
    if (tooltipRef.current) {
      let newRelatedX = task.x2 + arrowIndent + arrowIndent * 0.5 + taskListWidth - scrollX;
      let newRelatedY = task.index * rowHeight - scrollY + headerHeight;
      const tooltipHeight = tooltipRef.current.offsetHeight * 1.1;
      const tooltipWidth = tooltipRef.current.offsetWidth * 1.1;
      const tooltipLowerPoint = tooltipHeight + newRelatedY - scrollY;
      const tooltipLeftmostPoint = tooltipWidth + newRelatedX;
      const fullChartWidth = taskListWidth + svgContainerWidth;

      if (tooltipLeftmostPoint > fullChartWidth) {
        newRelatedX = task.x1 + taskListWidth - arrowIndent - arrowIndent * 0.5 - scrollX - tooltipWidth;
      }

      if (newRelatedX < taskListWidth) {
        newRelatedX = svgContainerWidth + taskListWidth - tooltipWidth;
        newRelatedY += rowHeight;
      } else if (tooltipLowerPoint > svgContainerHeight - scrollY) {
        newRelatedX = newRelatedX + 50;
        newRelatedY = svgContainerHeight - tooltipHeight;
      }

      setRelatedY(newRelatedY);
      setRelatedX(newRelatedX);
    }
  }, [task, arrowIndent, scrollX, scrollY, headerHeight, taskListWidth, rowHeight, svgContainerHeight, svgContainerWidth]);
  return React.createElement("div", {
    ref: tooltipRef,
    className: relatedX ? styles.tooltipDetailsContainer : styles.tooltipDetailsContainerHidden,
    style: {
      left: (task === null || task === void 0 ? void 0 : task.type) === "milestone" ? relatedX + 10 : relatedX + 30,
      top: relatedY < -40 ? -40 : relatedY
    }
  }, React.createElement(TooltipContent, {
    task: task,
    fontSize: fontSize,
    fontFamily: fontFamily,
    userAvatar: UserAvatar
  }));
});
const StandardTooltipContent = ({
  task,
  fontSize,
  fontFamily,
  userAvatar
}) => {
  var _task$item3, _task$item4, _task$item4$status;

  const style = {
    fontSize,
    fontFamily
  };
  return React.createElement("div", {
    className: styles.tooltipDefaultContainer,
    style: style
  }, task.type !== "milestone" ? React.createElement("div", {
    className: styles.tooltipId
  }, task === null || task === void 0 ? void 0 : (_task$item3 = task.item) === null || _task$item3 === void 0 ? void 0 : _task$item3.key) : null, React.createElement("div", {
    className: styles.tooltipName
  }, task.name), task.type === "milestone" ? React.createElement("div", {
    className: styles.item
  }, React.createElement("div", null, React.createElement("span", {
    className: styles.lightColor
  }, "\u72B6\u6001\uFF1A"), React.createElement("span", {
    className: styles.status
  }, task === null || task === void 0 ? void 0 : (_task$item4 = task.item) === null || _task$item4 === void 0 ? void 0 : (_task$item4$status = _task$item4.status) === null || _task$item4$status === void 0 ? void 0 : _task$item4$status.name)), React.createElement("div", null, React.createElement("span", {
    className: styles.lightColor
  }, "\u8D1F\u8D23\u4EBA\uFF1A"), userAvatar), React.createElement("div", {
    className: styles.lightColor
  }, React.createElement("span", null, "\u8BA1\u5212\u5B8C\u6210\u65F6\u95F4\uFF1A"), React.createElement("span", null, dayjs(task.end).format(dayFormat)))) : React.createElement("div", {
    className: `${styles.lightColor} ${styles.item}`
  }, React.createElement("div", null, React.createElement("span", null, "\u5F00\u59CB\u65E5\u671F\uFF1A"), React.createElement("span", null, dayjs(task.start).format(dayFormat))), React.createElement("div", null, React.createElement("span", null, "\u7ED3\u675F\u65E5\u671F\uFF1A"), React.createElement("span", null, dayjs(task.end).format(dayFormat)))));
};

const Svg = () => /*#__PURE__*/React.createElement("svg", {
  width: "24px",
  height: "24px",
  viewBox: "0 0 24 24",
  version: "1.1"
}, /*#__PURE__*/React.createElement("path", {
  d: "M13.721 14.43a.972.972 0 00-1.37-.004l-2.088 2.059a1.928 1.928 0 01-1.37.568c-.588 0-1.135-.26-1.525-.738-.634-.777-.505-1.933.203-2.643l1.321-1.322.002.001.688-.686a.974.974 0 000-1.377l-.002-.003a.972.972 0 00-1.375 0l-2.068 2.07a3.892 3.892 0 000 5.497l.009.01A3.87 3.87 0 008.892 19a3.87 3.87 0 002.746-1.139l2.083-2.085a.951.951 0 000-1.345zm-3.442-4.86a.972.972 0 001.37.004l2.088-2.058c.366-.367.853-.57 1.37-.57.588 0 1.135.26 1.525.739.634.777.505 1.933-.203 2.643l-1.321 1.322-.002-.001-.688.686a.974.974 0 000 1.377l.002.003c.38.38.995.38 1.375 0l2.068-2.07a3.892 3.892 0 000-5.497l-.009-.01A3.87 3.87 0 0015.108 5a3.87 3.87 0 00-2.746 1.139l-2.083 2.085a.951.951 0 000 1.345zM8.924 4.618l.401.968a1 1 0 11-1.848.765l-.4-.968a1 1 0 111.848-.765M5.383 7.076l.968.401a1.001 1.001 0 01-.766 1.848l-.968-.4a1.001 1.001 0 01.766-1.848m9.932 10.413a1.003 1.003 0 00-.542 1.307l.402.968A1 1 0 1017.023 19l-.401-.967a1 1 0 00-1.307-.542zm2.176-2.174a1 1 0 00.54 1.306l.969.401a1.001 1.001 0 00.766-1.848l-.969-.4a1 1 0 00-1.306.542z",
  fill: "currentColor",
  "fill-rule": "evenodd"
}));

const IconComponent = props => /*#__PURE__*/React.createElement(Icon, Object.assign({
  component: Svg
}, props));

const Svg$1 = () => /*#__PURE__*/React.createElement("svg", {
  width: "1em",
  height: "1em",
  viewBox: "0 0 24 24",
  version: "1.1"
}, /*#__PURE__*/React.createElement("g", {
  fill: "#fff",
  "fill-rule": "evenodd"
}, /*#__PURE__*/React.createElement("path", {
  d: "M12.856 5.457l-.937.92a1.002 1.002 0 000 1.437 1.047 1.047 0 001.463 0l.984-.966c.967-.95 2.542-1.135 3.602-.288a2.54 2.54 0 01.203 3.81l-2.903 2.852a2.646 2.646 0 01-3.696 0l-1.11-1.09L9 13.57l1.108 1.089c1.822 1.788 4.802 1.788 6.622 0l2.905-2.852a4.558 4.558 0 00-.357-6.82c-1.893-1.517-4.695-1.226-6.422.47"
}), /*#__PURE__*/React.createElement("path", {
  d: "M11.144 19.543l.937-.92a1.002 1.002 0 000-1.437 1.047 1.047 0 00-1.462 0l-.985.966c-.967.95-2.542 1.135-3.602.288a2.54 2.54 0 01-.203-3.81l2.903-2.852a2.646 2.646 0 013.696 0l1.11 1.09L15 11.43l-1.108-1.089c-1.822-1.788-4.802-1.788-6.622 0l-2.905 2.852a4.558 4.558 0 00.357 6.82c1.893 1.517 4.695 1.226 6.422-.47"
})));

const IconComponent$1 = props => /*#__PURE__*/React.createElement(Icon, Object.assign({
  component: Svg$1
}, props));

var styles$1 = {"tooltipDeleteDefaultContainer":"_deleteTooltip-module__tooltipDeleteDefaultContainer__1E0Mg","tooltipDeleteContainer":"_deleteTooltip-module__tooltipDeleteContainer__3a-sg","title":"_deleteTooltip-module__title__TXuno","taskInfo":"_deleteTooltip-module__taskInfo__3kijo","date":"_deleteTooltip-module__date__36kyr","connect":"_deleteTooltip-module__connect__1r7Sh","unconnectionIcon":"_deleteTooltip-module__unconnectionIcon__r1q0R","connection":"_deleteTooltip-module__connection__3jYhQ","connectionLine":"_deleteTooltip-module__connectionLine__3UKWM","connectionIcon":"_deleteTooltip-module__connectionIcon__18-g_"};

const DeleteTooltip = memo(({
  tasks,
  delConnection,
  taskListWidth,
  itemLinks,
  currentConnection,
  boundTop,
  setCurrentConnection,
  svgContainerHeight
}) => {
  var _currentConnection$or5, _currentConnection$or6, _sourceTask$, _sourceTask$$item, _sourceTask$$item$ite, _sourceTask$2, _currentConnection$co3, _currentConnection$co4, _currentConnection$co5, _sourceTask$3, _sourceTask$4, _targetTask$, _targetTask$$item, _targetTask$$item$ite, _targetTask$2, _currentConnection$co6, _currentConnection$co7, _currentConnection$co8, _targetTask$3, _targetTask$4;

  const path = window.location.origin;
  const tooltipRef = useRef(null);
  const [relatedY, setRelatedY] = useState(0);
  const [relatedX, setRelatedX] = useState(0);
  const sourceTask = useMemo(() => {
    return tasks.filter(ele => {
      return ele.id === currentConnection.connection.sourceId;
    });
  }, [currentConnection.connection.sourceId, tasks]);
  const targetTask = useMemo(() => {
    return tasks.filter(ele => ele.id === currentConnection.connection.targetId);
  }, [currentConnection.connection.targetId, tasks]);
  useEffect(() => {
    if (tooltipRef.current) {
      var _currentConnection$or, _currentConnection$or2, _currentConnection$or3, _currentConnection$or4;

      const tooltipHeight = tooltipRef.current.offsetHeight;
      const newRelatedY = (currentConnection === null || currentConnection === void 0 ? void 0 : (_currentConnection$or = currentConnection.originalEvent) === null || _currentConnection$or === void 0 ? void 0 : _currentConnection$or.clientY) - boundTop + tooltipHeight > svgContainerHeight ? (currentConnection === null || currentConnection === void 0 ? void 0 : (_currentConnection$or2 = currentConnection.originalEvent) === null || _currentConnection$or2 === void 0 ? void 0 : _currentConnection$or2.clientY) - boundTop - tooltipHeight : (currentConnection === null || currentConnection === void 0 ? void 0 : (_currentConnection$or3 = currentConnection.originalEvent) === null || _currentConnection$or3 === void 0 ? void 0 : _currentConnection$or3.clientY) - boundTop;
      const newRelatedX = (currentConnection === null || currentConnection === void 0 ? void 0 : (_currentConnection$or4 = currentConnection.originalEvent) === null || _currentConnection$or4 === void 0 ? void 0 : _currentConnection$or4.clientX) - taskListWidth;
      setRelatedY(newRelatedY);
      setRelatedX(newRelatedX);
    }
  }, [tasks, taskListWidth, boundTop, currentConnection === null || currentConnection === void 0 ? void 0 : (_currentConnection$or5 = currentConnection.originalEvent) === null || _currentConnection$or5 === void 0 ? void 0 : _currentConnection$or5.clientX, currentConnection === null || currentConnection === void 0 ? void 0 : (_currentConnection$or6 = currentConnection.originalEvent) === null || _currentConnection$or6 === void 0 ? void 0 : _currentConnection$or6.clientY, svgContainerHeight]);

  const removeConnection = async () => {
    const currentLink = itemLinks === null || itemLinks === void 0 ? void 0 : itemLinks.filter(ele => {
      var _ele$source, _currentConnection$co, _ele$destination, _currentConnection$co2, _ele$linkType;

      return ((_ele$source = ele.source) === null || _ele$source === void 0 ? void 0 : _ele$source.objectId) === ((_currentConnection$co = currentConnection.connection) === null || _currentConnection$co === void 0 ? void 0 : _currentConnection$co.sourceId) && ((_ele$destination = ele.destination) === null || _ele$destination === void 0 ? void 0 : _ele$destination.objectId) === ((_currentConnection$co2 = currentConnection.connection) === null || _currentConnection$co2 === void 0 ? void 0 : _currentConnection$co2.targetId) && ((_ele$linkType = ele.linkType) === null || _ele$linkType === void 0 ? void 0 : _ele$linkType.objectId) === currentConnection.connection.getData();
    });

    if (currentLink !== null && currentLink !== void 0 && currentLink.length) {
      var _currentLink$;

      await (delConnection === null || delConnection === void 0 ? void 0 : delConnection(currentLink === null || currentLink === void 0 ? void 0 : (_currentLink$ = currentLink[0]) === null || _currentLink$ === void 0 ? void 0 : _currentLink$.objectId));
      setCurrentConnection === null || setCurrentConnection === void 0 ? void 0 : setCurrentConnection(null);
    }
  };

  return React.createElement("div", {
    ref: tooltipRef,
    className: styles$1.tooltipDeleteContainer,
    style: {
      left: relatedX + 30,
      top: relatedY < -40 ? -40 : relatedY
    }
  }, currentConnection && React.createElement("div", {
    className: styles$1.tooltipDeleteDefaultContainer
  }, React.createElement("div", {
    className: styles$1.taskInfo
  }, React.createElement("div", {
    className: styles$1.title
  }, ((_sourceTask$ = sourceTask[0]) === null || _sourceTask$ === void 0 ? void 0 : (_sourceTask$$item = _sourceTask$.item) === null || _sourceTask$$item === void 0 ? void 0 : (_sourceTask$$item$ite = _sourceTask$$item.itemType) === null || _sourceTask$$item$ite === void 0 ? void 0 : _sourceTask$$item$ite.icon) && React.createElement("img", {
    src: `${path}${sourceTask[0].item.itemType.icon}`
  }), React.createElement("span", null, " ", (_sourceTask$2 = sourceTask[0]) === null || _sourceTask$2 === void 0 ? void 0 : _sourceTask$2.name)), React.createElement("div", {
    className: styles$1.date
  }, ((_currentConnection$co3 = currentConnection.connection) === null || _currentConnection$co3 === void 0 ? void 0 : (_currentConnection$co4 = _currentConnection$co3.endpoints) === null || _currentConnection$co4 === void 0 ? void 0 : (_currentConnection$co5 = _currentConnection$co4[0].anchor) === null || _currentConnection$co5 === void 0 ? void 0 : _currentConnection$co5.cssClass) === "Right" ? `结束日期：${dayjs((_sourceTask$3 = sourceTask[0]) === null || _sourceTask$3 === void 0 ? void 0 : _sourceTask$3.end).format(dayFormat)}` : `开始日期：${dayjs((_sourceTask$4 = sourceTask[0]) === null || _sourceTask$4 === void 0 ? void 0 : _sourceTask$4.start).format(dayFormat)}`)), React.createElement("div", {
    className: styles$1.connect
  }, React.createElement("div", {
    className: styles$1.connection
  }, React.createElement("div", {
    className: styles$1.connectionLine
  }), React.createElement("span", {
    className: styles$1.connectionIcon
  }, React.createElement(IconComponent$1, {
    style: {
      fontSize: "18px"
    }
  })), React.createElement("div", {
    className: styles$1.connectionLine
  })), React.createElement(Tooltip$1, {
    title: "\u89E3\u9664\u4E8B\u9879\u94FE\u63A5",
    className: styles$1.unconnectionIcon
  }, React.createElement("span", {
    onClick: removeConnection
  }, React.createElement(IconComponent, null)))), React.createElement("div", {
    className: styles$1.taskInfo
  }, React.createElement("div", {
    className: styles$1.title
  }, ((_targetTask$ = targetTask[0]) === null || _targetTask$ === void 0 ? void 0 : (_targetTask$$item = _targetTask$.item) === null || _targetTask$$item === void 0 ? void 0 : (_targetTask$$item$ite = _targetTask$$item.itemType) === null || _targetTask$$item$ite === void 0 ? void 0 : _targetTask$$item$ite.icon) && React.createElement("img", {
    src: `${path}${targetTask[0].item.itemType.icon}`
  }), React.createElement("span", null, (_targetTask$2 = targetTask[0]) === null || _targetTask$2 === void 0 ? void 0 : _targetTask$2.name)), React.createElement("div", {
    className: styles$1.date
  }, ((_currentConnection$co6 = currentConnection.connection) === null || _currentConnection$co6 === void 0 ? void 0 : (_currentConnection$co7 = _currentConnection$co6.endpoints[1]) === null || _currentConnection$co7 === void 0 ? void 0 : (_currentConnection$co8 = _currentConnection$co7.anchor) === null || _currentConnection$co8 === void 0 ? void 0 : _currentConnection$co8.cssClass) === "Right" ? `结束日期：${dayjs((_targetTask$3 = targetTask[0]) === null || _targetTask$3 === void 0 ? void 0 : _targetTask$3.end).format(dayFormat)}` : `开始日期：${dayjs((_targetTask$4 = targetTask[0]) === null || _targetTask$4 === void 0 ? void 0 : _targetTask$4.start).format(dayFormat)}`))));
});

var styles$2 = {"scroll":"_vertical-scroll-module__scroll__1eT-t"};

const VerticalScrollComponent = ({
  ganttHeight,
  ganttFullHeight,
  headerHeight,
  onScroll,
  listBottomHeight
}, ref) => {
  const scrollHeight = 16;
  return React.createElement("div", {
    style: {
      height: ganttHeight || "auto",
      marginTop: headerHeight,
      marginBottom: `${listBottomHeight + scrollHeight}px`
    },
    className: styles$2.scroll,
    onScroll: onScroll,
    ref: ref
  }, React.createElement("div", {
    style: {
      height: ganttFullHeight,
      width: 1
    }
  }));
};

const VerticalScroll = memo(forwardRef(VerticalScrollComponent));

const GanttConfigContext = createContext(null);
const ConfigHandleContext = createContext(null);
const BaseLineContext = createContext(null);

var styles$3 = {"gridRow":"_grid-module__gridRow__2dZTy","gridRowLine":"_grid-module__gridRowLine__3rUKi","gridTick":"_grid-module__gridTick__RuwuK","gridTickWeekday":"_grid-module__gridTickWeekday__3JhzT"};

dayjs.extend(weekday);

const isRestDay = date => {
  const dt = new Date(date);
  return [0, 6].includes(dt.getDay());
};

const GridBody = memo(({
  tasks,
  dates,
  rowHeight,
  svgWidth,
  columnWidth,
  todayColor,
  viewMode,
  scrollX,
  offsetLeft,
  taskListHeight,
  onDateChange
}) => {
  const {
    ganttConfig
  } = useContext(GanttConfigContext);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isShow, setIsShow] = useState(false);
  const [parts, setParts] = useState(1);
  const [remainderDays, setRemainderDays] = useState(0);
  const [currentIndex, setCurrentDataIndex] = useState(0);
  useEffect(() => {
    setParts(1);
    setRemainderDays(0);
    setCurrentDataIndex(0);
  }, [viewMode]);
  let y = 0;
  const invalidColumn = [];
  const gridRows = [];
  const rowLines = [React.createElement("line", {
    key: "RowLineFirst",
    x: "0",
    y1: 0,
    x2: svgWidth,
    y2: 0,
    className: styles$3.gridRowLine
  })];
  const handleMouseMove = useCallback((event, index) => {
    const pointerX = event.clientX - offsetLeft - 24;
    const currentDataIndex = Math.floor((pointerX + scrollX) / columnWidth);
    setCurrentDataIndex(currentDataIndex);
    let translateX = 0;

    if (viewMode === ViewMode.Day || viewMode === ViewMode.Week) {
      setParts(1);
      setRemainderDays(0);
      translateX = currentDataIndex * columnWidth;
    }

    if (viewMode === ViewMode.Month) {
      var _dates$currentDataInd, _dates$currentDataInd2;

      const dateRemainder = pointerX + scrollX - currentDataIndex * columnWidth;
      const parts = new Date((_dates$currentDataInd = dates[currentDataIndex]) === null || _dates$currentDataInd === void 0 ? void 0 : _dates$currentDataInd.getFullYear(), ((_dates$currentDataInd2 = dates[currentDataIndex]) === null || _dates$currentDataInd2 === void 0 ? void 0 : _dates$currentDataInd2.getMonth()) + 1, 0).getDate();
      setParts(parts);
      const dayWidth = columnWidth / parts;
      const remainder = Math.floor(dateRemainder / dayWidth);
      setRemainderDays(remainder);
      translateX = currentDataIndex * columnWidth + remainder / parts * columnWidth;
    }

    if (viewMode === ViewMode.Quarter) {
      const dateRemainder = pointerX + scrollX - currentDataIndex * columnWidth;
      const parts = 3;
      setParts(3);
      const dayWidth = columnWidth / parts;
      const remainder = Math.floor(dateRemainder / dayWidth);
      setRemainderDays(remainder);
      translateX = currentDataIndex * columnWidth + remainder / parts * columnWidth;
    }

    if (viewMode === ViewMode.Year) {
      const dateRemainder = pointerX + scrollX - currentDataIndex * columnWidth;
      const parts = 12;
      setParts(12);
      const dayWidth = columnWidth / parts;
      const remainder = Math.floor(dateRemainder / dayWidth);
      setRemainderDays(remainder);
      translateX = currentDataIndex * columnWidth + remainder / parts * columnWidth;
    }

    setTranslateX(translateX);
    setTranslateY(index * rowHeight);
  }, [columnWidth, dates, offsetLeft, rowHeight, scrollX, viewMode]);
  const handleInvalidColumnMouseMove = useCallback((index, row) => {
    setTranslateY(index * rowHeight);
    setIsShow(!row.start);
  }, [rowHeight]);

  const invalidBarClick = () => {
    var _ganttConfig$time, _startDate, _ganttConfig$time2, _endDate;

    const taskIndex = translateY / rowHeight;
    let startDate, endDate;

    if (viewMode === ViewMode.Day) {
      startDate = dayjs(dates[0].valueOf() + translateX / columnWidth * 86400000);
      endDate = dayjs(dates[0].valueOf() + translateX / columnWidth * 86400000 + 86400000);
    }

    if (viewMode === ViewMode.Week) {
      startDate = dayjs(dates[0].valueOf() + translateX / columnWidth * 86400000 * 7);
      endDate = dayjs(dates[0].valueOf() + translateX / columnWidth * 86400000 * 7 + 86400000 * 7);
    }

    if (viewMode === ViewMode.Month) {
      startDate = dayjs(dates[currentIndex].valueOf() + remainderDays * 86400000);
      endDate = dayjs(dates[currentIndex].valueOf() + remainderDays * 86400000 + 86400000);
    }

    if (viewMode === ViewMode.Quarter || viewMode === ViewMode.Year) {
      startDate = dayjs(new Date(dates[currentIndex].getFullYear(), dates[currentIndex].getMonth() + remainderDays));
      endDate = dayjs(new Date(dates[currentIndex].getFullYear(), dates[currentIndex].getMonth() + remainderDays + 1));
    }

    onDateChange === null || onDateChange === void 0 ? void 0 : onDateChange(Object.assign(tasks[taskIndex], {
      start: ganttConfig !== null && ganttConfig !== void 0 && (_ganttConfig$time = ganttConfig.time) !== null && _ganttConfig$time !== void 0 && _ganttConfig$time.length ? (_startDate = startDate) === null || _startDate === void 0 ? void 0 : _startDate.startOf("day").toDate() : null,
      end: ganttConfig !== null && ganttConfig !== void 0 && (_ganttConfig$time2 = ganttConfig.time) !== null && _ganttConfig$time2 !== void 0 && _ganttConfig$time2.length ? (_endDate = endDate) === null || _endDate === void 0 ? void 0 : _endDate.startOf("day").toDate() : null
    }));
  };

  for (let i = 0; i < tasks.length; i++) {
    gridRows.push(React.createElement("g", {
      key: `Cell-${i}`,
      onMouseEnter: e => {
        const ele = e.target.parentNode.firstChild;
        ele && (ele.style.fill = "#f3f3f3");
      },
      onMouseLeave: e => {
        const ele = e.target.parentNode.firstChild;
        ele && (ele.style.fill = "");
      },
      index: i
    }, React.createElement("rect", {
      key: "Row" + tasks[i].id + i,
      x: "0",
      y: y,
      width: svgWidth,
      height: rowHeight,
      className: styles$3.gridRow,
      onMouseMove: e => {
        handleMouseMove(e, i);
      }
    }), React.createElement("rect", {
      key: "Cell" + tasks[i].id + i,
      x: translateX + 0.5,
      y: y,
      width: columnWidth / parts,
      height: rowHeight,
      fill: "transparent",
      ry: 4,
      rx: 4,
      onMouseMove: () => {
        handleInvalidColumnMouseMove(i, tasks[i]);
      }
    }), tasks[i].id && React.createElement("rect", {
      key: "Time" + tasks[i].id + i,
      x: translateX,
      y: y + rowHeight / 2 - 30 / 2,
      width: columnWidth / parts,
      height: 30,
      fill: "transparent",
      onClick: isShow ? invalidBarClick : () => {},
      cursor: isShow ? "pointer" : "default",
      onMouseEnter: e => {
        const ele = e.target.parentNode;
        const index = ele.getAttribute("index");

        if (isShow && i === Number(index)) {
          e.target.style.fill = "#AFCBFF";
        }
      },
      onMouseLeave: e => {
        e.target.style.fill = "transparent";
      }
    })));
    invalidColumn.push(React.createElement("rect", {
      key: "invalidColumn" + tasks[i].id + i,
      x: translateX + 0.5,
      y: y,
      width: columnWidth / parts,
      height: rowHeight,
      fill: isShow ? "#DAE0FF" : "transparent",
      onMouseMove: () => {
        handleInvalidColumnMouseMove(i, tasks[i]);
      }
    }));
    rowLines.push(React.createElement("line", {
      key: "RowLine" + tasks[i].id + i,
      x: "0",
      y1: y + rowHeight,
      x2: svgWidth,
      y2: y + rowHeight,
      className: styles$3.gridRowLine
    }));
    y += rowHeight;
  }

  const now = new Date();
  let tickX = 0;
  const ticks = [];
  let today = React.createElement("rect", null);

  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    ticks.push(React.createElement("g", {
      key: `${date.getTime()}-${i}-ticks`
    }, React.createElement("line", {
      key: `${date.getTime()}-${i}-line`,
      x1: tickX,
      y1: 0,
      x2: tickX,
      y2: y < Number(taskListHeight) ? taskListHeight : y,
      className: styles$3.gridTick
    }), isRestDay(date) && viewMode === ViewMode.Day && React.createElement("rect", {
      key: `${date.getTime()}-${date.getTime()}-${i}-restday`,
      x: tickX + 1,
      y: "0",
      width: columnWidth - 1,
      height: y < Number(taskListHeight) ? taskListHeight : y,
      className: styles$3.gridTickWeekday
    })));

    if (i + 1 !== dates.length && date.getTime() < now.getTime() && dates[i + 1].getTime() >= now.getTime() || i !== 0 && i + 1 === dates.length && date.getTime() < now.getTime() && addToDate(date, date.getTime() - dates[i - 1].getTime(), "millisecond").getTime() >= now.getTime()) {
      const currentStamp = new Date(new Date().toLocaleDateString()).getTime();
      const currentMinus = (currentStamp + 86400000 - dates[i].getTime()) / 86400000;
      const totalMinus = (dates[i + 1].getTime() - dates[i].getTime()) / 86400000;
      const newTickX = tickX + columnWidth * (currentMinus / totalMinus) - columnWidth / totalMinus / 2;
      today = React.createElement("g", null, React.createElement("circle", {
        cx: newTickX,
        cy: "3",
        r: "3",
        stroke: "black",
        strokeWidth: "0",
        fill: todayColor
      }), React.createElement("line", {
        x1: newTickX,
        y1: "0",
        x2: newTickX,
        y2: y < Number(taskListHeight) ? taskListHeight : y,
        style: {
          stroke: todayColor,
          strokeWidth: "1"
        }
      }));
    }

    tickX += columnWidth;
  }

  const invalidBar = React.createElement("g", null, React.createElement("rect", {
    x: translateX,
    y: translateY + rowHeight / 2 - 30 / 2,
    width: columnWidth / parts,
    height: 30,
    rx: 4,
    ry: 4,
    fill: "#AFCBFF",
    onClick: invalidBarClick,
    cursor: "pointer"
  }));
  return React.createElement("g", {
    className: "gridBody",
    onMouseLeave: () => {
      setTranslateX(-500);
    }
  }, React.createElement("g", {
    className: "ticks"
  }, ticks), React.createElement("g", {
    className: "rowLines"
  }, rowLines), React.createElement("g", {
    className: "rows"
  }, gridRows), false , false , React.createElement("g", {
    className: "today"
  }, today));
});
GridBody.defaultProps = {
  scrollX: 0
};

const Grid = memo(props => {
  return React.createElement("g", {
    className: "grid"
  }, React.createElement(GridBody, Object.assign({}, props)));
});

var styles$4 = {"calendarBottomText":"_calendar-module__calendarBottomText__9w8d5","calendarTopTick":"_calendar-module__calendarTopTick__1rLuZ","calendarTopText":"_calendar-module__calendarTopText__2q1Kt","calendarHeader":"_calendar-module__calendarHeader__35nLX"};

const TopPartOfCalendar = ({
  value,
  x1Line,
  y1Line,
  y2Line,
  xText,
  yText
}) => {
  return React.createElement("g", {
    className: "calendarTop"
  }, React.createElement("line", {
    x1: x1Line,
    y1: y1Line,
    x2: x1Line,
    y2: y2Line,
    className: styles$4.calendarTopTick,
    key: value + "line"
  }), React.createElement("text", {
    key: value + "text",
    y: yText,
    x: xText,
    className: styles$4.calendarTopText
  }, value));
};

const Calendar = memo(({
  dateSetup,
  locale,
  viewMode,
  headerHeight,
  columnWidth,
  fontFamily,
  fontSize
}) => {
  const bottomValuesInit = useCallback((bottomValue, date, headerHeight, i, type) => {
    return React.createElement("text", {
      key: ["Day", "Other", "Week"].includes(type) ? date.getTime() : bottomValue + date.getFullYear(),
      y: ["Day", "Week"].includes(type) ? headerHeight * 0.6 + 6 : headerHeight * 0.6,
      x: columnWidth * i + columnWidth * 0.5,
      className: styles$4.calendarBottomText
    }, bottomValue);
  }, [columnWidth]);
  const getCalendarValuesForYear = useCallback(() => {
    const topValues = [];
    const bottomValues = [];

    for (let i = 0; i < dateSetup.dates.length; i++) {
      const date = dateSetup.dates[i];
      const bottomValue = date.getFullYear().toString();
      bottomValues.push(bottomValuesInit(bottomValue, date, headerHeight, i, "year"));
    }

    return [topValues, bottomValues];
  }, [dateSetup.dates, headerHeight, bottomValuesInit]);
  const getCalendarValuesForQuarter = useCallback(() => {
    const topValues = [];
    const bottomValues = [];
    const topDefaultWidth = columnWidth * 3;
    const topDefaultHeight = headerHeight * 0.5;

    for (let i = 0; i < dateSetup.dates.length; i++) {
      const date = dateSetup.dates[i];
      const currentQuarter = Math.floor(date.getMonth() % 3 === 0 ? date.getMonth() / 3 + 1 : date.getMonth() / 3 + 1);
      const bottomValue = `第${currentQuarter}季`;
      bottomValues.push(bottomValuesInit(bottomValue, date, headerHeight, i, "Quarter"));

      if (i === 0 || date.getFullYear() !== dateSetup.dates[i - 1].getFullYear()) {
        const topValue = date.getFullYear().toString();
        topValues.push(React.createElement(TopPartOfCalendar, {
          key: topValue,
          value: topValue,
          x1Line: columnWidth * i,
          y1Line: 0,
          y2Line: topDefaultHeight,
          xText: topDefaultWidth + columnWidth * i - currentQuarter * columnWidth,
          yText: topDefaultHeight * 0.9
        }));
      }
    }

    return [topValues, bottomValues];
  }, [columnWidth, dateSetup.dates, headerHeight, bottomValuesInit]);
  const getCalendarValuesForMonth = useCallback(() => {
    const topValues = [];
    const bottomValues = [];
    const topDefaultWidth = columnWidth * 6;
    const topDefaultHeight = headerHeight * 0.5;

    for (let i = 0; i < dateSetup.dates.length; i++) {
      const date = dateSetup.dates[i];
      const bottomValue = getLocaleMonth(date, locale);
      bottomValues.push(bottomValuesInit(bottomValue, date, headerHeight, i, "Month"));

      if (i === 0 || date.getFullYear() !== dateSetup.dates[i - 1].getFullYear()) {
        const topValue = date.getFullYear().toString();
        topValues.push(React.createElement(TopPartOfCalendar, {
          key: topValue,
          value: topValue,
          x1Line: columnWidth * i,
          y1Line: 0,
          y2Line: topDefaultHeight,
          xText: topDefaultWidth + columnWidth * i - date.getMonth() * columnWidth,
          yText: topDefaultHeight * 0.9
        }));
      }
    }

    return [topValues, bottomValues];
  }, [columnWidth, dateSetup.dates, headerHeight, locale, bottomValuesInit]);
  const getCalendarValuesForWeek = useCallback(() => {
    const topValues = [];
    const bottomValues = [];
    let weeksCount = 1;
    const topDefaultHeight = headerHeight * 0.5;
    const dates = dateSetup.dates;

    for (let i = dates.length - 1; i >= 0; i--) {
      const date = dates[i];
      let topValue = "";

      if (i === 0 || date.getMonth() !== dates[i - 1].getMonth()) {
        topValue = `${date.getFullYear()}年${date.getMonth() + 1}月`;
      }

      const bottomValue = `第${getWeekNumberISO8601(date)}周`;
      bottomValues.push(bottomValuesInit(bottomValue, date, headerHeight, i, "Week"));

      if (topValue) {
        if (i !== dates.length - 1) {
          topValues.push(React.createElement(TopPartOfCalendar, {
            key: topValue,
            value: topValue,
            x1Line: columnWidth * i + weeksCount * columnWidth,
            y1Line: 0,
            y2Line: topDefaultHeight,
            xText: columnWidth * i + columnWidth * weeksCount * 0.5,
            yText: topDefaultHeight * 0.9 - 4
          }));
        }

        weeksCount = 0;
      }

      weeksCount++;
    }

    return [topValues, bottomValues];
  }, [columnWidth, dateSetup.dates, headerHeight, bottomValuesInit]);
  const getCalendarValuesForDay = useCallback(() => {
    const topValues = [];
    const bottomValues = [];
    const topDefaultHeight = headerHeight * 0.5;
    const dates = dateSetup.dates;

    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const bottomValue = date.getDate().toString();
      bottomValues.push(bottomValuesInit(bottomValue, date, headerHeight, i, "Day"));

      if (i + 1 !== dates.length && date.getMonth() !== dates[i + 1].getMonth()) {
        const topValue = `${date.getFullYear()}年${date.getMonth() + 1}月`;
        topValues.push(React.createElement(TopPartOfCalendar, {
          key: topValue + date.getFullYear(),
          value: topValue,
          x1Line: columnWidth * (i + 1),
          y1Line: 0,
          y2Line: topDefaultHeight,
          xText: columnWidth * (i + 1) - date.getDate() * columnWidth * 0.5,
          yText: topDefaultHeight * 0.9 - 4
        }));
      }
    }

    return [topValues, bottomValues];
  }, [columnWidth, dateSetup.dates, headerHeight, bottomValuesInit]);
  const getCalendarValuesForOther = useCallback(() => {
    const topValues = [];
    const bottomValues = [];
    const ticks = viewMode === ViewMode.HalfDay ? 2 : 4;
    const topDefaultHeight = headerHeight * 0.5;
    const dates = dateSetup.dates;

    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const bottomValue = Intl.DateTimeFormat(locale, {
        hour: "numeric"
      }).format(date);
      bottomValues.push(bottomValuesInit(bottomValue, date, headerHeight, i, "Other"));

      if (i === 0 || date.getDate() !== dates[i - 1].getDate()) {
        const topValue = `${date.getDate()} ${getLocaleMonth(date, locale)}`;
        topValues.push(React.createElement(TopPartOfCalendar, {
          key: topValue + date.getFullYear(),
          value: topValue,
          x1Line: columnWidth * i + ticks * columnWidth,
          y1Line: 0,
          y2Line: topDefaultHeight,
          xText: columnWidth * i + ticks * columnWidth * 0.5,
          yText: topDefaultHeight * 0.9
        }));
      }
    }

    return [topValues, bottomValues];
  }, [columnWidth, dateSetup.dates, headerHeight, locale, viewMode, bottomValuesInit]);
  const [topValues, bottomValues] = useMemo(() => {
    let topValues = [];
    let bottomValues = [];

    switch (dateSetup.viewMode) {
      case ViewMode.Month:
        [topValues, bottomValues] = getCalendarValuesForMonth();
        break;

      case ViewMode.Week:
        [topValues, bottomValues] = getCalendarValuesForWeek();
        break;

      case ViewMode.Day:
        [topValues, bottomValues] = getCalendarValuesForDay();
        break;

      case ViewMode.Year:
        [topValues, bottomValues] = getCalendarValuesForYear();
        break;

      case ViewMode.Quarter:
        [topValues, bottomValues] = getCalendarValuesForQuarter();
        break;

      default:
        [topValues, bottomValues] = getCalendarValuesForOther();
        break;
    }

    return [topValues, bottomValues];
  }, [dateSetup.viewMode, getCalendarValuesForDay, getCalendarValuesForMonth, getCalendarValuesForOther, getCalendarValuesForQuarter, getCalendarValuesForWeek, getCalendarValuesForYear]);
  return React.createElement("g", {
    className: "calendar",
    fontSize: fontSize,
    fontFamily: fontFamily
  }, React.createElement("rect", {
    x: 0,
    y: 0,
    width: columnWidth * dateSetup.dates.length,
    height: headerHeight,
    className: styles$4.calendarHeader
  }), bottomValues, topValues);
});

const Arrow = ({
  taskFrom,
  taskTo,
  rowHeight,
  taskHeight,
  arrowIndent
}) => {
  const indexCompare = taskFrom.index > taskTo.index ? -1 : 1;
  const taskToEndPosition = taskTo.y + taskHeight / 2;
  const path = `M ${taskFrom.x2} ${taskFrom.y + taskHeight / 2} 
  h ${arrowIndent} 
  v ${indexCompare * rowHeight / 2} 
  H ${taskTo.x1 - arrowIndent} 
  V ${taskToEndPosition} 
  h ${arrowIndent}`;
  const trianglePoints = `${taskTo.x1},${taskToEndPosition} 
  ${taskTo.x1 - 5},${taskToEndPosition - 5} 
  ${taskTo.x1 - 5},${taskToEndPosition + 5}`;
  return React.createElement("g", {
    className: "arrow"
  }, React.createElement("path", {
    strokeWidth: "1.5",
    d: path,
    fill: "none"
  }), React.createElement("polygon", {
    points: trianglePoints
  }));
};

function isKeyboardEvent(event) {
  return event.key !== undefined;
}
function isLeapYear(year) {
  if (year % 4 === 0 && year % 100 !== 0) {
    return true;
  } else if (year % 400 === 0) {
    return true;
  } else {
    return false;
  }
}
function getQuarter(currMonth) {
  return Math.floor(currMonth % 3 === 0 ? currMonth / 3 : currMonth / 3 + 1);
}

const convertToBarTasks = (tasks, dates, columnWidth, rowHeight, taskHeight, barCornerRadius, handleWidth, barProgressColor, barProgressSelectedColor, barBackgroundColor, barBackgroundSelectedColor, projectProgressColor, projectProgressSelectedColor, projectBackgroundColor, projectBackgroundSelectedColor, milestoneBackgroundColor, milestoneBackgroundSelectedColor, viewMode) => {
  const dateDelta = dates[1].getTime() - dates[0].getTime() - dates[1].getTimezoneOffset() * 60 * 1000 + dates[0].getTimezoneOffset() * 60 * 1000;
  let barTasks = tasks.map((t, i) => {
    return convertToBarTask(t, i, dates, dateDelta, columnWidth, rowHeight, taskHeight, barCornerRadius, handleWidth, barProgressColor, barProgressSelectedColor, barBackgroundColor, barBackgroundSelectedColor, projectProgressColor, projectProgressSelectedColor, projectBackgroundColor, projectBackgroundSelectedColor, milestoneBackgroundColor, milestoneBackgroundSelectedColor, viewMode);
  });
  barTasks = barTasks.map((task, i) => {
    const dependencies = task.dependencies || [];

    for (let j = 0; j < dependencies.length; j++) {
      const dependence = barTasks.findIndex(value => value.id === dependencies[j]);
      if (dependence !== -1) barTasks[dependence].barChildren.push(i);
    }

    return task;
  });
  return barTasks;
};

const convertToBarTask = (task, index, dates, dateDelta, columnWidth, rowHeight, taskHeight, barCornerRadius, handleWidth, barProgressColor, barProgressSelectedColor, barBackgroundColor, barBackgroundSelectedColor, projectProgressColor, projectProgressSelectedColor, projectBackgroundColor, projectBackgroundSelectedColor, milestoneBackgroundColor, milestoneBackgroundSelectedColor, viewMode) => {
  let barTask;

  switch (task.type) {
    case "milestone":
      barTask = convertToMilestone(task, index, dates, dateDelta, columnWidth, rowHeight, taskHeight, barCornerRadius, handleWidth, milestoneBackgroundColor, milestoneBackgroundSelectedColor);
      break;

    case "project":
      barTask = convertToBar(task, index, dates, dateDelta, columnWidth, rowHeight, taskHeight, barCornerRadius, handleWidth, projectProgressColor, projectProgressSelectedColor, projectBackgroundColor, projectBackgroundSelectedColor, viewMode);
      break;

    default:
      barTask = convertToBar(task, index, dates, dateDelta, columnWidth, rowHeight, taskHeight, barCornerRadius, handleWidth, barProgressColor, barProgressSelectedColor, barBackgroundColor, barBackgroundSelectedColor, viewMode);
      break;
  }

  return barTask;
};

const convertToBar = (task, index, dates, dateDelta, columnWidth, rowHeight, taskHeight, barCornerRadius, handleWidth, barProgressColor, barProgressSelectedColor, barBackgroundColor, barBackgroundSelectedColor, viewMode) => {
  const x1 = taskXCoordinate(task.start, dates, dateDelta, columnWidth, viewMode);
  let x2 = taskXCoordinate(task.end, dates, dateDelta, columnWidth, viewMode);
  const y = taskYCoordinate(index, rowHeight, taskHeight);
  const styles = {
    backgroundColor: barBackgroundColor,
    backgroundSelectedColor: barBackgroundSelectedColor,
    progressColor: barProgressColor,
    progressSelectedColor: barProgressSelectedColor,
    ...task.styles
  };
  const typeInternal = task.type;

  if ((typeInternal === "task" || typeInternal === "parent") && x2 - x1 < handleWidth * 2) {
    x2 = x1 + handleWidth * 2;
  }

  return { ...task,
    typeInternal,
    x1,
    x2,
    y,
    index,
    barCornerRadius,
    handleWidth,
    height: taskHeight,
    barChildren: [],
    styles
  };
};

const convertToMilestone = (task, index, dates, dateDelta, columnWidth, rowHeight, taskHeight, barCornerRadius, handleWidth, milestoneBackgroundColor, milestoneBackgroundSelectedColor) => {
  const x = taskXCoordinate(task.end, dates, dateDelta, columnWidth);
  const y = taskYCoordinate(index, rowHeight, taskHeight);
  const x1 = x - taskHeight * 0.5;
  const x2 = x + taskHeight * 0.5;
  const styles = {
    backgroundColor: milestoneBackgroundColor,
    backgroundSelectedColor: milestoneBackgroundSelectedColor,
    progressColor: "",
    progressSelectedColor: "",
    ...task.styles
  };
  return { ...task,
    end: task.start,
    x1,
    x2,
    y,
    index,
    barCornerRadius,
    handleWidth,
    typeInternal: task.type,
    progress: 0,
    height: taskHeight,
    barChildren: [],
    styles
  };
};

const taskXCoordinate = (xDate, dates, dateDelta, columnWidth, viewMode) => {
  if (!xDate) return;
  let precision;
  let index = 0;

  if (viewMode === ViewMode.Month) {
    var _dates$, _dates$2;

    index = (xDate === null || xDate === void 0 ? void 0 : xDate.getFullYear()) * 12 + (xDate === null || xDate === void 0 ? void 0 : xDate.getMonth()) - ((_dates$ = dates[0]) === null || _dates$ === void 0 ? void 0 : _dates$.getFullYear()) * 12 - ((_dates$2 = dates[0]) === null || _dates$2 === void 0 ? void 0 : _dates$2.getMonth());

    if (isLeapYear(xDate === null || xDate === void 0 ? void 0 : xDate.getFullYear()) && (xDate === null || xDate === void 0 ? void 0 : xDate.getMonth()) === 1) {
      precision = DateDeltaInit.LeapMounth;
    } else {
      precision = DateDeltaInit[ViewMode.Month][(xDate === null || xDate === void 0 ? void 0 : xDate.getMonth()) + 1];
    }
  } else if (viewMode === ViewMode.Year) {
    var _dates$3;

    index = (xDate === null || xDate === void 0 ? void 0 : xDate.getFullYear()) - ((_dates$3 = dates[0]) === null || _dates$3 === void 0 ? void 0 : _dates$3.getFullYear());
    precision = isLeapYear(xDate === null || xDate === void 0 ? void 0 : xDate.getFullYear()) ? DateDeltaInit[ViewMode.Year].leap : DateDeltaInit[ViewMode.Year].common;
  } else if (viewMode === ViewMode.Quarter) {
    var _dates$4, _dates$5;

    index = (xDate === null || xDate === void 0 ? void 0 : xDate.getFullYear()) * 4 + getQuarter((xDate === null || xDate === void 0 ? void 0 : xDate.getMonth()) + 1) - ((_dates$4 = dates[0]) === null || _dates$4 === void 0 ? void 0 : _dates$4.getFullYear()) * 4 - getQuarter(((_dates$5 = dates[0]) === null || _dates$5 === void 0 ? void 0 : _dates$5.getMonth()) + 1);

    if (isLeapYear(xDate === null || xDate === void 0 ? void 0 : xDate.getFullYear()) && getQuarter((xDate === null || xDate === void 0 ? void 0 : xDate.getMonth()) + 1) === 1) {
      precision = DateDeltaInit.LeapQuarter;
    } else {
      precision = DateDeltaInit[ViewMode.Quarter][getQuarter((xDate === null || xDate === void 0 ? void 0 : xDate.getMonth()) + 1)];
    }
  } else {
    index = ~~((xDate.getTime() - dates[0].getTime() + xDate.getTimezoneOffset() - dates[0].getTimezoneOffset()) / dateDelta);
    precision = dateDelta;
  }

  if (index < 0) {
    index = 0;
  } else if (index > dates.length - 1) {
    index = dates.length - 1;
  }

  const x = Math.round((index + (xDate.getTime() - dates[index].getTime() - xDate.getTimezoneOffset() * 60 * 1000 + dates[index].getTimezoneOffset() * 60 * 1000) / precision) * columnWidth);
  return x;
};

const taskYCoordinate = (index, rowHeight, taskHeight) => {
  const y = index * rowHeight + (rowHeight - taskHeight) / 2;
  return y;
};

const progressWithByParams = (taskX1, taskX2, progress) => {
  return (taskX2 - taskX1) * progress * 0.01;
};

const progressByX = (x, task) => {
  if (x >= task.x2) return 100;else if (x <= task.x1) return 0;else {
    const barWidth = task.x2 - task.x1;
    const progressPercent = Math.round((x - task.x1) * 100 / barWidth);
    return progressPercent;
  }
};

const getProgressPoint = (progressX, taskY, taskHeight) => {
  const point = [progressX - 5, taskY + taskHeight, progressX + 5, taskY + taskHeight, progressX, taskY + taskHeight - 5.66];
  return point.join(",");
};

const startByX = (x, xStep, task) => {
  if (x >= task.x2 - task.handleWidth * 2) {
    x = task.x2 - task.handleWidth * 2;
  }

  const steps = Math.round((x - task.x1) / xStep);
  const additionalXValue = steps * xStep;
  const newX = task.x1 + additionalXValue;
  return newX;
};

const endByX = (x, xStep, task) => {
  if (x <= task.x1 + task.handleWidth * 2) {
    x = task.x1 + task.handleWidth * 2;
  }

  const steps = Math.round((x - task.x2) / xStep);
  const additionalXValue = steps * xStep;
  const newX = task.x2 + additionalXValue;
  return newX;
};

const moveByX = (x, xStep, task) => {
  const steps = Math.round((x - task.x1) / xStep);
  const additionalXValue = steps * xStep;
  const newX1 = task.x1 + additionalXValue;
  const newX2 = newX1 + task.x2 - task.x1;
  return [newX1, newX2];
};

const dateByX = (x, taskX, taskDate, xStep, timeStep) => {
  let newDate = new Date((x - taskX) / xStep * timeStep + taskDate.getTime());
  newDate = new Date(newDate.getTime() + (newDate.getTimezoneOffset() - taskDate.getTimezoneOffset()) * 60000);
  return newDate;
};

const handleTaskBySVGMouseEvent = (svgX, action, selectedTask, xStep, timeStep, initEventX1Delta) => {
  let result;

  switch (selectedTask.type) {
    case "milestone":
      result = handleTaskBySVGMouseEventForMilestone(svgX, action, selectedTask, xStep, timeStep, initEventX1Delta);
      break;

    default:
      result = handleTaskBySVGMouseEventForBar(svgX, action, selectedTask, xStep, timeStep, initEventX1Delta);
      break;
  }

  return result;
};

const handleTaskBySVGMouseEventForBar = (svgX, action, selectedTask, xStep, timeStep, initEventX1Delta) => {
  const changedTask = { ...selectedTask
  };
  let isChanged = false;

  switch (action) {
    case "progress":
      changedTask.progress = progressByX(svgX, selectedTask);
      isChanged = changedTask.progress !== selectedTask.progress;
      break;

    case "start":
      {
        const newX1 = startByX(svgX, xStep, selectedTask);
        changedTask.x1 = newX1;
        isChanged = changedTask.x1 !== selectedTask.x1;

        if (isChanged) {
          changedTask.start = dateByX(newX1, selectedTask.x1, selectedTask.start, xStep, timeStep);
        }

        break;
      }

    case "end":
      {
        const newX2 = endByX(svgX, xStep, selectedTask);
        changedTask.x2 = newX2;
        isChanged = changedTask.x2 !== selectedTask.x2;

        if (isChanged) {
          changedTask.end = dateByX(newX2, selectedTask.x2, selectedTask.end, xStep, timeStep);
        }

        break;
      }

    case "move":
      {
        const [newMoveX1, newMoveX2] = moveByX(svgX - initEventX1Delta, xStep, selectedTask);
        isChanged = newMoveX1 !== selectedTask.x1;

        if (isChanged) {
          changedTask.start = dateByX(newMoveX1, selectedTask.x1, selectedTask.start, xStep, timeStep);
          changedTask.end = dateByX(newMoveX2, selectedTask.x2, selectedTask.end, xStep, timeStep);
          changedTask.x1 = newMoveX1;
          changedTask.x2 = newMoveX2;
        }

        break;
      }
  }

  return {
    isChanged,
    changedTask
  };
};

const handleTaskBySVGMouseEventForMilestone = (svgX, action, selectedTask, xStep, timeStep, initEventX1Delta) => {
  const changedTask = { ...selectedTask
  };
  let isChanged = false;

  switch (action) {
    case "move":
      {
        const [newMoveX1, newMoveX2] = moveByX(svgX - initEventX1Delta, xStep, selectedTask);
        isChanged = newMoveX1 !== selectedTask.x1;

        if (isChanged) {
          changedTask.start = dateByX(newMoveX1, selectedTask.x1, selectedTask.start, xStep, timeStep);
          changedTask.end = changedTask.start;
          changedTask.x1 = newMoveX1;
          changedTask.x2 = newMoveX2;
        }

        break;
      }
  }

  return {
    isChanged,
    changedTask
  };
};

var styles$5 = {"barWrapper":"_bar-module__barWrapper__KxSXS","barHandle":"_bar-module__barHandle__3w_5u","barHandleProgress":"_bar-module__barHandleProgress__2TAN0","barHandleDate":"_bar-module__barHandleDate__ebM68","barHandleBg":"_bar-module__barHandleBg__3Mox9","barHandleBackground":"_bar-module__barHandleBackground__tv31v","barBackground":"_bar-module__barBackground__31ERP"};

const BarDisplay = ({
  x,
  y,
  width,
  height,
  isSelected,
  progressWidth,
  barCornerRadius,
  styles,
  onMouseDown,
  id,
  task,
  isLog
}) => {
  const getBarColor = () => {
    return task !== null && task !== void 0 && task.isTimeErrorItem || task !== null && task !== void 0 && task.isOverdueItem ? barBackgroundColorTimeError : task !== null && task !== void 0 && task.isPivotalPathItem ? barBackgroundColorPivotalPath : isSelected ? styles.backgroundSelectedColor : styles.backgroundColor;
  };

  return React.createElement("g", {
    onMouseDown: onMouseDown
  }, React.createElement("rect", {
    id: id,
    x: x,
    width: width,
    y: y,
    height: height,
    ry: barCornerRadius,
    rx: barCornerRadius,
    fill: getBarColor(),
    className: styles$5.barBackground
  }), React.createElement("rect", {
    x: x + progressWidth,
    width: width - progressWidth,
    y: y,
    height: height,
    style: {
      opacity: isLog ? 0.8 : 0.4
    },
    fill: "#fff"
  }));
};

const BarDateHandle = ({
  x,
  y,
  width,
  height,
  type,
  onMouseDown
}) => {
  return React.createElement("g", {
    onMouseDown: onMouseDown
  }, React.createElement("rect", {
    x: type === "left" ? x - 18 : x + 6,
    y: y + 3,
    width: 12,
    height: 20,
    className: "barHandle barHandleBg"
  }), React.createElement("rect", {
    x: type === "left" ? x - 14 : x + 14,
    y: y + 6,
    width: width,
    height: height,
    className: "barHandle barHandleDate",
    ry: 1,
    rx: 1
  }), React.createElement("rect", {
    x: type === "left" ? x - 10 : x + 10,
    y: y + 6,
    width: width,
    height: height,
    className: "barHandle barHandleDate",
    ry: 1,
    rx: 1
  }));
};

const BarProgressHandle = ({
  progressPoint,
  onMouseDown
}) => {
  return React.createElement("polygon", {
    className: `barHandle ${styles$5.barHandleProgress}`,
    points: progressPoint,
    onMouseDown: onMouseDown
  });
};

const canChangeLayout = true;
const commonConfig = {
  isSource: canChangeLayout,
  isTarget: canChangeLayout,
  maxConnections: -1,
  endpoint: [ "Dot" , {
    radius: 4,
    cssClass: "end-point"
  }],
  endpointStyle: {},
  connector: ["Flowchart", {
    alwaysRespectStubs: true,
    cornerRadius: 8,
    stub: 16
  }],
  connectorStyle: {
    stroke: "#979797",
    strokeWidth: 1.5,
    strokeOpacity: 0.5
  },
  connectorHoverStyle: {
    strokeWidth: 2,
    stroke: "#0C62FF",
    outlineWidth: 5,
    outlineStroke: "F7F7F7"
  },
  connectorOverlays: [["PlainArrow", {
    width: 8,
    length: 8,
    location: 1
  }]]
};
const offsetCalculators = {
  CIRCLE: function (el) {
    const cx = parseInt(el.getAttribute("cx"), 10);
    const cy = parseInt(el.getAttribute("cy"), 10);
    const r = parseInt(el.getAttribute("r"), 10);
    return {
      left: cx - r,
      top: cy - r
    };
  },
  ELLIPSE: function (el) {
    const cx = parseInt(el.getAttribute("cx"), 10);
    const cy = parseInt(el.getAttribute("cy"), 10);
    const rx = parseInt(el.getAttribute("rx"), 10);
    const ry = parseInt(el.getAttribute("ry"), 10);
    return {
      left: cx - rx,
      top: cy - ry
    };
  },
  RECT: function (el) {
    const x = parseInt(el.getAttribute("x"), 10);
    const y = parseInt(el.getAttribute("y"), 10);
    return {
      left: x,
      top: y
    };
  }
};
const sizeCalculators = {
  CIRCLE: function (el) {
    const r = parseInt(el.getAttribute("r"), 10);
    return [r * 2, r * 2];
  },
  ELLIPSE: function (el) {
    const rx = parseInt(el.getAttribute("rx"), 10);
    const ry = parseInt(el.getAttribute("ry"), 10);
    return [rx * 2, ry * 2];
  },
  RECT: function (el) {
    const w = parseInt(el.getAttribute("width"), 10);
    const h = parseInt(el.getAttribute("height"), 10);
    return [w, h];
  }
};
const relationInit = {
  FS: ["Right", "Left"],
  FF: ["Right", "Right"],
  SS: ["Left", "Left"],
  SF: ["Left", "Right"]
};
const relationReverse = (start, end) => {
  if (start === "Right" && end === "Left") {
    return "FS";
  }

  if (start === "Right" && end === "Right") {
    return "FF";
  }

  if (start === "Left" && end === "Left") {
    return "SS";
  }

  if (start === "Left" && end === "Right") {
    return "SF";
  }

  return "SS";
};

const pointOverEvent = (barRef, jsPlumb, id) => {
  barRef.current.classList.add("barHover");

  if (jsPlumb) {
    jsPlumb.selectEndpoints({
      element: id
    }).addClass("endpoint-hover");
  }
};
const pointOutEvent = (barRef, jsPlumb, id) => {
  var _barRef$current;

  barRef === null || barRef === void 0 ? void 0 : (_barRef$current = barRef.current) === null || _barRef$current === void 0 ? void 0 : _barRef$current.classList.remove("barHover");

  if (jsPlumb) {
    jsPlumb.selectEndpoints({
      element: id
    }).removeClass("endpoint-hover");
  }
};
const barAnchor = {
  milestone: {
    Left: [0, 0.5, -1, 0, 5, 0, "Left"],
    Right: [1, 0.5, 1, 0, -2, 0, "Right"]
  },
  normal: {
    Left: [0, 0.5, -1, 0, 0, 0, "Left"],
    Right: [1, 0.5, 1, 0, 0, 0, "Right"]
  }
};
const useHover = (barRef, jsPlumb, id, action) => {
  const passiveAction = useMemo(() => {
    return ["start", "end", "progress", "move"].includes(action);
  }, [action]);
  useEffect(() => {
    if (barRef.current && jsPlumb) {
      const addHoverClass = () => {
        if (!passiveAction) {
          var _barRef$current2;

          barRef === null || barRef === void 0 ? void 0 : (_barRef$current2 = barRef.current) === null || _barRef$current2 === void 0 ? void 0 : _barRef$current2.classList.add("barHover");
          jsPlumb.selectEndpoints({
            element: id
          }).addClass("endpoint-hover");
          jsPlumb.selectEndpoints({
            element: id
          }).setVisible(true);
        } else {
          var _barRef$current3;

          barRef === null || barRef === void 0 ? void 0 : (_barRef$current3 = barRef.current) === null || _barRef$current3 === void 0 ? void 0 : _barRef$current3.classList.remove("barHover");
          jsPlumb.selectEndpoints({
            element: id
          }).removeClass("endpoint-hover");
          jsPlumb.selectEndpoints({
            element: id
          }).setVisible(false, true, true);
        }
      };

      const removeHoverClass = () => {
        var _barRef$current4;

        barRef === null || barRef === void 0 ? void 0 : (_barRef$current4 = barRef.current) === null || _barRef$current4 === void 0 ? void 0 : _barRef$current4.classList.remove("barHover");
        jsPlumb.selectEndpoints({
          element: id
        }).removeClass("endpoint-hover");
      };

      const nodeDom = barRef.current;
      nodeDom.addEventListener("mousemove", addHoverClass);
      nodeDom.addEventListener("mouseout", removeHoverClass);
      return () => {
        if (nodeDom) {
          nodeDom.removeEventListener("mousemove", addHoverClass);
          nodeDom.removeEventListener("mouseout", removeHoverClass);
        }
      };
    }
  }, [barRef, jsPlumb, id, passiveAction]);
};
const useAddPoint = (jsPlumb, task, barRef, type) => {
  const [addPointFinished, setAddPointFinished] = useState(false);
  useEffect(() => {
    if (jsPlumb) {
      jsPlumb.setIdChanged(task.id, task.id);
      const rightPoint = jsPlumb.addEndpoint(task.id, {
        anchor: type === "milestone" ? barAnchor.milestone.Right : barAnchor.normal.Right,
        uuid: task.id + "-Right"
      }, commonConfig);
      rightPoint.bind("mouseover", () => pointOverEvent(barRef, jsPlumb, task.id));
      rightPoint.bind("mouseout", () => pointOutEvent(barRef, jsPlumb, task.id));
      const leftPoint = jsPlumb.addEndpoint(task.id, {
        anchor: type === "milestone" ? barAnchor.milestone.Left : barAnchor.normal.Left,
        uuid: task.id + "-Left"
      }, commonConfig);
      leftPoint.bind("mouseover", () => pointOverEvent(barRef, jsPlumb, task.id));
      leftPoint.bind("mouseout", () => pointOutEvent(barRef, jsPlumb, task.id));
      setAddPointFinished(true);
    }

    return () => {
      if (jsPlumb) {
        jsPlumb.deleteEndpoint(task.id + "-Left");
        jsPlumb.deleteEndpoint(task.id + "-Right");
      }
    };
  }, [jsPlumb, task.y, barRef, task.id, type]);
  return addPointFinished;
};

const Bar = ({
  task,
  isProgressChangeable,
  isDateChangeable,
  onEventStart,
  isSelected,
  jsPlumb,
  isLog,
  setPointInited,
  ganttEvent: _ganttEvent = {
    action: ""
  }
}) => {
  const {
    action
  } = _ganttEvent;
  const barRef = useRef(null);
  const progressWidth = progressWithByParams(task.x1, task.x2, task.progress);
  const progressPoint = getProgressPoint(progressWidth + task.x1, task.y, task.height);
  const handleHeight = task.height - 12;
  const addPointFinished = useAddPoint(jsPlumb, task, barRef);
  useEffect(() => {
    if (addPointFinished) {
      setPointInited === null || setPointInited === void 0 ? void 0 : setPointInited(addPointFinished);
    }
  }, [addPointFinished, setPointInited]);
  useEffect(() => {
    if (jsPlumb) {
      jsPlumb.revalidate(task.id);
    }
  }, [jsPlumb, task]);
  useEffect(() => {
    return () => {
      if (jsPlumb) {
        jsPlumb.deleteEndpoint(task.id + "-Left");
        jsPlumb.deleteEndpoint(task.id + "-Right");
      }
    };
  }, [jsPlumb, task.id]);
  useHover(barRef, jsPlumb, task.id, action);
  return React.createElement("svg", null, React.createElement("g", {
    ref: barRef,
    className: styles$5.barWrapper,
    tabIndex: 0
  }, !isLog && isDateChangeable && React.createElement("g", {
    className: "barHandle"
  }, React.createElement("rect", {
    x: task.x1 - 20,
    y: task.y - 3,
    width: task.x2 - task.x1 + 40,
    height: task.height + 6,
    className: `barHandle ${styles$5.barHandleBackground}`,
    ry: task.barCornerRadius,
    rx: task.barCornerRadius
  })), React.createElement(BarDisplay, {
    x: task.x1,
    y: task.y,
    task: task,
    width: task.x2 - task.x1,
    height: task.height,
    progressWidth: progressWidth,
    barCornerRadius: task.barCornerRadius,
    styles: !isLog ? task.styles : { ...task.styles,
      opacity: 0.5
    },
    isSelected: isSelected,
    id: isLog ? `${task.id}-log` : task.id,
    isLog: isLog,
    onMouseDown: e => {
      isDateChangeable && !isLog && onEventStart("move", task, e);
    }
  }), React.createElement("g", {
    className: "handleGroup"
  }, isDateChangeable && !isLog && React.createElement("g", null, React.createElement(BarDateHandle, {
    x: task.x1,
    y: task.y,
    width: task.handleWidth,
    height: handleHeight,
    type: "left",
    onMouseDown: e => {
      onEventStart("start", task, e);
    }
  }), React.createElement(BarDateHandle, {
    x: task.x2,
    y: task.y,
    width: task.handleWidth,
    height: handleHeight,
    type: "right",
    onMouseDown: e => {
      onEventStart("end", task, e);
    }
  })), isProgressChangeable && !isLog && React.createElement(BarProgressHandle, {
    progressPoint: progressPoint,
    onMouseDown: e => {
      onEventStart("progress", task, e);
    }
  }))));
};

const BarSmall = ({
  task,
  isProgressChangeable,
  isDateChangeable,
  onEventStart,
  isSelected
}) => {
  const progressWidth = progressWithByParams(task.x1, task.x2, task.progress);
  const progressPoint = getProgressPoint(progressWidth + task.x1, task.y, task.height);
  return React.createElement("g", {
    className: styles$5.barWrapper,
    tabIndex: 0
  }, React.createElement(BarDisplay, {
    x: task.x1,
    y: task.y,
    task: task,
    width: task.x2 - task.x1,
    height: task.height,
    progressWidth: progressWidth,
    barCornerRadius: task.barCornerRadius,
    styles: task.styles,
    isSelected: isSelected,
    onMouseDown: e => {
      isDateChangeable && onEventStart("move", task, e);
    },
    id: task.id
  }), React.createElement("g", {
    className: "handleGroup"
  }, isProgressChangeable && React.createElement(BarProgressHandle, {
    progressPoint: progressPoint,
    onMouseDown: e => {
      onEventStart("progress", task, e);
    }
  })));
};

const BarDisplay$1 = ({
  x,
  y,
  task,
  width,
  height,
  isSelected,
  progressWidth,
  barCornerRadius,
  styles,
  onMouseDown,
  id,
  isLog
}) => {
  const getBarColor = () => {
    return task !== null && task !== void 0 && task.isTimeErrorItem || task !== null && task !== void 0 && task.isOverdueItem ? barBackgroundColorTimeError : task !== null && task !== void 0 && task.isPivotalPathItem ? barBackgroundColorPivotalPath : isSelected ? styles.backgroundSelectedColor : styles.backgroundColor;
  };

  const triangleX = task.x2 - task.x1 > 15 ? 15 : 2;
  const triangleY = 2;
  const projectLeftTriangle = [task.x1, task.y + task.height - triangleY, task.x1, task.y + task.height + triangleY + 3, task.x1 + triangleX, task.y + task.height - triangleY].join(",");
  const projectRightTriangle = [task.x2, task.y + task.height - triangleY, task.x2, task.y + task.height + triangleY + 3, task.x2 - triangleX, task.y + task.height - triangleY].join(",");
  return React.createElement("g", {
    onMouseDown: onMouseDown
  }, React.createElement("rect", {
    id: id,
    x: x,
    width: width,
    y: y,
    height: height,
    ry: barCornerRadius,
    rx: barCornerRadius,
    fill: getBarColor(),
    className: styles$5.barBackground
  }), React.createElement("polygon", {
    points: projectLeftTriangle,
    fill: getBarColor()
  }), React.createElement("polygon", {
    points: projectRightTriangle,
    fill: getBarColor()
  }), React.createElement("rect", {
    x: x + progressWidth,
    width: width - progressWidth,
    y: y,
    height: height + 5,
    style: {
      opacity: isLog ? 0.8 : 0.4
    },
    fill: "#fff"
  }));
};

const BarParent = ({
  task,
  isProgressChangeable,
  isDateChangeable,
  onEventStart,
  isSelected,
  jsPlumb,
  isLog,
  setPointInited,
  ganttEvent: _ganttEvent = {
    action: ""
  }
}) => {
  const barRef = useRef(null);
  const {
    action
  } = _ganttEvent;
  const progressWidth = progressWithByParams(task.x1, task.x2, task.progress);
  const progressPoint = getProgressPoint(progressWidth + task.x1 + 1, task.y + 5, task.height);
  const addPointFinished = useAddPoint(jsPlumb, task, barRef);
  useEffect(() => {
    if (addPointFinished) {
      setPointInited === null || setPointInited === void 0 ? void 0 : setPointInited(addPointFinished);
    }
  }, [addPointFinished, setPointInited]);
  useEffect(() => {
    if (jsPlumb) {
      jsPlumb.revalidate(task.id);
    }
  }, [jsPlumb, task]);
  useEffect(() => {
    return () => {
      if (jsPlumb) {
        jsPlumb.deleteEndpoint((task === null || task === void 0 ? void 0 : task.id) + "-Left");
        jsPlumb.deleteEndpoint((task === null || task === void 0 ? void 0 : task.id) + "-Right");
      }
    };
  }, [jsPlumb, task === null || task === void 0 ? void 0 : task.id]);
  useHover(barRef, jsPlumb, task.id, action);
  const handleHeight = task.height - 10;
  return React.createElement("g", {
    ref: barRef,
    className: styles$5.barWrapper,
    tabIndex: 0
  }, !isLog && isDateChangeable && React.createElement("g", {
    className: "barHandle"
  }, React.createElement("rect", {
    x: task.x1 - 20,
    y: task.y - 6,
    width: task.x2 - task.x1 + 40,
    height: task.height + 12,
    className: `barHandle ${styles$5.barHandleBackground}`,
    ry: task.barCornerRadius,
    rx: task.barCornerRadius
  })), React.createElement(BarDisplay$1, {
    id: isLog ? `${task.id}-log` : task.id,
    isLog: isLog,
    x: task.x1,
    y: task.y,
    task: task,
    width: task.x2 - task.x1,
    height: task.height,
    progressWidth: progressWidth,
    barCornerRadius: task.barCornerRadius,
    styles: !isLog ? task.styles : { ...task.styles,
      opacity: 0.5
    },
    isSelected: isSelected,
    onMouseDown: e => {
      isDateChangeable && !isLog && onEventStart("move", task, e);
    }
  }), React.createElement("g", {
    className: "handleGroup"
  }, isDateChangeable && !isLog && React.createElement("g", null, React.createElement(BarDateHandle, {
    x: task.x1,
    y: task.y,
    width: task.handleWidth,
    height: handleHeight,
    type: "left",
    onMouseDown: e => {
      onEventStart("start", task, e);
    }
  }), React.createElement(BarDateHandle, {
    x: task.x2 - task.handleWidth,
    y: task.y,
    width: task.handleWidth,
    height: handleHeight,
    type: "right",
    onMouseDown: e => {
      onEventStart("end", task, e);
    }
  })), isProgressChangeable && !isLog && React.createElement(BarProgressHandle, {
    progressPoint: progressPoint,
    onMouseDown: e => {
      onEventStart("progress", task, e);
    }
  })));
};

var styles$6 = {"milestoneWrapper":"_milestone-module__milestoneWrapper__RRr13","milestoneBackground":"_milestone-module__milestoneBackground__2P2B1"};

const base64Milestone = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAATpJREFUeNqslUEOATEUQL9exDiARCJhRYRbIDE2HIONA4iVFYux5gISYmfnBizsrViO32qbwZj+tn7yTTqdeW865v9CHMdgk51mHNhcn+M/lOi2YIyHEDOPucccR1vYme4jCRC+xEMvZaqPkmXWvcwG3h4ATCOASk1PL3A+dBZ8wqv11/nOkC5htnAVVAlzgdtImCucKmE+cIqE+cJNElEHsohGrvBkrOYAx4MeFtQKwn/A1UqKZT0MGT59IMvfG64iISgxLPWz7C1ieb5xvQCsIz3cqFfE/wPx7nwkHD6bADzuYnjifUoIZFfs+0g+4ZiNt89UdkUnSRocebevQnORZMFTW4WNxAT/2ewoEgo8s11nSahw0pYpe8pCFRBP/p1T4DZ7spYkwggnC6QkkD2rxCvUtNmreAowAEKnBro8dl0wAAAAAElFTkSuQmCC";

const Milestone = ({
  task,
  isDateChangeable,
  onEventStart,
  jsPlumb,
  setPointInited,
  ganttEvent: _ganttEvent = {
    action: ""
  }
}) => {
  const barRef = useRef(null);
  const {
    action
  } = _ganttEvent;
  const addPointFinished = useAddPoint(jsPlumb, task, barRef, "milestone");
  useEffect(() => {
    if (addPointFinished) {
      setPointInited === null || setPointInited === void 0 ? void 0 : setPointInited(addPointFinished);
    }
  }, [addPointFinished, setPointInited]);
  useHover(barRef, jsPlumb, task.id, action);
  useEffect(() => {
    if (jsPlumb) {
      jsPlumb.revalidate(task.id);
    }
  }, [jsPlumb, task]);
  useEffect(() => {
    return () => {
      if (jsPlumb) {
        jsPlumb.deleteEndpoint(task.id + "-Left");
        jsPlumb.deleteEndpoint(task.id + "-Right");
      }
    };
  }, [jsPlumb, task.id]);
  return React.createElement("g", {
    ref: barRef,
    tabIndex: 0,
    className: styles$6.milestoneWrapper
  }, React.createElement("rect", {
    id: task.id,
    fill: "transparent",
    x: task.x1,
    width: task.height,
    y: task.y,
    height: task.height,
    className: styles$6.milestoneBackground,
    onMouseDown: e => {
      isDateChangeable && onEventStart("move", task, e);
    }
  }), React.createElement("image", {
    href: base64Milestone,
    x: task.x1 + task.height / 6,
    y: task.y + task.height / 6,
    width: task.height * 2 / 3,
    height: task.height * 2 / 3,
    onMouseDown: e => {
      isDateChangeable && onEventStart("move", task, e);
    }
  }));
};

var styles$7 = {"projectWrapper":"_project-module__projectWrapper__1KJ6x","projectBackground":"_project-module__projectBackground__2RbVy","projectTop":"_project-module__projectTop__2pZMF"};

const Project = ({
  task,
  isSelected
}) => {
  const barColor = isSelected ? task.styles.backgroundSelectedColor : task.styles.backgroundColor;
  const processColor = isSelected ? task.styles.progressSelectedColor : task.styles.progressColor;
  const progressWidth = progressWithByParams(task.x1, task.x2, task.progress);
  const projectWith = task.x2 - task.x1;
  const projectLeftTriangle = [task.x1, task.y + task.height / 2 - 1, task.x1, task.y + task.height, task.x1 + 15, task.y + task.height / 2 - 1].join(",");
  const projectRightTriangle = [task.x2, task.y + task.height / 2 - 1, task.x2, task.y + task.height, task.x2 - 15, task.y + task.height / 2 - 1].join(",");
  return React.createElement("g", {
    tabIndex: 0,
    className: styles$7.projectWrapper
  }, React.createElement("rect", {
    fill: barColor,
    x: task.x1,
    width: projectWith,
    y: task.y,
    height: task.height,
    rx: task.barCornerRadius,
    ry: task.barCornerRadius,
    className: styles$7.projectBackground
  }), React.createElement("rect", {
    x: task.x1,
    width: progressWidth,
    y: task.y,
    height: task.height,
    ry: task.barCornerRadius,
    rx: task.barCornerRadius,
    fill: processColor
  }), React.createElement("rect", {
    fill: barColor,
    x: task.x1,
    width: projectWith,
    y: task.y,
    height: task.height / 2,
    rx: task.barCornerRadius,
    ry: task.barCornerRadius,
    className: styles$7.projectTop
  }), React.createElement("polygon", {
    className: styles$7.projectTop,
    points: projectLeftTriangle,
    fill: barColor
  }), React.createElement("polygon", {
    className: styles$7.projectTop,
    points: projectRightTriangle,
    fill: barColor
  }));
};

const TaskItem = props => {
  const {
    task,
    isDelete,
    isSelected,
    onEventStart,
    jsPlumb
  } = props;
  const [taskItem, setTaskItem] = useState(React.createElement("div", null));
  useEffect(() => {
    switch (task.typeInternal) {
      case "milestone":
        setTaskItem(React.createElement(Milestone, Object.assign({}, props)));
        break;

      case "project":
        setTaskItem(React.createElement(Project, Object.assign({}, props)));
        break;

      case "smalltask":
        setTaskItem(React.createElement(BarSmall, Object.assign({}, props)));
        break;

      case "parent":
        setTaskItem(React.createElement(BarParent, Object.assign({}, props)));
        break;

      default:
        setTaskItem(React.createElement(Bar, Object.assign({}, props)));
        break;
    }
  }, [task, isSelected, jsPlumb, props]);
  return React.createElement("g", {
    onKeyDown: e => {
      switch (e.key) {
        case "Delete":
          {
            if (isDelete) onEventStart("delete", task, e);
            break;
          }
      }

      e.stopPropagation();
    },
    onMouseEnter: e => {
      onEventStart("mouseenter", task, e);
    },
    onMouseLeave: e => {
      onEventStart("mouseleave", task, e);
    },
    onDoubleClick: e => {
      onEventStart("dblclick", task, e);
    },
    onClick: e => {
      onEventStart("click", task, e);
    },
    onFocus: () => {
      onEventStart("select", task);
    }
  }, taskItem);
};

const TaskItemLog = props => {
  const {
    task,
    onEventStart,
    isSelected,
    jsPlumb
  } = { ...props
  };
  const [taskItem, setTaskItem] = useState(React.createElement("div", null));
  useEffect(() => {
    switch (task.typeInternal) {
      case "milestone":
        setTaskItem(React.createElement(Milestone, Object.assign({}, props)));
        break;

      case "project":
        setTaskItem(React.createElement(Project, Object.assign({}, props)));
        break;

      case "smalltask":
        setTaskItem(React.createElement(BarSmall, Object.assign({}, props)));
        break;

      case "parent":
        setTaskItem(React.createElement(BarParent, Object.assign({}, props)));
        break;

      default:
        setTaskItem(React.createElement(Bar, Object.assign({}, props)));
        break;
    }
  }, [task, isSelected, jsPlumb]);
  return React.createElement("g", {
    onClick: e => {
      onEventStart("click", task, e);
    }
  }, taskItem);
};

const TaskGanttContent = memo(({
  tasks,
  logTasks,
  dates,
  ganttEvent,
  selectedTask,
  rowHeight,
  columnWidth,
  timeStep,
  svg,
  taskHeight,
  arrowColor,
  arrowIndent,
  fontFamily,
  fontSize,
  setGanttEvent,
  setFailedTask,
  setSelectedTask,
  onDateChange,
  onProgressChange,
  onDoubleClick,
  onDelete,
  addConnection,
  itemLinks,
  taskListHeight,
  clickBaselineItem,
  isConnect,
  setCurrentConnection,
  currentConnection,
  containerRef
}) => {
  var _svg$current;

  const [connectUuids, setConnectUuids] = useState([]);
  const point = svg === null || svg === void 0 ? void 0 : (_svg$current = svg.current) === null || _svg$current === void 0 ? void 0 : _svg$current.createSVGPoint();
  const [xStep, setXStep] = useState(0);
  const [initEventX1Delta, setInitEventX1Delta] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [jsPlumbInstance, setJsPlumbInstance] = useState(null);
  const {
    ganttConfig
  } = useContext(GanttConfigContext);
  const [pointInited, setPointInited] = useState(false);
  useEffect(() => {
    const connectClickHandle = () => {
      if (currentConnection) {
        var _currentConnection$co;

        currentConnection === null || currentConnection === void 0 ? void 0 : (_currentConnection$co = currentConnection.connection) === null || _currentConnection$co === void 0 ? void 0 : _currentConnection$co.removeClass("select-connection");
        setCurrentConnection === null || setCurrentConnection === void 0 ? void 0 : setCurrentConnection(null);
      }
    };

    const container = containerRef === null || containerRef === void 0 ? void 0 : containerRef.current;
    container === null || container === void 0 ? void 0 : container.addEventListener("click", connectClickHandle, true);
    return () => {
      container === null || container === void 0 ? void 0 : container.removeEventListener("click", connectClickHandle, true);
    };
  }, [containerRef, setCurrentConnection, currentConnection]);
  useEffect(() => {
    if (!currentConnection && jsPlumbInstance) {
      const connections = jsPlumbInstance.getConnections();
      connections.forEach(ele => {
        ele.removeClass("select-connection");
      });
    }
  }, [currentConnection, jsPlumbInstance]);
  useEffect(() => {
    const dateDelta = dates[1].getTime() - dates[0].getTime() - dates[1].getTimezoneOffset() * 60 * 1000 + dates[0].getTimezoneOffset() * 60 * 1000;
    const newXStep = timeStep * columnWidth / dateDelta;
    setXStep(newXStep);
  }, [columnWidth, dates, timeStep]);
  useEffect(() => {
    const handleMouseMove = async event => {
      var _svg$current$getScree;

      if (!ganttEvent.changedTask || !point || !(svg !== null && svg !== void 0 && svg.current)) return;
      event.preventDefault();
      point.x = event.clientX;
      const cursor = point.matrixTransform(svg === null || svg === void 0 ? void 0 : (_svg$current$getScree = svg.current.getScreenCTM()) === null || _svg$current$getScree === void 0 ? void 0 : _svg$current$getScree.inverse());
      const {
        isChanged,
        changedTask
      } = handleTaskBySVGMouseEvent(cursor.x, ganttEvent.action, ganttEvent.changedTask, xStep, timeStep, initEventX1Delta);

      if (isChanged) {
        setGanttEvent({
          action: ganttEvent.action,
          changedTask
        });
      }
    };

    const handleMouseUp = async event => {
      var _svg$current$getScree2;

      const {
        action,
        originalSelectedTask,
        changedTask
      } = ganttEvent;
      if (!changedTask || !point || !(svg !== null && svg !== void 0 && svg.current) || !originalSelectedTask) return;
      event.preventDefault();
      point.x = event.clientX;
      const cursor = point.matrixTransform(svg === null || svg === void 0 ? void 0 : (_svg$current$getScree2 = svg.current.getScreenCTM()) === null || _svg$current$getScree2 === void 0 ? void 0 : _svg$current$getScree2.inverse());
      const {
        changedTask: newChangedTask
      } = handleTaskBySVGMouseEvent(cursor.x, action, changedTask, xStep, timeStep, initEventX1Delta);
      const isNotLikeOriginal = originalSelectedTask.start !== newChangedTask.start || originalSelectedTask.end !== newChangedTask.end || originalSelectedTask.progress !== newChangedTask.progress;
      svg.current.removeEventListener("mousemove", handleMouseMove);
      svg.current.removeEventListener("mouseup", handleMouseUp);
      setGanttEvent({
        action: ""
      });
      setIsMoving(false);
      let operationSuccess = true;

      if ((action === "move" || action === "end" || action === "start") && onDateChange && isNotLikeOriginal) {
        try {
          const result = await onDateChange(newChangedTask);

          if (result !== undefined) {
            operationSuccess = result;
          }
        } catch (error) {
          operationSuccess = false;
        }
      } else if (onProgressChange && isNotLikeOriginal) {
        try {
          const result = await onProgressChange(newChangedTask);

          if (result !== undefined) {
            operationSuccess = result;
          }
        } catch (error) {
          operationSuccess = false;
        }
      }

      if (!operationSuccess) {
        setFailedTask(originalSelectedTask);
      }
    };

    if (!isMoving && ["move", "end", "start", "progress"].includes(ganttEvent.action) && svg !== null && svg !== void 0 && svg.current) {
      svg.current.addEventListener("mousemove", handleMouseMove);
      svg.current.addEventListener("mouseup", handleMouseUp);
      setIsMoving(true);
    }
  }, [ganttEvent, xStep, initEventX1Delta, onProgressChange, timeStep, onDateChange, svg, isMoving, point, setFailedTask, setGanttEvent]);
  const handleBarEventStart = useCallback(async (action, task, event) => {
    if (!event) {
      if (action === "select") {
        setSelectedTask(task.id);
      }
    } else if (isKeyboardEvent(event)) {
        if (action === "delete") {
          if (onDelete) {
            try {
              const result = await onDelete(task);

              if (result !== undefined && result) {
                setGanttEvent({
                  action,
                  changedTask: task
                });
              }
            } catch (error) {
              console.error("Error on Delete. " + error);
            }
          }
        }
      } else if (action === "mouseenter") {
          if (!ganttEvent.action) {
            setGanttEvent({
              action,
              changedTask: task,
              originalSelectedTask: task
            });
          }
        } else if (action === "mouseleave") {
          setGanttEvent({
            action: ""
          });
        } else if (action === "dblclick") {
          !!onDoubleClick && onDoubleClick(task);
        } else if (action === "click") {
          var _event$nativeEvent, _currentLogItem$, _currentLogItem$2;

          const offsetX = event === null || event === void 0 ? void 0 : (_event$nativeEvent = event.nativeEvent) === null || _event$nativeEvent === void 0 ? void 0 : _event$nativeEvent.offsetX;
          const currentLogItem = tasks.filter(ele => ele.id === task.id);

          if (!(currentLogItem !== null && currentLogItem !== void 0 && (_currentLogItem$ = currentLogItem[0]) !== null && _currentLogItem$ !== void 0 && _currentLogItem$.end && currentLogItem !== null && currentLogItem !== void 0 && (_currentLogItem$2 = currentLogItem[0]) !== null && _currentLogItem$2 !== void 0 && _currentLogItem$2.start)) {
            clickBaselineItem === null || clickBaselineItem === void 0 ? void 0 : clickBaselineItem(offsetX, currentLogItem[0]);
          }

          setGanttEvent({
            action,
            changedTask: task
          });
        } else if (action === "move") {
            var _svg$current$getScree3;

            if (!(svg !== null && svg !== void 0 && svg.current) || !point) return;
            point.x = event.clientX;
            const cursor = point.matrixTransform((_svg$current$getScree3 = svg.current.getScreenCTM()) === null || _svg$current$getScree3 === void 0 ? void 0 : _svg$current$getScree3.inverse());
            setInitEventX1Delta(cursor.x - task.x1);
            setGanttEvent({
              action,
              changedTask: task,
              originalSelectedTask: task
            });
          } else {
            setGanttEvent({
              action,
              changedTask: task,
              originalSelectedTask: task
            });
          }
  }, [ganttEvent.action, onDelete, onDoubleClick, point, setGanttEvent, setSelectedTask, svg, clickBaselineItem, tasks]);
  const getLinkTypeId = useCallback((start, end) => {
    const linkType = relationReverse(start, end);
    return ganttConfig.relation[linkType];
  }, [ganttConfig.relation]);
  const getHasLinkItems = useCallback(task => {
    const hasLinkItems = (task === null || task === void 0 ? void 0 : task.link) || {};
    let needUpdateItems = [];
    Object.keys(hasLinkItems).map(type => {
      if (hasLinkItems[type]) {
        Object.keys(hasLinkItems[type]).map(linkType => {
          if (hasLinkItems[type][linkType]) {
            needUpdateItems = needUpdateItems.concat(hasLinkItems[type][linkType]);
          }
        });
      }
    });
    return needUpdateItems;
  }, []);
  const checkIsPivotalPathLink = useCallback((task, target, tasks, relationType) => {
    const targetPivotalPathItem = tasks.filter(ele => ele.id === target && (ele === null || ele === void 0 ? void 0 : ele.isPivotalPathItem));

    if (task !== null && task !== void 0 && task.isPivotalPathItem && targetPivotalPathItem !== null && targetPivotalPathItem !== void 0 && targetPivotalPathItem.length && relationType === "FS") {
      return true;
    }

    return false;
  }, []);
  const checkIsErrorLink = useCallback((task, target) => {
    var _task$item, _task$item2;

    const needUpdateItems = getHasLinkItems(task);
    const subItems = (task === null || task === void 0 ? void 0 : (_task$item = task.item) === null || _task$item === void 0 ? void 0 : _task$item.subItem) || [];
    let flag = false;
    const targetItems = needUpdateItems.filter(id => id === target);

    if ((targetItems === null || targetItems === void 0 ? void 0 : targetItems.length) > 1) {
      flag = true;
      return flag;
    }

    if (((task === null || task === void 0 ? void 0 : (_task$item2 = task.item) === null || _task$item2 === void 0 ? void 0 : _task$item2.ancestors) || []).includes(target)) {
      flag = true;
      return flag;
    }

    subItems.forEach(item => {
      if (needUpdateItems.includes(item)) {
        flag = true;
      }
    });
    return flag;
  }, [getHasLinkItems]);
  useEffect(() => {
    if (isConnect) {
      import('jsplumb').then(({
        jsPlumb
      }) => {
        jsPlumb.ready(() => {
          const instance = jsPlumb.getInstance();
          instance.fire("jsPlumbDemoLoaded", instance);
          setJsPlumbInstance(instance);
        });
      });
    }
  }, [isConnect]);
  useEffect(() => {
    if (jsPlumbInstance) {
      const originalOffset = jsPlumbInstance.getOffset;
      const originalSize = jsPlumbInstance.getSize;

      jsPlumbInstance.getOffset = function (el) {
        const tn = el.tagName.toUpperCase();

        if (offsetCalculators[tn]) {
          return offsetCalculators[tn](el);
        } else return originalOffset.apply(this, [el]);
      };

      jsPlumbInstance.getSize = function (el) {
        const tn = el.tagName.toUpperCase();

        if (sizeCalculators[tn]) {
          return sizeCalculators[tn](el);
        } else return originalSize.apply(this, [el]);
      };

      jsPlumbInstance.setContainer("horizontalContainer");
      jsPlumbInstance.bind("beforeDrop", conn => {
        var _taskSource$item, _taskTarget$item, _desinationTask, _desinationTask$item, _sourceTask, _sourceTask$item;

        const taskSource = filter(tasks, {
          id: conn.sourceId
        })[0];
        const taskTarget = filter(tasks, {
          id: conn.targetId
        })[0];

        if (!ganttConfig.relation) {
          message.warning("未配置关联关系");
          return;
        }

        if (conn.targetId === conn.sourceId) {
          message.warning("连线有误");
          return;
        }

        if (((taskSource === null || taskSource === void 0 ? void 0 : (_taskSource$item = taskSource.item) === null || _taskSource$item === void 0 ? void 0 : _taskSource$item.subItem) || []).includes(taskTarget === null || taskTarget === void 0 ? void 0 : taskTarget.id) || ((taskTarget === null || taskTarget === void 0 ? void 0 : (_taskTarget$item = taskTarget.item) === null || _taskTarget$item === void 0 ? void 0 : _taskTarget$item.subItem) || []).includes(taskSource === null || taskSource === void 0 ? void 0 : taskSource.id)) {
          message.warning("父子卡片之间不能存在关联关系");
          return;
        }

        const linkTypeId = getLinkTypeId(conn.connection.endpoints[0].anchor.cssClass, conn.dropEndpoint.anchor.cssClass);
        const currentLink = itemLinks === null || itemLinks === void 0 ? void 0 : itemLinks.filter(ele => {
          var _ele$source, _ele$destination, _ele$linkType;

          return ((_ele$source = ele.source) === null || _ele$source === void 0 ? void 0 : _ele$source.objectId) === (conn === null || conn === void 0 ? void 0 : conn.sourceId) && ((_ele$destination = ele.destination) === null || _ele$destination === void 0 ? void 0 : _ele$destination.objectId) === (conn === null || conn === void 0 ? void 0 : conn.targetId) && ((_ele$linkType = ele.linkType) === null || _ele$linkType === void 0 ? void 0 : _ele$linkType.objectId) === linkTypeId;
        });

        if (currentLink !== null && currentLink !== void 0 && currentLink.length) {
          message.warning("连线有误");
          return false;
        }

        let sourceTask;
        let desinationTask;
        tasks.map(task => {
          if (task.id === conn.sourceId) {
            sourceTask = task;
          }

          if (task.id === conn.sourceId) {
            desinationTask = task;
          }
        });
        const hasLinkItems = getHasLinkItems(sourceTask);

        if (hasLinkItems.includes(conn.targetId)) {
          message.warning("连线有误");
          return false;
        }

        if ((_desinationTask = desinationTask) !== null && _desinationTask !== void 0 && (_desinationTask$item = _desinationTask.item) !== null && _desinationTask$item !== void 0 && _desinationTask$item.subItem.includes(conn.sourceId) || (_sourceTask = sourceTask) !== null && _sourceTask !== void 0 && (_sourceTask$item = _sourceTask.item) !== null && _sourceTask$item !== void 0 && _sourceTask$item.subItem.includes(conn.targetId)) {
          message.warning("连线有误");
          return false;
        }

        return true;
      });
      jsPlumbInstance.bind("connection", (infor, originalEvent) => {
        const linkTypeId = getLinkTypeId(infor.connection.endpoints[0].anchor.cssClass, infor.connection.endpoints[1].anchor.cssClass);
        const params = {
          source: infor === null || infor === void 0 ? void 0 : infor.sourceId,
          destination: infor === null || infor === void 0 ? void 0 : infor.targetId,
          linkType: linkTypeId
        };

        if (originalEvent) {
          infor.connection.setData(linkTypeId);
          addConnection === null || addConnection === void 0 ? void 0 : addConnection(params);
        }
      });
      jsPlumbInstance.bind("click", (connection, originalEvent) => {
        jsPlumbInstance.select().removeClass("select-connection");
        connection.addClass("select-connection");
        setCurrentConnection === null || setCurrentConnection === void 0 ? void 0 : setCurrentConnection({
          originalEvent: originalEvent,
          connection: connection
        });
      });
    }

    return () => {
      if (jsPlumbInstance) {
        jsPlumbInstance.unbind("beforeDrop");
        jsPlumbInstance.unbind("connection");
        jsPlumbInstance.unbind("click");
      }
    };
  }, [jsPlumbInstance, itemLinks, tasks, getHasLinkItems, addConnection, ganttConfig.relation, getLinkTypeId, setCurrentConnection]);
  useEffect(() => {
    if (!(itemLinks !== null && itemLinks !== void 0 && itemLinks.length)) {
      if (!isEqual(connectUuids, [])) {
        setConnectUuids([]);
      }
    }

    if (itemLinks !== null && itemLinks !== void 0 && itemLinks.length && tasks.length && jsPlumbInstance) {
      const newConnectUuids = [];
      tasks.forEach(task => {
        const itemFilter = itemLinks === null || itemLinks === void 0 ? void 0 : itemLinks.filter(ele => {
          var _ele$source2;

          return ((_ele$source2 = ele.source) === null || _ele$source2 === void 0 ? void 0 : _ele$source2.objectId) === (task === null || task === void 0 ? void 0 : task.id);
        });
        itemFilter.forEach(ele => {
          var _ele$destination2, _ele$destination3, _ele$source3, _ele$destination4;

          let relationType = "";

          for (const key in ganttConfig.relation) {
            var _ele$linkType2;

            if (ganttConfig.relation[key] === ((_ele$linkType2 = ele.linkType) === null || _ele$linkType2 === void 0 ? void 0 : _ele$linkType2.objectId)) {
              relationType = key;
              continue;
            }
          }

          const isErrorLink = checkIsErrorLink(task, (_ele$destination2 = ele.destination) === null || _ele$destination2 === void 0 ? void 0 : _ele$destination2.objectId);
          const isPivotalPathLink = checkIsPivotalPathLink(task, (_ele$destination3 = ele.destination) === null || _ele$destination3 === void 0 ? void 0 : _ele$destination3.objectId, tasks, relationType);
          newConnectUuids.push({
            source: (_ele$source3 = ele.source) === null || _ele$source3 === void 0 ? void 0 : _ele$source3.objectId,
            destination: (_ele$destination4 = ele.destination) === null || _ele$destination4 === void 0 ? void 0 : _ele$destination4.objectId,
            relationType: relationType,
            isErrorLink: isErrorLink,
            isPivotalPathLink: isPivotalPathLink
          });
        });
      });

      if (!isEqual(connectUuids, newConnectUuids)) {
        setConnectUuids(newConnectUuids);
      }
    }
  }, [jsPlumbInstance, itemLinks, tasks, connectUuids, checkIsErrorLink, checkIsPivotalPathLink, ganttConfig.relation, ganttConfig]);
  useEffect(() => {
    if (jsPlumbInstance && connectUuids.length && pointInited) {
      jsPlumbInstance.setSuspendDrawing(true);

      for (let i = 0; i < connectUuids.length; i++) {
        const uuidObj = connectUuids[i];
        const {
          source,
          destination,
          relationType,
          isErrorLink,
          isPivotalPathLink
        } = uuidObj;

        if (source && destination && relationType) {
          var _relationInit$relatio, _relationInit$relatio2;

          const uuid = [`${source}-${(_relationInit$relatio = relationInit[relationType]) === null || _relationInit$relatio === void 0 ? void 0 : _relationInit$relatio[0]}`, `${destination}-${(_relationInit$relatio2 = relationInit[relationType]) === null || _relationInit$relatio2 === void 0 ? void 0 : _relationInit$relatio2[1]}`];
          const connect = jsPlumbInstance.connect({
            uuids: uuid
          });

          if (connect) {
            var _ganttConfig$relation;

            if (isErrorLink) {
              connect.setPaintStyle({
                stroke: errorLinkBorderColor
              });
            }

            if (isPivotalPathLink) {
              connect.setPaintStyle({
                stroke: pivotalPathLinkBorderColor
              });
            }

            connect.setData(ganttConfig === null || ganttConfig === void 0 ? void 0 : (_ganttConfig$relation = ganttConfig.relation) === null || _ganttConfig$relation === void 0 ? void 0 : _ganttConfig$relation[relationType]);
          }
        }
      }

      jsPlumbInstance.setSuspendDrawing(false, true);
    }

    return () => {
      if (jsPlumbInstance) {
        jsPlumbInstance.deleteEveryConnection();
      }
    };
  }, [jsPlumbInstance, ganttConfig === null || ganttConfig === void 0 ? void 0 : ganttConfig.relation, connectUuids, pointInited]);
  return React.createElement("g", {
    className: "content"
  }, React.createElement("g", {
    className: "arrows",
    fill: arrowColor,
    stroke: arrowColor
  }, tasks.map(task => {
    return task.barChildren.map(child => {
      return React.createElement(Arrow, {
        key: `Arrow from ${task.id} to ${tasks[child].id}`,
        taskFrom: task,
        taskTo: tasks[child],
        rowHeight: rowHeight,
        taskHeight: taskHeight,
        arrowIndent: arrowIndent
      });
    });
  })), React.createElement("g", {
    className: "bar",
    fontFamily: fontFamily,
    fontSize: fontSize
  }, tasks.map(task => {
    const cuttentLog = logTasks.find(ele => ele.id === task.id);

    if (cuttentLog) {
      cuttentLog.y = task.y;
    }

    return React.createElement("g", {
      key: `g-${task.id}`
    }, !(cuttentLog !== null && cuttentLog !== void 0 && cuttentLog.start) || !(cuttentLog !== null && cuttentLog !== void 0 && cuttentLog.end) ? null : React.createElement(TaskItemLog, {
      task: cuttentLog,
      arrowIndent: arrowIndent,
      taskHeight: taskHeight,
      isProgressChangeable: !!onProgressChange && !task.isDisabled,
      isDateChangeable: !!onDateChange && !task.isDisabled,
      isDelete: !task.isDisabled,
      onEventStart: handleBarEventStart,
      key: `${task.id}-log`,
      isSelected: !!selectedTask && task.id === selectedTask.id,
      isLog: true
    }), !task.start || !task.end ? null : React.createElement(TaskItem, {
      jsPlumb: jsPlumbInstance,
      task: task,
      arrowIndent: arrowIndent,
      taskHeight: taskHeight,
      isProgressChangeable: !!onProgressChange && !task.isDisabled,
      isDateChangeable: !!onDateChange && !task.isDisabled,
      isDelete: !task.isDisabled,
      onEventStart: handleBarEventStart,
      key: task.id,
      isSelected: !!selectedTask && task.id === selectedTask.id,
      taskListHeight: taskListHeight,
      setPointInited: setPointInited,
      isMoving: isMoving,
      ganttEvent: ganttEvent
    }));
  })));
});

var styles$8 = {"ganttVerticalContainer":"_gantt-module__ganttVerticalContainer__CZjuD","horizontalContainer":"_gantt-module__horizontalContainer__2B2zv","box":"_gantt-module__box__1OUoh","wrapper":"_gantt-module__wrapper__3eULf","choosedBaselIne":"_gantt-module__choosedBaselIne__1Dj-F","loaded":"_gantt-module__loaded__3Z0-o","task-gantt-wrapper":"_gantt-module__task-gantt-wrapper__1XY6X","calendarWrapper":"_gantt-module__calendarWrapper__1Yq_L","ganttHeader":"_gantt-module__ganttHeader__3AK9_","cursor":"_gantt-module__cursor__1s6IU","taskListWrapper":"_gantt-module__taskListWrapper__1WqXP","backgroundSvg":"_gantt-module__backgroundSvg__2g59X","contextContainer":"_gantt-module__contextContainer__3thyu","dividerWrapper":"_gantt-module__dividerWrapper__vHXuk","dividerContainer":"_gantt-module__dividerContainer__8wIQn","maskLine":"_gantt-module__maskLine__2Zpkt","maskLineTop":"_gantt-module__maskLineTop__3FMpN","dividerIconWarpper":"_gantt-module__dividerIconWarpper___Gn1R","reverse":"_gantt-module__reverse__277Zr","guideInfor":"_gantt-module__guideInfor__3jotN","clickThis":"_gantt-module__clickThis__1QPSE","displayPopover":"_gantt-module__displayPopover__3WXVd","displayRow":"_gantt-module__displayRow__3YNAF","textAlignR":"_gantt-module__textAlignR__1zkpu","viewMode":"_gantt-module__viewMode__2lFUt","todayBtn":"_gantt-module__todayBtn__25AiV","dataMode":"_gantt-module__dataMode__gHoVA"};

const TaskGanttComponent = ({
  gridProps,
  calendarProps,
  barProps,
  scrollX,
  onScroll,
  taskListHeight,
  listBottomHeight,
  headerHeight
}, ref) => {
  const {
    dates,
    onDateChange,
    columnWidth
  } = gridProps;
  const {
    viewMode
  } = calendarProps;
  const {
    ganttConfig
  } = useContext(GanttConfigContext);
  const ganttSVGRef = useRef(null);
  const horizontalContainerRef = useRef(null);
  const verticalGanttContainerRef = useRef(null);
  const newBarProps = { ...barProps,
    svg: ganttSVGRef
  };
  useImperativeHandle(ref, () => ({
    horizontalContainerRef: horizontalContainerRef.current,
    verticalGanttContainerRef: verticalGanttContainerRef.current
  }));

  const clickBaselineItem = (offsetX, currentLogItem) => {
    let startDate, endDate;

    if (viewMode === ViewMode.Day) {
      var _ganttConfig$time, _startDate, _ganttConfig$time2, _endDate;

      startDate = dayjs(dates[0].valueOf() + offsetX / columnWidth * daySeconds);
      endDate = dayjs(dates[0].valueOf() + offsetX / columnWidth * daySeconds + daySeconds);
      onDateChange === null || onDateChange === void 0 ? void 0 : onDateChange(Object.assign(currentLogItem, {
        start: ganttConfig !== null && ganttConfig !== void 0 && (_ganttConfig$time = ganttConfig.time) !== null && _ganttConfig$time !== void 0 && _ganttConfig$time.length ? (_startDate = startDate) === null || _startDate === void 0 ? void 0 : _startDate.startOf("day").toDate() : null,
        end: ganttConfig !== null && ganttConfig !== void 0 && (_ganttConfig$time2 = ganttConfig.time) !== null && _ganttConfig$time2 !== void 0 && _ganttConfig$time2.length ? (_endDate = endDate) === null || _endDate === void 0 ? void 0 : _endDate.startOf("day").toDate() : null
      }));
    }
  };

  return React.createElement("div", {
    className: styles$8.ganttVerticalContainer,
    ref: verticalGanttContainerRef,
    onScroll: onScroll,
    style: {
      marginBottom: `${listBottomHeight}px`
    }
  }, React.createElement("div", {
    style: {
      height: `${headerHeight}px`
    }
  }, React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: gridProps.svgWidth,
    height: calendarProps.headerHeight,
    fontFamily: barProps.fontFamily
  }, React.createElement(Calendar, Object.assign({}, calendarProps)))), React.createElement("div", {
    id: "horizontalContainer",
    ref: horizontalContainerRef,
    className: styles$8.horizontalContainer,
    style: {
      width: gridProps.svgWidth
    }
  }, React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: gridProps.svgWidth,
    height: barProps.rowHeight * barProps.tasks.length < Number(taskListHeight) ? taskListHeight : barProps.rowHeight * barProps.tasks.length + scrollBarHeight,
    fontFamily: barProps.fontFamily,
    ref: ganttSVGRef,
    style: {
      position: "relative"
    }
  }, React.createElement(Grid, Object.assign({}, gridProps, {
    viewMode: calendarProps.viewMode,
    scrollX: scrollX,
    taskListHeight: taskListHeight
  })), React.createElement(TaskGanttContent, Object.assign({}, newBarProps, {
    taskListHeight: taskListHeight,
    clickBaselineItem: clickBaselineItem,
    containerRef: horizontalContainerRef
  }))), false ));
};

const TaskGantt = memo(forwardRef(TaskGanttComponent));

var styles$9 = {"scroll":"_horizontal-scroll-module__scroll__19jgW"};

const HorizontalScrollComponent = ({
  svgWidth,
  taskListWidth,
  onScroll,
  listBottomHeight
}, ref) => {
  const dividerWidth = 15;
  return React.createElement("div", {
    style: {
      marginLeft: taskListWidth + dividerWidth,
      width: `calc(100% - ${taskListWidth}px)`,
      bottom: `${listBottomHeight}px`
    },
    className: styles$9.scroll,
    onScroll: onScroll,
    ref: ref
  }, React.createElement("div", {
    style: {
      width: svgWidth,
      height: 1
    }
  }));
};
const HorizontalScroll = memo(forwardRef(HorizontalScrollComponent));

var styles$a = {"timeConfigTable":"_index-module__timeConfigTable__RtxeF","timeConfigAddBtn":"_index-module__timeConfigAddBtn__z7sOS","width100":"_index-module__width100__3YVQm","icon":"_index-module__icon__J9ThB","timeTips":"_index-module__timeTips__3yvG2","settingsModalContainer":"_index-module__settingsModalContainer__3rfkd","otherConfig":"_index-module__otherConfig__FPmvI","question":"_index-module__question__212e-","displayPopover":"_index-module__displayPopover__31Cvc","displayRow":"_index-module__displayRow__cYuLc","textAlignR":"_index-module__textAlignR__3mW_D","activeRotate":"_index-module__activeRotate__13Q7Y","collapse":"_index-module__collapse__ik7_-","extraHeader":"_index-module__extraHeader__2M_je","title":"_index-module__title__2tmi3","des":"_index-module__des__3U2u7"};

const {
  Option
} = Select;

const filterOption = (input, option) => {
  var _option$name;

  return (option === null || option === void 0 ? void 0 : (_option$name = option.name) === null || _option$name === void 0 ? void 0 : _option$name.toLowerCase().indexOf(input === null || input === void 0 ? void 0 : input.toLowerCase())) > -1;
};

const filterFields = (type, customField) => {
  return customField.filter(ele => {
    var _ele$fieldType;

    return (ele === null || ele === void 0 ? void 0 : (_ele$fieldType = ele.fieldType) === null || _ele$fieldType === void 0 ? void 0 : _ele$fieldType.key) === type;
  });
};
const filterDeleteFields = (id, customField) => {
  const filterData = find(customField, {
    objectId: id
  });
  return filterData ? filterData.objectId : null;
};

const ItemModal = ({
  visible,
  handleCancel,
  handleOk,
  currentItem,
  timeList
}) => {
  const [form] = Form.useForm();
  const {
    itemTypeData,
    getCustomFields
  } = useContext(ConfigHandleContext);
  const [isSelected, setIsSelected] = useState(false);
  const [customField, setCustomField] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  useEffect(() => {
    if (visible) {
      if (isSelected) {
        return;
      }

      form.resetFields();
      form.setFieldsValue({
        endDate: filterDeleteFields(currentItem.endDate, customField),
        itemType: filterDeleteFields(`${currentItem.itemType}`, itemTypeData),
        percentage: filterDeleteFields(currentItem.percentage, customField),
        startDate: filterDeleteFields(currentItem.startDate, customField),
        isDefault: currentItem.isDefault
      });
    }
  }, [visible, currentItem, form, customField, itemTypeData, isSelected]);
  useEffect(() => {
    const fetch = async currentItem => {
      const fields = await getCustomFields(currentItem);
      setCustomField(fields);
    };

    if (visible) {
      fetch(currentItem);
    }
  }, [visible, getCustomFields, currentItem]);
  useEffect(() => {
    if (!visible) {
      setIsSelected(false);
    }
  }, [visible]);

  const handleConfirm = () => {
    form.validateFields().then(async values => {
      const fields = await getCustomFields(currentItem);
      Object.keys(omit(values, ["itemType"])).forEach(ele => {
        const fileldFilter = fields.filter(f => f.objectId === values[ele]);

        if (!fileldFilter.length) {
          const obj = {};
          obj[ele] = null;
          form.setFieldsValue(obj);
        }
      });
      form.validateFields().then(async () => {
        setConfirmLoading(true);
        await handleOk(values);
        setConfirmLoading(false);
      });
    }).catch(info => {
      console.log("Validate Failed:", info);
    });
  };

  const itemCheck = (_, value) => {
    if (value) {
      const itemFilter = timeList === null || timeList === void 0 ? void 0 : timeList.filter(item => item.itemType === value);

      if (itemFilter !== null && itemFilter !== void 0 && itemFilter.length && currentItem.itemType !== value) {
        return Promise.reject(new Error("该事项类型已选择， 请重新选择"));
      }

      return Promise.resolve();
    } else {
      return Promise.resolve();
    }
  };

  const handelChange = async val => {
    setIsSelected(true);
    const fields = await getCustomFields({
      itemType: val
    });
    setCustomField(fields);
    form.setFieldsValue({
      startDate: undefined,
      endDate: undefined,
      percentage: undefined
    });
  };

  return React.createElement(Modal, {
    title: "\u65F6\u95F4\u5B57\u6BB5\u914D\u7F6E",
    visible: visible,
    onOk: handleConfirm,
    onCancel: handleCancel,
    cancelText: "\u53D6\u6D88",
    okText: "\u786E\u5B9A",
    confirmLoading: confirmLoading
  }, React.createElement(Form, {
    form: form,
    name: "basic",
    labelCol: {
      span: 24
    },
    wrapperCol: {
      span: 24
    },
    layout: "vertical"
  }, !(currentItem !== null && currentItem !== void 0 && currentItem.isDefault) && React.createElement(Form.Item, {
    label: "\u4E8B\u9879\u7C7B\u578B",
    name: "itemType",
    rules: [{
      required: true,
      message: "请选择事项类型"
    }, {
      validator: itemCheck
    }]
  }, React.createElement(Select, {
    placeholder: "\u8BF7\u9009\u62E9",
    onChange: handelChange
  }, itemTypeData.map(ele => {
    return React.createElement(Option, {
      value: ele.value,
      key: ele.value
    }, ele.icon ? React.createElement("img", {
      src: ele.icon,
      className: styles$a.icon
    }) : null, ele.label);
  }))), React.createElement(Form.Item, {
    label: "\u5F00\u59CB\u65E5\u671F",
    name: "startDate",
    rules: [{
      required: true,
      message: "请选择开始日期字段"
    }]
  }, React.createElement(Select, {
    placeholder: "\u8BF7\u9009\u62E9",
    showSearch: true,
    filterOption: filterOption,
    allowClear: true
  }, filterFields("Date", customField).map(ele => {
    return React.createElement(Option, {
      value: ele.value,
      key: ele.value,
      name: ele.label
    }, ele.label);
  }))), React.createElement(Form.Item, {
    label: "\u7ED3\u675F\u65E5\u671F",
    name: "endDate",
    rules: [{
      required: true,
      message: "请选择结束日期字段"
    }]
  }, React.createElement(Select, {
    placeholder: "\u8BF7\u9009\u62E9",
    allowClear: true,
    showSearch: true,
    filterOption: filterOption
  }, filterFields("Date", customField).map(ele => {
    return React.createElement(Option, {
      value: ele.value,
      key: ele.value,
      name: ele.label
    }, ele.label);
  }))), React.createElement(Form.Item, {
    label: "\u5B8C\u6210\u5360\u6BD4",
    name: "percentage"
  }, React.createElement(Select, {
    placeholder: "\u8BF7\u9009\u62E9",
    allowClear: true,
    showSearch: true,
    filterOption: filterOption
  }, filterFields("Number", customField).map(ele => {
    return React.createElement(Option, {
      value: ele.value,
      key: ele.value,
      name: ele.label
    }, ele.label);
  })))));
};

const Svg$2 = () => /*#__PURE__*/React.createElement("svg", {
  width: "16px",
  height: "16px",
  viewBox: "0 0 16 16",
  version: "1.1"
}, /*#__PURE__*/React.createElement("title", null, "\u5207\u7247"), /*#__PURE__*/React.createElement("g", {
  id: "\u65B9\u6848",
  stroke: "none",
  strokeWidth: "1",
  fill: "none",
  fillRule: "evenodd"
}, /*#__PURE__*/React.createElement("g", {
  id: "#18-\u7518\u7279\u56FE-\u521D\u6B21\u63D0\u9192\u65F6\u95F4\u5B57\u6BB5\u914D\u7F6E",
  transform: "translate(-880.000000, -403.000000)"
}, /*#__PURE__*/React.createElement("g", {
  id: "5.\u53CD\u9988/1.\u8B66\u544A\u63D0\u793A/2.\u5E26\u94FE\u63A5/\u63D0\u793A",
  transform: "translate(864.000000, 395.000000)"
}, /*#__PURE__*/React.createElement("g", {
  id: "\u56FE\u6807",
  transform: "translate(16.000000, 8.000000)"
}, /*#__PURE__*/React.createElement("rect", {
  id: "\u77E9\u5F62",
  fill: "#FFFFFF",
  opacity: "0",
  x: "0",
  y: "0",
  width: "16",
  height: "16"
}), /*#__PURE__*/React.createElement("path", {
  d: "M8,1 C11.8663333,1 15,4.13366667 15,8 C15,11.8663333 11.8663333,15 8,15 C4.13366667,15 1,11.8663333 1,8 C1,4.13366667 4.13366667,1 8,1 Z M8,6.44444444 L7.89383105,6.45156544 C7.5123098,6.50321808 7.22222222,6.82958857 7.22222222,7.22450059 L7.22222222,7.22450059 L7.22222222,11.1088327 C7.22222222,11.5316637 7.57044519,11.8888889 8,11.8888889 L8,11.8888889 L8.10616895,11.8817679 C8.4876902,11.8301153 8.77777778,11.5037448 8.77777778,11.1088327 L8.77777778,11.1088327 L8.77777778,7.22450059 C8.77777778,6.80166965 8.42955481,6.44444444 8,6.44444444 L8,6.44444444 Z M8,4.11111111 C7.57044519,4.11111111 7.22222222,4.45933408 7.22222222,4.88888889 C7.22222222,5.31844369 7.57044519,5.66666667 8,5.66666667 C8.42955481,5.66666667 8.77777778,5.31844369 8.77777778,4.88888889 C8.77777778,4.45933408 8.42955481,4.11111111 8,4.11111111 Z",
  id: "Combined-Shape",
  fill: "#3683FF"
}))))));

const IconComponent$2 = props => /*#__PURE__*/React.createElement(Icon, Object.assign({
  component: Svg$2
}, props));

const Time = () => {
  const [visible, setVisible] = useState(false);
  const columns = [{
    title: "关联事项",
    dataIndex: "itemType",
    key: "name",
    render: text => {
      var _res$;

      const res = itemTypeData && itemTypeData.filter(ele => {
        return ele.value === text;
      });
      return ((_res$ = res[0]) === null || _res$ === void 0 ? void 0 : _res$.label) || React.createElement(Tooltip$1, {
        title: "\u6CA1\u6709\u914D\u7F6E\u7684\u5361\u7247\u7C7B\u578B\u5C06\u4F7F\u7528\u9ED8\u8BA4\u914D\u7F6E"
      }, "\u9ED8\u8BA4 \u00A0", React.createElement(QuestionCircleOutlined, null));
    }
  }, {
    title: "操作",
    key: "action",
    width: 120,
    render: (_text, record, index) => React.createElement(Space, null, React.createElement("a", {
      type: "link",
      onClick: () => editTime(index)
    }, "\u914D\u7F6E"), !(record !== null && record !== void 0 && record.isDefault) && React.createElement("a", {
      type: "link",
      onClick: () => del(index)
    }, "\u5220\u9664"))
  }];
  const {
    configHandle,
    itemTypeData
  } = useContext(ConfigHandleContext);
  const {
    ganttConfig
  } = useContext(GanttConfigContext);
  const [currentItem, setCurrentItem] = useState({});
  const [index, setIndex] = useState(0);
  const timeList = useMemo(() => {
    var _ganttConfig$time;

    return ganttConfig !== null && ganttConfig !== void 0 && (_ganttConfig$time = ganttConfig.time) !== null && _ganttConfig$time !== void 0 && _ganttConfig$time.length ? ganttConfig === null || ganttConfig === void 0 ? void 0 : ganttConfig.time : [{
      isDefault: true
    }];
  }, [ganttConfig === null || ganttConfig === void 0 ? void 0 : ganttConfig.time]);
  const canAddConfig = useMemo(() => {
    var _timeList$, _timeList$2;

    return (timeList === null || timeList === void 0 ? void 0 : (_timeList$ = timeList[0]) === null || _timeList$ === void 0 ? void 0 : _timeList$.startDate) && (timeList === null || timeList === void 0 ? void 0 : (_timeList$2 = timeList[0]) === null || _timeList$2 === void 0 ? void 0 : _timeList$2.endDate);
  }, [timeList]);
  const handleCancel = useCallback(() => {
    setVisible(false);
  }, []);

  const handleOk = async values => {
    let newTimeList;

    if (Object.keys(currentItem).length) {
      newTimeList = [...timeList];

      if (currentItem !== null && currentItem !== void 0 && currentItem.isDefault) {
        values.isDefault = currentItem === null || currentItem === void 0 ? void 0 : currentItem.isDefault;
      }

      newTimeList[index] = values;
    } else {
      newTimeList = [...timeList, values];
    }

    setVisible(false);
    configHandle({ ...ganttConfig,
      time: newTimeList
    });
  };

  const addTime = useCallback(() => {
    setVisible(true);
    setCurrentItem({});
  }, []);
  const editTime = useCallback(index => {
    setIndex(index);
    setCurrentItem(timeList[index]);
    setVisible(true);
  }, [timeList]);

  const del = index => {
    Modal.confirm({
      title: "删除该配置",
      content: "删除后无法恢复。您确定删除吗？",
      okText: "确认",
      cancelText: "取消",
      onOk: () => delConfig(index)
    });
  };

  const delConfig = index => {
    const newTimeList = [...timeList];
    newTimeList.splice(index, 1);
    configHandle({ ...ganttConfig,
      time: newTimeList
    });
  };

  return React.createElement("div", null, React.createElement(ItemModal, {
    visible: visible,
    handleCancel: handleCancel,
    handleOk: handleOk,
    currentItem: currentItem,
    timeList: timeList
  }), React.createElement("div", {
    className: `${styles$a.timeTips}`
  }, React.createElement("em", null, React.createElement(IconComponent$2, {
    style: {
      color: "red"
    }
  })), "\u4E3A\u4E86\u8BA9\u7518\u7279\u56FE\u6B63\u786E\u663E\u793A\uFF0C\u60A8\u9700\u8981\u8BBE\u7F6E\u7518\u7279\u56FE\u4E2D\u65F6\u95F4\u533A\u5757\u7684\u8D77\u6B62\u65F6\u95F4\u5BF9\u5E94\u4E8B\u9879\u7684\u54EA\u4E2A\u65F6\u95F4\u5B57\u6BB5"), React.createElement(Table, {
    columns: columns,
    dataSource: timeList,
    pagination: false,
    className: styles$a.timeConfigTable,
    rowKey: columns => {
      return columns.itemType || "default";
    }
  }), React.createElement("div", {
    className: styles$a.timeConfigAddBtn
  }, React.createElement(Button, {
    icon: React.createElement(PlusOutlined, null),
    type: "link",
    onClick: addTime,
    disabled: !canAddConfig
  }, "\u65B0\u589E\u914D\u7F6E")));
};

const {
  confirm
} = Modal;

const OtherConfig = () => {
  const [checked, setChecked] = useState(false);
  const {
    ganttConfig
  } = useContext(GanttConfigContext);
  const {
    configHandle
  } = useContext(ConfigHandleContext);
  const otherConfig = useMemo(() => ganttConfig === null || ganttConfig === void 0 ? void 0 : ganttConfig.otherConfig, [ganttConfig === null || ganttConfig === void 0 ? void 0 : ganttConfig.otherConfig]);
  useEffect(() => {
    setChecked(otherConfig === null || otherConfig === void 0 ? void 0 : otherConfig.autoPatch);
  }, [otherConfig === null || otherConfig === void 0 ? void 0 : otherConfig.autoPatch]);

  const onChange = value => {
    if (!value) {
      setChecked(value);
      configHandle({ ...ganttConfig,
        otherConfig: { ...ganttConfig.otherConfig,
          ...{
            autoPatch: value
          }
        }
      });
      return;
    }

    confirm({
      title: "自动编排",
      okText: "确定",
      cancelText: "取消",
      content: "开启自动编排时，将按当前的事项关系自动调整所有事项的时间。确认开启？",

      onOk() {
        setChecked(value);
        configHandle({ ...ganttConfig,
          otherConfig: { ...ganttConfig.otherConfig,
            ...{
              autoPatch: value
            }
          }
        });
      },

      onCancel() {
        setChecked(false);
      }

    });
  };

  return React.createElement("div", {
    className: styles$a.otherConfig
  }, React.createElement("div", null, "\u81EA\u52A8\u7F16\u6392", React.createElement("span", {
    className: styles$a.question
  }, React.createElement(Tooltip$1, {
    title: "\u6839\u636E\u5361\u7247\u4E4B\u95F4\u7684\u5173\u7CFB\uFF0C\u81EA\u52A8\u8C03\u6574\u5361\u7247\u65F6\u95F4\uFF0C\u907F\u514D\u51FA\u73B0\u903B\u8F91\u9519\u8BEF"
  }, React.createElement(QuestionCircleOutlined, null)))), React.createElement("div", null, React.createElement(Switch, {
    onChange: onChange,
    checked: checked
  })));
};

const {
  TextArea
} = Input;
const AddEdit = ({
  visible,
  handleOk,
  handleCancel,
  currentBaseline
}) => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const {
    baselineList
  } = useContext(BaseLineContext);
  console.log(currentBaseline, "currentBaseline");
  const isEdit = useMemo(() => {
    return !!(currentBaseline !== null && currentBaseline !== void 0 && currentBaseline.objectId);
  }, [currentBaseline]);
  useEffect(() => {
    setModalVisible(visible);
  }, [visible]);
  useEffect(() => {
    form.setFieldsValue({
      name: currentBaseline !== null && currentBaseline !== void 0 && currentBaseline.name ? currentBaseline === null || currentBaseline === void 0 ? void 0 : currentBaseline.name : dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      description: currentBaseline === null || currentBaseline === void 0 ? void 0 : currentBaseline.description
    });
  }, [currentBaseline, form]);

  const onFinish = () => {};

  const confirmOk = () => {
    form.validateFields().then(async values => {
      setConfirmLoading(true);
      await handleOk(Object.assign(currentBaseline, values));
      setConfirmLoading(false);
    }).catch(info => {
      console.log("Validate Failed:", info);
    });
  };

  const nameValidator = ({}, value, callback) => {
    if (!value) {
      callback();
    } else {
      const findRepeat = baselineList === null || baselineList === void 0 ? void 0 : baselineList.filter(ele => ele.name === value);

      if (findRepeat.length && currentBaseline && currentBaseline.name !== value) {
        callback("该名称已存在");
      } else {
        callback();
      }
    }
  };

  return React.createElement(Modal, {
    title: `${isEdit ? "编辑" : "新建"}基线`,
    visible: modalVisible,
    onCancel: handleCancel,
    onOk: confirmOk,
    okText: "\u786E\u8BA4",
    cancelText: "\u53D6\u6D88",
    confirmLoading: confirmLoading
  }, React.createElement(Form, {
    form: form,
    name: "basic",
    labelCol: {
      span: 24
    },
    wrapperCol: {
      span: 24
    },
    layout: "vertical",
    onFinish: onFinish
  }, React.createElement(Form.Item, {
    label: "\u57FA\u7EBF\u540D\u79F0",
    name: "name",
    rules: [{
      required: true,
      message: "请输入基线名称"
    }, {
      validator: nameValidator
    }]
  }, React.createElement(Input, {
    placeholder: "\u8BF7\u8F93\u5165\u57FA\u7EBF\u540D\u79F0\uFF0C\u6700\u5927\u957F\u5EA632\u4E2A\u5B57\u7B26",
    maxLength: 32
  })), React.createElement(Form.Item, {
    label: "\u63CF\u8FF0",
    name: "description"
  }, React.createElement(TextArea, {
    placeholder: "\u8BF7\u8F93\u5165\u57FA\u7EBF\u63CF\u8FF0"
  }))));
};

const Svg$3 = () => /*#__PURE__*/React.createElement("svg", {
  width: "28px",
  height: "28px",
  viewBox: "0 0 28 28",
  version: "1.1",
  xmlns: "http://www.w3.org/2000/svg"
}, /*#__PURE__*/React.createElement("title", null, "\u7F16\u7EC4 13"), /*#__PURE__*/React.createElement("g", {
  id: "\u65B9\u6848",
  stroke: "none",
  "stroke-width": "1",
  fill: "none",
  "fill-rule": "evenodd"
}, /*#__PURE__*/React.createElement("g", {
  id: "#17-\u7518\u7279\u56FE\u914D\u7F6E",
  transform: "translate(-864.000000, -336.000000)"
}, /*#__PURE__*/React.createElement("g", {
  id: "\u7F16\u7EC4-12",
  transform: "translate(840.000000, 201.000000)"
}, /*#__PURE__*/React.createElement("g", {
  id: "\u57FA\u7EBF\u5907\u4EFD-2",
  transform: "translate(24.000000, 135.000000)"
}, /*#__PURE__*/React.createElement("g", {
  id: "\u7F16\u7EC4-13",
  transform: "translate(-0.000844, -0.000844)"
}, /*#__PURE__*/React.createElement("polygon", {
  id: "\u8DEF\u5F84",
  fill: "#0C62FF",
  points: "27.943 0 0 27.943 0.000844122713 0.000844122712"
}), /*#__PURE__*/React.createElement("g", {
  id: "\u52FE\u9009",
  transform: "translate(1.000844, 0.000844)",
  fill: "#FFFFFF"
}, /*#__PURE__*/React.createElement("path", {
  d: "M11.8295143,4.29289322 C12.2200386,3.90236893 12.8532036,3.90236893 13.2437279,4.29289322 C13.6042118,4.65337718 13.6319414,5.22060824 13.3269165,5.61289944 L13.2437279,5.70710678 L7.30919533,11.6416393 C6.76002054,12.1908141 5.89095813,12.2251375 5.30179739,11.7446096 L5.18787498,11.6416393 L2.29289322,8.74665756 C1.90236893,8.35613327 1.90236893,7.72296829 2.29289322,7.332444 C2.65337718,6.97196004 3.22060824,6.9442305 3.61289944,7.24925539 L3.70710678,7.332444 L6.248,9.873 L11.8295143,4.29289322 Z",
  id: "\u8DEF\u5F84-4"
}))))))));

const IconComponent$3 = props => /*#__PURE__*/React.createElement(Icon, Object.assign({
  component: Svg$3
}, props));

var styles$b = {"list":"_index__list__3s_ej","activeBaseline":"_index__activeBaseline__1G5xN","content":"_index__content__34gkh","name":"_index__name__3vW_9","time":"_index__time__1g8Mb","createTime":"_index__createTime__33-L9","handleIcon":"_index__handleIcon__VphrR","cursor":"_index__cursor__3VfsG","panel":"_index__panel__3B5gw","createBaseline":"_index__createBaseline__1k5ei","dot":"_index__dot__2Jsus","ml8":"_index__ml8__e5wsD","checkedIcon":"_index__checkedIcon__1UH6O"};

const BaseLine = () => {
  const {
    baseLineHandle,
    baselineList,
    setCurrentLog,
    currentLog,
    OverflowTooltip,
    setLogTasks
  } = useContext(BaseLineContext);

  const deleteBaseline = currentBaseline => {
    Modal.confirm({
      title: "删除基线",
      content: "删除的基线无法恢复，确认删除？",
      okText: "确认",
      cancelText: "取消",
      onOk: () => baseLineHandle(currentBaseline)
    });
  };

  const handleMenuClick = (type, e, currentBaseLine) => {
    const currentBaselineOmit = omit(currentBaseLine, ["createdAt", "updatedAt"]);
    setCurrentBaseline(currentBaselineOmit);
    e.stopPropagation();

    switch (type) {
      case "edit":
        setVisible(true);
        break;

      case "del":
        deleteBaseline(currentBaselineOmit);
        break;
    }
  };

  const [visible, setVisible] = useState(false);
  const [currentBaseline, setCurrentBaseline] = useState({});

  const addBaseline = () => {
    setVisible(true);
    setCurrentBaseline({});
  };

  const handleOk = useCallback(async value => {
    await baseLineHandle(value, value.objectId ? "edit" : "add");
    setVisible(false);
  }, [baseLineHandle]);

  const handleCancel = () => {
    setVisible(false);
  };

  const chooseLog = infor => {
    if ((currentLog === null || currentLog === void 0 ? void 0 : currentLog.objectId) === (infor === null || infor === void 0 ? void 0 : infor.objectId)) {
      setCurrentLog([]);
      setLogTasks([]);
    } else {
      setCurrentLog(infor);
    }
  };

  return React.createElement("div", {
    className: styles$b.panel
  }, React.createElement("div", {
    className: styles$b.createBaseline
  }, React.createElement(Button, {
    type: "dashed",
    icon: React.createElement(PlusOutlined, null),
    onClick: addBaseline,
    disabled: (baselineList === null || baselineList === void 0 ? void 0 : baselineList.length) >= 10
  }, `创建基线（${baselineList === null || baselineList === void 0 ? void 0 : baselineList.length}/10）`)), visible && React.createElement(AddEdit, {
    visible: visible,
    handleOk: handleOk,
    handleCancel: handleCancel,
    currentBaseline: currentBaseline
  }), React.createElement("ul", {
    className: styles$b.list
  }, baselineList.map(ele => {
    return React.createElement("li", {
      key: ele.objectId,
      className: currentLog && ele.objectId === currentLog.objectId ? styles$b.activeBaseline : undefined
    }, ele.objectId === (currentLog === null || currentLog === void 0 ? void 0 : currentLog.objectId) && React.createElement("div", {
      className: styles$b.checkedIcon
    }, React.createElement(IconComponent$3, null)), React.createElement("div", {
      className: `${styles$b.content} ${styles$b.cursor}`,
      onClick: () => chooseLog(ele)
    }, React.createElement("div", {
      className: styles$b.name
    }, OverflowTooltip(ele.name)), React.createElement("div", {
      className: styles$b.time
    }, React.createElement("div", {
      className: styles$b.createTime
    }, "\u521B\u5EFA\u4E8E\uFF1A", dayjs(new Date(ele.createdAt)).format(dayTimeFormat)), React.createElement("div", {
      className: styles$b.handleIcon
    }, React.createElement(EditOutlined, {
      onClick: e => handleMenuClick("edit", e, ele)
    }), React.createElement(DeleteOutlined, {
      onClick: e => handleMenuClick("del", e, ele)
    })))));
  })));
};

const Display = ({
  ganttConfig,
  configHandle
}) => {
  var _currentValue$otherCo, _currentValue$otherCo2;

  const [currentValue, setCurrentValue] = useState({});
  useEffect(() => {
    setCurrentValue({ ...ganttConfig,
      isChanged: false
    });
  }, [ganttConfig]);

  const handleChange = (value, type) => {
    const newConfig = { ...currentValue,
      otherConfig: { ...currentValue.otherConfig,
        [type]: value
      },
      isChanged: true
    };
    setCurrentValue(newConfig);
    configHandle === null || configHandle === void 0 ? void 0 : configHandle(newConfig);
  };

  return React.createElement("div", {
    className: styles$a.displayPopover
  }, React.createElement(Row, {
    className: styles$a.displayRow
  }, React.createElement(Col, {
    span: 14
  }, "\u5173\u952E\u8DEF\u5F84"), React.createElement(Col, {
    span: 10,
    className: styles$a.textAlignR
  }, React.createElement(Switch, {
    onChange: checked => handleChange(checked, "pivotalPath"),
    checked: currentValue === null || currentValue === void 0 ? void 0 : (_currentValue$otherCo = currentValue.otherConfig) === null || _currentValue$otherCo === void 0 ? void 0 : _currentValue$otherCo.pivotalPath
  }))), React.createElement(Row, null, React.createElement(Col, {
    span: 14
  }, "\u903E\u671F\u7684\u4E8B\u9879"), React.createElement(Col, {
    span: 10,
    className: styles$a.textAlignR
  }, React.createElement(Switch, {
    onChange: checked => handleChange(checked, "overdue"),
    checked: currentValue === null || currentValue === void 0 ? void 0 : (_currentValue$otherCo2 = currentValue.otherConfig) === null || _currentValue$otherCo2 === void 0 ? void 0 : _currentValue$otherCo2.overdue
  }))));
};

const Svg$4 = () => /*#__PURE__*/React.createElement("svg", {
  width: "16px",
  height: "16px",
  viewBox: "0 0 16 16",
  version: "1.1",
  xmlns: "http://www.w3.org/2000/svg"
}, /*#__PURE__*/React.createElement("title", null, "\u5207\u7247"), /*#__PURE__*/React.createElement("g", {
  id: "\u65B9\u6848",
  stroke: "none",
  "stroke-width": "1",
  fill: "none",
  "fill-rule": "evenodd"
}, /*#__PURE__*/React.createElement("g", {
  id: "#6.\u8BE6\u60C5\u9875\u95F4\u8DDD\u6807\u6CE8",
  transform: "translate(-744.000000, -1064.000000)"
}, /*#__PURE__*/React.createElement("g", {
  id: "4.\u6570\u636E\u5C55\u793A/5.Collapse\u6298\u53E0\u9762\u677F/\u6807\u9898\u5907\u4EFD-3",
  transform: "translate(744.000000, 1060.000000)"
}, /*#__PURE__*/React.createElement("g", {
  id: "1.\u901A\u7528/2.\u56FE\u6807/2.\u586B\u5145/collapse-down",
  transform: "translate(0.000000, 4.000000)"
}, /*#__PURE__*/React.createElement("rect", {
  id: "\u77E9\u5F62",
  fill: "#FFFFFF",
  opacity: "0",
  x: "0",
  y: "0",
  width: "16",
  height: "16"
}), /*#__PURE__*/React.createElement("rect", {
  id: "\u77E9\u5F62",
  fill: "#F1F2F4",
  x: "0",
  y: "0",
  width: "16",
  height: "16",
  rx: "8"
}), /*#__PURE__*/React.createElement("path", {
  d: "M4.24726739,5.72183194 C3.9842442,5.96094393 3.9842442,6.35723789 4.24726739,6.59634988 L8.29726739,10.2781681 C8.54928757,10.5072773 8.95071243,10.5072773 9.20273261,10.2781681 L13.2527326,6.59634988 C13.5157558,6.35723789 13.5157558,5.96094393 13.2527326,5.72183194 L13.1636023,5.65394772 C12.9133514,5.4955512 12.5712853,5.51817927 12.3472674,5.72183194 L8.75,8.992 L5.15273261,5.72183194 C4.90071243,5.49272269 4.49928757,5.49272269 4.24726739,5.72183194 Z",
  id: "\u8DEF\u5F84",
  fill: "#213053",
  transform: "translate(8.750000, 8.000000) rotate(-90.000000) translate(-8.750000, -8.000000) "
}))))));

const IconComponent$4 = props => /*#__PURE__*/React.createElement(Icon, Object.assign({
  component: Svg$4
}, props));

const {
  Panel
} = Collapse;

const GanttConfig = ({
  toGantt,
  visible,
  currentPanel,
  configHandle,
  ganttConfig
}) => {
  const [activeKey, setActiveKey] = useState([]);
  useEffect(() => {
    if (currentPanel) {
      setActiveKey([currentPanel]);
    } else {
      setActiveKey([]);
    }
  }, [currentPanel]);

  const onChange = val => {
    if (isArray(val)) {
      setActiveKey([...val]);
    }
  };

  const genHeader = () => React.createElement("span", {
    className: styles$a.extraHeader
  }, React.createElement("span", {
    className: styles$a.title
  }, "\u57FA\u7EBF"), React.createElement("span", {
    className: styles$a.des
  }, "\uFF08\u70B9\u51FB\u57FA\u7EBF\u5361\u7247\u53EF\u9009\u62E9\u663E\u793A\u57FA\u7EBF\uFF09"));

  return React.createElement(Drawer, {
    title: "\u7518\u7279\u56FE\u8BBE\u7F6E",
    visible: visible,
    onClose: () => toGantt(),
    width: drawerWidth,
    getContainer: false,
    className: styles$a.settingsModalContainer,
    contentWrapperStyle: {
      maxWidth: "721px"
    },
    style: {
      position: "absolute"
    },
    maskClosable: false,
    mask: false
  }, React.createElement(Collapse, {
    activeKey: activeKey,
    onChange: onChange,
    expandIcon: ({
      isActive
    }) => React.createElement(IconComponent$4, {
      className: isActive ? styles$a.activeRotate : ""
    }),
    className: styles$a.collapse
  }, React.createElement(Panel, {
    header: genHeader(),
    key: "baseLine"
  }, React.createElement(BaseLine, null)), React.createElement(Panel, {
    header: "\u663E\u793A\u9879",
    key: "display"
  }, React.createElement(Display, {
    ganttConfig: ganttConfig,
    configHandle: configHandle
  })), React.createElement(Panel, {
    header: "\u65F6\u95F4\u5B57\u6BB5\u914D\u7F6E",
    key: "time"
  }, React.createElement(Time, null)), React.createElement(Panel, {
    header: "\u5176\u4ED6\u914D\u7F6E",
    key: "other"
  }, React.createElement(OtherConfig, null))));
};

var GanttConfig$1 = memo(GanttConfig);

const GuideModal = ({
  visible,
  toPanel,
  toCancel
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    setModalVisible(visible);
  }, [visible]);
  const toConfig = useCallback(() => {
    toPanel();
  }, [toPanel]);
  const handleCancel = useCallback(() => {
    toCancel();
  }, [toCancel]);
  return React.createElement(Modal, {
    closable: false,
    visible: modalVisible,
    footer: null,
    width: 300,
    className: "guide-modal",
    onCancel: handleCancel
  }, React.createElement("span", {
    className: styles$8.guideInfor
  }, "\u8FD8\u6CA1\u6709\u914D\u7F6E\u7518\u7279\u56FE\u4E2D\u5361\u7247\u7684\u65F6\u95F4\u5B57\u6BB5\uFF0C", React.createElement("span", {
    onClick: toConfig,
    className: styles$8.clickThis
  }, "\u70B9\u6B64"), "\u8FDB\u884C\u914D\u7F6E"));
};
var GuideModal$1 = memo(GuideModal);

const Svg$5 = () => /*#__PURE__*/React.createElement("svg", {
  width: "16px",
  height: "16px",
  viewBox: "0 0 16 16",
  version: "1.1"
}, /*#__PURE__*/React.createElement("title", null, "1.\u901A\u7528/2.Icon\u56FE\u6807/Line/Down"), /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("rect", {
  id: "path-1",
  x: "260",
  y: "226",
  width: "396",
  height: "611"
}), /*#__PURE__*/React.createElement("filter", {
  x: "-0.9%",
  y: "-0.9%",
  width: "102.8%",
  height: "101.8%",
  filterUnits: "objectBoundingBox",
  id: "filter-2"
}, /*#__PURE__*/React.createElement("feOffset", {
  dx: "2",
  dy: "0",
  in: "SourceAlpha",
  result: "shadowOffsetOuter1"
}), /*#__PURE__*/React.createElement("feGaussianBlur", {
  stdDeviation: "1.5",
  in: "shadowOffsetOuter1",
  result: "shadowBlurOuter1"
}), /*#__PURE__*/React.createElement("feColorMatrix", {
  values: "0 0 0 0 0.0352941176   0 0 0 0 0.117647059   0 0 0 0 0.258823529  0 0 0 0.162778628 0",
  type: "matrix",
  in: "shadowBlurOuter1",
  result: "shadowMatrixOuter1"
}), /*#__PURE__*/React.createElement("feOffset", {
  dx: "0",
  dy: "0",
  in: "SourceAlpha",
  result: "shadowOffsetOuter2"
}), /*#__PURE__*/React.createElement("feGaussianBlur", {
  stdDeviation: "0.5",
  in: "shadowOffsetOuter2",
  result: "shadowBlurOuter2"
}), /*#__PURE__*/React.createElement("feColorMatrix", {
  values: "0 0 0 0 0.0352941176   0 0 0 0 0.117647059   0 0 0 0 0.258823529  0 0 0 0.34099104 0",
  type: "matrix",
  in: "shadowBlurOuter2",
  result: "shadowMatrixOuter2"
}), /*#__PURE__*/React.createElement("feMerge", null, /*#__PURE__*/React.createElement("feMergeNode", {
  in: "shadowMatrixOuter1"
}), /*#__PURE__*/React.createElement("feMergeNode", {
  in: "shadowMatrixOuter2"
}))), /*#__PURE__*/React.createElement("filter", {
  "color-interpolation-filters": "auto",
  id: "filter-3"
}, /*#__PURE__*/React.createElement("feColorMatrix", {
  in: "SourceGraphic",
  type: "matrix",
  values: "0 0 0 0 0.180392 0 0 0 0 0.250980 0 0 0 0 0.368627 0 0 0 1.000000 0"
})), /*#__PURE__*/React.createElement("filter", {
  "color-interpolation-filters": "auto",
  id: "filter-4"
}, /*#__PURE__*/React.createElement("feColorMatrix", {
  in: "SourceGraphic",
  type: "matrix",
  values: "0 0 0 0 0.180392 0 0 0 0 0.250980 0 0 0 0 0.368627 0 0 0 1.000000 0"
}))), /*#__PURE__*/React.createElement("g", {
  id: "\u9875\u9762-1",
  stroke: "none",
  "stroke-width": "1",
  fill: "none",
  "fill-rule": "evenodd"
}, /*#__PURE__*/React.createElement("g", {
  id: "\u7518\u7279\u56FE-\u672A\u8BBE\u7F6E",
  transform: "translate(-648.000000, -515.000000)"
}, /*#__PURE__*/React.createElement("rect", {
  fill: "#FFFFFF",
  x: "0",
  y: "0",
  width: "1440",
  height: "900"
}), /*#__PURE__*/React.createElement("g", {
  id: "\u77E9\u5F62"
}, /*#__PURE__*/React.createElement("use", {
  fill: "black",
  "fill-opacity": "1",
  filter: "url(#filter-2)",
  id: "#path-1"
}), /*#__PURE__*/React.createElement("use", {
  fill: "#FFFFFF",
  "fill-rule": "evenodd",
  id: "#path-2"
})), /*#__PURE__*/React.createElement("g", {
  id: "\u6570\u636E\u914D\u7F6E",
  transform: "translate(260.000000, 486.000000)"
}), /*#__PURE__*/React.createElement("g", {
  id: "\u6570\u636E\u914D\u7F6E",
  transform: "translate(260.000000, 530.000000)"
}), /*#__PURE__*/React.createElement("rect", {
  id: "\u77E9\u5F62",
  stroke: "#ECEDF0",
  x: "260.5",
  y: "225.5",
  width: "1159",
  height: "612"
}), /*#__PURE__*/React.createElement("g", {
  id: "\u7F16\u7EC4-13",
  transform: "translate(640.000000, 507.000000)"
}, /*#__PURE__*/React.createElement("circle", {
  id: "\u692D\u5706\u5F62",
  stroke: "#ECEDF0",
  fill: "#FFFFFF",
  cx: "16",
  cy: "16",
  r: "15.5"
}), /*#__PURE__*/React.createElement("g", {
  id: "\u5C55\u5F00",
  transform: "translate(8.000000, 8.000000)",
  filter: "url(#filter-3)"
}, /*#__PURE__*/React.createElement("g", {
  transform: "translate(8.000000, 8.000000) rotate(90.000000) translate(-8.000000, -8.000000) "
}, /*#__PURE__*/React.createElement("rect", {
  id: "\u77E9\u5F62",
  fill: "#D8D8D8",
  opacity: "0",
  x: "0",
  y: "0",
  width: "16",
  height: "16"
}), /*#__PURE__*/React.createElement("path", {
  d: "M12.9757359,6.15975994 C13.2100505,5.94674669 13.5899495,5.94674669 13.8242641,6.15975994 C14.0585786,6.37277319 14.0585786,6.7181359 13.8242641,6.93114915 L8.42426407,11.8402401 C8.18994949,12.0532533 7.81005051,12.0532533 7.57573593,11.8402401 L2.17573593,6.93114915 C1.94142136,6.7181359 1.94142136,6.37277319 2.17573593,6.15975994 C2.41005051,5.94674669 2.78994949,5.94674669 3.02426407,6.15975994 L8,10.6831562 L12.9757359,6.15975994 Z",
  id: "Rectangle-2\u5907\u4EFD",
  fill: "#1E2A3D"
}))), /*#__PURE__*/React.createElement("g", {
  filter: "url(#filter-4)",
  id: "\u5C55\u5F00"
}, /*#__PURE__*/React.createElement("g", {
  transform: "translate(16.000000, 16.000000) rotate(90.000000) translate(-16.000000, -16.000000) translate(8.000000, 8.000000)"
}, /*#__PURE__*/React.createElement("rect", {
  id: "\u77E9\u5F62",
  fill: "#D8D8D8",
  opacity: "0",
  x: "0",
  y: "0",
  width: "16",
  height: "16"
}), /*#__PURE__*/React.createElement("path", {
  d: "M12.9757359,6.15975994 C13.2100505,5.94674669 13.5899495,5.94674669 13.8242641,6.15975994 C14.0585786,6.37277319 14.0585786,6.7181359 13.8242641,6.93114915 L8.42426407,11.8402401 C8.18994949,12.0532533 7.81005051,12.0532533 7.57573593,11.8402401 L2.17573593,6.93114915 C1.94142136,6.7181359 1.94142136,6.37277319 2.17573593,6.15975994 C2.41005051,5.94674669 2.78994949,5.94674669 3.02426407,6.15975994 L8,10.6831562 L12.9757359,6.15975994 Z",
  id: "Rectangle-2\u5907\u4EFD",
  fill: "#1E2A3D"
})))))));

const IconComponent$5 = props => /*#__PURE__*/React.createElement(Icon, Object.assign({
  component: Svg$5
}, props));

const getLocalStorageItem = (key, defalut = "") => {
  try {
    if (typeof window !== "undefined") {
      const item = localStorage.getItem(key);
      return item && JSON.parse(item) || defalut;
    }
  } catch (e) {
    return localStorage.getItem(key) || defalut;
  }
};
const setLocalStorageItem = (key, value) => {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    }

    return false;
  } catch (e) {
    console.error(e);
    return false;
  }
};
var utils = {
  getLocalStorageItem,
  setLocalStorageItem
};

const {
  TabPane
} = Tabs;

const DataMode = ({
  toToday,
  modeChange,
  todayX,
  svgContainerWidth,
  refScrollX
}) => {
  const handleChange = value => {
    modeChange(value);
  };

  const isShowToday = useMemo(() => {
    return refScrollX + svgContainerWidth - 20 < todayX || refScrollX > todayX - 20;
  }, [refScrollX, svgContainerWidth, todayX]);
  return React.createElement("div", {
    className: styles$8.viewMode
  }, isShowToday && React.createElement("span", {
    className: styles$8.todayBtn,
    onClick: toToday
  }, "\u4ECA\u5929"), React.createElement("div", {
    className: styles$8.dataMode
  }, React.createElement(Tabs, {
    defaultActiveKey: ViewMode.Day,
    tabPosition: "top",
    onChange: handleChange
  }, viewModeOptions.map(ele => React.createElement(TabPane, {
    tab: ele.label,
    key: ele.value
  })))));
};

const widthData = {
  [ViewMode.Month]: 300,
  [ViewMode.Week]: 210,
  [ViewMode.Year]: 240,
  [ViewMode.Quarter]: 180
};
const Gantt = ({
  tasks,
  baseLineLog,
  isUpdate,
  headerHeight: _headerHeight = 41,
  listCellWidth: _listCellWidth = "155px",
  listWidth: _listWidth = 496,
  listBottomHeight: _listBottomHeight = 48,
  rowHeight: _rowHeight = 41,
  locale: _locale = "zh-cn",
  barFill: _barFill = 60,
  barCornerRadius: _barCornerRadius = 4,
  barProgressColor: _barProgressColor = "#4B8BFF",
  barProgressSelectedColor: _barProgressSelectedColor = "#4B8BFF",
  barBackgroundColor: _barBackgroundColor = "#4B8BFF",
  barBackgroundSelectedColor: _barBackgroundSelectedColor = "#4B8BFF",
  projectProgressColor: _projectProgressColor = "#7db59a",
  projectProgressSelectedColor: _projectProgressSelectedColor = "#59a985",
  projectBackgroundColor: _projectBackgroundColor = "#fac465",
  projectBackgroundSelectedColor: _projectBackgroundSelectedColor = "#f7bb53",
  milestoneBackgroundColor: _milestoneBackgroundColor = "#f1c453",
  milestoneBackgroundSelectedColor: _milestoneBackgroundSelectedColor = "#f29e4c",
  handleWidth: _handleWidth = 2,
  timeStep: _timeStep = 300000,
  arrowColor: _arrowColor = "grey",
  fontFamily: _fontFamily = "Arial, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue",
  fontSize: _fontSize = "14px",
  arrowIndent: _arrowIndent = 20,
  todayColor: _todayColor = "#FFAB00",
  TooltipContent: _TooltipContent = StandardTooltipContent,
  onDateChange,
  onProgressChange,
  onDoubleClick,
  onDelete,
  onSelect,
  renderTaskListComponent,
  renderOverflowTooltip,
  renderUserAvatar,
  itemTypeData: _itemTypeData = [],
  configHandle,
  baseLineHandle,
  setCurrentLog,
  ganttConfig: _ganttConfig = {},
  itemLinks: _itemLinks = [],
  addConnection,
  delConnection,
  baselineList: _baselineList = [],
  currentLog,
  actionRef,
  workspaceId,
  getCustomFields,
  isConnect: _isConnect = true,
  isViewModeChange: _isViewModeChange = true,
  onMouseEvent,
  onClickEvent,
  configVisibleChange,
  tableQuerySelector: _tableQuerySelector = ".BaseTable__table-main .BaseTable__body"
}) => {
  var _taskGanttContainerRe2, _wrapperRef$current3, _wrapperRef$current4, _taskListRef$current, _tasks, _taskListRef$current2, _tasks2;

  const wrapperRef = useRef(null);
  const taskListRef = useRef(null);
  const onMouseEventRef = useRef(null);
  const taskGanttContainerRef = useRef({});
  const verticalScrollContainerRef = useRef(null);
  const horizontalScrollContainerRef = useRef(null);
  const [viewMode, setViewMode] = useState(ViewMode.Day);
  const [columnWidth, setColumnWidth] = useState(60);
  const [dateSetup, setDateSetup] = useState(() => {
    const [startDate, endDate] = ganttDateRange(viewMode);
    return {
      viewMode,
      dates: seedDates(startDate, endDate, viewMode)
    };
  });
  const CACHE_LIST_WIDTH_KEY = "gantt-cache-list-width";
  const cacheListWidth = utils.getLocalStorageItem(CACHE_LIST_WIDTH_KEY);
  const initListWidth = useMemo(() => {
    return cacheListWidth || _listWidth;
  }, [_listWidth, cacheListWidth]);
  const [taskHeight, setTaskHeight] = useState(_rowHeight * _barFill / 100);
  const [taskListWidth, setTaskListWidth] = useState(initListWidth);
  const [svgContainerWidth, setSvgContainerWidth] = useState(0);
  const [ganttHeight, setGanttHeight] = useState(0);
  const [svgContainerHeight, setSvgContainerHeight] = useState(ganttHeight);
  const [barTasks, setBarTasks] = useState([]);
  const [logTasks, setLogTasks] = useState([]);
  const [isTableScrollX, setIsTableScrollX] = useState(true);
  const [ganttEvent, setGanttEvent] = useState({
    action: ""
  });
  const [currentConnection, setCurrentConnection] = useState(null);
  const [selectedTask, setSelectedTask] = useState();
  const [failedTask, setFailedTask] = useState(null);
  const eleListTableBodyRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [scrollX, setScrollX] = useState(0);
  const refScrollY = useRef(0);
  const refScrollX = useRef(0);
  const [visible, setVisible] = useState(false);
  const [ignoreScrollEvent, setIgnoreScrollEvent] = useState(false);
  const [guideModalVisible, setGuideModalVisible] = useState(false);
  const [currentPanel, setCurrentPanel] = useState("");
  const dividerPositionRef = useRef({
    left: 0
  });
  const svgWidth = dateSetup.dates.length * columnWidth;
  const ganttFullHeight = barTasks.length * _rowHeight;
  const minWidth = 2;
  const paddingLeft = 38;
  useEffect(() => {
    const [startDate, endDate] = ganttDateRange(viewMode);
    const newDates = seedDates(startDate, endDate, viewMode);
    setDateSetup({
      dates: newDates,
      viewMode
    });
    setBarTasks(convertToBarTasks(tasks, newDates, columnWidth, _rowHeight, taskHeight, _barCornerRadius, _handleWidth, _barProgressColor, _barProgressSelectedColor, _barBackgroundColor, _barBackgroundSelectedColor, _projectProgressColor, _projectProgressSelectedColor, _projectBackgroundColor, _projectBackgroundSelectedColor, _milestoneBackgroundColor, _milestoneBackgroundSelectedColor, viewMode));
  }, [tasks, isUpdate, viewMode, _rowHeight, _barCornerRadius, columnWidth, taskHeight, _handleWidth, _barProgressColor, _barProgressSelectedColor, _barBackgroundColor, _barBackgroundSelectedColor, _projectProgressColor, _projectProgressSelectedColor, _projectBackgroundColor, _projectBackgroundSelectedColor, _milestoneBackgroundColor, _milestoneBackgroundSelectedColor]);
  useEffect(() => {
    const [startDate, endDate] = ganttDateRange(viewMode);
    const newDates = seedDates(startDate, endDate, viewMode);

    if (baseLineLog !== null && baseLineLog !== void 0 && baseLineLog.length) {
      setLogTasks(convertToBarTasks(tasks = baseLineLog, newDates, columnWidth, _rowHeight, taskHeight, _barCornerRadius, _handleWidth, _barProgressColor, _barProgressSelectedColor, _barBackgroundColor, _barBackgroundSelectedColor, _projectProgressColor, _projectProgressSelectedColor, _projectBackgroundColor, _projectBackgroundSelectedColor, _milestoneBackgroundColor, _milestoneBackgroundSelectedColor, viewMode));
    }
  }, [baseLineLog, isUpdate, viewMode, _rowHeight, _barCornerRadius, columnWidth, taskHeight, _handleWidth, _barProgressColor, _barProgressSelectedColor, _barBackgroundColor, _barBackgroundSelectedColor, _projectProgressColor, _projectProgressSelectedColor, _projectBackgroundColor, _projectBackgroundSelectedColor, _milestoneBackgroundColor, _milestoneBackgroundSelectedColor]);
  useEffect(() => {
    const {
      changedTask,
      action
    } = ganttEvent;

    if (changedTask) {
      onMouseEventRef.current = changedTask;

      if (action === "delete") {
        setGanttEvent({
          action: ""
        });
        setBarTasks(barTasks.filter(t => t.id !== changedTask.id));
      } else if (action === "move" || action === "end" || action === "start" || action === "progress") {
        const prevStateTask = barTasks.find(t => t.id === changedTask.id);

        if (prevStateTask && (prevStateTask.start.getTime() !== changedTask.start.getTime() || prevStateTask.end.getTime() !== changedTask.end.getTime() || prevStateTask.progress !== changedTask.progress)) {
          const newTaskList = barTasks.map(t => t.id === changedTask.id ? changedTask : t);
          setBarTasks(newTaskList);
        }
      } else if (action === "click") {
        onClickEvent === null || onClickEvent === void 0 ? void 0 : onClickEvent(action, changedTask);
      } else if (action === "mouseenter") {
        onMouseEvent === null || onMouseEvent === void 0 ? void 0 : onMouseEvent(action, changedTask);
      }
    } else if (onMouseEventRef.current) {
      onMouseEvent === null || onMouseEvent === void 0 ? void 0 : onMouseEvent(action, changedTask);
    }
  }, [ganttEvent, barTasks, onMouseEvent, onClickEvent]);
  useEffect(() => {
    if (failedTask) {
      setBarTasks(barTasks.map(t => t.id !== failedTask.id ? t : failedTask));
      setFailedTask(null);
    }
  }, [failedTask, barTasks]);
  useEffect(() => {
    const newTaskHeight = _rowHeight * _barFill / 100;

    if (newTaskHeight !== taskHeight) {
      setTaskHeight(newTaskHeight);
    }
  }, [_rowHeight, _barFill, taskHeight]);
  useEffect(() => {
    if (!_listCellWidth) {
      setTaskListWidth(0);
    }

    if (taskListRef.current) {
      setTaskListWidth(taskListRef.current.offsetWidth);
    }
  }, [taskListRef, _listCellWidth]);
  useEffect(() => {
    if (wrapperRef.current) {
      if (tasks.length) {
        setTaskListWidth(initListWidth);
      } else {
        var _wrapperRef$current;

        setTaskListWidth(wrapperRef === null || wrapperRef === void 0 ? void 0 : (_wrapperRef$current = wrapperRef.current) === null || _wrapperRef$current === void 0 ? void 0 : _wrapperRef$current.offsetWidth);
      }
    }
  }, [tasks.length, initListWidth]);
  useEffect(() => {
    if (wrapperRef.current) {
      setSvgContainerWidth(wrapperRef.current.offsetWidth - taskListWidth);
    }
  }, [wrapperRef, taskListWidth]);
  useEffect(() => {
    if (ganttHeight) {
      setSvgContainerHeight(ganttHeight + _headerHeight);
    } else {
      setSvgContainerHeight(tasks.length * _rowHeight + _headerHeight);
    }
  }, [ganttHeight, tasks, _headerHeight, _rowHeight]);
  useEffect(() => {
    var _taskGanttContainerRe;

    const ele = taskGanttContainerRef === null || taskGanttContainerRef === void 0 ? void 0 : (_taskGanttContainerRe = taskGanttContainerRef.current) === null || _taskGanttContainerRe === void 0 ? void 0 : _taskGanttContainerRe.horizontalContainerRef;

    if (ele) {
      setGanttHeight(ele.offsetHeight);
    }
  }, [taskGanttContainerRef === null || taskGanttContainerRef === void 0 ? void 0 : (_taskGanttContainerRe2 = taskGanttContainerRef.current) === null || _taskGanttContainerRe2 === void 0 ? void 0 : _taskGanttContainerRe2.horizontalContainerRef]);
  const setElementsScrollY = useCallback(() => {
    var _taskGanttContainerRe3;

    eleListTableBodyRef.current && (eleListTableBodyRef.current.scrollTop = refScrollY.current);
    (taskGanttContainerRef === null || taskGanttContainerRef === void 0 ? void 0 : (_taskGanttContainerRe3 = taskGanttContainerRef.current) === null || _taskGanttContainerRe3 === void 0 ? void 0 : _taskGanttContainerRe3.horizontalContainerRef) && (taskGanttContainerRef.current.horizontalContainerRef.scrollTop = refScrollY.current);
    (verticalScrollContainerRef === null || verticalScrollContainerRef === void 0 ? void 0 : verticalScrollContainerRef.current) && (verticalScrollContainerRef.current.scrollTop = refScrollY.current);
  }, []);
  const setElementsScrollX = useCallback(() => {
    var _taskGanttContainerRe4;

    (taskGanttContainerRef === null || taskGanttContainerRef === void 0 ? void 0 : (_taskGanttContainerRe4 = taskGanttContainerRef.current) === null || _taskGanttContainerRe4 === void 0 ? void 0 : _taskGanttContainerRe4.verticalGanttContainerRef) && (taskGanttContainerRef.current.verticalGanttContainerRef.scrollLeft = refScrollX.current);
    (horizontalScrollContainerRef === null || horizontalScrollContainerRef === void 0 ? void 0 : horizontalScrollContainerRef.current) && (horizontalScrollContainerRef.current.scrollLeft = refScrollX.current);
  }, []);
  const handleWheel = useCallback(event => {
    if (Math.abs(event.deltaX) >= Math.abs(event.deltaY)) {
      if (event.deltaX !== 0) {
        const path = event.path || [];
        const filterData = path.filter(ele => ele.id === "ganttTaskListWrapper");

        if (filterData !== null && filterData !== void 0 && filterData.length) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        const scrollX = refScrollX.current;
        const scrollMove = event.deltaX;
        let newScrollX = scrollX + scrollMove;

        if (newScrollX < 0) {
          newScrollX = 0;
        } else if (newScrollX > svgWidth) {
          newScrollX = svgWidth;
        }

        refScrollX.current = newScrollX;
        setElementsScrollX();
        setScrollX(refScrollX.current);
      }
    } else {
      event.preventDefault();
      event.stopPropagation();

      if (event.deltaY !== 0) {
        var _eleListTableBodyRef$, _eleListTableBodyRef$2;

        const isScroll = (eleListTableBodyRef === null || eleListTableBodyRef === void 0 ? void 0 : (_eleListTableBodyRef$ = eleListTableBodyRef.current) === null || _eleListTableBodyRef$ === void 0 ? void 0 : _eleListTableBodyRef$.clientWidth) !== (eleListTableBodyRef === null || eleListTableBodyRef === void 0 ? void 0 : (_eleListTableBodyRef$2 = eleListTableBodyRef.current) === null || _eleListTableBodyRef$2 === void 0 ? void 0 : _eleListTableBodyRef$2.scrollWidth);
        setIsTableScrollX(isScroll);
        const max = ganttFullHeight - ganttHeight;
        const scrollY = refScrollY.current;
        let newScrollY = scrollY + event.deltaY;

        if (newScrollY < 0) {
          newScrollY = 0;
        } else if (newScrollY > max) {
          if (isTableScrollX) {
            newScrollY = max + scrollBarHeight;
          } else {
            newScrollY = max;
          }
        }

        refScrollY.current = newScrollY;
        setElementsScrollY();
        setScrollY(refScrollY.current);
      }
    }

    setIgnoreScrollEvent(true);
  }, [ganttFullHeight, ganttHeight, setElementsScrollX, setElementsScrollY, svgWidth, isTableScrollX]);
  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.addEventListener("wheel", handleWheel, {
        passive: false
      });
    }

    return () => {
      if (wrapperRef.current) {
        var _wrapperRef$current2;

        wrapperRef === null || wrapperRef === void 0 ? void 0 : (_wrapperRef$current2 = wrapperRef.current) === null || _wrapperRef$current2 === void 0 ? void 0 : _wrapperRef$current2.removeEventListener("wheel", handleWheel);
      }
    };
  }, [handleWheel]);
  const handleScrollY = useCallback(event => {
    const scrollY = refScrollY.current;

    if (scrollY !== event.currentTarget.scrollTop && !ignoreScrollEvent) {
      refScrollY.current = event.currentTarget.scrollTop;
      setElementsScrollY();
      setScrollY(refScrollY.current);
    }

    setIgnoreScrollEvent(false);
    setCurrentConnection(null);
  }, [ignoreScrollEvent, setElementsScrollY]);
  const handleScrollX = useCallback(event => {
    const scrollX = refScrollX.current;

    if (scrollX !== event.currentTarget.scrollLeft && !ignoreScrollEvent) {
      refScrollX.current = event.currentTarget.scrollLeft;
      setElementsScrollX();
      setScrollX(refScrollX.current);
    }

    setIgnoreScrollEvent(false);
    setCurrentConnection(null);
  }, [ignoreScrollEvent, setElementsScrollX]);
  const handleKeyDown = useCallback(event => {
    if (["Down", "ArrowDown", "Up", "ArrowUp", "Left", "ArrowLeft", "Right", "ArrowRight"].includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();
      const scrollY = refScrollY.current;
      const scrollX = refScrollX.current;
      let newScrollY = scrollY;
      let newScrollX = scrollX;
      let isX = true;

      switch (event.key) {
        case "Down":
        case "ArrowDown":
          newScrollY += _rowHeight;
          isX = false;
          break;

        case "Up":
        case "ArrowUp":
          newScrollY -= _rowHeight;
          isX = false;
          break;

        case "Left":
        case "ArrowLeft":
          newScrollX -= columnWidth;
          break;

        case "Right":
        case "ArrowRight":
          newScrollX += columnWidth;
          break;
      }

      if (isX) {
        if (newScrollX < 0) {
          newScrollX = 0;
        } else if (newScrollX > svgWidth) {
          newScrollX = svgWidth;
        }

        refScrollX.current = newScrollX;
        setElementsScrollX();
        setScrollX(refScrollX.current);
      } else {
        if (newScrollY < 0) {
          newScrollY = 0;
        } else if (newScrollY > ganttFullHeight - ganttHeight) {
          newScrollY = ganttFullHeight - ganttHeight;
        }

        refScrollY.current = newScrollY;
        setElementsScrollY();
        setScrollY(refScrollY.current);
      }

      setIgnoreScrollEvent(true);
    }
  }, [columnWidth, ganttFullHeight, ganttHeight, _rowHeight, setElementsScrollX, setElementsScrollY, svgWidth]);
  const handleSelectedTask = useCallback(taskId => {
    const newSelectedTask = barTasks.find(t => t.id === taskId);
    const oldSelectedTask = barTasks.find(t => !!selectedTask && t.id === selectedTask.id);

    if (onSelect) {
      if (oldSelectedTask) {
        onSelect(oldSelectedTask, false);
      }

      if (newSelectedTask) {
        onSelect(newSelectedTask, true);
      }
    }

    setSelectedTask(newSelectedTask);
  }, [barTasks, onSelect, selectedTask]);
  const boundLeft = ((_wrapperRef$current3 = wrapperRef.current) === null || _wrapperRef$current3 === void 0 ? void 0 : _wrapperRef$current3.getBoundingClientRect().left) || 0;
  const boundTop = ((_wrapperRef$current4 = wrapperRef.current) === null || _wrapperRef$current4 === void 0 ? void 0 : _wrapperRef$current4.getBoundingClientRect().top) || 0;
  const offsetLeft = ((_taskListRef$current = taskListRef.current) === null || _taskListRef$current === void 0 ? void 0 : _taskListRef$current.clientWidth) || 0;
  const gridProps = useMemo(() => {
    return {
      columnWidth,
      svgWidth,
      tasks: tasks,
      rowHeight: _rowHeight,
      dates: dateSetup.dates,
      todayColor: _todayColor,
      scrollX,
      offsetLeft: boundLeft + offsetLeft,
      onDateChange
    };
  }, [boundLeft, columnWidth, dateSetup.dates, offsetLeft, onDateChange, _rowHeight, scrollX, svgWidth, tasks, _todayColor]);
  const calendarProps = useMemo(() => {
    return {
      dateSetup,
      locale: _locale,
      viewMode,
      headerHeight: _headerHeight,
      columnWidth,
      fontFamily: _fontFamily,
      fontSize: _fontSize
    };
  }, [columnWidth, dateSetup, _fontFamily, _fontSize, _headerHeight, _locale, viewMode]);
  const barProps = useMemo(() => {
    return {
      tasks: barTasks,
      logTasks: logTasks,
      dates: dateSetup.dates,
      ganttEvent,
      selectedTask,
      rowHeight: _rowHeight,
      taskHeight,
      columnWidth,
      arrowColor: _arrowColor,
      timeStep: _timeStep,
      fontFamily: _fontFamily,
      fontSize: _fontSize,
      arrowIndent: _arrowIndent,
      svgWidth,
      setGanttEvent,
      setFailedTask,
      setSelectedTask: handleSelectedTask,
      onDateChange,
      onProgressChange,
      onDoubleClick,
      onDelete,
      delConnection,
      addConnection,
      itemLinks: _itemLinks,
      isConnect: _isConnect,
      setCurrentConnection,
      currentConnection
    };
  }, [barTasks, logTasks, dateSetup.dates, ganttEvent, selectedTask, _rowHeight, taskHeight, columnWidth, _arrowColor, _timeStep, _fontFamily, _fontSize, _arrowIndent, svgWidth, setGanttEvent, setFailedTask, onDateChange, onProgressChange, onDoubleClick, onDelete, delConnection, addConnection, _itemLinks, handleSelectedTask, _isConnect, currentConnection]);
  const TaskListComponent = useMemo(() => {
    if (typeof renderTaskListComponent === "function") {
      return renderTaskListComponent();
    }

    return null;
  }, [renderTaskListComponent]);
  const isHiddenShowTooltip = useMemo(() => {
    return ["move", "start", "end", "progress"].includes(ganttEvent.action);
  }, [ganttEvent]);
  useEffect(() => {
    if (TaskListComponent) {
      setTimeout(() => {
        eleListTableBodyRef.current = document.querySelector(_tableQuerySelector);
      });
    }
  }, [TaskListComponent, _tableQuerySelector]);
  const todayX = useMemo(() => {
    const now = new Date();
    let tickX = 0;
    let newTickX = 0;

    for (let i = 0; i < dateSetup.dates.length; i++) {
      const date = dateSetup.dates[i];

      if (i + 1 !== dateSetup.dates.length && date.getTime() < now.getTime() && dateSetup.dates[i + 1].getTime() >= now.getTime() || i !== 0 && i + 1 === dateSetup.dates.length && date.getTime() < now.getTime() && addToDate(date, date.getTime() - dateSetup.dates[i - 1].getTime(), "millisecond").getTime() >= now.getTime()) {
        const currentStamp = new Date(new Date().toLocaleDateString()).getTime();
        const currentMinus = (currentStamp + 86400000 - dateSetup.dates[i].getTime()) / 86400000;
        const totalMinus = (dateSetup.dates[i + 1].getTime() - dateSetup.dates[i].getTime()) / 86400000;
        newTickX = tickX + columnWidth * (currentMinus / totalMinus) - columnWidth / totalMinus / 2;
      }

      tickX += columnWidth;
    }

    return newTickX;
  }, [columnWidth, dateSetup.dates]);
  const toToday = useCallback(() => {
    refScrollX.current = todayX - svgContainerWidth / 2;
    setElementsScrollX();
    setScrollX(refScrollX.current);
  }, [setElementsScrollX, svgContainerWidth, todayX]);
  useEffect(() => {
    toToday();
  }, [toToday]);
  const toConfig = useCallback(() => {
    setVisible(true);
    configVisibleChange === null || configVisibleChange === void 0 ? void 0 : configVisibleChange(true);
  }, [configVisibleChange]);
  const toGantt = useCallback(() => {
    setVisible(false);
    configVisibleChange === null || configVisibleChange === void 0 ? void 0 : configVisibleChange(false);
  }, [configVisibleChange]);
  const modeChange = useCallback(val => {
    setViewMode(val);
    setColumnWidth(widthData[val] || 60);
  }, []);
  const handleDividerMouseDown = useCallback(event => {
    const handleMouseMove = event => {
      const distance = event.clientX - dividerPositionRef.current.left;
      const minWidth = 220;
      const width = taskListWidth + distance > minWidth ? taskListWidth + distance : minWidth;
      setTaskListWidth(width);
      utils.setLocalStorageItem(CACHE_LIST_WIDTH_KEY, width);
    };

    const handleMouseUp = () => {
      var _eleListTableBodyRef$3, _eleListTableBodyRef$4;

      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      const isScroll = (eleListTableBodyRef === null || eleListTableBodyRef === void 0 ? void 0 : (_eleListTableBodyRef$3 = eleListTableBodyRef.current) === null || _eleListTableBodyRef$3 === void 0 ? void 0 : _eleListTableBodyRef$3.clientWidth) !== (eleListTableBodyRef === null || eleListTableBodyRef === void 0 ? void 0 : (_eleListTableBodyRef$4 = eleListTableBodyRef.current) === null || _eleListTableBodyRef$4 === void 0 ? void 0 : _eleListTableBodyRef$4.scrollWidth);
      setIsTableScrollX(isScroll);
    };

    dividerPositionRef.current.left = event.clientX;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }, [taskListWidth]);
  const handleDividerClick = useCallback(event => {
    let width;

    if (taskListWidth > minWidth) {
      dividerPositionRef.current.left = taskListWidth;
      width = minWidth;
    } else {
      width = dividerPositionRef.current.left || _listWidth;
    }

    setTaskListWidth(width);
    utils.setLocalStorageItem(CACHE_LIST_WIDTH_KEY, width);
    event.stopPropagation();
  }, [_listWidth, taskListWidth]);

  const baselineExit = () => {
    setCurrentLog === null || setCurrentLog === void 0 ? void 0 : setCurrentLog({});
    setLogTasks([]);
  };

  const toPanel = useCallback(() => {
    setGuideModalVisible(false);
    toConfig();
  }, [toConfig]);
  React.useImperativeHandle(actionRef, () => ({
    openGuide(type) {
      setCurrentPanel(type);
      setGuideModalVisible(true);
    },

    toPanel: toPanel
  }));
  const panelCanel = useCallback(() => {
    setGuideModalVisible(false);
  }, []);
  const OverflowTooltip = useCallback(value => {
    if (typeof renderOverflowTooltip === "function") {
      return renderOverflowTooltip(value);
    }

    return React.createElement(React.Fragment, null);
  }, [renderOverflowTooltip]);
  return React.createElement("div", {
    className: styles$8.box
  }, React.createElement(GuideModal$1, {
    visible: guideModalVisible,
    toPanel: toPanel,
    toCancel: panelCanel
  }), React.createElement(GanttConfigContext.Provider, {
    value: {
      ganttConfig: _ganttConfig
    }
  }, React.createElement(ConfigHandleContext.Provider, {
    value: {
      configHandle,
      itemTypeData: _itemTypeData,
      workspaceId,
      getCustomFields
    }
  }, React.createElement(BaseLineContext.Provider, {
    value: {
      baseLineHandle,
      baselineList: _baselineList,
      setCurrentLog,
      setLogTasks,
      currentLog,
      OverflowTooltip
    }
  }, React.createElement(GanttConfig$1, {
    toGantt: toGantt,
    visible: visible,
    currentPanel: currentPanel,
    configHandle: configHandle,
    ganttConfig: _ganttConfig
  }))), React.createElement("div", {
    className: styles$8.wrapper,
    onKeyDown: handleKeyDown,
    tabIndex: 0,
    ref: wrapperRef
  }, (currentLog === null || currentLog === void 0 ? void 0 : currentLog.name) && React.createElement("div", {
    className: styles$8.choosedBaselIne
  }, React.createElement("span", {
    className: styles$8.loaded
  }, OverflowTooltip(`已加载：${currentLog === null || currentLog === void 0 ? void 0 : currentLog.name}`)), React.createElement(Button, {
    size: "small",
    onClick: baselineExit
  }, "\u9000\u51FA")), _listCellWidth && TaskListComponent && React.createElement("div", {
    ref: taskListRef,
    className: styles$8.taskListWrapper,
    id: "ganttTaskListWrapper",
    style: {
      width: `${taskListWidth}px`,
      visibility: (_tasks = tasks) !== null && _tasks !== void 0 && _tasks.length ? "visible" : "hidden"
    }
  }, TaskListComponent), tasks.length > 0 && React.createElement(TaskGantt, {
    ref: taskGanttContainerRef,
    gridProps: gridProps,
    calendarProps: calendarProps,
    barProps: barProps,
    ganttHeight: ganttHeight,
    scrollX: scrollX,
    onScroll: handleScrollX,
    listBottomHeight: _listBottomHeight,
    taskListHeight: taskListRef === null || taskListRef === void 0 ? void 0 : (_taskListRef$current2 = taskListRef.current) === null || _taskListRef$current2 === void 0 ? void 0 : _taskListRef$current2.offsetHeight,
    headerHeight: _headerHeight
  }), React.createElement("div", {
    className: taskListWidth <= minWidth ? `${styles$8.dividerWrapper} ${styles$8.reverse}` : styles$8.dividerWrapper,
    style: {
      left: `${taskListWidth - minWidth > 0 ? taskListWidth + paddingLeft : paddingLeft}px`,
      visibility: (_tasks2 = tasks) !== null && _tasks2 !== void 0 && _tasks2.length ? "visible" : "hidden",
      height: `calc(100% - ${_listBottomHeight}px)`
    }
  }, React.createElement("div", {
    className: styles$8.dividerContainer,
    style: {
      height: `calc(100% - ${_headerHeight}px)`,
      top: `${_headerHeight}px`
    }
  }, React.createElement("hr", {
    onMouseDown: taskListWidth <= minWidth ? undefined : handleDividerMouseDown
  }), React.createElement("hr", {
    className: styles$8.maskLine
  }), React.createElement("hr", {
    className: styles$8.maskLineTop
  }), React.createElement("span", {
    className: styles$8.dividerIconWarpper,
    onMouseDown: e => e.stopPropagation(),
    onClick: handleDividerClick
  }, React.createElement(IconComponent$5, null)))), _isViewModeChange && React.createElement(DataMode, {
    toToday: toToday,
    modeChange: modeChange,
    todayX: todayX,
    svgContainerWidth: svgContainerWidth,
    refScrollX: refScrollX.current
  }), ganttEvent.changedTask && !isHiddenShowTooltip && React.createElement(Tooltip, {
    arrowIndent: _arrowIndent,
    rowHeight: _rowHeight,
    svgContainerHeight: svgContainerHeight,
    svgContainerWidth: svgContainerWidth,
    fontFamily: _fontFamily,
    fontSize: _fontSize,
    scrollX: scrollX,
    scrollY: scrollY,
    task: ganttEvent.changedTask,
    headerHeight: _headerHeight,
    taskListWidth: taskListWidth,
    TooltipContent: _TooltipContent,
    renderUserAvatar: renderUserAvatar
  }), currentConnection && React.createElement(DeleteTooltip, {
    tasks: tasks,
    taskListWidth: taskListWidth,
    currentConnection: currentConnection,
    boundTop: boundTop,
    itemLinks: _itemLinks,
    delConnection: delConnection,
    setCurrentConnection: setCurrentConnection,
    svgContainerHeight: svgContainerHeight
  }), tasks.length > 0 && React.createElement(VerticalScroll, {
    ref: verticalScrollContainerRef,
    ganttFullHeight: ganttFullHeight,
    ganttHeight: ganttHeight,
    headerHeight: _headerHeight,
    listBottomHeight: _listBottomHeight,
    onScroll: handleScrollY
  }), tasks.length > 0 && React.createElement(HorizontalScroll, {
    ref: horizontalScrollContainerRef,
    listBottomHeight: isTableScrollX ? _listBottomHeight : _listBottomHeight - scrollBarHeight,
    svgWidth: svgWidth,
    taskListWidth: taskListWidth,
    onScroll: handleScrollX
  }))));
};

export { Gantt, ViewMode };
//# sourceMappingURL=index.modern.js.map
