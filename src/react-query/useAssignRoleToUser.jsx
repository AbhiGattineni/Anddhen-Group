import { useQueryClient, useMutation } from "react-query";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const useAssignRoleToUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ user, role }) =>
      fetch(`${API_BASE_URL}/assignrole/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user, role }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userDataAndRoles"] });
    },
  });
};

export default useAssignRoleToUser;
