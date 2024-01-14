const { useQuery } = require("react-query");

const useUserData = (isNewUser, googleUserData) => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  console.log("fetchUserDataOutside", isNewUser, googleUserData);
  const fetchUserData = async () => {
    console.log("fetchUserData", isNewUser, googleUserData);
    if (isNewUser && googleUserData) {
      const response = await fetch(`${API_BASE_URL}/user/log-first-time/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(googleUserData),
      });

      if (!response.ok) {
        throw new Error("Error posting new user to backend");
      }

      return response.json();
    } else {
      const response = await fetch(`${API_BASE_URL}/user/data/`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not OK");
      }

      return response.json();
    }
  };

  return useQuery({
    queryKey: ["UserData", isNewUser],
    queryFn: fetchUserData,
    enabled: isNewUser === true && !!googleUserData,
  });
};

export default useUserData;
