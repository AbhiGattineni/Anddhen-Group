// usePostUserData.js
import { useState } from "react";

const usePostUserData = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const postUserData = async (userData) => {
    setIsLoading(true);
    try {
      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
      const response = await fetch(`${API_BASE_URL}/user/log-first-time/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(
          `Error posting new user to backend: ${response.statusText}`
        );
      }

      const responseData = await response.json();
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
