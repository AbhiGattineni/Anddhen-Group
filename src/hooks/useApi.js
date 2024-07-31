import { useState } from 'react';
import { submitFormData } from '../services/apiService';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await submitFormData(formData);
      return response;
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, callApi };
};
