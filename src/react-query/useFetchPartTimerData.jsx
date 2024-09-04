import { useQuery } from 'react-query';

const fetchPartTimerData = async (user_id) => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const response = await fetch(`${API_BASE_URL}/get-part-timer/${user_id}/`);
  if (!response.ok) {
    throw new Error('Error fetching data');
  }
  const data = await response.json();
  return data;
};

export const usePartTimerQuery = (user_id) => {
  return useQuery(['part-timer', user_id], () => fetchPartTimerData(user_id), {
    staleTime: 0,
  });
};
