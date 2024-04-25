import { useQuery } from 'react-query';

const fetchCalendarData = async (firebaseId) => {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const response = await fetch(`${API_BASE_URL}/api/status/${firebaseId}`);
    if (!response.ok) {
        throw new Error('Error fetching data');
    }
    return response.json();
};

export const useCalendarData = (firebaseId) => {
    return useQuery(['calendarData', firebaseId], () => fetchCalendarData(firebaseId));
};
