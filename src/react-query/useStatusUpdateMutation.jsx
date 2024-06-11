import { useMutation, useQueryClient } from "react-query";
import { auth } from "src/services/Authentication/firebase";

export const useStatusUpdateMutation = () => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const queryClient = useQueryClient();

  const postStatus = async (statusData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/create_status_update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(statusData),
      });

      const data = await response.json();

      if (!response.ok) {
        // If the response is not ok, throw an error with the message from the response
        throw new Error(data.message);
      }

      return data;
    } catch (error) {
      // Log the error for debugging
      console.error("Error in postStatus:", error.message);
      // Return the error message so it can be used in the calling function
      return { message: error.message };
    }
  };

  const updateStatus = async (updatedData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/update_status_by_id`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();

      if (!response.ok) {
        // If the response is not ok, throw an error with the message from the response
        throw new Error(data.message);
      }

      return data;
    } catch (error) {
      // Log the error for debugging
      console.error("Error in postStatus:", error.message);
      // Return the error message so it can be used in the calling function
      return { message: error.message };
    }
  };

  const statusMutation = useMutation(postStatus, {
    onMutate: async (newStatus) => {
      await queryClient.cancelQueries(["calendarData", auth.currentUser.uid]);

      const previousStatus = queryClient.getQueryData([
        "calendarData",
        auth.currentUser.uid,
      ]);

      queryClient.setQueryData(
        ["calendarData", auth.currentUser.uid],
        (oldData) => {
          if (oldData) {
            return [...oldData, auth.currentUser.uid];
          }
          return [newStatus];
        }
      );

      return { previousStatus };
    },
    onError: (error, newStatus, context) => {
      if (context?.previousStatus) {
        queryClient.setQueryData(
          ["calendarData", auth.currentUser.uid],
          context.previousStatus
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["calendarData", auth.currentUser.uid]);
    },
  });

  const updateMutation = useMutation(updateStatus, {
    onSuccess: () => {
      queryClient.invalidateQueries(["calendarData", auth.currentUser.uid]);
    },
  });

  return { statusMutation, updateMutation };
};
