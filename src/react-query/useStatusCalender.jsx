import { useQuery } from 'react-query';
import connector from '../services/connector';

// Migrated to the connector. Django: GET /get_status_by_id/:id (server-side
// filtered list). Firebase: where('user_id','==',id) on `Status_updates`.
export const useStatusCalendar = firebaseId => {
  return useQuery(
    ['calendarData', firebaseId],
    () => connector.byField('statusUpdates', 'user_id', firebaseId),
    {
      enabled: !!firebaseId, // API will only be called if firebaseId is truthy
    }
  );
};
