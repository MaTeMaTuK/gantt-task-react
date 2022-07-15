import React, { memo, useRef, useState, useMemo, useEffect, forwardRef, createContext, useContext, useCallback, useImperativeHandle } from 'react';
import dayjs from 'dayjs';
import Icon, { PlusOutlined, QuestionCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Tooltip as Tooltip$1, message, Form, Modal, Select, Table, Button, Space, Switch, Input, Row, Col, Drawer, Collapse, Tabs } from 'antd';
import weekday from 'dayjs/plugin/weekday';
import { filter, isEqual, find, omit, isArray } from 'lodash';

var _DateDeltaInit;

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

var viewModeOptions = [{
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
var DateDeltaInit = (_DateDeltaInit = {}, _DateDeltaInit[ViewMode.Month] = {
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
}, _DateDeltaInit[ViewMode.Year] = {
  common: 365 * 24 * 3600 * 1000,
  leap: 366 * 24 * 3600 * 1000
}, _DateDeltaInit[ViewMode.Quarter] = {
  1: (31 + 28 + 31) * 24 * 3600 * 1000,
  2: (30 + 31 + 30) * 24 * 3600 * 1000,
  3: (31 + 31 + 30) * 24 * 3600 * 1000,
  4: (30 + 30 + 31) * 24 * 3600 * 1000
}, _DateDeltaInit.LeapMounth = 29 * 24 * 3600 * 1000, _DateDeltaInit.LeapQuarter = (31 + 29 + 31) * 24 * 3600 * 1000, _DateDeltaInit);

var intlDTCache = {};

var getCachedDateTimeFormat = function getCachedDateTimeFormat(locString, opts) {
  if (opts === void 0) {
    opts = {};
  }

  var key = JSON.stringify([locString, opts]);
  var dtf = intlDTCache[key];

  if (!dtf) {
    dtf = new Intl.DateTimeFormat(locString, opts);
    intlDTCache[key] = dtf;
  }

  return dtf;
};

var addToDate = function addToDate(date, quantity, scale) {
  var newDate = new Date(date.getFullYear() + (scale === "year" ? quantity : 0), date.getMonth() + (scale === "month" ? quantity : 0), date.getDate() + (scale === "day" ? quantity : 0), date.getHours() + (scale === "hour" ? quantity : 0), date.getMinutes() + (scale === "minute" ? quantity : 0), date.getSeconds() + (scale === "second" ? quantity : 0), date.getMilliseconds() + (scale === "millisecond" ? quantity : 0));
  return newDate;
};
var startOfDate = function startOfDate(date, scale) {
  var scores = ["millisecond", "second", "minute", "hour", "day", "month", "year"];

  var shouldReset = function shouldReset(_scale) {
    var maxScore = scores.indexOf(scale);
    return scores.indexOf(_scale) <= maxScore;
  };

  var newDate = new Date(date.getFullYear(), shouldReset("year") ? 0 : date.getMonth(), shouldReset("month") ? 1 : date.getDate(), shouldReset("day") ? 0 : date.getHours(), shouldReset("hour") ? 0 : date.getMinutes(), shouldReset("minute") ? 0 : date.getSeconds(), shouldReset("second") ? 0 : date.getMilliseconds());
  return newDate;
};
var ganttDateRange = function ganttDateRange(viewMode) {
  var newStartDate = new Date(Date.now());
  var newEndDate = new Date(Date.now());
  var year = 10;
  var oneYear = 1;

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
var seedDates = function seedDates(startDate, endDate, viewMode) {
  var currentDate = new Date(startDate);
  var dates = [currentDate];

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
var getLocaleMonth = function getLocaleMonth(date, locale) {
  var bottomValue = getCachedDateTimeFormat(locale, {
    month: "long"
  }).format(date);
  bottomValue = bottomValue.replace(bottomValue[0], bottomValue[0].toLocaleUpperCase());
  return bottomValue;
};

var getMonday = function getMonday(date) {
  var day = date.getDay();
  var diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
};

var getWeekNumberISO8601 = function getWeekNumberISO8601(date) {
  var tmpDate = new Date(date.valueOf());
  var dayNumber = (tmpDate.getDay() + 6) % 7;
  tmpDate.setDate(tmpDate.getDate() - dayNumber + 3);
  var firstThursday = tmpDate.valueOf();
  tmpDate.setMonth(0, 1);

  if (tmpDate.getDay() !== 4) {
    tmpDate.setMonth(0, 1 + (4 - tmpDate.getDay() + 7) % 7);
  }

  var weekNumber = (1 + Math.ceil((firstThursday - tmpDate.valueOf()) / 604800000)).toString();

  if (weekNumber.length === 1) {
    return "0" + weekNumber;
  } else {
    return weekNumber;
  }
};

var barBackgroundColorPivotalPath = "#8777D9";
var barBackgroundColorTimeError = "#FF8F73";
var errorLinkBorderColor = "#FF8F73";
var pivotalPathLinkBorderColor = "#6554C0";
var scrollBarHeight = 4;
var dayFormat = "YYYY-MM-DD";
var dayTimeFormat = " YYYY-MM-DD HH:mm:ss";
var drawerWidth = 600;
var daySeconds = 24 * 60 * 60 * 1000;

var styles = {"tooltipDefaultContainer":"_3T42e","tooltipDefaultContainerParagraph":"_29NTg","tooltipDetailsContainer":"_25P-K","tooltipDetailsContainerHidden":"_3gVAq","tooltipId":"_1089R","tooltipName":"_1LUF2","lightColor":"_3fzTV","status":"_1FA7R","item":"_3WF3F"};

var Tooltip = memo(function (_ref) {
  var _task$item2;

  var task = _ref.task,
      rowHeight = _ref.rowHeight,
      svgContainerHeight = _ref.svgContainerHeight,
      svgContainerWidth = _ref.svgContainerWidth,
      scrollX = _ref.scrollX,
      scrollY = _ref.scrollY,
      arrowIndent = _ref.arrowIndent,
      fontSize = _ref.fontSize,
      fontFamily = _ref.fontFamily,
      headerHeight = _ref.headerHeight,
      taskListWidth = _ref.taskListWidth,
      TooltipContent = _ref.TooltipContent,
      renderUserAvatar = _ref.renderUserAvatar;
  var tooltipRef = useRef(null);

  var _useState = useState(0),
      relatedY = _useState[0],
      setRelatedY = _useState[1];

  var _useState2 = useState(0),
      relatedX = _useState2[0],
      setRelatedX = _useState2[1];

  var UserAvatar = useMemo(function () {
    if (typeof renderUserAvatar === "function") {
      var _task$item;

      return renderUserAvatar(task === null || task === void 0 ? void 0 : (_task$item = task.item) === null || _task$item === void 0 ? void 0 : _task$item.assignee);
    }

    return React.createElement(React.Fragment, null);
  }, [renderUserAvatar, task === null || task === void 0 ? void 0 : (_task$item2 = task.item) === null || _task$item2 === void 0 ? void 0 : _task$item2.assignee]);
  useEffect(function () {
    if (tooltipRef.current) {
      var newRelatedX = task.x2 + arrowIndent + arrowIndent * 0.5 + taskListWidth - scrollX;
      var newRelatedY = task.index * rowHeight - scrollY + headerHeight;
      var tooltipHeight = tooltipRef.current.offsetHeight * 1.1;
      var tooltipWidth = tooltipRef.current.offsetWidth * 1.1;
      var tooltipLowerPoint = tooltipHeight + newRelatedY - scrollY;
      var tooltipLeftmostPoint = tooltipWidth + newRelatedX;
      var fullChartWidth = taskListWidth + svgContainerWidth;

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
var StandardTooltipContent = function StandardTooltipContent(_ref2) {
  var _task$item3, _task$item4, _task$item4$status;

  var task = _ref2.task,
      fontSize = _ref2.fontSize,
      fontFamily = _ref2.fontFamily,
      userAvatar = _ref2.userAvatar;
  var style = {
    fontSize: fontSize,
    fontFamily: fontFamily
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
    className: styles.lightColor + " " + styles.item
  }, React.createElement("div", null, React.createElement("span", null, "\u5F00\u59CB\u65E5\u671F\uFF1A"), React.createElement("span", null, dayjs(task.start).format(dayFormat))), React.createElement("div", null, React.createElement("span", null, "\u7ED3\u675F\u65E5\u671F\uFF1A"), React.createElement("span", null, dayjs(task.end).format(dayFormat)))));
};

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectDestructuringEmpty(obj) {
  if (obj == null) throw new TypeError("Cannot destructure undefined");
}

var Svg = function Svg() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "24px",
    height: "24px",
    viewBox: "0 0 24 24",
    version: "1.1"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M13.721 14.43a.972.972 0 00-1.37-.004l-2.088 2.059a1.928 1.928 0 01-1.37.568c-.588 0-1.135-.26-1.525-.738-.634-.777-.505-1.933.203-2.643l1.321-1.322.002.001.688-.686a.974.974 0 000-1.377l-.002-.003a.972.972 0 00-1.375 0l-2.068 2.07a3.892 3.892 0 000 5.497l.009.01A3.87 3.87 0 008.892 19a3.87 3.87 0 002.746-1.139l2.083-2.085a.951.951 0 000-1.345zm-3.442-4.86a.972.972 0 001.37.004l2.088-2.058c.366-.367.853-.57 1.37-.57.588 0 1.135.26 1.525.739.634.777.505 1.933-.203 2.643l-1.321 1.322-.002-.001-.688.686a.974.974 0 000 1.377l.002.003c.38.38.995.38 1.375 0l2.068-2.07a3.892 3.892 0 000-5.497l-.009-.01A3.87 3.87 0 0015.108 5a3.87 3.87 0 00-2.746 1.139l-2.083 2.085a.951.951 0 000 1.345zM8.924 4.618l.401.968a1 1 0 11-1.848.765l-.4-.968a1 1 0 111.848-.765M5.383 7.076l.968.401a1.001 1.001 0 01-.766 1.848l-.968-.4a1.001 1.001 0 01.766-1.848m9.932 10.413a1.003 1.003 0 00-.542 1.307l.402.968A1 1 0 1017.023 19l-.401-.967a1 1 0 00-1.307-.542zm2.176-2.174a1 1 0 00.54 1.306l.969.401a1.001 1.001 0 00.766-1.848l-.969-.4a1 1 0 00-1.306.542z",
    fill: "currentColor",
    "fill-rule": "evenodd"
  }));
};

var IconComponent = function IconComponent(props) {
  return /*#__PURE__*/React.createElement(Icon, _extends({
    component: Svg
  }, props));
};

var Svg$1 = function Svg() {
  return /*#__PURE__*/React.createElement("svg", {
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
};

var IconComponent$1 = function IconComponent(props) {
  return /*#__PURE__*/React.createElement(Icon, _extends({
    component: Svg$1
  }, props));
};

var styles$1 = {"tooltipDeleteDefaultContainer":"_1E0Mg","tooltipDeleteContainer":"_3a-sg","title":"_TXuno","taskInfo":"_3kijo","date":"_36kyr","connect":"_1r7Sh","unconnectionIcon":"_r1q0R","connection":"_3jYhQ","connectionLine":"_3UKWM","connectionIcon":"_18-g_"};

var DeleteTooltip = memo(function (_ref) {
  var _currentConnection$or5, _currentConnection$or6, _sourceTask$, _sourceTask$$item, _sourceTask$$item$ite, _sourceTask$2, _currentConnection$co3, _currentConnection$co4, _currentConnection$co5, _sourceTask$3, _sourceTask$4, _targetTask$, _targetTask$$item, _targetTask$$item$ite, _targetTask$2, _currentConnection$co6, _currentConnection$co7, _currentConnection$co8, _targetTask$3, _targetTask$4;

  var tasks = _ref.tasks,
      delConnection = _ref.delConnection,
      taskListWidth = _ref.taskListWidth,
      itemLinks = _ref.itemLinks,
      currentConnection = _ref.currentConnection,
      boundTop = _ref.boundTop,
      setCurrentConnection = _ref.setCurrentConnection,
      svgContainerHeight = _ref.svgContainerHeight;
  var path = window.location.origin;
  var tooltipRef = useRef(null);

  var _useState = useState(0),
      relatedY = _useState[0],
      setRelatedY = _useState[1];

  var _useState2 = useState(0),
      relatedX = _useState2[0],
      setRelatedX = _useState2[1];

  var sourceTask = useMemo(function () {
    return tasks.filter(function (ele) {
      return ele.id === currentConnection.connection.sourceId;
    });
  }, [currentConnection.connection.sourceId, tasks]);
  var targetTask = useMemo(function () {
    return tasks.filter(function (ele) {
      return ele.id === currentConnection.connection.targetId;
    });
  }, [currentConnection.connection.targetId, tasks]);
  useEffect(function () {
    if (tooltipRef.current) {
      var _currentConnection$or, _currentConnection$or2, _currentConnection$or3, _currentConnection$or4;

      var tooltipHeight = tooltipRef.current.offsetHeight;
      var newRelatedY = (currentConnection === null || currentConnection === void 0 ? void 0 : (_currentConnection$or = currentConnection.originalEvent) === null || _currentConnection$or === void 0 ? void 0 : _currentConnection$or.clientY) - boundTop + tooltipHeight > svgContainerHeight ? (currentConnection === null || currentConnection === void 0 ? void 0 : (_currentConnection$or2 = currentConnection.originalEvent) === null || _currentConnection$or2 === void 0 ? void 0 : _currentConnection$or2.clientY) - boundTop - tooltipHeight : (currentConnection === null || currentConnection === void 0 ? void 0 : (_currentConnection$or3 = currentConnection.originalEvent) === null || _currentConnection$or3 === void 0 ? void 0 : _currentConnection$or3.clientY) - boundTop;
      var newRelatedX = (currentConnection === null || currentConnection === void 0 ? void 0 : (_currentConnection$or4 = currentConnection.originalEvent) === null || _currentConnection$or4 === void 0 ? void 0 : _currentConnection$or4.clientX) - taskListWidth;
      setRelatedY(newRelatedY);
      setRelatedX(newRelatedX);
    }
  }, [tasks, taskListWidth, boundTop, currentConnection === null || currentConnection === void 0 ? void 0 : (_currentConnection$or5 = currentConnection.originalEvent) === null || _currentConnection$or5 === void 0 ? void 0 : _currentConnection$or5.clientX, currentConnection === null || currentConnection === void 0 ? void 0 : (_currentConnection$or6 = currentConnection.originalEvent) === null || _currentConnection$or6 === void 0 ? void 0 : _currentConnection$or6.clientY, svgContainerHeight]);

  var removeConnection = function removeConnection() {
    try {
      var currentLink = itemLinks === null || itemLinks === void 0 ? void 0 : itemLinks.filter(function (ele) {
        var _ele$source, _currentConnection$co, _ele$destination, _currentConnection$co2, _ele$linkType;

        return ((_ele$source = ele.source) === null || _ele$source === void 0 ? void 0 : _ele$source.objectId) === ((_currentConnection$co = currentConnection.connection) === null || _currentConnection$co === void 0 ? void 0 : _currentConnection$co.sourceId) && ((_ele$destination = ele.destination) === null || _ele$destination === void 0 ? void 0 : _ele$destination.objectId) === ((_currentConnection$co2 = currentConnection.connection) === null || _currentConnection$co2 === void 0 ? void 0 : _currentConnection$co2.targetId) && ((_ele$linkType = ele.linkType) === null || _ele$linkType === void 0 ? void 0 : _ele$linkType.objectId) === currentConnection.connection.getData();
      });

      var _temp2 = function () {
        if (currentLink !== null && currentLink !== void 0 && currentLink.length) {
          var _currentLink$;

          return Promise.resolve(delConnection === null || delConnection === void 0 ? void 0 : delConnection(currentLink === null || currentLink === void 0 ? void 0 : (_currentLink$ = currentLink[0]) === null || _currentLink$ === void 0 ? void 0 : _currentLink$.objectId)).then(function () {
            setCurrentConnection === null || setCurrentConnection === void 0 ? void 0 : setCurrentConnection(null);
          });
        }
      }();

      return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
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
    src: "" + path + sourceTask[0].item.itemType.icon
  }), React.createElement("span", null, " ", (_sourceTask$2 = sourceTask[0]) === null || _sourceTask$2 === void 0 ? void 0 : _sourceTask$2.name)), React.createElement("div", {
    className: styles$1.date
  }, ((_currentConnection$co3 = currentConnection.connection) === null || _currentConnection$co3 === void 0 ? void 0 : (_currentConnection$co4 = _currentConnection$co3.endpoints) === null || _currentConnection$co4 === void 0 ? void 0 : (_currentConnection$co5 = _currentConnection$co4[0].anchor) === null || _currentConnection$co5 === void 0 ? void 0 : _currentConnection$co5.cssClass) === "Right" ? "\u7ED3\u675F\u65E5\u671F\uFF1A" + dayjs((_sourceTask$3 = sourceTask[0]) === null || _sourceTask$3 === void 0 ? void 0 : _sourceTask$3.end).format(dayFormat) : "\u5F00\u59CB\u65E5\u671F\uFF1A" + dayjs((_sourceTask$4 = sourceTask[0]) === null || _sourceTask$4 === void 0 ? void 0 : _sourceTask$4.start).format(dayFormat))), React.createElement("div", {
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
    src: "" + path + targetTask[0].item.itemType.icon
  }), React.createElement("span", null, (_targetTask$2 = targetTask[0]) === null || _targetTask$2 === void 0 ? void 0 : _targetTask$2.name)), React.createElement("div", {
    className: styles$1.date
  }, ((_currentConnection$co6 = currentConnection.connection) === null || _currentConnection$co6 === void 0 ? void 0 : (_currentConnection$co7 = _currentConnection$co6.endpoints[1]) === null || _currentConnection$co7 === void 0 ? void 0 : (_currentConnection$co8 = _currentConnection$co7.anchor) === null || _currentConnection$co8 === void 0 ? void 0 : _currentConnection$co8.cssClass) === "Right" ? "\u7ED3\u675F\u65E5\u671F\uFF1A" + dayjs((_targetTask$3 = targetTask[0]) === null || _targetTask$3 === void 0 ? void 0 : _targetTask$3.end).format(dayFormat) : "\u5F00\u59CB\u65E5\u671F\uFF1A" + dayjs((_targetTask$4 = targetTask[0]) === null || _targetTask$4 === void 0 ? void 0 : _targetTask$4.start).format(dayFormat)))));
});

