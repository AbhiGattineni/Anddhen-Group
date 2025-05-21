import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // default styling
import './StatusCalender.css'; // your custom styling
import useAuthStore from 'src/services/store/globalStore';

import PropTypes from 'prop-types';

export const StatusCalendar = ({ data, empName }) => {
  // Add prop validation for 'data'
  StatusCalendar.propTypes = {
    data: PropTypes.array.isRequired,
    empName: PropTypes.string,
  };
  const [selectedDate, setSelectedDate] = useState(new Date());
  useEffect(() => {
    useAuthStore.setState({ selectedAcsStatusDate: selectedDate });
  }, [selectedDate]);

  const getDayStatus = date => {
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    for (const entry of data) {
      const entryDate = new Date(entry[0]);
      entryDate.setHours(0, 0, 0, 0);

      if (entryDate.getTime() === checkDate.getTime()) {
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

  const tileContent = ({ date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return (
        <div className="icon-container text-black">
          <i className="bi bi-pencil-square"></i>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="calendar-container">
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileClassName={tileClassName}
        tileContent={tileContent}
        maxDate={new Date()}
        className="react-calendar"
      />
    </div>
  );
};
