"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStaticRanges = createStaticRanges;
exports.defaultStaticRanges = exports.defaultInputRanges = void 0;
var _differenceInCalendarDays = _interopRequireDefault(require("date-fns/differenceInCalendarDays"));
var _isSameDay = _interopRequireDefault(require("date-fns/isSameDay"));
var _endOfWeek = _interopRequireDefault(require("date-fns/endOfWeek"));
var _startOfWeek = _interopRequireDefault(require("date-fns/startOfWeek"));
var _addMonths = _interopRequireDefault(require("date-fns/addMonths"));
var _endOfMonth = _interopRequireDefault(require("date-fns/endOfMonth"));
var _startOfMonth = _interopRequireDefault(require("date-fns/startOfMonth"));
var _startOfDay = _interopRequireDefault(require("date-fns/startOfDay"));
var _endOfDay = _interopRequireDefault(require("date-fns/endOfDay"));
var _addDays = _interopRequireDefault(require("date-fns/addDays"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const defineds = {
  startOfWeek: (0, _startOfWeek.default)(new Date()),
  endOfWeek: (0, _endOfWeek.default)(new Date()),
  startOfLastWeek: (0, _startOfWeek.default)((0, _addDays.default)(new Date(), -7)),
  endOfLastWeek: (0, _endOfWeek.default)((0, _addDays.default)(new Date(), -7)),
  startOfToday: (0, _startOfDay.default)(new Date()),
  endOfToday: (0, _endOfDay.default)(new Date()),
  startOfYesterday: (0, _startOfDay.default)((0, _addDays.default)(new Date(), -1)),
  endOfYesterday: (0, _endOfDay.default)((0, _addDays.default)(new Date(), -1)),
  startOfMonth: (0, _startOfMonth.default)(new Date()),
  endOfMonth: (0, _endOfMonth.default)(new Date()),
  startOfLastMonth: (0, _startOfMonth.default)((0, _addMonths.default)(new Date(), -1)),
  endOfLastMonth: (0, _endOfMonth.default)((0, _addMonths.default)(new Date(), -1))
};
const staticRangeHandler = {
  range: {},
  isSelected(range) {
    const definedRange = this.range();
    return (0, _isSameDay.default)(range.startDate, definedRange.startDate) && (0, _isSameDay.default)(range.endDate, definedRange.endDate);
  }
};
function createStaticRanges(ranges) {
  return ranges.map(range => ({
    ...staticRangeHandler,
    ...range
  }));
}
const defaultStaticRanges = exports.defaultStaticRanges = createStaticRanges([{
  label: 'Today',
  range: () => ({
    startDate: defineds.startOfToday,
    endDate: defineds.endOfToday
  })
}, {
  label: 'Yesterday',
  range: () => ({
    startDate: defineds.startOfYesterday,
    endDate: defineds.endOfYesterday
  })
}, {
  label: 'This Week',
  range: () => ({
    startDate: defineds.startOfWeek,
    endDate: defineds.endOfWeek
  })
}, {
  label: 'Last Week',
  range: () => ({
    startDate: defineds.startOfLastWeek,
    endDate: defineds.endOfLastWeek
  })
}, {
  label: 'This Month',
  range: () => ({
    startDate: defineds.startOfMonth,
    endDate: defineds.endOfMonth
  })
}, {
  label: 'Last Month',
  range: () => ({
    startDate: defineds.startOfLastMonth,
    endDate: defineds.endOfLastMonth
  })
}]);
const defaultInputRanges = exports.defaultInputRanges = [{
  label: 'days up to today',
  range(value) {
    return {
      startDate: (0, _addDays.default)(defineds.startOfToday, (Math.max(Number(value), 1) - 1) * -1),
      endDate: defineds.endOfToday
    };
  },
  getCurrentValue(range) {
    if (!(0, _isSameDay.default)(range.endDate, defineds.endOfToday)) return '-';
    if (!range.startDate) return '∞';
    return (0, _differenceInCalendarDays.default)(defineds.endOfToday, range.startDate) + 1;
  }
}, {
  label: 'days starting today',
  range(value) {
    const today = new Date();
    return {
      startDate: today,
      endDate: (0, _addDays.default)(today, Math.max(Number(value), 1) - 1)
    };
  },
  getCurrentValue(range) {
    if (!(0, _isSameDay.default)(range.startDate, defineds.startOfToday)) return '-';
    if (!range.endDate) return '∞';
    return (0, _differenceInCalendarDays.default)(range.endDate, defineds.startOfToday) + 1;
  }
}];