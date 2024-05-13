import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // default styling
import "./StatusCalender.css"; // your custom styling
import useAuthStore from "src/services/store/globalStore";

export const StatusCalendar = ({ data, empName }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  useEffect(() => {
    useAuthStore.setState({ selectedAcsStatusDate: selectedDate });
  }, [selectedDate]);

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