// hooks/useSubmitPartTimer.js
import { useMutation } from 'react-query';
import connector from '../services/connector';

// Migrated to the connector. Django: POST /part-timer/. Firebase: add to `PartTimer`.
export const useSubmitPartTimer = () => {
  const submitPartTimer = formData => connector.create('partTimers', formData);
  return useMutation(submitPartTimer);
};

export default useSubmitPartTimer;
