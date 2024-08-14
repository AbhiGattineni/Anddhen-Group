import { useMutation, useQueryClient } from 'react-query';
import { auth } from 'src/services/Authentication/firebase';

export const useStatusMutation = () => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const queryClient = useQueryClient();

  const postStatus = async (statusData) => {
    const response = await fetch(
      `${API_BASE_URL}/acs_parttimer_status_create`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(statusData),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to post status');
    }

    return response.json();
  };

  const updateStatus = async (updatedData) => {
    const response = await fetch(
      `${API_BASE_URL}/acs_parttimer_status_update`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update status');
    }

    return response.json();
  };

  const statusMutation = useMutation(postStatus, {
    onMutate: (newStatus) => {
      // Optimistically update the data in the cache
      queryClient.setQueryData(
        ['calendarData', auth.currentUser.uid],
        (oldData) => {
          if (oldData) {
            return [...oldData, [newStatus.date, newStatus.parttimerName]];
          }
          return [[newStatus.date, newStatus.parttimerName]];
        }
      );
    },
    onError: (error, newStatus, rollback) => {
      // Revert the optimistic update on error
      rollback();
    },
    onSettled: () => {
      queryClient.invalidateQueries(['calendarData', auth.currentUser.uid]);
    },
  });

  const updateMutation = useMutation(updateStatus, {
    onSuccess: () => {
      queryClient.invalidateQueries(['calendarData', auth.currentUser.uid]);
      // Optionally, you can perform additional actions after the mutation is successful
    },
  });

  return { statusMutation, updateMutation };
};
