import { useMutation, useQueryClient } from 'react-query';
import { auth } from '../services/Authentication/firebase';

async function postStatus(statusData) {
    const response = await fetch('http://localhost:5000/api/status/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(statusData),
    });

    if (!response.ok) {
        throw new Error('Failed to post status');
    }

    return response.json();
}

export function usePostStatus() {
    const queryClient = useQueryClient();

    return useMutation(postStatus, {
        onMutate: (newStatus) => {
            // Optimistically update the data in the cache
            queryClient.setQueryData(['calendarData', auth.currentUser.uid], (oldData) => {
                if (oldData) {
                    return [...oldData, [newStatus.date, newStatus.name]];
                }
                return [[newStatus.date, newStatus.name]];
            });
        },
        onError: (error) => {
            // Revert the optimistic update on error
            queryClient.setQueryData(['calendarData', auth.currentUser.uid], oldData => oldData);
        },
        onSettled: () => {
            // Refetch the calendar data after the mutation is complete
            queryClient.invalidateQueries(['calendarData', auth.currentUser.uid]);
        },
    });
}

