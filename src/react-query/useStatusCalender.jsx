import { useQuery } from 'react-query';

const fetchCalendarData = async (firebaseId) => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const response = await fetch(
    `${API_BASE_URL}/get_status_by_id/${firebaseId}`
  );
  if (!response.ok) {
    throw new Error('Error fetching data');
  }
  return response.json();
};

export const useStatusCalendar = (firebaseId) => {
  return useQuery(
    ['calendarData', firebaseId],
    () => fetchCalendarData(firebaseId),
    {
      enabled: !!firebaseId, // API will only be called if firebaseId is truthy
    }
  );
};