var styles$2 = {"scroll":"_1eT-t"};

var VerticalScrollComponent = function VerticalScrollComponent(_ref, ref) {
  var ganttHeight = _ref.ganttHeight,
      ganttFullHeight = _ref.ganttFullHeight,
      headerHeight = _ref.headerHeight,
      onScroll = _ref.onScroll,
      listBottomHeight = _ref.listBottomHeight;
  var scrollHeight = 16;
  return React.createElement("div", {
    style: {
      height: ganttHeight || "auto",
      marginTop: headerHeight,
      marginBottom: listBottomHeight + scrollHeight + "px"
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

var VerticalScroll = memo(forwardRef(VerticalScrollComponent));

var GanttConfigContext = createContext(null);
var ConfigHandleContext = createContext(null);
var BaseLineContext = createContext(null);

var styles$3 = {"gridRow":"_2dZTy","gridRowLine":"_3rUKi","gridTick":"_RuwuK","gridTickWeekday":"_3JhzT"};

dayjs.extend(weekday);

var isRestDay = function isRestDay(date) {
  var dt = new Date(date);
  return [0, 6].includes(dt.getDay());
};

var GridBody = memo(function (_ref) {
  var tasks = _ref.tasks,
      dates = _ref.dates,
      rowHeight = _ref.rowHeight,
      svgWidth = _ref.svgWidth,
      columnWidth = _ref.columnWidth,
      todayColor = _ref.todayColor,
      viewMode = _ref.viewMode,
      scrollX = _ref.scrollX,
      offsetLeft = _ref.offsetLeft,
      taskListHeight = _ref.taskListHeight,
      onDateChange = _ref.onDateChange;

  var _useContext = useContext(GanttConfigContext),
      ganttConfig = _useContext.ganttConfig;

  var _useState = useState(0),
      translateX = _useState[0],
      setTranslateX = _useState[1];

  var _useState2 = useState(0),
      translateY = _useState2[0],
      setTranslateY = _useState2[1];

  var _useState3 = useState(false),
      isShow = _useState3[0],
      setIsShow = _useState3[1];

  var _useState4 = useState(1),
      parts = _useState4[0],
      setParts = _useState4[1];

  var _useState5 = useState(0),
      remainderDays = _useState5[0],
      setRemainderDays = _useState5[1];

  var _useState6 = useState(0),
      currentIndex = _useState6[0],
      setCurrentDataIndex = _useState6[1];

  useEffect(function () {
    setParts(1);
    setRemainderDays(0);
    setCurrentDataIndex(0);
  }, [viewMode]);
  var y = 0;
  var invalidColumn = [];
  var gridRows = [];
  var rowLines = [React.createElement("line", {
    key: "RowLineFirst",
    x: "0",
    y1: 0,
    x2: svgWidth,
    y2: 0,
    className: styles$3.gridRowLine
  })];
  var handleMouseMove = useCallback(function (event, index) {
    var pointerX = event.clientX - offsetLeft - 24;
    var currentDataIndex = Math.floor((pointerX + scrollX) / columnWidth);
    setCurrentDataIndex(currentDataIndex);
    var translateX = 0;

    if (viewMode === ViewMode.Day || viewMode === ViewMode.Week) {
      setParts(1);
      setRemainderDays(0);
      translateX = currentDataIndex * columnWidth;
    }

    if (viewMode === ViewMode.Month) {
      var _dates$currentDataInd, _dates$currentDataInd2;

      var dateRemainder = pointerX + scrollX - currentDataIndex * columnWidth;

      var _parts = new Date((_dates$currentDataInd = dates[currentDataIndex]) === null || _dates$currentDataInd === void 0 ? void 0 : _dates$currentDataInd.getFullYear(), ((_dates$currentDataInd2 = dates[currentDataIndex]) === null || _dates$currentDataInd2 === void 0 ? void 0 : _dates$currentDataInd2.getMonth()) + 1, 0).getDate();

      setParts(_parts);
      var dayWidth = columnWidth / _parts;
      var remainder = Math.floor(dateRemainder / dayWidth);
      setRemainderDays(remainder);
      translateX = currentDataIndex * columnWidth + remainder / _parts * columnWidth;
    }

    if (viewMode === ViewMode.Quarter) {
      var _dateRemainder = pointerX + scrollX - currentDataIndex * columnWidth;

      var _parts2 = 3;
      setParts(3);

      var _dayWidth = columnWidth / _parts2;

      var _remainder = Math.floor(_dateRemainder / _dayWidth);

      setRemainderDays(_remainder);
      translateX = currentDataIndex * columnWidth + _remainder / _parts2 * columnWidth;
    }

    if (viewMode === ViewMode.Year) {
      var _dateRemainder2 = pointerX + scrollX - currentDataIndex * columnWidth;

      var _parts3 = 12;
      setParts(12);

      var _dayWidth2 = columnWidth / _parts3;

      var _remainder2 = Math.floor(_dateRemainder2 / _dayWidth2);

      setRemainderDays(_remainder2);
      translateX = currentDataIndex * columnWidth + _remainder2 / _parts3 * columnWidth;
    }

    setTranslateX(translateX);
    setTranslateY(index * rowHeight);
  }, [columnWidth, dates, offsetLeft, rowHeight, scrollX, viewMode]);
  var handleInvalidColumnMouseMove = useCallback(function (index, row) {
    setTranslateY(index * rowHeight);
    setIsShow(!row.start);
  }, [rowHeight]);

  var invalidBarClick = function invalidBarClick() {
    var _ganttConfig$time, _startDate, _ganttConfig$time2, _endDate;

    var taskIndex = translateY / rowHeight;
    var startDate, endDate;

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

  var _loop = function _loop(i) {
    gridRows.push(React.createElement("g", {
      key: "Cell-" + i,
      onMouseEnter: function onMouseEnter(e) {
        var ele = e.target.parentNode.firstChild;
        ele && (ele.style.fill = "#f3f3f3");
      },
      onMouseLeave: function onMouseLeave(e) {
        var ele = e.target.parentNode.firstChild;
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
      onMouseMove: function onMouseMove(e) {
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
      onMouseMove: function onMouseMove() {
        handleInvalidColumnMouseMove(i, tasks[i]);
      }
    }), tasks[i].id && React.createElement("rect", {
      key: "Time" + tasks[i].id + i,
      x: translateX,
      y: y + rowHeight / 2 - 30 / 2,
      width: columnWidth / parts,
      height: 30,
      fill: "transparent",
      onClick: isShow ? invalidBarClick : function () {},
      cursor: isShow ? "pointer" : "default",
      onMouseEnter: function onMouseEnter(e) {
        var ele = e.target.parentNode;
        var index = ele.getAttribute("index");

        if (isShow && i === Number(index)) {
          e.target.style.fill = "#AFCBFF";
        }
      },
      onMouseLeave: function onMouseLeave(e) {
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
      onMouseMove: function onMouseMove() {
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
  };

  for (var i = 0; i < tasks.length; i++) {
    _loop(i);
  }

  var now = new Date();
  var tickX = 0;
  var ticks = [];
  var today = React.createElement("rect", null);

  for (var _i = 0; _i < dates.length; _i++) {
    var date = dates[_i];
    ticks.push(React.createElement("g", {
      key: date.getTime() + "-" + _i + "-ticks"
    }, React.createElement("line", {
      key: date.getTime() + "-" + _i + "-line",
      x1: tickX,
      y1: 0,
      x2: tickX,
      y2: y < Number(taskListHeight) ? taskListHeight : y,
      className: styles$3.gridTick
    }), isRestDay(date) && viewMode === ViewMode.Day && React.createElement("rect", {
      key: date.getTime() + "-" + date.getTime() + "-" + _i + "-restday",
      x: tickX + 1,
      y: "0",
      width: columnWidth - 1,
      height: y < Number(taskListHeight) ? taskListHeight : y,
      className: styles$3.gridTickWeekday
    })));

    if (_i + 1 !== dates.length && date.getTime() < now.getTime() && dates[_i + 1].getTime() >= now.getTime() || _i !== 0 && _i + 1 === dates.length && date.getTime() < now.getTime() && addToDate(date, date.getTime() - dates[_i - 1].getTime(), "millisecond").getTime() >= now.getTime()) {
      var currentStamp = new Date(new Date().toLocaleDateString()).getTime();
      var currentMinus = (currentStamp + 86400000 - dates[_i].getTime()) / 86400000;
      var totalMinus = (dates[_i + 1].getTime() - dates[_i].getTime()) / 86400000;
      var newTickX = tickX + columnWidth * (currentMinus / totalMinus) - columnWidth / totalMinus / 2;
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

  var invalidBar = React.createElement("g", null, React.createElement("rect", {
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
    onMouseLeave: function onMouseLeave() {
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

var Grid = memo(function (props) {
  return React.createElement("g", {
    className: "grid"
  }, React.createElement(GridBody, Object.assign({}, props)));
});

var styles$4 = {"calendarBottomText":"_9w8d5","calendarTopTick":"_1rLuZ","calendarTopText":"_2q1Kt","calendarHeader":"_35nLX"};

var TopPartOfCalendar = function TopPartOfCalendar(_ref) {
  var value = _ref.value,
      x1Line = _ref.x1Line,
      y1Line = _ref.y1Line,
      y2Line = _ref.y2Line,
      xText = _ref.xText,
      yText = _ref.yText;
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

var Calendar = memo(function (_ref) {
  var dateSetup = _ref.dateSetup,
      locale = _ref.locale,
      viewMode = _ref.viewMode,
      headerHeight = _ref.headerHeight,
      columnWidth = _ref.columnWidth,
      fontFamily = _ref.fontFamily,
      fontSize = _ref.fontSize;
  var bottomValuesInit = useCallback(function (bottomValue, date, headerHeight, i, type) {
    return React.createElement("text", {
      key: ["Day", "Other", "Week"].includes(type) ? date.getTime() : bottomValue + date.getFullYear(),
      y: ["Day", "Week"].includes(type) ? headerHeight * 0.6 + 6 : headerHeight * 0.6,
      x: columnWidth * i + columnWidth * 0.5,
      className: styles$4.calendarBottomText
    }, bottomValue);
  }, [columnWidth]);
  var getCalendarValuesForYear = useCallback(function () {
    var topValues = [];
    var bottomValues = [];

    for (var i = 0; i < dateSetup.dates.length; i++) {
      var date = dateSetup.dates[i];
      var bottomValue = date.getFullYear().toString();
      bottomValues.push(bottomValuesInit(bottomValue, date, headerHeight, i, "year"));
    }

    return [topValues, bottomValues];
  }, [dateSetup.dates, headerHeight, bottomValuesInit]);
  var getCalendarValuesForQuarter = useCallback(function () {
    var topValues = [];
    var bottomValues = [];
    var topDefaultWidth = columnWidth * 3;
    var topDefaultHeight = headerHeight * 0.5;

    for (var i = 0; i < dateSetup.dates.length; i++) {
      var date = dateSetup.dates[i];
      var currentQuarter = Math.floor(date.getMonth() % 3 === 0 ? date.getMonth() / 3 + 1 : date.getMonth() / 3 + 1);
      var bottomValue = "\u7B2C" + currentQuarter + "\u5B63";
      bottomValues.push(bottomValuesInit(bottomValue, date, headerHeight, i, "Quarter"));

      if (i === 0 || date.getFullYear() !== dateSetup.dates[i - 1].getFullYear()) {
        var topValue = date.getFullYear().toString();
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
  var getCalendarValuesForMonth = useCallback(function () {
    var topValues = [];
    var bottomValues = [];
    var topDefaultWidth = columnWidth * 6;
    var topDefaultHeight = headerHeight * 0.5;

    for (var i = 0; i < dateSetup.dates.length; i++) {
      var date = dateSetup.dates[i];
      var bottomValue = getLocaleMonth(date, locale);
      bottomValues.push(bottomValuesInit(bottomValue, date, headerHeight, i, "Month"));

      if (i === 0 || date.getFullYear() !== dateSetup.dates[i - 1].getFullYear()) {
        var topValue = date.getFullYear().toString();
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
  var getCalendarValuesForWeek = useCallback(function () {
    var topValues = [];
    var bottomValues = [];
    var weeksCount = 1;
    var topDefaultHeight = headerHeight * 0.5;
    var dates = dateSetup.dates;

    for (var i = dates.length - 1; i >= 0; i--) {
      var date = dates[i];
      var topValue = "";

      if (i === 0 || date.getMonth() !== dates[i - 1].getMonth()) {
        topValue = date.getFullYear() + "\u5E74" + (date.getMonth() + 1) + "\u6708";
      }

      var bottomValue = "\u7B2C" + getWeekNumberISO8601(date) + "\u5468";
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
  var getCalendarValuesForDay = useCallback(function () {
    var topValues = [];
    var bottomValues = [];
    var topDefaultHeight = headerHeight * 0.5;
    var dates = dateSetup.dates;

    for (var i = 0; i < dates.length; i++) {
      var date = dates[i];
      var bottomValue = date.getDate().toString();
      bottomValues.push(bottomValuesInit(bottomValue, date, headerHeight, i, "Day"));

      if (i + 1 !== dates.length && date.getMonth() !== dates[i + 1].getMonth()) {
        var topValue = date.getFullYear() + "\u5E74" + (date.getMonth() + 1) + "\u6708";
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
  var getCalendarValuesForOther = useCallback(function () {
    var topValues = [];
    var bottomValues = [];
    var ticks = viewMode === ViewMode.HalfDay ? 2 : 4;
    var topDefaultHeight = headerHeight * 0.5;
    var dates = dateSetup.dates;

    for (var i = 0; i < dates.length; i++) {
      var date = dates[i];
      var bottomValue = Intl.DateTimeFormat(locale, {
        hour: "numeric"
      }).format(date);
      bottomValues.push(bottomValuesInit(bottomValue, date, headerHeight, i, "Other"));

      if (i === 0 || date.getDate() !== dates[i - 1].getDate()) {
        var topValue = date.getDate() + " " + getLocaleMonth(date, locale);
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

  var _useMemo = useMemo(function () {
    var topValues = [];
    var bottomValues = [];

    switch (dateSetup.viewMode) {
      case ViewMode.Month:
        var _getCalendarValuesFor = getCalendarValuesForMonth();

        topValues = _getCalendarValuesFor[0];
        bottomValues = _getCalendarValuesFor[1];
        break;

      case ViewMode.Week:
        var _getCalendarValuesFor2 = getCalendarValuesForWeek();

        topValues = _getCalendarValuesFor2[0];
        bottomValues = _getCalendarValuesFor2[1];
        break;

      case ViewMode.Day:
        var _getCalendarValuesFor3 = getCalendarValuesForDay();

        topValues = _getCalendarValuesFor3[0];
        bottomValues = _getCalendarValuesFor3[1];
        break;

      case ViewMode.Year:
        var _getCalendarValuesFor4 = getCalendarValuesForYear();

        topValues = _getCalendarValuesFor4[0];
        bottomValues = _getCalendarValuesFor4[1];
        break;

      case ViewMode.Quarter:
        var _getCalendarValuesFor5 = getCalendarValuesForQuarter();

        topValues = _getCalendarValuesFor5[0];
        bottomValues = _getCalendarValuesFor5[1];
        break;

      default:
        var _getCalendarValuesFor6 = getCalendarValuesForOther();

        topValues = _getCalendarValuesFor6[0];
        bottomValues = _getCalendarValuesFor6[1];
        break;
    }

    return [topValues, bottomValues];
  }, [dateSetup.viewMode, getCalendarValuesForDay, getCalendarValuesForMonth, getCalendarValuesForOther, getCalendarValuesForQuarter, getCalendarValuesForWeek, getCalendarValuesForYear]),
      topValues = _useMemo[0],
      bottomValues = _useMemo[1];

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

// A type of promise-like that resolves synchronously and supports only one observer

const _iteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator"))) : "@@iterator";

const _asyncIteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator"))) : "@@asyncIterator";

// Asynchronously call a function and send errors to recovery continuation
function _catch(body, recover) {
	try {
		var result = body();
	} catch(e) {
		return recover(e);
	}
	if (result && result.then) {
		return result.then(void 0, recover);
	}
	return result;
}

var Arrow = function Arrow(_ref) {
  var taskFrom = _ref.taskFrom,
      taskTo = _ref.taskTo,
      rowHeight = _ref.rowHeight,
      taskHeight = _ref.taskHeight,
      arrowIndent = _ref.arrowIndent;
  var indexCompare = taskFrom.index > taskTo.index ? -1 : 1;
  var taskToEndPosition = taskTo.y + taskHeight / 2;
  var path = "M " + taskFrom.x2 + " " + (taskFrom.y + taskHeight / 2) + " \n  h " + arrowIndent + " \n  v " + indexCompare * rowHeight / 2 + " \n  H " + (taskTo.x1 - arrowIndent) + " \n  V " + taskToEndPosition + " \n  h " + arrowIndent;
  var trianglePoints = taskTo.x1 + "," + taskToEndPosition + " \n  " + (taskTo.x1 - 5) + "," + (taskToEndPosition - 5) + " \n  " + (taskTo.x1 - 5) + "," + (taskToEndPosition + 5);
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

var convertToBarTasks = function convertToBarTasks(tasks, dates, columnWidth, rowHeight, taskHeight, barCornerRadius, handleWidth, barProgressColor, barProgressSelectedColor, barBackgroundColor, barBackgroundSelectedColor, projectProgressColor, projectProgressSelectedColor, projectBackgroundColor, projectBackgroundSelectedColor, milestoneBackgroundColor, milestoneBackgroundSelectedColor, viewMode) {
  var dateDelta = dates[1].getTime() - dates[0].getTime() - dates[1].getTimezoneOffset() * 60 * 1000 + dates[0].getTimezoneOffset() * 60 * 1000;
  var barTasks = tasks.map(function (t, i) {
    return convertToBarTask(t, i, dates, dateDelta, columnWidth, rowHeight, taskHeight, barCornerRadius, handleWidth, barProgressColor, barProgressSelectedColor, barBackgroundColor, barBackgroundSelectedColor, projectProgressColor, projectProgressSelectedColor, projectBackgroundColor, projectBackgroundSelectedColor, milestoneBackgroundColor, milestoneBackgroundSelectedColor, viewMode);
  });
  barTasks = barTasks.map(function (task, i) {
    var dependencies = task.dependencies || [];

    var _loop = function _loop(j) {
      var dependence = barTasks.findIndex(function (value) {
        return value.id === dependencies[j];
      });
      if (dependence !== -1) barTasks[dependence].barChildren.push(i);
    };

    for (var j = 0; j < dependencies.length; j++) {
      _loop(j);
    }

    return task;
  });
  return barTasks;
};

var convertToBarTask = function convertToBarTask(task, index, dates, dateDelta, columnWidth, rowHeight, taskHeight, barCornerRadius, handleWidth, barProgressColor, barProgressSelectedColor, barBackgroundColor, barBackgroundSelectedColor, projectProgressColor, projectProgressSelectedColor, projectBackgroundColor, projectBackgroundSelectedColor, milestoneBackgroundColor, milestoneBackgroundSelectedColor, viewMode) {
  var barTask;

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

var convertToBar = function convertToBar(task, index, dates, dateDelta, columnWidth, rowHeight, taskHeight, barCornerRadius, handleWidth, barProgressColor, barProgressSelectedColor, barBackgroundColor, barBackgroundSelectedColor, viewMode) {
  var x1 = taskXCoordinate(task.start, dates, dateDelta, columnWidth, viewMode);
  var x2 = taskXCoordinate(task.end, dates, dateDelta, columnWidth, viewMode);
  var y = taskYCoordinate(index, rowHeight, taskHeight);

  var styles = _extends({
    backgroundColor: barBackgroundColor,
    backgroundSelectedColor: barBackgroundSelectedColor,
    progressColor: barProgressColor,
    progressSelectedColor: barProgressSelectedColor
  }, task.styles);

  var typeInternal = task.type;

  if ((typeInternal === "task" || typeInternal === "parent") && x2 - x1 < handleWidth * 2) {
    x2 = x1 + handleWidth * 2;
  }

  return _extends({}, task, {
    typeInternal: typeInternal,
    x1: x1,
    x2: x2,
    y: y,
    index: index,
    barCornerRadius: barCornerRadius,
    handleWidth: handleWidth,
    height: taskHeight,
    barChildren: [],
    styles: styles
  });
};

var convertToMilestone = function convertToMilestone(task, index, dates, dateDelta, columnWidth, rowHeight, taskHeight, barCornerRadius, handleWidth, milestoneBackgroundColor, milestoneBackgroundSelectedColor) {
  var x = taskXCoordinate(task.end, dates, dateDelta, columnWidth);
  var y = taskYCoordinate(index, rowHeight, taskHeight);
  var x1 = x - taskHeight * 0.5;
  var x2 = x + taskHeight * 0.5;

  var styles = _extends({
    backgroundColor: milestoneBackgroundColor,
    backgroundSelectedColor: milestoneBackgroundSelectedColor,
    progressColor: "",
    progressSelectedColor: ""
  }, task.styles);

  return _extends({}, task, {
    end: task.start,
    x1: x1,
    x2: x2,
    y: y,
    index: index,
    barCornerRadius: barCornerRadius,
    handleWidth: handleWidth,
    typeInternal: task.type,
    progress: 0,
    height: taskHeight,
    barChildren: [],
    styles: styles
  });
};

var taskXCoordinate = function taskXCoordinate(xDate, dates, dateDelta, columnWidth, viewMode) {
  if (!xDate) return;
  var precision;
  var index = 0;

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

  var x = Math.round((index + (xDate.getTime() - dates[index].getTime() - xDate.getTimezoneOffset() * 60 * 1000 + dates[index].getTimezoneOffset() * 60 * 1000) / precision) * columnWidth);
  return x;
};

var taskYCoordinate = function taskYCoordinate(index, rowHeight, taskHeight) {
  var y = index * rowHeight + (rowHeight - taskHeight) / 2;
  return y;
};

var progressWithByParams = function progressWithByParams(taskX1, taskX2, progress) {
  return (taskX2 - taskX1) * progress * 0.01;
};

var progressByX = function progressByX(x, task) {
  if (x >= task.x2) return 100;else if (x <= task.x1) return 0;else {
    var barWidth = task.x2 - task.x1;
    var progressPercent = Math.round((x - task.x1) * 100 / barWidth);
    return progressPercent;
  }
};

var getProgressPoint = function getProgressPoint(progressX, taskY, taskHeight) {
  var point = [progressX - 5, taskY + taskHeight, progressX + 5, taskY + taskHeight, progressX, taskY + taskHeight - 5.66];
  return point.join(",");
};

var startByX = function startByX(x, xStep, task) {
  if (x >= task.x2 - task.handleWidth * 2) {
    x = task.x2 - task.handleWidth * 2;
  }

  var steps = Math.round((x - task.x1) / xStep);
  var additionalXValue = steps * xStep;
  var newX = task.x1 + additionalXValue;
  return newX;
};

var endByX = function endByX(x, xStep, task) {
  if (x <= task.x1 + task.handleWidth * 2) {
    x = task.x1 + task.handleWidth * 2;
  }

  var steps = Math.round((x - task.x2) / xStep);
  var additionalXValue = steps * xStep;
  var newX = task.x2 + additionalXValue;
  return newX;
};

var moveByX = function moveByX(x, xStep, task) {
  var steps = Math.round((x - task.x1) / xStep);
  var additionalXValue = steps * xStep;
  var newX1 = task.x1 + additionalXValue;
  var newX2 = newX1 + task.x2 - task.x1;
  return [newX1, newX2];
};

var dateByX = function dateByX(x, taskX, taskDate, xStep, timeStep) {
  var newDate = new Date((x - taskX) / xStep * timeStep + taskDate.getTime());
  newDate = new Date(newDate.getTime() + (newDate.getTimezoneOffset() - taskDate.getTimezoneOffset()) * 60000);
  return newDate;
};

var handleTaskBySVGMouseEvent = function handleTaskBySVGMouseEvent(svgX, action, selectedTask, xStep, timeStep, initEventX1Delta) {
  var result;

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

var handleTaskBySVGMouseEventForBar = function handleTaskBySVGMouseEventForBar(svgX, action, selectedTask, xStep, timeStep, initEventX1Delta) {
  var changedTask = _extends({}, selectedTask);

  var isChanged = false;

  switch (action) {
    case "progress":
      changedTask.progress = progressByX(svgX, selectedTask);
      isChanged = changedTask.progress !== selectedTask.progress;
      break;

    case "start":
      {
        var newX1 = startByX(svgX, xStep, selectedTask);
        changedTask.x1 = newX1;
        isChanged = changedTask.x1 !== selectedTask.x1;

        if (isChanged) {
          changedTask.start = dateByX(newX1, selectedTask.x1, selectedTask.start, xStep, timeStep);
        }

        break;
      }

    case "end":
      {
        var newX2 = endByX(svgX, xStep, selectedTask);
        changedTask.x2 = newX2;
        isChanged = changedTask.x2 !== selectedTask.x2;

        if (isChanged) {
          changedTask.end = dateByX(newX2, selectedTask.x2, selectedTask.end, xStep, timeStep);
        }

        break;
      }

    case "move":
      {
        var _moveByX = moveByX(svgX - initEventX1Delta, xStep, selectedTask),
            newMoveX1 = _moveByX[0],
            newMoveX2 = _moveByX[1];

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
    isChanged: isChanged,
    changedTask: changedTask
  };
};

var handleTaskBySVGMouseEventForMilestone = function handleTaskBySVGMouseEventForMilestone(svgX, action, selectedTask, xStep, timeStep, initEventX1Delta) {
  var changedTask = _extends({}, selectedTask);

  var isChanged = false;

  switch (action) {
    case "move":
      {
        var _moveByX2 = moveByX(svgX - initEventX1Delta, xStep, selectedTask),
            newMoveX1 = _moveByX2[0],
            newMoveX2 = _moveByX2[1];

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
    isChanged: isChanged,
    changedTask: changedTask
  };
};

var styles$5 = {"barWrapper":"_KxSXS","barHandle":"_3w_5u","barHandleProgress":"_2TAN0","barHandleDate":"_ebM68","barHandleBg":"_3Mox9","barHandleBackground":"_tv31v","barBackground":"_31ERP"};

var BarDisplay = function BarDisplay(_ref) {
  var x = _ref.x,
      y = _ref.y,
      width = _ref.width,
      height = _ref.height,
      isSelected = _ref.isSelected,
      progressWidth = _ref.progressWidth,
      barCornerRadius = _ref.barCornerRadius,
      styles = _ref.styles,
      onMouseDown = _ref.onMouseDown,
      id = _ref.id,
      task = _ref.task,
      isLog = _ref.isLog;

  var getBarColor = function getBarColor() {
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

var BarDateHandle = function BarDateHandle(_ref) {
  var x = _ref.x,
      y = _ref.y,
      width = _ref.width,
      height = _ref.height,
      type = _ref.type,
      onMouseDown = _ref.onMouseDown;
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

var BarProgressHandle = function BarProgressHandle(_ref) {
  var progressPoint = _ref.progressPoint,
      onMouseDown = _ref.onMouseDown;
  return React.createElement("polygon", {
    className: "barHandle " + styles$5.barHandleProgress,
    points: progressPoint,
    onMouseDown: onMouseDown
  });
};

var canChangeLayout = true;
var commonConfig = {
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
var offsetCalculators = {
  CIRCLE: function CIRCLE(el) {
    var cx = parseInt(el.getAttribute("cx"), 10);
    var cy = parseInt(el.getAttribute("cy"), 10);
    var r = parseInt(el.getAttribute("r"), 10);
    return {
      left: cx - r,
      top: cy - r
    };
  },
  ELLIPSE: function ELLIPSE(el) {
    var cx = parseInt(el.getAttribute("cx"), 10);
    var cy = parseInt(el.getAttribute("cy"), 10);
    var rx = parseInt(el.getAttribute("rx"), 10);
    var ry = parseInt(el.getAttribute("ry"), 10);
    return {
      left: cx - rx,
      top: cy - ry
    };
  },
  RECT: function RECT(el) {
    var x = parseInt(el.getAttribute("x"), 10);
    var y = parseInt(el.getAttribute("y"), 10);
    return {
      left: x,
      top: y
    };
  }
};
var sizeCalculators = {
  CIRCLE: function CIRCLE(el) {
    var r = parseInt(el.getAttribute("r"), 10);
    return [r * 2, r * 2];
  },
  ELLIPSE: function ELLIPSE(el) {
    var rx = parseInt(el.getAttribute("rx"), 10);
    var ry = parseInt(el.getAttribute("ry"), 10);
    return [rx * 2, ry * 2];
  },
  RECT: function RECT(el) {
    var w = parseInt(el.getAttribute("width"), 10);
    var h = parseInt(el.getAttribute("height"), 10);
    return [w, h];
  }
};
var relationInit = {
  FS: ["Right", "Left"],
  FF: ["Right", "Right"],
  SS: ["Left", "Left"],
  SF: ["Left", "Right"]
};
var relationReverse = function relationReverse(start, end) {
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

var pointOverEvent = function pointOverEvent(barRef, jsPlumb, id) {
  barRef.current.classList.add("barHover");

  if (jsPlumb) {
    jsPlumb.selectEndpoints({
      element: id
    }).addClass("endpoint-hover");
  }
};
var pointOutEvent = function pointOutEvent(barRef, jsPlumb, id) {
  var _barRef$current;

  barRef === null || barRef === void 0 ? void 0 : (_barRef$current = barRef.current) === null || _barRef$current === void 0 ? void 0 : _barRef$current.classList.remove("barHover");

  if (jsPlumb) {
    jsPlumb.selectEndpoints({
      element: id
    }).removeClass("endpoint-hover");
  }
};
var barAnchor = {
  milestone: {
    Left: [0, 0.5, -1, 0, 5, 0, "Left"],
    Right: [1, 0.5, 1, 0, -2, 0, "Right"]
  },
  normal: {
    Left: [0, 0.5, -1, 0, 0, 0, "Left"],
    Right: [1, 0.5, 1, 0, 0, 0, "Right"]
  }
};
var useHover = function useHover(barRef, jsPlumb, id, action) {
  var passiveAction = useMemo(function () {
    return ["start", "end", "progress", "move"].includes(action);
  }, [action]);
  useEffect(function () {
    if (barRef.current && jsPlumb) {
      var addHoverClass = function addHoverClass() {
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

      var removeHoverClass = function removeHoverClass() {
        var _barRef$current4;

        barRef === null || barRef === void 0 ? void 0 : (_barRef$current4 = barRef.current) === null || _barRef$current4 === void 0 ? void 0 : _barRef$current4.classList.remove("barHover");
        jsPlumb.selectEndpoints({
          element: id
        }).removeClass("endpoint-hover");
      };

      var nodeDom = barRef.current;
      nodeDom.addEventListener("mousemove", addHoverClass);
      nodeDom.addEventListener("mouseout", removeHoverClass);
      return function () {
        if (nodeDom) {
          nodeDom.removeEventListener("mousemove", addHoverClass);
          nodeDom.removeEventListener("mouseout", removeHoverClass);
        }
      };
    }
  }, [barRef, jsPlumb, id, passiveAction]);
};
var useAddPoint = function useAddPoint(jsPlumb, task, barRef, type) {
  var _useState = useState(false),
      addPointFinished = _useState[0],
      setAddPointFinished = _useState[1];

  useEffect(function () {
    if (jsPlumb) {
      jsPlumb.setIdChanged(task.id, task.id);
      var rightPoint = jsPlumb.addEndpoint(task.id, {
        anchor: type === "milestone" ? barAnchor.milestone.Right : barAnchor.normal.Right,
        uuid: task.id + "-Right"
      }, commonConfig);
      rightPoint.bind("mouseover", function () {
        return pointOverEvent(barRef, jsPlumb, task.id);
      });
      rightPoint.bind("mouseout", function () {
        return pointOutEvent(barRef, jsPlumb, task.id);
      });
      var leftPoint = jsPlumb.addEndpoint(task.id, {
        anchor: type === "milestone" ? barAnchor.milestone.Left : barAnchor.normal.Left,
        uuid: task.id + "-Left"
      }, commonConfig);
      leftPoint.bind("mouseover", function () {
        return pointOverEvent(barRef, jsPlumb, task.id);
      });
      leftPoint.bind("mouseout", function () {
        return pointOutEvent(barRef, jsPlumb, task.id);
      });
      setAddPointFinished(true);
    }

    return function () {
      if (jsPlumb) {
        jsPlumb.deleteEndpoint(task.id + "-Left");
        jsPlumb.deleteEndpoint(task.id + "-Right");
      }
    };
  }, [jsPlumb, task.y, barRef, task.id, type]);
  return addPointFinished;
};

var Bar = function Bar(_ref) {
  var task = _ref.task,
      isProgressChangeable = _ref.isProgressChangeable,
      isDateChangeable = _ref.isDateChangeable,
      onEventStart = _ref.onEventStart,
      isSelected = _ref.isSelected,
      jsPlumb = _ref.jsPlumb,
      isLog = _ref.isLog,
      setPointInited = _ref.setPointInited,
      _ref$ganttEvent = _ref.ganttEvent,
      ganttEvent = _ref$ganttEvent === void 0 ? {
    action: ""
  } : _ref$ganttEvent;
  var action = ganttEvent.action;
  var barRef = useRef(null);
  var progressWidth = progressWithByParams(task.x1, task.x2, task.progress);
  var progressPoint = getProgressPoint(progressWidth + task.x1, task.y, task.height);
  var handleHeight = task.height - 12;
  var addPointFinished = useAddPoint(jsPlumb, task, barRef);
  useEffect(function () {
    if (addPointFinished) {
      setPointInited === null || setPointInited === void 0 ? void 0 : setPointInited(addPointFinished);
    }
  }, [addPointFinished, setPointInited]);
  useEffect(function () {
    if (jsPlumb) {
      jsPlumb.revalidate(task.id);
    }
  }, [jsPlumb, task]);
  useEffect(function () {
    return function () {
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
    className: "barHandle " + styles$5.barHandleBackground,
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
    styles: !isLog ? task.styles : _extends({}, task.styles, {
      opacity: 0.5
    }),
    isSelected: isSelected,
    id: isLog ? task.id + "-log" : task.id,
    isLog: isLog,
    onMouseDown: function onMouseDown(e) {
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
    onMouseDown: function onMouseDown(e) {
      onEventStart("start", task, e);
    }
  }), React.createElement(BarDateHandle, {
    x: task.x2,
    y: task.y,
    width: task.handleWidth,
    height: handleHeight,
    type: "right",
    onMouseDown: function onMouseDown(e) {
      onEventStart("end", task, e);
    }
  })), isProgressChangeable && !isLog && React.createElement(BarProgressHandle, {
    progressPoint: progressPoint,
    onMouseDown: function onMouseDown(e) {
      onEventStart("progress", task, e);
    }
  }))));
};

var BarSmall = function BarSmall(_ref) {
  var task = _ref.task,
      isProgressChangeable = _ref.isProgressChangeable,
      isDateChangeable = _ref.isDateChangeable,
      onEventStart = _ref.onEventStart,
      isSelected = _ref.isSelected;
  var progressWidth = progressWithByParams(task.x1, task.x2, task.progress);
  var progressPoint = getProgressPoint(progressWidth + task.x1, task.y, task.height);
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
    onMouseDown: function onMouseDown(e) {
      isDateChangeable && onEventStart("move", task, e);
    },
    id: task.id
  }), React.createElement("g", {
    className: "handleGroup"
  }, isProgressChangeable && React.createElement(BarProgressHandle, {
    progressPoint: progressPoint,
    onMouseDown: function onMouseDown(e) {
      onEventStart("progress", task, e);
    }
  })));
};

var BarDisplay$1 = function BarDisplay(_ref) {
  var x = _ref.x,
      y = _ref.y,
      task = _ref.task,
      width = _ref.width,
      height = _ref.height,
      isSelected = _ref.isSelected,
      progressWidth = _ref.progressWidth,
      barCornerRadius = _ref.barCornerRadius,
      styles = _ref.styles,
      onMouseDown = _ref.onMouseDown,
      id = _ref.id,
      isLog = _ref.isLog;

  var getBarColor = function getBarColor() {
    return task !== null && task !== void 0 && task.isTimeErrorItem || task !== null && task !== void 0 && task.isOverdueItem ? barBackgroundColorTimeError : task !== null && task !== void 0 && task.isPivotalPathItem ? barBackgroundColorPivotalPath : isSelected ? styles.backgroundSelectedColor : styles.backgroundColor;
  };

  var triangleX = task.x2 - task.x1 > 15 ? 15 : 2;
  var triangleY = 2;
  var projectLeftTriangle = [task.x1, task.y + task.height - triangleY, task.x1, task.y + task.height + triangleY + 3, task.x1 + triangleX, task.y + task.height - triangleY].join(",");
  var projectRightTriangle = [task.x2, task.y + task.height - triangleY, task.x2, task.y + task.height + triangleY + 3, task.x2 - triangleX, task.y + task.height - triangleY].join(",");
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

var BarParent = function BarParent(_ref) {
  var task = _ref.task,
      isProgressChangeable = _ref.isProgressChangeable,
      isDateChangeable = _ref.isDateChangeable,
      onEventStart = _ref.onEventStart,
      isSelected = _ref.isSelected,
      jsPlumb = _ref.jsPlumb,
      isLog = _ref.isLog,
      setPointInited = _ref.setPointInited,
      _ref$ganttEvent = _ref.ganttEvent,
      ganttEvent = _ref$ganttEvent === void 0 ? {
    action: ""
  } : _ref$ganttEvent;
  var barRef = useRef(null);
  var action = ganttEvent.action;
  var progressWidth = progressWithByParams(task.x1, task.x2, task.progress);
  var progressPoint = getProgressPoint(progressWidth + task.x1 + 1, task.y + 5, task.height);
  var addPointFinished = useAddPoint(jsPlumb, task, barRef);
  useEffect(function () {
    if (addPointFinished) {
      setPointInited === null || setPointInited === void 0 ? void 0 : setPointInited(addPointFinished);
    }
  }, [addPointFinished, setPointInited]);
  useEffect(function () {
    if (jsPlumb) {
      jsPlumb.revalidate(task.id);
    }
  }, [jsPlumb, task]);
  useEffect(function () {
    return function () {
      if (jsPlumb) {
        jsPlumb.deleteEndpoint((task === null || task === void 0 ? void 0 : task.id) + "-Left");
        jsPlumb.deleteEndpoint((task === null || task === void 0 ? void 0 : task.id) + "-Right");
      }
    };
  }, [jsPlumb, task === null || task === void 0 ? void 0 : task.id]);
  useHover(barRef, jsPlumb, task.id, action);
  var handleHeight = task.height - 10;
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
    className: "barHandle " + styles$5.barHandleBackground,
    ry: task.barCornerRadius,
    rx: task.barCornerRadius
  })), React.createElement(BarDisplay$1, {
    id: isLog ? task.id + "-log" : task.id,
    isLog: isLog,
    x: task.x1,
    y: task.y,
    task: task,
    width: task.x2 - task.x1,
    height: task.height,
    progressWidth: progressWidth,
    barCornerRadius: task.barCornerRadius,
    styles: !isLog ? task.styles : _extends({}, task.styles, {
      opacity: 0.5
    }),
    isSelected: isSelected,
    onMouseDown: function onMouseDown(e) {
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
    onMouseDown: function onMouseDown(e) {
      onEventStart("start", task, e);
    }
  }), React.createElement(BarDateHandle, {
    x: task.x2 - task.handleWidth,
    y: task.y,
    width: task.handleWidth,
    height: handleHeight,
    type: "right",
    onMouseDown: function onMouseDown(e) {
      onEventStart("end", task, e);
    }
  })), isProgressChangeable && !isLog && React.createElement(BarProgressHandle, {
    progressPoint: progressPoint,
    onMouseDown: function onMouseDown(e) {
      onEventStart("progress", task, e);
    }
  })));
};

var styles$6 = {"milestoneWrapper":"_RRr13","milestoneBackground":"_2P2B1"};

var base64Milestone = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAATpJREFUeNqslUEOATEUQL9exDiARCJhRYRbIDE2HIONA4iVFYux5gISYmfnBizsrViO32qbwZj+tn7yTTqdeW865v9CHMdgk51mHNhcn+M/lOi2YIyHEDOPucccR1vYme4jCRC+xEMvZaqPkmXWvcwG3h4ATCOASk1PL3A+dBZ8wqv11/nOkC5htnAVVAlzgdtImCucKmE+cIqE+cJNElEHsohGrvBkrOYAx4MeFtQKwn/A1UqKZT0MGT59IMvfG64iISgxLPWz7C1ieb5xvQCsIz3cqFfE/wPx7nwkHD6bADzuYnjifUoIZFfs+0g+4ZiNt89UdkUnSRocebevQnORZMFTW4WNxAT/2ewoEgo8s11nSahw0pYpe8pCFRBP/p1T4DZ7spYkwggnC6QkkD2rxCvUtNmreAowAEKnBro8dl0wAAAAAElFTkSuQmCC";

var Milestone = function Milestone(_ref) {
  var task = _ref.task,
      isDateChangeable = _ref.isDateChangeable,
      onEventStart = _ref.onEventStart,
      jsPlumb = _ref.jsPlumb,
      setPointInited = _ref.setPointInited,
      _ref$ganttEvent = _ref.ganttEvent,
      ganttEvent = _ref$ganttEvent === void 0 ? {
    action: ""
  } : _ref$ganttEvent;
  var barRef = useRef(null);
  var action = ganttEvent.action;
  var addPointFinished = useAddPoint(jsPlumb, task, barRef, "milestone");
  useEffect(function () {
    if (addPointFinished) {
      setPointInited === null || setPointInited === void 0 ? void 0 : setPointInited(addPointFinished);
    }
  }, [addPointFinished, setPointInited]);
  useHover(barRef, jsPlumb, task.id, action);
  useEffect(function () {
    if (jsPlumb) {
      jsPlumb.revalidate(task.id);
    }
  }, [jsPlumb, task]);
  useEffect(function () {
    return function () {
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
    onMouseDown: function onMouseDown(e) {
      isDateChangeable && onEventStart("move", task, e);
    }
  }), React.createElement("image", {
    href: base64Milestone,
    x: task.x1 + task.height / 6,
    y: task.y + task.height / 6,
    width: task.height * 2 / 3,
    height: task.height * 2 / 3,
    onMouseDown: function onMouseDown(e) {
      isDateChangeable && onEventStart("move", task, e);
    }
  }));
};

var styles$7 = {"projectWrapper":"_1KJ6x","projectBackground":"_2RbVy","projectTop":"_2pZMF"};

var Project = function Project(_ref) {
  var task = _ref.task,
      isSelected = _ref.isSelected;
  var barColor = isSelected ? task.styles.backgroundSelectedColor : task.styles.backgroundColor;
  var processColor = isSelected ? task.styles.progressSelectedColor : task.styles.progressColor;
  var progressWidth = progressWithByParams(task.x1, task.x2, task.progress);
  var projectWith = task.x2 - task.x1;
  var projectLeftTriangle = [task.x1, task.y + task.height / 2 - 1, task.x1, task.y + task.height, task.x1 + 15, task.y + task.height / 2 - 1].join(",");
  var projectRightTriangle = [task.x2, task.y + task.height / 2 - 1, task.x2, task.y + task.height, task.x2 - 15, task.y + task.height / 2 - 1].join(",");
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

var TaskItem = function TaskItem(props) {
  var task = props.task,
      isDelete = props.isDelete,
      isSelected = props.isSelected,
      onEventStart = props.onEventStart,
      jsPlumb = props.jsPlumb;

  var _useState = useState(React.createElement("div", null)),
      taskItem = _useState[0],
      setTaskItem = _useState[1];

  useEffect(function () {
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
    onKeyDown: function onKeyDown(e) {
      switch (e.key) {
        case "Delete":
          {
            if (isDelete) onEventStart("delete", task, e);
            break;
          }
      }

      e.stopPropagation();
    },
    onMouseEnter: function onMouseEnter(e) {
      onEventStart("mouseenter", task, e);
    },
    onMouseLeave: function onMouseLeave(e) {
      onEventStart("mouseleave", task, e);
    },
    onDoubleClick: function onDoubleClick(e) {
      onEventStart("dblclick", task, e);
    },
    onClick: function onClick(e) {
      onEventStart("click", task, e);
    },
    onFocus: function onFocus() {
      onEventStart("select", task);
    }
  }, taskItem);
};

var TaskItemLog = function TaskItemLog(props) {
  var _props = _extends({}, props),
      task = _props.task,
      onEventStart = _props.onEventStart,
      isSelected = _props.isSelected,
      jsPlumb = _props.jsPlumb;

  var _useState = useState(React.createElement("div", null)),
      taskItem = _useState[0],
      setTaskItem = _useState[1];

  useEffect(function () {
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
    onClick: function onClick(e) {
      onEventStart("click", task, e);
    }
  }, taskItem);
};

var TaskGanttContent = memo(function (_ref) {
  var _svg$current;

  var tasks = _ref.tasks,
      logTasks = _ref.logTasks,
      dates = _ref.dates,
      ganttEvent = _ref.ganttEvent,
      selectedTask = _ref.selectedTask,
      rowHeight = _ref.rowHeight,
      columnWidth = _ref.columnWidth,
      timeStep = _ref.timeStep,
      svg = _ref.svg,
      taskHeight = _ref.taskHeight,
      arrowColor = _ref.arrowColor,
      arrowIndent = _ref.arrowIndent,
      fontFamily = _ref.fontFamily,
      fontSize = _ref.fontSize,
      setGanttEvent = _ref.setGanttEvent,
      setFailedTask = _ref.setFailedTask,
      setSelectedTask = _ref.setSelectedTask,
      onDateChange = _ref.onDateChange,
      onProgressChange = _ref.onProgressChange,
      onDoubleClick = _ref.onDoubleClick,
      onDelete = _ref.onDelete,
      addConnection = _ref.addConnection,
      itemLinks = _ref.itemLinks,
      taskListHeight = _ref.taskListHeight,
      clickBaselineItem = _ref.clickBaselineItem,
      isConnect = _ref.isConnect,
      setCurrentConnection = _ref.setCurrentConnection,
      currentConnection = _ref.currentConnection,
      containerRef = _ref.containerRef;

  var _useState = useState([]),
      connectUuids = _useState[0],
      setConnectUuids = _useState[1];

  var point = svg === null || svg === void 0 ? void 0 : (_svg$current = svg.current) === null || _svg$current === void 0 ? void 0 : _svg$current.createSVGPoint();

  var _useState2 = useState(0),
      xStep = _useState2[0],
      setXStep = _useState2[1];

  var _useState3 = useState(0),
      initEventX1Delta = _useState3[0],
      setInitEventX1Delta = _useState3[1];

  var _useState4 = useState(false),
      isMoving = _useState4[0],
      setIsMoving = _useState4[1];

  var _useState5 = useState(null),
      jsPlumbInstance = _useState5[0],
      setJsPlumbInstance = _useState5[1];

  var _useContext = useContext(GanttConfigContext),
      ganttConfig = _useContext.ganttConfig;

  var _useState6 = useState(false),
      pointInited = _useState6[0],
      setPointInited = _useState6[1];

  useEffect(function () {
    var connectClickHandle = function connectClickHandle() {
      if (currentConnection) {
        var _currentConnection$co;

        currentConnection === null || currentConnection === void 0 ? void 0 : (_currentConnection$co = currentConnection.connection) === null || _currentConnection$co === void 0 ? void 0 : _currentConnection$co.removeClass("select-connection");
        setCurrentConnection === null || setCurrentConnection === void 0 ? void 0 : setCurrentConnection(null);
      }
    };

    var container = containerRef === null || containerRef === void 0 ? void 0 : containerRef.current;
    container === null || container === void 0 ? void 0 : container.addEventListener("click", connectClickHandle, true);
    return function () {
      container === null || container === void 0 ? void 0 : container.removeEventListener("click", connectClickHandle, true);
    };
  }, [containerRef, setCurrentConnection, currentConnection]);
  useEffect(function () {
    if (!currentConnection && jsPlumbInstance) {
      var connections = jsPlumbInstance.getConnections();
      connections.forEach(function (ele) {
        ele.removeClass("select-connection");
      });
    }
  }, [currentConnection, jsPlumbInstance]);
  useEffect(function () {
    var dateDelta = dates[1].getTime() - dates[0].getTime() - dates[1].getTimezoneOffset() * 60 * 1000 + dates[0].getTimezoneOffset() * 60 * 1000;
    var newXStep = timeStep * columnWidth / dateDelta;
    setXStep(newXStep);
  }, [columnWidth, dates, timeStep]);
  useEffect(function () {
    var handleMouseMove = function handleMouseMove(event) {
      try {
        var _svg$current$getScree;

        if (!ganttEvent.changedTask || !point || !(svg !== null && svg !== void 0 && svg.current)) return Promise.resolve();
        event.preventDefault();
        point.x = event.clientX;
        var cursor = point.matrixTransform(svg === null || svg === void 0 ? void 0 : (_svg$current$getScree = svg.current.getScreenCTM()) === null || _svg$current$getScree === void 0 ? void 0 : _svg$current$getScree.inverse());

        var _handleTaskBySVGMouse = handleTaskBySVGMouseEvent(cursor.x, ganttEvent.action, ganttEvent.changedTask, xStep, timeStep, initEventX1Delta),
            isChanged = _handleTaskBySVGMouse.isChanged,
            changedTask = _handleTaskBySVGMouse.changedTask;

        if (isChanged) {
          setGanttEvent({
            action: ganttEvent.action,
            changedTask: changedTask
          });
        }

        return Promise.resolve();
      } catch (e) {
        return Promise.reject(e);
      }
    };

    var handleMouseUp = function handleMouseUp(event) {
      try {
        var _svg$current$getScree2;

        var _temp6 = function _temp6() {
          if (!operationSuccess) {
            setFailedTask(originalSelectedTask);
          }
        };

        var action = ganttEvent.action,
            originalSelectedTask = ganttEvent.originalSelectedTask,
            changedTask = ganttEvent.changedTask;
        if (!changedTask || !point || !(svg !== null && svg !== void 0 && svg.current) || !originalSelectedTask) return Promise.resolve();
        event.preventDefault();
        point.x = event.clientX;
        var cursor = point.matrixTransform(svg === null || svg === void 0 ? void 0 : (_svg$current$getScree2 = svg.current.getScreenCTM()) === null || _svg$current$getScree2 === void 0 ? void 0 : _svg$current$getScree2.inverse());

        var _handleTaskBySVGMouse2 = handleTaskBySVGMouseEvent(cursor.x, action, changedTask, xStep, timeStep, initEventX1Delta),
            newChangedTask = _handleTaskBySVGMouse2.changedTask;

        var isNotLikeOriginal = originalSelectedTask.start !== newChangedTask.start || originalSelectedTask.end !== newChangedTask.end || originalSelectedTask.progress !== newChangedTask.progress;
        svg.current.removeEventListener("mousemove", handleMouseMove);
        svg.current.removeEventListener("mouseup", handleMouseUp);
        setGanttEvent({
          action: ""
        });
        setIsMoving(false);
        var operationSuccess = true;

        var _temp7 = function () {
          if ((action === "move" || action === "end" || action === "start") && onDateChange && isNotLikeOriginal) {
            var _temp8 = _catch(function () {
              return Promise.resolve(onDateChange(newChangedTask)).then(function (result) {
                if (result !== undefined) {
                  operationSuccess = result;
                }
              });
            }, function () {
              operationSuccess = false;
            });

            if (_temp8 && _temp8.then) return _temp8.then(function () {});
          } else {
            var _temp9 = function () {
              if (onProgressChange && isNotLikeOriginal) {
                var _temp10 = _catch(function () {
                  return Promise.resolve(onProgressChange(newChangedTask)).then(function (result) {
                    if (result !== undefined) {
                      operationSuccess = result;
                    }
                  });
                }, function () {
                  operationSuccess = false;
                });

                if (_temp10 && _temp10.then) return _temp10.then(function () {});
              }
            }();

            if (_temp9 && _temp9.then) return _temp9.then(function () {});
          }
        }();

        return Promise.resolve(_temp7 && _temp7.then ? _temp7.then(_temp6) : _temp6(_temp7));
      } catch (e) {
        return Promise.reject(e);
      }
    };

    if (!isMoving && ["move", "end", "start", "progress"].includes(ganttEvent.action) && svg !== null && svg !== void 0 && svg.current) {
      svg.current.addEventListener("mousemove", handleMouseMove);
      svg.current.addEventListener("mouseup", handleMouseUp);
      setIsMoving(true);
    }
  }, [ganttEvent, xStep, initEventX1Delta, onProgressChange, timeStep, onDateChange, svg, isMoving, point, setFailedTask, setGanttEvent]);
  var handleBarEventStart = useCallback(function (action, task, event) {
    try {
      return Promise.resolve(function () {
        if (!event) {
          if (action === "select") {
            setSelectedTask(task.id);
          }
        } else return function () {
            if (isKeyboardEvent(event)) {
              var _temp14 = function () {
                if (action === "delete") {
                  var _temp15 = function () {
                    if (onDelete) {
                      var _temp16 = _catch(function () {
                        return Promise.resolve(onDelete(task)).then(function (result) {
                          if (result !== undefined && result) {
                            setGanttEvent({
                              action: action,
                              changedTask: task
                            });
                          }
                        });
                      }, function (error) {
                        console.error("Error on Delete. " + error);
                      });

                      if (_temp16 && _temp16.then) return _temp16.then(function () {});
                    }
                  }();

                  if (_temp15 && _temp15.then) return _temp15.then(function () {});
                }
              }();

              if (_temp14 && _temp14.then) return _temp14.then(function () {});
            } else if (action === "mouseenter") {
                if (!ganttEvent.action) {
                  setGanttEvent({
                    action: action,
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

                var offsetX = event === null || event === void 0 ? void 0 : (_event$nativeEvent = event.nativeEvent) === null || _event$nativeEvent === void 0 ? void 0 : _event$nativeEvent.offsetX;
                var currentLogItem = tasks.filter(function (ele) {
                  return ele.id === task.id;
                });

                if (!(currentLogItem !== null && currentLogItem !== void 0 && (_currentLogItem$ = currentLogItem[0]) !== null && _currentLogItem$ !== void 0 && _currentLogItem$.end && currentLogItem !== null && currentLogItem !== void 0 && (_currentLogItem$2 = currentLogItem[0]) !== null && _currentLogItem$2 !== void 0 && _currentLogItem$2.start)) {
                  clickBaselineItem === null || clickBaselineItem === void 0 ? void 0 : clickBaselineItem(offsetX, currentLogItem[0]);
                }

                setGanttEvent({
                  action: action,
                  changedTask: task
                });
              } else if (action === "move") {
                  var _svg$current$getScree3;

                  if (!(svg !== null && svg !== void 0 && svg.current) || !point) return;
                  point.x = event.clientX;
                  var cursor = point.matrixTransform((_svg$current$getScree3 = svg.current.getScreenCTM()) === null || _svg$current$getScree3 === void 0 ? void 0 : _svg$current$getScree3.inverse());
                  setInitEventX1Delta(cursor.x - task.x1);
                  setGanttEvent({
                    action: action,
                    changedTask: task,
                    originalSelectedTask: task
                  });
                } else {
                  setGanttEvent({
                    action: action,
                    changedTask: task,
                    originalSelectedTask: task
                  });
                }
          }();
      }());
    } catch (e) {
      return Promise.reject(e);
    }
  }, [ganttEvent.action, onDelete, onDoubleClick, point, setGanttEvent, setSelectedTask, svg, clickBaselineItem, tasks]);
  var getLinkTypeId = useCallback(function (start, end) {
    var linkType = relationReverse(start, end);
    return ganttConfig.relation[linkType];
  }, [ganttConfig.relation]);
  var getHasLinkItems = useCallback(function (task) {
    var hasLinkItems = (task === null || task === void 0 ? void 0 : task.link) || {};
    var needUpdateItems = [];
    Object.keys(hasLinkItems).map(function (type) {
      if (hasLinkItems[type]) {
        Object.keys(hasLinkItems[type]).map(function (linkType) {
          if (hasLinkItems[type][linkType]) {
            needUpdateItems = needUpdateItems.concat(hasLinkItems[type][linkType]);
          }
        });
      }
    });
    return needUpdateItems;
  }, []);
  var checkIsPivotalPathLink = useCallback(function (task, target, tasks, relationType) {
    var targetPivotalPathItem = tasks.filter(function (ele) {
      return ele.id === target && (ele === null || ele === void 0 ? void 0 : ele.isPivotalPathItem);
    });

    if (task !== null && task !== void 0 && task.isPivotalPathItem && targetPivotalPathItem !== null && targetPivotalPathItem !== void 0 && targetPivotalPathItem.length && relationType === "FS") {
      return true;
    }

    return false;
  }, []);
  var checkIsErrorLink = useCallback(function (task, target) {
    var _task$item, _task$item2;

    var needUpdateItems = getHasLinkItems(task);
    var subItems = (task === null || task === void 0 ? void 0 : (_task$item = task.item) === null || _task$item === void 0 ? void 0 : _task$item.subItem) || [];
    var flag = false;
    var targetItems = needUpdateItems.filter(function (id) {
      return id === target;
    });

    if ((targetItems === null || targetItems === void 0 ? void 0 : targetItems.length) > 1) {
      flag = true;
      return flag;
    }

    if (((task === null || task === void 0 ? void 0 : (_task$item2 = task.item) === null || _task$item2 === void 0 ? void 0 : _task$item2.ancestors) || []).includes(target)) {
      flag = true;
      return flag;
    }

    subItems.forEach(function (item) {
      if (needUpdateItems.includes(item)) {
        flag = true;
      }
    });
    return flag;
  }, [getHasLinkItems]);
  useEffect(function () {
    if (isConnect) {
      import('jsplumb').then(function (_ref2) {
        var jsPlumb = _ref2.jsPlumb;
        jsPlumb.ready(function () {
          var instance = jsPlumb.getInstance();
          instance.fire("jsPlumbDemoLoaded", instance);
          setJsPlumbInstance(instance);
        });
      });
    }
  }, [isConnect]);
  useEffect(function () {
    if (jsPlumbInstance) {
      var originalOffset = jsPlumbInstance.getOffset;
      var originalSize = jsPlumbInstance.getSize;

      jsPlumbInstance.getOffset = function (el) {
        var tn = el.tagName.toUpperCase();

        if (offsetCalculators[tn]) {
          return offsetCalculators[tn](el);
        } else return originalOffset.apply(this, [el]);
      };

      jsPlumbInstance.getSize = function (el) {
        var tn = el.tagName.toUpperCase();

        if (sizeCalculators[tn]) {
          return sizeCalculators[tn](el);
        } else return originalSize.apply(this, [el]);
      };

      jsPlumbInstance.setContainer("horizontalContainer");
      jsPlumbInstance.bind("beforeDrop", function (conn) {
        var _taskSource$item, _taskTarget$item, _desinationTask, _desinationTask$item, _sourceTask, _sourceTask$item;

        var taskSource = filter(tasks, {
          id: conn.sourceId
        })[0];
        var taskTarget = filter(tasks, {
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

        var linkTypeId = getLinkTypeId(conn.connection.endpoints[0].anchor.cssClass, conn.dropEndpoint.anchor.cssClass);
        var currentLink = itemLinks === null || itemLinks === void 0 ? void 0 : itemLinks.filter(function (ele) {
          var _ele$source, _ele$destination, _ele$linkType;

          return ((_ele$source = ele.source) === null || _ele$source === void 0 ? void 0 : _ele$source.objectId) === (conn === null || conn === void 0 ? void 0 : conn.sourceId) && ((_ele$destination = ele.destination) === null || _ele$destination === void 0 ? void 0 : _ele$destination.objectId) === (conn === null || conn === void 0 ? void 0 : conn.targetId) && ((_ele$linkType = ele.linkType) === null || _ele$linkType === void 0 ? void 0 : _ele$linkType.objectId) === linkTypeId;
        });

        if (currentLink !== null && currentLink !== void 0 && currentLink.length) {
          message.warning("连线有误");
          return false;
        }

        var sourceTask;
        var desinationTask;
        tasks.map(function (task) {
          if (task.id === conn.sourceId) {
            sourceTask = task;
          }

          if (task.id === conn.sourceId) {
            desinationTask = task;
          }
        });
        var hasLinkItems = getHasLinkItems(sourceTask);

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
      jsPlumbInstance.bind("connection", function (infor, originalEvent) {
        var linkTypeId = getLinkTypeId(infor.connection.endpoints[0].anchor.cssClass, infor.connection.endpoints[1].anchor.cssClass);
        var params = {
          source: infor === null || infor === void 0 ? void 0 : infor.sourceId,
          destination: infor === null || infor === void 0 ? void 0 : infor.targetId,
          linkType: linkTypeId
        };

        if (originalEvent) {
          infor.connection.setData(linkTypeId);
          addConnection === null || addConnection === void 0 ? void 0 : addConnection(params);
        }
      });
      jsPlumbInstance.bind("click", function (connection, originalEvent) {
        jsPlumbInstance.select().removeClass("select-connection");
        connection.addClass("select-connection");
        setCurrentConnection === null || setCurrentConnection === void 0 ? void 0 : setCurrentConnection({
          originalEvent: originalEvent,
          connection: connection
        });
      });
    }

    return function () {
      if (jsPlumbInstance) {
        jsPlumbInstance.unbind("beforeDrop");
        jsPlumbInstance.unbind("connection");
        jsPlumbInstance.unbind("click");
      }
    };
  }, [jsPlumbInstance, itemLinks, tasks, getHasLinkItems, addConnection, ganttConfig.relation, getLinkTypeId, setCurrentConnection]);
  useEffect(function () {
    if (!(itemLinks !== null && itemLinks !== void 0 && itemLinks.length)) {
      if (!isEqual(connectUuids, [])) {
        setConnectUuids([]);
      }
    }

    if (itemLinks !== null && itemLinks !== void 0 && itemLinks.length && tasks.length && jsPlumbInstance) {
      var newConnectUuids = [];
      tasks.forEach(function (task) {
        var itemFilter = itemLinks === null || itemLinks === void 0 ? void 0 : itemLinks.filter(function (ele) {
          var _ele$source2;

          return ((_ele$source2 = ele.source) === null || _ele$source2 === void 0 ? void 0 : _ele$source2.objectId) === (task === null || task === void 0 ? void 0 : task.id);
        });
        itemFilter.forEach(function (ele) {
          var _ele$destination2, _ele$destination3, _ele$source3, _ele$destination4;

          var relationType = "";

          for (var key in ganttConfig.relation) {
            var _ele$linkType2;

            if (ganttConfig.relation[key] === ((_ele$linkType2 = ele.linkType) === null || _ele$linkType2 === void 0 ? void 0 : _ele$linkType2.objectId)) {
              relationType = key;
              continue;
            }
          }

          var isErrorLink = checkIsErrorLink(task, (_ele$destination2 = ele.destination) === null || _ele$destination2 === void 0 ? void 0 : _ele$destination2.objectId);
          var isPivotalPathLink = checkIsPivotalPathLink(task, (_ele$destination3 = ele.destination) === null || _ele$destination3 === void 0 ? void 0 : _ele$destination3.objectId, tasks, relationType);
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
  useEffect(function () {
    if (jsPlumbInstance && connectUuids.length && pointInited) {
      jsPlumbInstance.setSuspendDrawing(true);

      for (var i = 0; i < connectUuids.length; i++) {
        var uuidObj = connectUuids[i];
        var source = uuidObj.source,
            destination = uuidObj.destination,
            relationType = uuidObj.relationType,
            isErrorLink = uuidObj.isErrorLink,
            isPivotalPathLink = uuidObj.isPivotalPathLink;

        if (source && destination && relationType) {
          var _relationInit$relatio, _relationInit$relatio2;

          var uuid = [source + "-" + ((_relationInit$relatio = relationInit[relationType]) === null || _relationInit$relatio === void 0 ? void 0 : _relationInit$relatio[0]), destination + "-" + ((_relationInit$relatio2 = relationInit[relationType]) === null || _relationInit$relatio2 === void 0 ? void 0 : _relationInit$relatio2[1])];
          var connect = jsPlumbInstance.connect({
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

    return function () {
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
  }, tasks.map(function (task) {
    return task.barChildren.map(function (child) {
      return React.createElement(Arrow, {
        key: "Arrow from " + task.id + " to " + tasks[child].id,
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
  }, tasks.map(function (task) {
    var cuttentLog = logTasks.find(function (ele) {
      return ele.id === task.id;
    });

    if (cuttentLog) {
      cuttentLog.y = task.y;
    }

    return React.createElement("g", {
      key: "g-" + task.id
    }, !(cuttentLog !== null && cuttentLog !== void 0 && cuttentLog.start) || !(cuttentLog !== null && cuttentLog !== void 0 && cuttentLog.end) ? null : React.createElement(TaskItemLog, {
      task: cuttentLog,
      arrowIndent: arrowIndent,
      taskHeight: taskHeight,
      isProgressChangeable: !!onProgressChange && !task.isDisabled,
      isDateChangeable: !!onDateChange && !task.isDisabled,
      isDelete: !task.isDisabled,
      onEventStart: handleBarEventStart,
      key: task.id + "-log",
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

var styles$8 = {"ganttVerticalContainer":"_CZjuD","horizontalContainer":"_2B2zv","box":"_1OUoh","wrapper":"_3eULf","choosedBaselIne":"_1Dj-F","loaded":"_3Z0-o","task-gantt-wrapper":"_1XY6X","calendarWrapper":"_1Yq_L","ganttHeader":"_3AK9_","cursor":"_1s6IU","taskListWrapper":"_1WqXP","backgroundSvg":"_2g59X","contextContainer":"_3thyu","dividerWrapper":"_vHXuk","dividerContainer":"_8wIQn","maskLine":"_2Zpkt","maskLineTop":"_3FMpN","dividerIconWarpper":"__Gn1R","reverse":"_277Zr","guideInfor":"_3jotN","clickThis":"_1QPSE","displayPopover":"_3WXVd","displayRow":"_3YNAF","textAlignR":"_1zkpu","viewMode":"_2lFUt","todayBtn":"_25AiV","dataMode":"_gHoVA"};

var TaskGanttComponent = function TaskGanttComponent(_ref, ref) {
  var gridProps = _ref.gridProps,
      calendarProps = _ref.calendarProps,
      barProps = _ref.barProps,
      scrollX = _ref.scrollX,
      onScroll = _ref.onScroll,
      taskListHeight = _ref.taskListHeight,
      listBottomHeight = _ref.listBottomHeight,
      headerHeight = _ref.headerHeight;
  var dates = gridProps.dates,
      onDateChange = gridProps.onDateChange,
      columnWidth = gridProps.columnWidth;
  var viewMode = calendarProps.viewMode;

  var _useContext = useContext(GanttConfigContext),
      ganttConfig = _useContext.ganttConfig;

  var ganttSVGRef = useRef(null);
  var horizontalContainerRef = useRef(null);
  var verticalGanttContainerRef = useRef(null);

  var newBarProps = _extends({}, barProps, {
    svg: ganttSVGRef
  });

  useImperativeHandle(ref, function () {
    return {
      horizontalContainerRef: horizontalContainerRef.current,
      verticalGanttContainerRef: verticalGanttContainerRef.current
    };
  });

  var clickBaselineItem = function clickBaselineItem(offsetX, currentLogItem) {
    var startDate, endDate;

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
      marginBottom: listBottomHeight + "px"
    }
  }, React.createElement("div", {
    style: {
      height: headerHeight + "px"
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

var TaskGantt = memo(forwardRef(TaskGanttComponent));

var styles$9 = {"scroll":"_19jgW"};

var HorizontalScrollComponent = function HorizontalScrollComponent(_ref, ref) {
  var svgWidth = _ref.svgWidth,
      taskListWidth = _ref.taskListWidth,
      onScroll = _ref.onScroll,
      listBottomHeight = _ref.listBottomHeight;
  var dividerWidth = 15;
  return React.createElement("div", {
    style: {
      marginLeft: taskListWidth + dividerWidth,
      width: "calc(100% - " + taskListWidth + "px)",
      bottom: listBottomHeight + "px"
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
var HorizontalScroll = memo(forwardRef(HorizontalScrollComponent));

var styles$a = {"timeConfigTable":"_RtxeF","timeConfigAddBtn":"_z7sOS","width100":"_3YVQm","icon":"_J9ThB","timeTips":"_3yvG2","settingsModalContainer":"_3rfkd","otherConfig":"_FPmvI","question":"_212e-","displayPopover":"_31Cvc","displayRow":"_cYuLc","textAlignR":"_3mW_D","activeRotate":"_13Q7Y","collapse":"_ik7_-","extraHeader":"_2M_je","title":"_2tmi3","des":"_3U2u7"};

var Option = Select.Option;

var filterOption = function filterOption(input, option) {
  var _option$name;

  return (option === null || option === void 0 ? void 0 : (_option$name = option.name) === null || _option$name === void 0 ? void 0 : _option$name.toLowerCase().indexOf(input === null || input === void 0 ? void 0 : input.toLowerCase())) > -1;
};

var filterFields = function filterFields(type, customField) {
  return customField.filter(function (ele) {
    var _ele$fieldType;

    return (ele === null || ele === void 0 ? void 0 : (_ele$fieldType = ele.fieldType) === null || _ele$fieldType === void 0 ? void 0 : _ele$fieldType.key) === type;
  });
};
var filterDeleteFields = function filterDeleteFields(id, customField) {
  var filterData = find(customField, {
    objectId: id
  });
  return filterData ? filterData.objectId : null;
};

var ItemModal = function ItemModal(_ref) {
  var visible = _ref.visible,
      handleCancel = _ref.handleCancel,
      handleOk = _ref.handleOk,
      currentItem = _ref.currentItem,
      timeList = _ref.timeList;

  var _Form$useForm = Form.useForm(),
      form = _Form$useForm[0];

  var _useContext = useContext(ConfigHandleContext),
      itemTypeData = _useContext.itemTypeData,
      getCustomFields = _useContext.getCustomFields;

  var _useState = useState(false),
      isSelected = _useState[0],
      setIsSelected = _useState[1];

  var _useState2 = useState([]),
      customField = _useState2[0],
      setCustomField = _useState2[1];

  var _useState3 = useState(false),
      confirmLoading = _useState3[0],
      setConfirmLoading = _useState3[1];

  useEffect(function () {
    if (visible) {
      if (isSelected) {
        return;
      }

      form.resetFields();
      form.setFieldsValue({
        endDate: filterDeleteFields(currentItem.endDate, customField),
        itemType: filterDeleteFields("" + currentItem.itemType, itemTypeData),
        percentage: filterDeleteFields(currentItem.percentage, customField),
        startDate: filterDeleteFields(currentItem.startDate, customField),
        isDefault: currentItem.isDefault
      });
    }
  }, [visible, currentItem, form, customField, itemTypeData, isSelected]);
  useEffect(function () {
    var fetch = function fetch(currentItem) {
      try {
        return Promise.resolve(getCustomFields(currentItem)).then(function (fields) {
          setCustomField(fields);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    };

    if (visible) {
      fetch(currentItem);
    }
  }, [visible, getCustomFields, currentItem]);
  useEffect(function () {
    if (!visible) {
      setIsSelected(false);
    }
  }, [visible]);

  var handleConfirm = function handleConfirm() {
    form.validateFields().then(function (values) {
      try {
        return Promise.resolve(getCustomFields(currentItem)).then(function (fields) {
          Object.keys(omit(values, ["itemType"])).forEach(function (ele) {
            var fileldFilter = fields.filter(function (f) {
              return f.objectId === values[ele];
            });

            if (!fileldFilter.length) {
              var obj = {};
              obj[ele] = null;
              form.setFieldsValue(obj);
            }
          });
          form.validateFields().then(function () {
            try {
              setConfirmLoading(true);
              return Promise.resolve(handleOk(values)).then(function () {
                setConfirmLoading(false);
              });
            } catch (e) {
              return Promise.reject(e);
            }
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    })["catch"](function (info) {
      console.log("Validate Failed:", info);
    });
  };

  var itemCheck = function itemCheck(_, value) {
    if (value) {
      var itemFilter = timeList === null || timeList === void 0 ? void 0 : timeList.filter(function (item) {
        return item.itemType === value;
      });

      if (itemFilter !== null && itemFilter !== void 0 && itemFilter.length && currentItem.itemType !== value) {
        return Promise.reject(new Error("该事项类型已选择， 请重新选择"));
      }

      return Promise.resolve();
    } else {
      return Promise.resolve();
    }
  };

  var handelChange = function handelChange(val) {
    try {
      setIsSelected(true);
      return Promise.resolve(getCustomFields({
        itemType: val
      })).then(function (fields) {
        setCustomField(fields);
        form.setFieldsValue({
          startDate: undefined,
          endDate: undefined,
          percentage: undefined
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
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
  }, itemTypeData.map(function (ele) {
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
  }, filterFields("Date", customField).map(function (ele) {
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
  }, filterFields("Date", customField).map(function (ele) {
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
  }, filterFields("Number", customField).map(function (ele) {
    return React.createElement(Option, {
      value: ele.value,
      key: ele.value,
      name: ele.label
    }, ele.label);
  })))));
};

var Svg$2 = function Svg() {
  return /*#__PURE__*/React.createElement("svg", {
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
};

var IconComponent$2 = function IconComponent(props) {
  return /*#__PURE__*/React.createElement(Icon, _extends({
    component: Svg$2
  }, props));
};

var Time = function Time() {
  var _useState = useState(false),
      visible = _useState[0],
      setVisible = _useState[1];

  var columns = [{
    title: "关联事项",
    dataIndex: "itemType",
    key: "name",
    render: function render(text) {
      var _res$;

      var res = itemTypeData && itemTypeData.filter(function (ele) {
        return ele.value === text;
      });
      return ((_res$ = res[0]) === null || _res$ === void 0 ? void 0 : _res$.label) || React.createElement(Tooltip$1, {
        title: "\u6CA1\u6709\u914D\u7F6E\u7684\u5361\u7247\u7C7B\u578B\u5C06\u4F7F\u7528\u9ED8\u8BA4\u914D\u7F6E"
      }, "\u9ED8\u8BA4 \xA0", React.createElement(QuestionCircleOutlined, null));
    }
  }, {
    title: "操作",
    key: "action",
    width: 120,
    render: function render(_text, record, index) {
      return React.createElement(Space, null, React.createElement("a", {
        type: "link",
        onClick: function onClick() {
          return editTime(index);
        }
      }, "\u914D\u7F6E"), !(record !== null && record !== void 0 && record.isDefault) && React.createElement("a", {
        type: "link",
        onClick: function onClick() {
          return del(index);
        }
      }, "\u5220\u9664"));
    }
  }];

  var _useContext = useContext(ConfigHandleContext),
      configHandle = _useContext.configHandle,
      itemTypeData = _useContext.itemTypeData;

  var _useContext2 = useContext(GanttConfigContext),
      ganttConfig = _useContext2.ganttConfig;

  var _useState2 = useState({}),
      currentItem = _useState2[0],
      setCurrentItem = _useState2[1];

  var _useState3 = useState(0),
      index = _useState3[0],
      setIndex = _useState3[1];

  var timeList = useMemo(function () {
    var _ganttConfig$time;

    return ganttConfig !== null && ganttConfig !== void 0 && (_ganttConfig$time = ganttConfig.time) !== null && _ganttConfig$time !== void 0 && _ganttConfig$time.length ? ganttConfig === null || ganttConfig === void 0 ? void 0 : ganttConfig.time : [{
      isDefault: true
    }];
  }, [ganttConfig === null || ganttConfig === void 0 ? void 0 : ganttConfig.time]);
  var handleCancel = useCallback(function () {
    setVisible(false);
  }, []);

  var handleOk = function handleOk(values) {
    try {
      var newTimeList;

      if (Object.keys(currentItem).length) {
        newTimeList = [].concat(timeList);

        if (currentItem !== null && currentItem !== void 0 && currentItem.isDefault) {
          values.isDefault = currentItem === null || currentItem === void 0 ? void 0 : currentItem.isDefault;
        }

        newTimeList[index] = values;
      } else {
        newTimeList = [].concat(timeList, [values]);
      }

      setVisible(false);
      configHandle(_extends({}, ganttConfig, {
        time: newTimeList
      }));
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var addTime = useCallback(function () {
    setVisible(true);
    setCurrentItem({});
  }, []);
  var editTime = useCallback(function (index) {
    setIndex(index);
    setCurrentItem(timeList[index]);
    setVisible(true);
  }, [timeList]);

  var del = function del(index) {
    Modal.confirm({
      title: "删除该配置",
      content: "删除后无法恢复。您确定删除吗？",
      okText: "确认",
      cancelText: "取消",
      onOk: function onOk() {
        return delConfig(index);
      }
    });
  };

  var delConfig = function delConfig(index) {
    var newTimeList = [].concat(timeList);
    newTimeList.splice(index, 1);
    configHandle(_extends({}, ganttConfig, {
      time: newTimeList
    }));
  };

  return React.createElement("div", null, React.createElement(ItemModal, {
    visible: visible,
    handleCancel: handleCancel,
    handleOk: handleOk,
    currentItem: currentItem,
    timeList: timeList
  }), React.createElement("div", {
    className: "" + styles$a.timeTips
  }, React.createElement("em", null, React.createElement(IconComponent$2, {
    style: {
      color: "red"
    }
  })), "\u4E3A\u4E86\u8BA9\u7518\u7279\u56FE\u6B63\u786E\u663E\u793A\uFF0C\u60A8\u9700\u8981\u8BBE\u7F6E\u7518\u7279\u56FE\u4E2D\u65F6\u95F4\u533A\u5757\u7684\u8D77\u6B62\u65F6\u95F4\u5BF9\u5E94\u4E8B\u9879\u7684\u54EA\u4E2A\u65F6\u95F4\u5B57\u6BB5"), React.createElement(Table, {
    columns: columns,
    dataSource: timeList,
    pagination: false,
    className: styles$a.timeConfigTable,
    rowKey: function rowKey(columns) {
      return columns.itemType || "default";
    }
  }), React.createElement("div", {
    className: styles$a.timeConfigAddBtn
  }, React.createElement(Button, {
    icon: React.createElement(PlusOutlined, null),
    type: "link",
    onClick: addTime
  }, "\u65B0\u589E\u914D\u7F6E")));
};

var confirm = Modal.confirm;

var OtherConfig = function OtherConfig() {
  var _useState = useState(false),
      checked = _useState[0],
      setChecked = _useState[1];

  var _useContext = useContext(GanttConfigContext),
      ganttConfig = _useContext.ganttConfig;

  var _useContext2 = useContext(ConfigHandleContext),
      configHandle = _useContext2.configHandle;

  var otherConfig = useMemo(function () {
    return ganttConfig === null || ganttConfig === void 0 ? void 0 : ganttConfig.otherConfig;
  }, [ganttConfig === null || ganttConfig === void 0 ? void 0 : ganttConfig.otherConfig]);
  useEffect(function () {
    setChecked(otherConfig === null || otherConfig === void 0 ? void 0 : otherConfig.autoPatch);
  }, [otherConfig === null || otherConfig === void 0 ? void 0 : otherConfig.autoPatch]);

  var onChange = function onChange(value) {
    if (!value) {
      setChecked(value);
      configHandle(_extends({}, ganttConfig, {
        otherConfig: _extends({}, ganttConfig.otherConfig, {
          autoPatch: value
        })
      }));
      return;
    }

    confirm({
      title: "自动编排",
      okText: "确定",
      cancelText: "取消",
      content: "开启自动编排时，将按当前的事项关系自动调整所有事项的时间。确认开启？",
      onOk: function onOk() {
        setChecked(value);
        configHandle(_extends({}, ganttConfig, {
          otherConfig: _extends({}, ganttConfig.otherConfig, {
            autoPatch: value
          })
        }));
      },
      onCancel: function onCancel() {
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

var TextArea = Input.TextArea;
var AddEdit = function AddEdit(_ref) {
  var visible = _ref.visible,
      handleOk = _ref.handleOk,
      handleCancel = _ref.handleCancel,
      currentBaseline = _ref.currentBaseline;

  var _Form$useForm = Form.useForm(),
      form = _Form$useForm[0];

  var _useState = useState(false),
      modalVisible = _useState[0],
      setModalVisible = _useState[1];

  var _useState2 = useState(false),
      confirmLoading = _useState2[0],
      setConfirmLoading = _useState2[1];

  var _useContext = useContext(BaseLineContext),
      baselineList = _useContext.baselineList;

  console.log(currentBaseline, "currentBaseline");
  var isEdit = useMemo(function () {
    return !!(currentBaseline !== null && currentBaseline !== void 0 && currentBaseline.objectId);
  }, [currentBaseline]);
  useEffect(function () {
    setModalVisible(visible);
  }, [visible]);
  useEffect(function () {
    form.setFieldsValue({
      name: currentBaseline !== null && currentBaseline !== void 0 && currentBaseline.name ? currentBaseline === null || currentBaseline === void 0 ? void 0 : currentBaseline.name : dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      description: currentBaseline === null || currentBaseline === void 0 ? void 0 : currentBaseline.description
    });
  }, [currentBaseline, form]);

  var onFinish = function onFinish() {};

  var confirmOk = function confirmOk() {
    form.validateFields().then(function (values) {
      try {
        setConfirmLoading(true);
        return Promise.resolve(handleOk(Object.assign(currentBaseline, values))).then(function () {
          setConfirmLoading(false);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    })["catch"](function (info) {
      console.log("Validate Failed:", info);
    });
  };

  var nameValidator = function nameValidator(_ref2, value, callback) {
    _objectDestructuringEmpty(_ref2);

    if (!value) {
      callback();
    } else {
      var findRepeat = baselineList === null || baselineList === void 0 ? void 0 : baselineList.filter(function (ele) {
        return ele.name === value;
      });

      if (findRepeat.length && currentBaseline && currentBaseline.name !== value) {
        callback("该名称已存在");
      } else {
        callback();
      }
    }
  };

  return React.createElement(Modal, {
    title: (isEdit ? "编辑" : "新建") + "\u57FA\u7EBF",
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

var Svg$3 = function Svg() {
  return /*#__PURE__*/React.createElement("svg", {
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
};

var IconComponent$3 = function IconComponent(props) {
  return /*#__PURE__*/React.createElement(Icon, _extends({
    component: Svg$3
  }, props));
};

var styles$b = {"list":"_3s_ej","activeBaseline":"_1G5xN","content":"_34gkh","name":"_3vW_9","time":"_1g8Mb","createTime":"_33-L9","handleIcon":"_VphrR","cursor":"_3VfsG","panel":"_3B5gw","createBaseline":"_1k5ei","dot":"_2Jsus","ml8":"_e5wsD","checkedIcon":"_1UH6O"};

var BaseLine = function BaseLine() {
  var _useContext = useContext(BaseLineContext),
      baseLineHandle = _useContext.baseLineHandle,
      baselineList = _useContext.baselineList,
      setCurrentLog = _useContext.setCurrentLog,
      currentLog = _useContext.currentLog,
      OverflowTooltip = _useContext.OverflowTooltip,
      setLogTasks = _useContext.setLogTasks;

  var deleteBaseline = function deleteBaseline(currentBaseline) {
    Modal.confirm({
      title: "删除基线",
      content: "删除的基线无法恢复，确认删除？",
      okText: "确认",
      cancelText: "取消",
      onOk: function onOk() {
        return baseLineHandle(currentBaseline);
      }
    });
  };

  var handleMenuClick = function handleMenuClick(type, e, currentBaseLine) {
    var currentBaselineOmit = omit(currentBaseLine, ["createdAt", "updatedAt"]);
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

  var _useState = useState(false),
      visible = _useState[0],
      setVisible = _useState[1];

  var _useState2 = useState({}),
      currentBaseline = _useState2[0],
      setCurrentBaseline = _useState2[1];

  var addBaseline = function addBaseline() {
    setVisible(true);
    setCurrentBaseline({});
  };

  var handleOk = useCallback(function (value) {
    try {
      return Promise.resolve(baseLineHandle(value, value.objectId ? "edit" : "add")).then(function () {
        setVisible(false);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }, [baseLineHandle]);

  var handleCancel = function handleCancel() {
    setVisible(false);
  };

  var chooseLog = function chooseLog(infor) {
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
  }, "\u521B\u5EFA\u57FA\u7EBF\uFF08" + (baselineList === null || baselineList === void 0 ? void 0 : baselineList.length) + "/10\uFF09")), visible && React.createElement(AddEdit, {
    visible: visible,
    handleOk: handleOk,
    handleCancel: handleCancel,
    currentBaseline: currentBaseline
  }), React.createElement("ul", {
    className: styles$b.list
  }, baselineList.map(function (ele) {
    return React.createElement("li", {
      key: ele.objectId,
      className: currentLog && ele.objectId === currentLog.objectId ? styles$b.activeBaseline : undefined
    }, ele.objectId === (currentLog === null || currentLog === void 0 ? void 0 : currentLog.objectId) && React.createElement("div", {
      className: styles$b.checkedIcon
    }, React.createElement(IconComponent$3, null)), React.createElement("div", {
      className: styles$b.content + " " + styles$b.cursor,
      onClick: function onClick() {
        return chooseLog(ele);
      }
    }, React.createElement("div", {
      className: styles$b.name
    }, OverflowTooltip(ele.name)), React.createElement("div", {
      className: styles$b.time
    }, React.createElement("div", {
      className: styles$b.createTime
    }, "\u521B\u5EFA\u4E8E\uFF1A", dayjs(new Date(ele.createdAt)).format(dayTimeFormat)), React.createElement("div", {
      className: styles$b.handleIcon
    }, React.createElement(EditOutlined, {
      onClick: function onClick(e) {
        return handleMenuClick("edit", e, ele);
      }
    }), React.createElement(DeleteOutlined, {
      onClick: function onClick(e) {
        return handleMenuClick("del", e, ele);
      }
    })))));
  })));
};

var Display = function Display(_ref) {
  var _currentValue$otherCo, _currentValue$otherCo2;

  var ganttConfig = _ref.ganttConfig,
      configHandle = _ref.configHandle;

  var _useState = useState({}),
      currentValue = _useState[0],
      setCurrentValue = _useState[1];

  useEffect(function () {
    setCurrentValue(_extends({}, ganttConfig, {
      isChanged: false
    }));
  }, [ganttConfig]);

  var handleChange = function handleChange(value, type) {
    var _extends2;

    var newConfig = _extends({}, currentValue, {
      otherConfig: _extends({}, currentValue.otherConfig, (_extends2 = {}, _extends2[type] = value, _extends2)),
      isChanged: true
    });

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
    onChange: function onChange(checked) {
      return handleChange(checked, "pivotalPath");
    },
    checked: currentValue === null || currentValue === void 0 ? void 0 : (_currentValue$otherCo = currentValue.otherConfig) === null || _currentValue$otherCo === void 0 ? void 0 : _currentValue$otherCo.pivotalPath
  }))), React.createElement(Row, null, React.createElement(Col, {
    span: 14
  }, "\u903E\u671F\u7684\u4E8B\u9879"), React.createElement(Col, {
    span: 10,
    className: styles$a.textAlignR
  }, React.createElement(Switch, {
    onChange: function onChange(checked) {
      return handleChange(checked, "overdue");
    },
    checked: currentValue === null || currentValue === void 0 ? void 0 : (_currentValue$otherCo2 = currentValue.otherConfig) === null || _currentValue$otherCo2 === void 0 ? void 0 : _currentValue$otherCo2.overdue
  }))));
};

var Svg$4 = function Svg() {
  return /*#__PURE__*/React.createElement("svg", {
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
};

var IconComponent$4 = function IconComponent(props) {
  return /*#__PURE__*/React.createElement(Icon, _extends({
    component: Svg$4
  }, props));
};

var Panel = Collapse.Panel;

var GanttConfig = function GanttConfig(_ref) {
  var toGantt = _ref.toGantt,
      visible = _ref.visible,
      currentPanel = _ref.currentPanel,
      configHandle = _ref.configHandle,
      ganttConfig = _ref.ganttConfig;

  var _useState = useState([]),
      activeKey = _useState[0],
      setActiveKey = _useState[1];

  useEffect(function () {
    if (currentPanel) {
      setActiveKey([currentPanel]);
    } else {
      setActiveKey([]);
    }
  }, [currentPanel]);

  var onChange = function onChange(val) {
    if (isArray(val)) {
      setActiveKey([].concat(val));
    }
  };

  var genHeader = function genHeader() {
    return React.createElement("span", {
      className: styles$a.extraHeader
    }, React.createElement("span", {
      className: styles$a.title
    }, "\u57FA\u7EBF"), React.createElement("span", {
      className: styles$a.des
    }, "\uFF08\u70B9\u51FB\u57FA\u7EBF\u5361\u7247\u53EF\u9009\u62E9\u663E\u793A\u57FA\u7EBF\uFF09"));
  };

  return React.createElement(Drawer, {
    title: "\u7518\u7279\u56FE\u8BBE\u7F6E",
    visible: visible,
    onClose: function onClose() {
      return toGantt();
    },
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
    expandIcon: function expandIcon(_ref2) {
      var isActive = _ref2.isActive;
      return React.createElement(IconComponent$4, {
        className: isActive ? styles$a.activeRotate : ""
      });
    },
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

var GuideModal = function GuideModal(_ref) {
  var visible = _ref.visible,
      toPanel = _ref.toPanel,
      toCancel = _ref.toCancel;

  var _useState = useState(false),
      modalVisible = _useState[0],
      setModalVisible = _useState[1];

  useEffect(function () {
    setModalVisible(visible);
  }, [visible]);
  var toConfig = useCallback(function () {
    toPanel();
  }, [toPanel]);
  var handleCancel = useCallback(function () {
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

var Svg$5 = function Svg() {
  return /*#__PURE__*/React.createElement("svg", {
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
    "in": "SourceAlpha",
    result: "shadowOffsetOuter1"
  }), /*#__PURE__*/React.createElement("feGaussianBlur", {
    stdDeviation: "1.5",
    "in": "shadowOffsetOuter1",
    result: "shadowBlurOuter1"
  }), /*#__PURE__*/React.createElement("feColorMatrix", {
    values: "0 0 0 0 0.0352941176   0 0 0 0 0.117647059   0 0 0 0 0.258823529  0 0 0 0.162778628 0",
    type: "matrix",
    "in": "shadowBlurOuter1",
    result: "shadowMatrixOuter1"
  }), /*#__PURE__*/React.createElement("feOffset", {
    dx: "0",
    dy: "0",
    "in": "SourceAlpha",
    result: "shadowOffsetOuter2"
  }), /*#__PURE__*/React.createElement("feGaussianBlur", {
    stdDeviation: "0.5",
    "in": "shadowOffsetOuter2",
    result: "shadowBlurOuter2"
  }), /*#__PURE__*/React.createElement("feColorMatrix", {
    values: "0 0 0 0 0.0352941176   0 0 0 0 0.117647059   0 0 0 0 0.258823529  0 0 0 0.34099104 0",
    type: "matrix",
    "in": "shadowBlurOuter2",
    result: "shadowMatrixOuter2"
  }), /*#__PURE__*/React.createElement("feMerge", null, /*#__PURE__*/React.createElement("feMergeNode", {
    "in": "shadowMatrixOuter1"
  }), /*#__PURE__*/React.createElement("feMergeNode", {
    "in": "shadowMatrixOuter2"
  }))), /*#__PURE__*/React.createElement("filter", {
    "color-interpolation-filters": "auto",
    id: "filter-3"
  }, /*#__PURE__*/React.createElement("feColorMatrix", {
    "in": "SourceGraphic",
    type: "matrix",
    values: "0 0 0 0 0.180392 0 0 0 0 0.250980 0 0 0 0 0.368627 0 0 0 1.000000 0"
  })), /*#__PURE__*/React.createElement("filter", {
    "color-interpolation-filters": "auto",
    id: "filter-4"
  }, /*#__PURE__*/React.createElement("feColorMatrix", {
    "in": "SourceGraphic",
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
};

var IconComponent$5 = function IconComponent(props) {
  return /*#__PURE__*/React.createElement(Icon, _extends({
    component: Svg$5
  }, props));
};

var getLocalStorageItem = function getLocalStorageItem(key, defalut) {
  if (defalut === void 0) {
    defalut = "";
  }

  try {
    if (typeof window !== "undefined") {
      var item = localStorage.getItem(key);
      return item && JSON.parse(item) || defalut;
    }
  } catch (e) {
    return localStorage.getItem(key) || defalut;
  }
};
var setLocalStorageItem = function setLocalStorageItem(key, value) {
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
  getLocalStorageItem: getLocalStorageItem,
  setLocalStorageItem: setLocalStorageItem
};

var TabPane = Tabs.TabPane;

var DataMode = function DataMode(_ref) {
  var toToday = _ref.toToday,
      modeChange = _ref.modeChange,
      todayX = _ref.todayX,
      svgContainerWidth = _ref.svgContainerWidth,
      refScrollX = _ref.refScrollX;

  var handleChange = function handleChange(value) {
    modeChange(value);
  };

  var isShowToday = useMemo(function () {
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
  }, viewModeOptions.map(function (ele) {
    return React.createElement(TabPane, {
      tab: ele.label,
      key: ele.value
    });
  }))));
};

var _widthData;
var widthData = (_widthData = {}, _widthData[ViewMode.Month] = 300, _widthData[ViewMode.Week] = 210, _widthData[ViewMode.Year] = 240, _widthData[ViewMode.Quarter] = 180, _widthData);
var Gantt = function Gantt(_ref) {
  var _taskGanttContainerRe2, _wrapperRef$current3, _wrapperRef$current4, _taskListRef$current, _tasks, _taskListRef$current2, _tasks2;

  var tasks = _ref.tasks,
      baseLineLog = _ref.baseLineLog,
      isUpdate = _ref.isUpdate,
      _ref$headerHeight = _ref.headerHeight,
      headerHeight = _ref$headerHeight === void 0 ? 41 : _ref$headerHeight,
      _ref$listCellWidth = _ref.listCellWidth,
      listCellWidth = _ref$listCellWidth === void 0 ? "155px" : _ref$listCellWidth,
      _ref$listWidth = _ref.listWidth,
      listWidth = _ref$listWidth === void 0 ? 496 : _ref$listWidth,
      _ref$listBottomHeight = _ref.listBottomHeight,
      listBottomHeight = _ref$listBottomHeight === void 0 ? 48 : _ref$listBottomHeight,
      _ref$rowHeight = _ref.rowHeight,
      rowHeight = _ref$rowHeight === void 0 ? 41 : _ref$rowHeight,
      _ref$locale = _ref.locale,
      locale = _ref$locale === void 0 ? "zh-cn" : _ref$locale,
      _ref$barFill = _ref.barFill,
      barFill = _ref$barFill === void 0 ? 60 : _ref$barFill,
      _ref$barCornerRadius = _ref.barCornerRadius,
      barCornerRadius = _ref$barCornerRadius === void 0 ? 4 : _ref$barCornerRadius,
      _ref$barProgressColor = _ref.barProgressColor,
      barProgressColor = _ref$barProgressColor === void 0 ? "#4B8BFF" : _ref$barProgressColor,
      _ref$barProgressSelec = _ref.barProgressSelectedColor,
      barProgressSelectedColor = _ref$barProgressSelec === void 0 ? "#4B8BFF" : _ref$barProgressSelec,
      _ref$barBackgroundCol = _ref.barBackgroundColor,
      barBackgroundColor = _ref$barBackgroundCol === void 0 ? "#4B8BFF" : _ref$barBackgroundCol,
      _ref$barBackgroundSel = _ref.barBackgroundSelectedColor,
      barBackgroundSelectedColor = _ref$barBackgroundSel === void 0 ? "#4B8BFF" : _ref$barBackgroundSel,
      _ref$projectProgressC = _ref.projectProgressColor,
      projectProgressColor = _ref$projectProgressC === void 0 ? "#7db59a" : _ref$projectProgressC,
      _ref$projectProgressS = _ref.projectProgressSelectedColor,
      projectProgressSelectedColor = _ref$projectProgressS === void 0 ? "#59a985" : _ref$projectProgressS,
      _ref$projectBackgroun = _ref.projectBackgroundColor,
      projectBackgroundColor = _ref$projectBackgroun === void 0 ? "#fac465" : _ref$projectBackgroun,
      _ref$projectBackgroun2 = _ref.projectBackgroundSelectedColor,
      projectBackgroundSelectedColor = _ref$projectBackgroun2 === void 0 ? "#f7bb53" : _ref$projectBackgroun2,
      _ref$milestoneBackgro = _ref.milestoneBackgroundColor,
      milestoneBackgroundColor = _ref$milestoneBackgro === void 0 ? "#f1c453" : _ref$milestoneBackgro,
      _ref$milestoneBackgro2 = _ref.milestoneBackgroundSelectedColor,
      milestoneBackgroundSelectedColor = _ref$milestoneBackgro2 === void 0 ? "#f29e4c" : _ref$milestoneBackgro2,
      _ref$handleWidth = _ref.handleWidth,
      handleWidth = _ref$handleWidth === void 0 ? 2 : _ref$handleWidth,
      _ref$timeStep = _ref.timeStep,
      timeStep = _ref$timeStep === void 0 ? 300000 : _ref$timeStep,
      _ref$arrowColor = _ref.arrowColor,
      arrowColor = _ref$arrowColor === void 0 ? "grey" : _ref$arrowColor,
      _ref$fontFamily = _ref.fontFamily,
      fontFamily = _ref$fontFamily === void 0 ? "Arial, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue" : _ref$fontFamily,
      _ref$fontSize = _ref.fontSize,
      fontSize = _ref$fontSize === void 0 ? "14px" : _ref$fontSize,
      _ref$arrowIndent = _ref.arrowIndent,
      arrowIndent = _ref$arrowIndent === void 0 ? 20 : _ref$arrowIndent,
      _ref$todayColor = _ref.todayColor,
      todayColor = _ref$todayColor === void 0 ? "#FFAB00" : _ref$todayColor,
      _ref$TooltipContent = _ref.TooltipContent,
      TooltipContent = _ref$TooltipContent === void 0 ? StandardTooltipContent : _ref$TooltipContent,
      onDateChange = _ref.onDateChange,
      onProgressChange = _ref.onProgressChange,
      onDoubleClick = _ref.onDoubleClick,
      onDelete = _ref.onDelete,
      onSelect = _ref.onSelect,
      renderTaskListComponent = _ref.renderTaskListComponent,
      renderOverflowTooltip = _ref.renderOverflowTooltip,
      renderUserAvatar = _ref.renderUserAvatar,
      _ref$itemTypeData = _ref.itemTypeData,
      itemTypeData = _ref$itemTypeData === void 0 ? [] : _ref$itemTypeData,
      configHandle = _ref.configHandle,
      baseLineHandle = _ref.baseLineHandle,
      setCurrentLog = _ref.setCurrentLog,
      _ref$ganttConfig = _ref.ganttConfig,
      ganttConfig = _ref$ganttConfig === void 0 ? {} : _ref$ganttConfig,
      _ref$itemLinks = _ref.itemLinks,
      itemLinks = _ref$itemLinks === void 0 ? [] : _ref$itemLinks,
      addConnection = _ref.addConnection,
      delConnection = _ref.delConnection,
      _ref$baselineList = _ref.baselineList,
      baselineList = _ref$baselineList === void 0 ? [] : _ref$baselineList,
      currentLog = _ref.currentLog,
      actionRef = _ref.actionRef,
      workspaceId = _ref.workspaceId,
      getCustomFields = _ref.getCustomFields,
      _ref$isConnect = _ref.isConnect,
      isConnect = _ref$isConnect === void 0 ? true : _ref$isConnect,
      _ref$isViewModeChange = _ref.isViewModeChange,
      isViewModeChange = _ref$isViewModeChange === void 0 ? true : _ref$isViewModeChange,
      onMouseEvent = _ref.onMouseEvent,
      onClickEvent = _ref.onClickEvent,
      configVisibleChange = _ref.configVisibleChange,
      _ref$tableQuerySelect = _ref.tableQuerySelector,
      tableQuerySelector = _ref$tableQuerySelect === void 0 ? ".BaseTable__table-main .BaseTable__body" : _ref$tableQuerySelect;
  var wrapperRef = useRef(null);
  var taskListRef = useRef(null);
  var onMouseEventRef = useRef(null);
  var taskGanttContainerRef = useRef({});
  var verticalScrollContainerRef = useRef(null);
  var horizontalScrollContainerRef = useRef(null);

  var _useState = useState(ViewMode.Day),
      viewMode = _useState[0],
      setViewMode = _useState[1];

  var _useState2 = useState(60),
      columnWidth = _useState2[0],
      setColumnWidth = _useState2[1];

  var _useState3 = useState(function () {
    var _ganttDateRange = ganttDateRange(viewMode),
        startDate = _ganttDateRange[0],
        endDate = _ganttDateRange[1];

    return {
      viewMode: viewMode,
      dates: seedDates(startDate, endDate, viewMode)
    };
  }),
      dateSetup = _useState3[0],
      setDateSetup = _useState3[1];

  var CACHE_LIST_WIDTH_KEY = "gantt-cache-list-width";
  var cacheListWidth = utils.getLocalStorageItem(CACHE_LIST_WIDTH_KEY);
  var initListWidth = useMemo(function () {
    return cacheListWidth || listWidth;
  }, [listWidth, cacheListWidth]);

  var _useState4 = useState(rowHeight * barFill / 100),
      taskHeight = _useState4[0],
      setTaskHeight = _useState4[1];

  var _useState5 = useState(initListWidth),
      taskListWidth = _useState5[0],
      setTaskListWidth = _useState5[1];

  var _useState6 = useState(0),
      svgContainerWidth = _useState6[0],
      setSvgContainerWidth = _useState6[1];

  var _useState7 = useState(0),
      ganttHeight = _useState7[0],
      setGanttHeight = _useState7[1];

  var _useState8 = useState(ganttHeight),
      svgContainerHeight = _useState8[0],
      setSvgContainerHeight = _useState8[1];

  var _useState9 = useState([]),
      barTasks = _useState9[0],
      setBarTasks = _useState9[1];

  var _useState10 = useState([]),
      logTasks = _useState10[0],
      setLogTasks = _useState10[1];

  var _useState11 = useState(true),
      isTableScrollX = _useState11[0],
      setIsTableScrollX = _useState11[1];

  var _useState12 = useState({
    action: ""
  }),
      ganttEvent = _useState12[0],
      setGanttEvent = _useState12[1];

  var _useState13 = useState(null),
      currentConnection = _useState13[0],
      setCurrentConnection = _useState13[1];

  var _useState14 = useState(),
      selectedTask = _useState14[0],
      setSelectedTask = _useState14[1];

  var _useState15 = useState(null),
      failedTask = _useState15[0],
      setFailedTask = _useState15[1];

  var eleListTableBodyRef = useRef(null);

  var _useState16 = useState(0),
      scrollY = _useState16[0],
      setScrollY = _useState16[1];

  var _useState17 = useState(0),
      scrollX = _useState17[0],
      setScrollX = _useState17[1];

  var refScrollY = useRef(0);
  var refScrollX = useRef(0);

  var _useState18 = useState(false),
      visible = _useState18[0],
      setVisible = _useState18[1];

  var _useState19 = useState(false),
      ignoreScrollEvent = _useState19[0],
      setIgnoreScrollEvent = _useState19[1];

  var _useState20 = useState(false),
      guideModalVisible = _useState20[0],
      setGuideModalVisible = _useState20[1];

  var _useState21 = useState(""),
      currentPanel = _useState21[0],
      setCurrentPanel = _useState21[1];

  var dividerPositionRef = useRef({
    left: 0
  });
  var svgWidth = dateSetup.dates.length * columnWidth;
  var ganttFullHeight = barTasks.length * rowHeight;
  var minWidth = 2;
  var paddingLeft = 38;
  useEffect(function () {
    var _ganttDateRange2 = ganttDateRange(viewMode),
        startDate = _ganttDateRange2[0],
        endDate = _ganttDateRange2[1];

    var newDates = seedDates(startDate, endDate, viewMode);
    setDateSetup({
      dates: newDates,
      viewMode: viewMode
    });
    setBarTasks(convertToBarTasks(tasks, newDates, columnWidth, rowHeight, taskHeight, barCornerRadius, handleWidth, barProgressColor, barProgressSelectedColor, barBackgroundColor, barBackgroundSelectedColor, projectProgressColor, projectProgressSelectedColor, projectBackgroundColor, projectBackgroundSelectedColor, milestoneBackgroundColor, milestoneBackgroundSelectedColor, viewMode));
  }, [tasks, isUpdate, viewMode, rowHeight, barCornerRadius, columnWidth, taskHeight, handleWidth, barProgressColor, barProgressSelectedColor, barBackgroundColor, barBackgroundSelectedColor, projectProgressColor, projectProgressSelectedColor, projectBackgroundColor, projectBackgroundSelectedColor, milestoneBackgroundColor, milestoneBackgroundSelectedColor]);
  useEffect(function () {
    var _ganttDateRange3 = ganttDateRange(viewMode),
        startDate = _ganttDateRange3[0],
        endDate = _ganttDateRange3[1];

    var newDates = seedDates(startDate, endDate, viewMode);

    if (baseLineLog !== null && baseLineLog !== void 0 && baseLineLog.length) {
      setLogTasks(convertToBarTasks(tasks = baseLineLog, newDates, columnWidth, rowHeight, taskHeight, barCornerRadius, handleWidth, barProgressColor, barProgressSelectedColor, barBackgroundColor, barBackgroundSelectedColor, projectProgressColor, projectProgressSelectedColor, projectBackgroundColor, projectBackgroundSelectedColor, milestoneBackgroundColor, milestoneBackgroundSelectedColor, viewMode));
    }
  }, [baseLineLog, isUpdate, viewMode, rowHeight, barCornerRadius, columnWidth, taskHeight, handleWidth, barProgressColor, barProgressSelectedColor, barBackgroundColor, barBackgroundSelectedColor, projectProgressColor, projectProgressSelectedColor, projectBackgroundColor, projectBackgroundSelectedColor, milestoneBackgroundColor, milestoneBackgroundSelectedColor]);
  useEffect(function () {
    var changedTask = ganttEvent.changedTask,
        action = ganttEvent.action;

    if (changedTask) {
      onMouseEventRef.current = changedTask;

      if (action === "delete") {
        setGanttEvent({
          action: ""
        });
        setBarTasks(barTasks.filter(function (t) {
          return t.id !== changedTask.id;
        }));
      } else if (action === "move" || action === "end" || action === "start" || action === "progress") {
        var prevStateTask = barTasks.find(function (t) {
          return t.id === changedTask.id;
        });

        if (prevStateTask && (prevStateTask.start.getTime() !== changedTask.start.getTime() || prevStateTask.end.getTime() !== changedTask.end.getTime() || prevStateTask.progress !== changedTask.progress)) {
          var newTaskList = barTasks.map(function (t) {
            return t.id === changedTask.id ? changedTask : t;
          });
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
  useEffect(function () {
    if (failedTask) {
      setBarTasks(barTasks.map(function (t) {
        return t.id !== failedTask.id ? t : failedTask;
      }));
      setFailedTask(null);
    }
  }, [failedTask, barTasks]);
  useEffect(function () {
    var newTaskHeight = rowHeight * barFill / 100;

    if (newTaskHeight !== taskHeight) {
      setTaskHeight(newTaskHeight);
    }
  }, [rowHeight, barFill, taskHeight]);
  useEffect(function () {
    if (!listCellWidth) {
      setTaskListWidth(0);
    }

    if (taskListRef.current) {
      setTaskListWidth(taskListRef.current.offsetWidth);
    }
  }, [taskListRef, listCellWidth]);
  useEffect(function () {
    if (wrapperRef.current) {
      if (tasks.length) {
        setTaskListWidth(initListWidth);
      } else {
        var _wrapperRef$current;

        setTaskListWidth(wrapperRef === null || wrapperRef === void 0 ? void 0 : (_wrapperRef$current = wrapperRef.current) === null || _wrapperRef$current === void 0 ? void 0 : _wrapperRef$current.offsetWidth);
      }
    }
  }, [tasks.length, initListWidth]);
  useEffect(function () {
    if (wrapperRef.current) {
      setSvgContainerWidth(wrapperRef.current.offsetWidth - taskListWidth);
    }
  }, [wrapperRef, taskListWidth]);
  useEffect(function () {
    if (ganttHeight) {
      setSvgContainerHeight(ganttHeight + headerHeight);
    } else {
      setSvgContainerHeight(tasks.length * rowHeight + headerHeight);
    }
  }, [ganttHeight, tasks, headerHeight, rowHeight]);
  useEffect(function () {
    var _taskGanttContainerRe;

    var ele = taskGanttContainerRef === null || taskGanttContainerRef === void 0 ? void 0 : (_taskGanttContainerRe = taskGanttContainerRef.current) === null || _taskGanttContainerRe === void 0 ? void 0 : _taskGanttContainerRe.horizontalContainerRef;

    if (ele) {
      setGanttHeight(ele.offsetHeight);
    }
  }, [taskGanttContainerRef === null || taskGanttContainerRef === void 0 ? void 0 : (_taskGanttContainerRe2 = taskGanttContainerRef.current) === null || _taskGanttContainerRe2 === void 0 ? void 0 : _taskGanttContainerRe2.horizontalContainerRef]);
  var setElementsScrollY = useCallback(function () {
    var _taskGanttContainerRe3;

    eleListTableBodyRef.current && (eleListTableBodyRef.current.scrollTop = refScrollY.current);
    (taskGanttContainerRef === null || taskGanttContainerRef === void 0 ? void 0 : (_taskGanttContainerRe3 = taskGanttContainerRef.current) === null || _taskGanttContainerRe3 === void 0 ? void 0 : _taskGanttContainerRe3.horizontalContainerRef) && (taskGanttContainerRef.current.horizontalContainerRef.scrollTop = refScrollY.current);
    (verticalScrollContainerRef === null || verticalScrollContainerRef === void 0 ? void 0 : verticalScrollContainerRef.current) && (verticalScrollContainerRef.current.scrollTop = refScrollY.current);
  }, []);
  var setElementsScrollX = useCallback(function () {
    var _taskGanttContainerRe4;

    (taskGanttContainerRef === null || taskGanttContainerRef === void 0 ? void 0 : (_taskGanttContainerRe4 = taskGanttContainerRef.current) === null || _taskGanttContainerRe4 === void 0 ? void 0 : _taskGanttContainerRe4.verticalGanttContainerRef) && (taskGanttContainerRef.current.verticalGanttContainerRef.scrollLeft = refScrollX.current);
    (horizontalScrollContainerRef === null || horizontalScrollContainerRef === void 0 ? void 0 : horizontalScrollContainerRef.current) && (horizontalScrollContainerRef.current.scrollLeft = refScrollX.current);
  }, []);
  var handleWheel = useCallback(function (event) {
    if (Math.abs(event.deltaX) >= Math.abs(event.deltaY)) {
      if (event.deltaX !== 0) {
        var path = event.path || [];
        var filterData = path.filter(function (ele) {
          return ele.id === "ganttTaskListWrapper";
        });

        if (filterData !== null && filterData !== void 0 && filterData.length) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        var _scrollX = refScrollX.current;
        var scrollMove = event.deltaX;
        var newScrollX = _scrollX + scrollMove;

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

        var isScroll = (eleListTableBodyRef === null || eleListTableBodyRef === void 0 ? void 0 : (_eleListTableBodyRef$ = eleListTableBodyRef.current) === null || _eleListTableBodyRef$ === void 0 ? void 0 : _eleListTableBodyRef$.clientWidth) !== (eleListTableBodyRef === null || eleListTableBodyRef === void 0 ? void 0 : (_eleListTableBodyRef$2 = eleListTableBodyRef.current) === null || _eleListTableBodyRef$2 === void 0 ? void 0 : _eleListTableBodyRef$2.scrollWidth);
        setIsTableScrollX(isScroll);
        var max = ganttFullHeight - ganttHeight;
        var _scrollY = refScrollY.current;
        var newScrollY = _scrollY + event.deltaY;

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
  useEffect(function () {
    if (wrapperRef.current) {
      wrapperRef.current.addEventListener("wheel", handleWheel, {
        passive: false
      });
    }

    return function () {
      if (wrapperRef.current) {
        var _wrapperRef$current2;

        wrapperRef === null || wrapperRef === void 0 ? void 0 : (_wrapperRef$current2 = wrapperRef.current) === null || _wrapperRef$current2 === void 0 ? void 0 : _wrapperRef$current2.removeEventListener("wheel", handleWheel);
      }
    };
  }, [handleWheel]);
  var handleScrollY = useCallback(function (event) {
    var scrollY = refScrollY.current;

    if (scrollY !== event.currentTarget.scrollTop && !ignoreScrollEvent) {
      refScrollY.current = event.currentTarget.scrollTop;
      setElementsScrollY();
      setScrollY(refScrollY.current);
    }

    setIgnoreScrollEvent(false);
    setCurrentConnection(null);
  }, [ignoreScrollEvent, setElementsScrollY]);
  var handleScrollX = useCallback(function (event) {
    var scrollX = refScrollX.current;

    if (scrollX !== event.currentTarget.scrollLeft && !ignoreScrollEvent) {
      refScrollX.current = event.currentTarget.scrollLeft;
      setElementsScrollX();
      setScrollX(refScrollX.current);
    }

    setIgnoreScrollEvent(false);
    setCurrentConnection(null);
  }, [ignoreScrollEvent, setElementsScrollX]);
  var handleKeyDown = useCallback(function (event) {
    if (["Down", "ArrowDown", "Up", "ArrowUp", "Left", "ArrowLeft", "Right", "ArrowRight"].includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();
      var _scrollY2 = refScrollY.current;
      var _scrollX2 = refScrollX.current;
      var newScrollY = _scrollY2;
      var newScrollX = _scrollX2;
      var isX = true;

      switch (event.key) {
        case "Down":
        case "ArrowDown":
          newScrollY += rowHeight;
          isX = false;
          break;

        case "Up":
        case "ArrowUp":
          newScrollY -= rowHeight;
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
  }, [columnWidth, ganttFullHeight, ganttHeight, rowHeight, setElementsScrollX, setElementsScrollY, svgWidth]);
  var handleSelectedTask = useCallback(function (taskId) {
    var newSelectedTask = barTasks.find(function (t) {
      return t.id === taskId;
    });
    var oldSelectedTask = barTasks.find(function (t) {
      return !!selectedTask && t.id === selectedTask.id;
    });

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
  var boundLeft = ((_wrapperRef$current3 = wrapperRef.current) === null || _wrapperRef$current3 === void 0 ? void 0 : _wrapperRef$current3.getBoundingClientRect().left) || 0;
  var boundTop = ((_wrapperRef$current4 = wrapperRef.current) === null || _wrapperRef$current4 === void 0 ? void 0 : _wrapperRef$current4.getBoundingClientRect().top) || 0;
  var offsetLeft = ((_taskListRef$current = taskListRef.current) === null || _taskListRef$current === void 0 ? void 0 : _taskListRef$current.clientWidth) || 0;
  var gridProps = useMemo(function () {
    return {
      columnWidth: columnWidth,
      svgWidth: svgWidth,
      tasks: tasks,
      rowHeight: rowHeight,
      dates: dateSetup.dates,
      todayColor: todayColor,
      scrollX: scrollX,
      offsetLeft: boundLeft + offsetLeft,
      onDateChange: onDateChange
    };
  }, [boundLeft, columnWidth, dateSetup.dates, offsetLeft, onDateChange, rowHeight, scrollX, svgWidth, tasks, todayColor]);
  var calendarProps = useMemo(function () {
    return {
      dateSetup: dateSetup,
      locale: locale,
      viewMode: viewMode,
      headerHeight: headerHeight,
      columnWidth: columnWidth,
      fontFamily: fontFamily,
      fontSize: fontSize
    };
  }, [columnWidth, dateSetup, fontFamily, fontSize, headerHeight, locale, viewMode]);
  var barProps = useMemo(function () {
    return {
      tasks: barTasks,
      logTasks: logTasks,
      dates: dateSetup.dates,
      ganttEvent: ganttEvent,
      selectedTask: selectedTask,
      rowHeight: rowHeight,
      taskHeight: taskHeight,
      columnWidth: columnWidth,
      arrowColor: arrowColor,
      timeStep: timeStep,
      fontFamily: fontFamily,
      fontSize: fontSize,
      arrowIndent: arrowIndent,
      svgWidth: svgWidth,
      setGanttEvent: setGanttEvent,
      setFailedTask: setFailedTask,
      setSelectedTask: handleSelectedTask,
      onDateChange: onDateChange,
      onProgressChange: onProgressChange,
      onDoubleClick: onDoubleClick,
      onDelete: onDelete,
      delConnection: delConnection,
      addConnection: addConnection,
      itemLinks: itemLinks,
      isConnect: isConnect,
      setCurrentConnection: setCurrentConnection,
      currentConnection: currentConnection
    };
  }, [barTasks, logTasks, dateSetup.dates, ganttEvent, selectedTask, rowHeight, taskHeight, columnWidth, arrowColor, timeStep, fontFamily, fontSize, arrowIndent, svgWidth, setGanttEvent, setFailedTask, onDateChange, onProgressChange, onDoubleClick, onDelete, delConnection, addConnection, itemLinks, handleSelectedTask, isConnect, currentConnection]);
  var TaskListComponent = useMemo(function () {
    if (typeof renderTaskListComponent === "function") {
      return renderTaskListComponent();
    }

    return null;
  }, [renderTaskListComponent]);
  var isHiddenShowTooltip = useMemo(function () {
    return ["move", "start", "end", "progress"].includes(ganttEvent.action);
  }, [ganttEvent]);
  useEffect(function () {
    if (TaskListComponent) {
      setTimeout(function () {
        eleListTableBodyRef.current = document.querySelector(tableQuerySelector);
      });
    }
  }, [TaskListComponent, tableQuerySelector]);
  var todayX = useMemo(function () {
    var now = new Date();
    var tickX = 0;
    var newTickX = 0;

    for (var i = 0; i < dateSetup.dates.length; i++) {
      var date = dateSetup.dates[i];

      if (i + 1 !== dateSetup.dates.length && date.getTime() < now.getTime() && dateSetup.dates[i + 1].getTime() >= now.getTime() || i !== 0 && i + 1 === dateSetup.dates.length && date.getTime() < now.getTime() && addToDate(date, date.getTime() - dateSetup.dates[i - 1].getTime(), "millisecond").getTime() >= now.getTime()) {
        var currentStamp = new Date(new Date().toLocaleDateString()).getTime();
        var currentMinus = (currentStamp + 86400000 - dateSetup.dates[i].getTime()) / 86400000;
        var totalMinus = (dateSetup.dates[i + 1].getTime() - dateSetup.dates[i].getTime()) / 86400000;
        newTickX = tickX + columnWidth * (currentMinus / totalMinus) - columnWidth / totalMinus / 2;
      }

      tickX += columnWidth;
    }

    return newTickX;
  }, [columnWidth, dateSetup.dates]);
  var toToday = useCallback(function () {
    refScrollX.current = todayX - svgContainerWidth / 2;
    setElementsScrollX();
    setScrollX(refScrollX.current);
  }, [setElementsScrollX, svgContainerWidth, todayX]);
  useEffect(function () {
    toToday();
  }, [toToday]);
  var toConfig = useCallback(function () {
    setVisible(true);
    configVisibleChange === null || configVisibleChange === void 0 ? void 0 : configVisibleChange(true);
  }, [configVisibleChange]);
  var toGantt = useCallback(function () {
    setVisible(false);
    configVisibleChange === null || configVisibleChange === void 0 ? void 0 : configVisibleChange(false);
  }, [configVisibleChange]);
  var modeChange = useCallback(function (val) {
    setViewMode(val);
    setColumnWidth(widthData[val] || 60);
  }, []);
  var handleDividerMouseDown = useCallback(function (event) {
    var handleMouseMove = function handleMouseMove(event) {
      var distance = event.clientX - dividerPositionRef.current.left;
      var minWidth = 220;
      var width = taskListWidth + distance > minWidth ? taskListWidth + distance : minWidth;
      setTaskListWidth(width);
      utils.setLocalStorageItem(CACHE_LIST_WIDTH_KEY, width);
    };

    var handleMouseUp = function handleMouseUp() {
      var _eleListTableBodyRef$3, _eleListTableBodyRef$4;

      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      var isScroll = (eleListTableBodyRef === null || eleListTableBodyRef === void 0 ? void 0 : (_eleListTableBodyRef$3 = eleListTableBodyRef.current) === null || _eleListTableBodyRef$3 === void 0 ? void 0 : _eleListTableBodyRef$3.clientWidth) !== (eleListTableBodyRef === null || eleListTableBodyRef === void 0 ? void 0 : (_eleListTableBodyRef$4 = eleListTableBodyRef.current) === null || _eleListTableBodyRef$4 === void 0 ? void 0 : _eleListTableBodyRef$4.scrollWidth);
      setIsTableScrollX(isScroll);
    };

    dividerPositionRef.current.left = event.clientX;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }, [taskListWidth]);
  var handleDividerClick = useCallback(function (event) {
    var width;

    if (taskListWidth > minWidth) {
      dividerPositionRef.current.left = taskListWidth;
      width = minWidth;
    } else {
      width = dividerPositionRef.current.left || listWidth;
    }

    setTaskListWidth(width);
    utils.setLocalStorageItem(CACHE_LIST_WIDTH_KEY, width);
    event.stopPropagation();
  }, [listWidth, taskListWidth]);

  var baselineExit = function baselineExit() {
    setCurrentLog === null || setCurrentLog === void 0 ? void 0 : setCurrentLog({});
    setLogTasks([]);
  };

  var toPanel = useCallback(function () {
    setGuideModalVisible(false);
    toConfig();
  }, [toConfig]);
  React.useImperativeHandle(actionRef, function () {
    return {
      openGuide: function openGuide(type) {
        setCurrentPanel(type);
        setGuideModalVisible(true);
      },
      toPanel: toPanel
    };
  });
  var panelCanel = useCallback(function () {
    setGuideModalVisible(false);
  }, []);
  var OverflowTooltip = useCallback(function (value) {
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
      ganttConfig: ganttConfig
    }
  }, React.createElement(ConfigHandleContext.Provider, {
    value: {
      configHandle: configHandle,
      itemTypeData: itemTypeData,
      workspaceId: workspaceId,
      getCustomFields: getCustomFields
    }
  }, React.createElement(BaseLineContext.Provider, {
    value: {
      baseLineHandle: baseLineHandle,
      baselineList: baselineList,
      setCurrentLog: setCurrentLog,
      setLogTasks: setLogTasks,
      currentLog: currentLog,
      OverflowTooltip: OverflowTooltip
    }
  }, React.createElement(GanttConfig$1, {
    toGantt: toGantt,
    visible: visible,
    currentPanel: currentPanel,
    configHandle: configHandle,
    ganttConfig: ganttConfig
  }))), React.createElement("div", {
    className: styles$8.wrapper,
    onKeyDown: handleKeyDown,
    tabIndex: 0,
    ref: wrapperRef
  }, (currentLog === null || currentLog === void 0 ? void 0 : currentLog.name) && React.createElement("div", {
    className: styles$8.choosedBaselIne
  }, React.createElement("span", {
    className: styles$8.loaded
  }, OverflowTooltip("\u5DF2\u52A0\u8F7D\uFF1A" + (currentLog === null || currentLog === void 0 ? void 0 : currentLog.name))), React.createElement(Button, {
    size: "small",
    onClick: baselineExit
  }, "\u9000\u51FA")), listCellWidth && TaskListComponent && React.createElement("div", {
    ref: taskListRef,
    className: styles$8.taskListWrapper,
    id: "ganttTaskListWrapper",
    style: {
      width: taskListWidth + "px",
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
    listBottomHeight: listBottomHeight,
    taskListHeight: taskListRef === null || taskListRef === void 0 ? void 0 : (_taskListRef$current2 = taskListRef.current) === null || _taskListRef$current2 === void 0 ? void 0 : _taskListRef$current2.offsetHeight,
    headerHeight: headerHeight
  }), React.createElement("div", {
    className: taskListWidth <= minWidth ? styles$8.dividerWrapper + " " + styles$8.reverse : styles$8.dividerWrapper,
    style: {
      left: (taskListWidth - minWidth > 0 ? taskListWidth + paddingLeft : paddingLeft) + "px",
      visibility: (_tasks2 = tasks) !== null && _tasks2 !== void 0 && _tasks2.length ? "visible" : "hidden",
      height: "calc(100% - " + listBottomHeight + "px)"
    }
  }, React.createElement("div", {
    className: styles$8.dividerContainer,
    style: {
      height: "calc(100% - " + headerHeight + "px)",
      top: headerHeight + "px"
    }
  }, React.createElement("hr", {
    onMouseDown: taskListWidth <= minWidth ? undefined : handleDividerMouseDown
  }), React.createElement("hr", {
    className: styles$8.maskLine
  }), React.createElement("hr", {
    className: styles$8.maskLineTop
  }), React.createElement("span", {
    className: styles$8.dividerIconWarpper,
    onMouseDown: function onMouseDown(e) {
      return e.stopPropagation();
    },
    onClick: handleDividerClick
  }, React.createElement(IconComponent$5, null)))), isViewModeChange && React.createElement(DataMode, {
    toToday: toToday,
    modeChange: modeChange,
    todayX: todayX,
    svgContainerWidth: svgContainerWidth,
    refScrollX: refScrollX.current
  }), ganttEvent.changedTask && !isHiddenShowTooltip && React.createElement(Tooltip, {
    arrowIndent: arrowIndent,
    rowHeight: rowHeight,
    svgContainerHeight: svgContainerHeight,
    svgContainerWidth: svgContainerWidth,
    fontFamily: fontFamily,
    fontSize: fontSize,
    scrollX: scrollX,
    scrollY: scrollY,
    task: ganttEvent.changedTask,
    headerHeight: headerHeight,
    taskListWidth: taskListWidth,
    TooltipContent: TooltipContent,
    renderUserAvatar: renderUserAvatar
  }), currentConnection && React.createElement(DeleteTooltip, {
    tasks: tasks,
    taskListWidth: taskListWidth,
    currentConnection: currentConnection,
    boundTop: boundTop,
    itemLinks: itemLinks,
    delConnection: delConnection,
    setCurrentConnection: setCurrentConnection,
    svgContainerHeight: svgContainerHeight
  }), tasks.length > 0 && React.createElement(VerticalScroll, {
    ref: verticalScrollContainerRef,
    ganttFullHeight: ganttFullHeight,
    ganttHeight: ganttHeight,
    headerHeight: headerHeight,
    listBottomHeight: listBottomHeight,
    onScroll: handleScrollY
  }), tasks.length > 0 && React.createElement(HorizontalScroll, {
    ref: horizontalScrollContainerRef,
    listBottomHeight: isTableScrollX ? listBottomHeight : listBottomHeight - scrollBarHeight,
    svgWidth: svgWidth,
    taskListWidth: taskListWidth,
    onScroll: handleScrollX
  }))));
};

export { Gantt, ViewMode };
//# sourceMappingURL=index.modern.js.map
