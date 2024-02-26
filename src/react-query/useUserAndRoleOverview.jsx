import { useQuery } from "react-query";

const useUserAndRoleOverview = () => {
  const fetchUserDataAndRoles = async () => {
    const response = await fetch(
      "http://127.0.0.1:8000/api/user_and_role_overview/"
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  return useQuery(["userDataAndRoles"], fetchUserDataAndRoles);
};

export default useUserAndRoleOverview;
