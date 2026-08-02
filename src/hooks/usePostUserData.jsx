import { useState } from 'react';
import connector from '../services/connector';

const usePostUserData = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const postUserData = async (userData, first_name, last_name) => {
    setIsLoading(true);
    try {
      const requiredUserData = {
        user_id: userData.uid,
        full_name: userData.displayName || userData.full_name || null,
        first_name: first_name || userData.first_name || null,
        last_name: last_name || userData.last_name || null,
        phone_country_code: userData.phone_country_code || null,
        phone_number: userData.phone_number || null,
        email_id: userData.email,
        enrolled_services: localStorage.getItem('preLoginPath'),
      };

      if (requiredUserData.full_name) {
        const names = requiredUserData.full_name.split(' ');
        requiredUserData.first_name = names[0];
        if (names.length > 1) {
          requiredUserData.last_name = names[names.length - 1];
        }
      } else if (first_name) {
        requiredUserData.full_name = first_name + ' ' + last_name;
      }

      // Route through the connector: with the Django provider this POSTs to
      // /user/log-first-time/ (unchanged); with the Firebase provider it writes
      // the User doc to Firestore. Either way returns the backend payload
      // ({ empty_fields, roles } from Django) or the created doc (Firebase).
      const responseData = await connector.create('users', requiredUserData, userData.uid);
      setResponse(responseData);
      return responseData;
    } catch (error) {
      // Backend unreachable (e.g. Django decommissioned) must NOT break sign-in.
      // Return a safe default so the auth flow can still complete.
      setError(error);
      console.error('postUserData failed (continuing sign-in):', error);
      return { empty_fields: [], roles: [], _backendUnavailable: true };
    } finally {
      setIsLoading(false);
    }
  };

  return { postUserData, response, error, isLoading };
};

export default usePostUserData;
