import { useQuery } from 'react-query';
import connector from '../services/connector';

// Migrated to the connector. Django: GET /acs_parttimer_status/:parttimerId (a
// server-side filtered list). Firebase: where('parttimerId','==',id) on
// `PartTimer_status`. Both return an array of that part-timer's status rows.
export const useCalendarData = firebaseId => {
  return useQuery(['calendarData', firebaseId], () =>
    connector.byField('acsParttimerStatus', 'parttimerId', firebaseId)
  );
};
