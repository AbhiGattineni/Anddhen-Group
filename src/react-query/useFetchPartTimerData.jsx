import { useFetchData } from './useFetchApis';

const usePartTimerData = (user_id) => {
  return useFetchData('partimer-status', `/get-part-timer/${user_id}/`);
};

export default usePartTimerData;
