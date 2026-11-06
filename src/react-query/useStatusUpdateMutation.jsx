import { useMutation, useQueryClient } from 'react-query';
import { auth } from 'src/services/Authentication/firebase';
import connector from 'src/services/connector';

/**
 * Create / edit a daily status through the connector, so it lands wherever
 * the app reads statuses from (Firestore `Status_updates` by default; the
 * Django endpoints when that provider is selected). This used to POST straight
 * to the Django API while useStatusCalendar read from Firestore, so submitted
 * statuses never showed up.
 *
 * Both reject on failure, so callers can tell the user it didn't save.
 */
export const useStatusUpdateMutation = () => {
  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries(['calendarData', auth.currentUser?.uid]);

  const postStatus = async statusData => {
    const saved = await connector.create('statusUpdates', statusData);
    return { message: saved?.message || 'Status submitted.', ...saved };
  };

  // Rows reach the table normalised for display (see useStatusCalendar), so
  // only the editable fields go back — never the tickets summary text.
  const updateStatus = async ({ id, tickets, createdAt, updatedAt, ...fields }) => {
    if (!id) throw new Error('This status has no id and cannot be edited.');
    return connector.update('statusUpdates', id, fields);
  };

  const statusMutation = useMutation(postStatus, { onSettled: refresh });
  const updateMutation = useMutation(updateStatus, { onSuccess: refresh });

  return { statusMutation, updateMutation };
};
