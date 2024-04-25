import { useQuery } from 'react-query';

const fetchPartTimerData = async (user_id) => {
    const response = await fetch(`http://127.0.0.1:8000/get-part-timer/${user_id}/`);
    if (!response.ok) {
        throw new Error('Error fetching data');
    }
    const data = await response.json();
    return data;
};

export const usePartTimerQuery = (user_id) => {
    return useQuery(['part-timer', user_id], () => fetchPartTimerData(user_id), { staleTime: 0 });
};
