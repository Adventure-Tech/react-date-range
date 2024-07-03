/* eslint-disable no-fallthrough */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import DayCell, { rangeShape } from '../DayCell';
import {
  format,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  isBefore,
  isSameDay,
  isAfter,
  isWeekend,
  isWithinInterval,
  eachDayOfInterval,
} from 'date-fns';
import { getMonthDisplayRange } from '../../utils';

function renderWeekdays(styles, dateOptions, weekdayDisplayFormat, showWeekNumbers, dayNames) {
  const now = new Date();
  return (
    <div className={styles.weekDays}>
      {showWeekNumbers && <span className={styles.weekDay} />}
      {eachDayOfInterval({
        start: startOfWeek(now, dateOptions),
        end: endOfWeek(now, dateOptions),
      }).map((day, i) => (
        <span className={styles.weekDay} key={i}>
          {dayNames && dayNames[format(day, 'i') - 1].slice(0, 3)}
          {!dayNames && format(day, weekdayDisplayFormat, dateOptions)}
        </span>
      ))}
    </div>
  );
}

class Month extends PureComponent {
  render() {
    const now = new Date();
    const {
      displayMode,
      focusedRange,
      drag,
      styles,
      disabledDates,
      disabledDay,
      showWeekNumbers,
    } = this.props;
    const minDate = this.props.minDate && startOfDay(this.props.minDate);
    const maxDate = this.props.maxDate && endOfDay(this.props.maxDate);
    const monthDisplay = getMonthDisplayRange(
      this.props.month,
      this.props.dateOptions,
      this.props.fixedHeight
    );
    let ranges = this.props.ranges;
    if (displayMode === 'dateRange' && drag.status) {
      let { startDate, endDate } = drag.range;

      if (this.props.dragRangeOnly) ranges.push({ startDate, endDate });
      else
        ranges = ranges.map((range, i) => {
          if (i !== focusedRange[0]) return range;
          return {
            ...range,
            startDate,
            endDate,
          };
        });
    }
    const showPreview = this.props.showPreview && !drag.disablePreview;
    return (
      <div
        className={`${styles.month} ${showWeekNumbers ? styles.weekNumbers : ''}`}
        style={this.props.style}>
        {this.props.showMonthName ? (
          <div className={styles.monthName}>
            {this.props.monthNames && this.props.monthNames[format(this.props.month, 'M') - 1]}
            {!this.props.monthNames &&
              format(this.props.month, this.props.monthDisplayFormat, this.props.dateOptions)}
          </div>
        ) : null}
        {this.props.showWeekDays &&
          renderWeekdays(
            styles,
            this.props.dateOptions,
            this.props.weekdayDisplayFormat,
            showWeekNumbers,
            this.props.dayNames
          )}
        <div className={styles.days} onMouseLeave={this.props.onMouseLeave}>
          {eachDayOfInterval({ start: monthDisplay.start, end: monthDisplay.end })
            .map((day, index) => {
              const isStartOfMonth = isSameDay(day, monthDisplay.startDateOfMonth);
              const isEndOfMonth = isSameDay(day, monthDisplay.endDateOfMonth);
              const isOutsideMinMax =
                (minDate && isBefore(day, minDate)) || (maxDate && isAfter(day, maxDate));
              const isDisabledSpecifically = disabledDates.some(disabledDate =>
                isSameDay(disabledDate, day)
              );
              const isDisabledDay = disabledDay(day);
              return [
                showWeekNumbers && index % 7 === 0 ? (
                  <DayCell
                    {...this.props}
                    day={day}
                    isWeekNumber={true}
                    key={`weeknumber.${index}`}
                  />
                ) : null,
                <DayCell
                  {...this.props}
                  ranges={ranges}
                  day={day}
                  preview={showPreview ? this.props.preview : null}
                  isWeekend={isWeekend(day, this.props.dateOptions)}
                  isToday={isSameDay(day, now)}
                  isStartOfWeek={isSameDay(day, startOfWeek(day, this.props.dateOptions))}
                  isEndOfWeek={isSameDay(day, endOfWeek(day, this.props.dateOptions))}
                  isStartOfMonth={isStartOfMonth}
                  isEndOfMonth={isEndOfMonth}
                  key={index}
                  disabled={isOutsideMinMax || isDisabledSpecifically || isDisabledDay}
                  isPassive={
                    !isWithinInterval(day, {
                      start: monthDisplay.startDateOfMonth,
                      end: monthDisplay.endDateOfMonth,
                    })
                  }
                  styles={styles}
                  onMouseDown={this.props.onDragSelectionStart}
                  onMouseUp={this.props.onDragSelectionEnd}
                  onMouseEnter={this.props.onDragSelectionMove}
                  dragRange={drag.range}
                  drag={drag.status}
                />,
              ];
            })
            .flat()}
        </div>
      </div>
    );
  }
}

Month.defaultProps = {};

Month.propTypes = {
  style: PropTypes.object,
  styles: PropTypes.object,
  month: PropTypes.object,
  drag: PropTypes.object,
  dateOptions: PropTypes.object,
  disabledDates: PropTypes.array,
  disabledDay: PropTypes.func,
  preview: PropTypes.shape({
    startDate: PropTypes.object,
    endDate: PropTypes.object,
  }),
  showPreview: PropTypes.bool,
  showWeekNumbers: PropTypes.bool,
  displayMode: PropTypes.oneOf(['dateRange', 'date']),
  minDate: PropTypes.object,
  maxDate: PropTypes.object,
  ranges: PropTypes.arrayOf(rangeShape),
  focusedRange: PropTypes.arrayOf(PropTypes.number),
  onDragSelectionStart: PropTypes.func,
  onDragSelectionEnd: PropTypes.func,
  onDragSelectionMove: PropTypes.func,
  onMouseLeave: PropTypes.func,
  monthDisplayFormat: PropTypes.string,
  weekdayDisplayFormat: PropTypes.string,
  dayDisplayFormat: PropTypes.string,
  showWeekDays: PropTypes.bool,
  showMonthName: PropTypes.bool,
  fixedHeight: PropTypes.bool,
  monthNames: PropTypes.arrayOf(PropTypes.string),
  dayNames: PropTypes.arrayOf(PropTypes.string),
  dragRangeOnly: PropTypes.bool,
};

export default Month;
