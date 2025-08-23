import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './StatusCalender.css';
import PropTypes from 'prop-types';

export const StatusCalendar = ({ data, empName, selectedDate, onDateChange, onMonthChange }) => {
  StatusCalendar.propTypes = {
    data: PropTypes.array.isRequired,
    empName: PropTypes.string,
    selectedDate: PropTypes.instanceOf(Date),
    onDateChange: PropTypes.func,
    onMonthChange: PropTypes.func,
  };

  // Default values for optional props
  const currentSelectedDate = selectedDate || new Date();
  const handleDateChange = onDateChange || (() => {});
  const handleMonthChange = onMonthChange || (() => {});

  const getDayStatus = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const checkDateString = `${year}-${month}-${day}`;

    for (const entry of data) {
      const entryDateString = entry[0];
      if (entryDateString === checkDateString) {
        return entry[1] ? 'leave-day' : 'green-day';
      }
    }
    return 'red-day';
  };

  const tileClassName = ({ date, view }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (view === 'month' && date <= today) {
      return getDayStatus(date);
    }
    return null;
  };

  return (
    <div className="calendar-container">
      <Calendar
        onChange={handleDateChange}
        value={currentSelectedDate}
        tileClassName={tileClassName}
        maxDate={new Date()}
        className="react-calendar"
        onActiveStartDateChange={({ activeStartDate }) => handleMonthChange(activeStartDate)}
      />
    </div>
  );
};
