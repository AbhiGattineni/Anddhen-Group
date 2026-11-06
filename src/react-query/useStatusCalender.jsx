import { useQuery } from 'react-query';
import connector from '../services/connector';

/**
 * Rows from Firestore can carry values the status views can't render as text:
 * Timestamps (createdAt/updatedAt) and the list of tickets worked on. Drop the
 * timestamps and show tickets as "AG-3 · Fix login, AG-7 · …".
 */
const normalizeRow = ({ createdAt, updatedAt, tickets, ...row }) => ({
  ...row,
  ...(Array.isArray(tickets) && tickets.length
    ? { tickets: tickets.map(t => `${t.key} · ${t.title}`).join(', ') }
    : {}),
});

// Migrated to the connector. Django: GET /get_status_by_id/:id returns
// { user_name, status_updates: [...] }. Firebase: where('user_id','==',id) on
// `Status_updates` returns the rows themselves — wrapped here into the same
// shape, which every consumer reads.
export const useStatusCalendar = firebaseId => {
  return useQuery(
    ['calendarData', firebaseId],
    async () => {
      const data = await connector.byField('statusUpdates', 'user_id', firebaseId);
      if (!Array.isArray(data)) return data;
      const rows = data.map(normalizeRow);
      return { user_name: rows.find(r => r.user_name)?.user_name || '', status_updates: rows };
    },
    {
      enabled: !!firebaseId, // API will only be called if firebaseId is truthy
    }
  );
};
