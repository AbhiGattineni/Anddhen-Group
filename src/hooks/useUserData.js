const { useQuery } = require("react-query");

const useUserData = () => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const fetchUserData = async () => {
    const response = await fetch(`${API_BASE_URL}/user/log-first-time/`);
    if (!response.ok) {
      throw new Error("Network response was not OK");
    }
    return response.json();
  };

  return useQuery({
    queryKey: ["UserData"],
    queryFn: fetchUserData,
  });
};

export default useUserData;
