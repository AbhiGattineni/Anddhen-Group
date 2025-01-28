import { useQuery } from 'react-query';

const fetchPartTimerData = async (user_id) => {
  const {
    data: response = [], // Provide a default value of an empty array
  } = useFetchData('partimer-status', `/get-part-timer/${user_id}/`);
  if (!response.ok) {
    throw new Error('Error fetching data');
  }
  return data;
};

export const usePartTimerQuery = (user_id) => {
  return useQuery(['part-timer', user_id], () => fetchPartTimerData(user_id), {
    staleTime: 0,
  });
};
