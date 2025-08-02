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
    // Format the check date as YYYY-MM-DD string in local timezone
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const checkDateString = `${year}-${month}-${day}`;

    for (const entry of data) {
      const entryDateString = entry[0]; // entry[0] is already a YYYY-MM-DD string

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
        onChange={setSelectedDate}
        value={selectedDate}
        tileClassName={tileClassName}
        maxDate={new Date()}
        className="react-calendar"
      />
    </div>
  );
};
