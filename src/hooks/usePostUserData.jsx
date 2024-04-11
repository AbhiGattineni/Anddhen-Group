import { useState } from "react";

const usePostUserData = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const postUserData = async (userData) => {
    setIsLoading(true);
    try {
      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
      const requiredUserData = {
        user_id: userData.uid,
        full_name: userData.displayName,
        first_name: userData.displayName.split(" ")[0],
        last_name: userData.displayName.split(" ").slice(-1).join(" "),
        email_id: userData.email,
        enrolled_services: sessionStorage.getItem("preLoginPath")
      };

      const names = requiredUserData.full_name.split(" ");

      if (names.length > 0) {
        requiredUserData.first_name = names[0];
        if (names.length > 1) {
          requiredUserData.last_name = names[names.length - 1];
        }
      }

      const response = await fetch(`${API_BASE_URL}/user/log-first-time/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requiredUserData),
      });

      if (!response.ok) {
        throw new Error(
          `Error posting new user to backend: ${response.statusText}`
        );
      }
      console.log("response",response);
      const responseData = await response.json();
      console.log("response data",responseData);
      setResponse(responseData);
    } catch (error) {
      setError(error);
      console.error("API call error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { postUserData, response, error, isLoading };
};

export default usePostUserData;
