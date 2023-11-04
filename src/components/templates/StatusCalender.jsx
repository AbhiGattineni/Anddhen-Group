import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // default styling
import "./StatusCalender.css"; // your custom styling

export const StatusCalendar = ({ data, empName }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const hasDataForDate = (date) => {
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    return data.some((entry) => {
      const entryDate = new Date(entry[0]);
      entryDate.setHours(0, 0, 0, 0);

      const hasData =
        entryDate.getTime() === checkDate.getTime() &&
        (!empName || entry[1] === empName);
      return hasData;
    });
  };

  const tileClassName = ({ date, view }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (view === "month" && date <= today) {
      if (hasDataForDate(date)) {
        return "green-day";
      } else {
        return "red-day";
      }
    }
  };

  return (
    <div className="calendar-container">
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileClassName={tileClassName}
        className="react-calendar"
      />
    </div>
  );
};
