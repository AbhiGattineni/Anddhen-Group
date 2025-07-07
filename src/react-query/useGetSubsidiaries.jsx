import { useQuery } from 'react-query';

const useGetSubsidiaries = () => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const getSubsidiaries = async () => {
    const response = await fetch(`${API_BASE_URL}/subsidiaries/`);
    if (!response.ok) {
      throw new Error(`Error fetching subsidiaries: ${response.status} - ${response.statusText}`);
    }
    return response.json();
  };

  const { data, isLoading, isError } = useQuery('subsidiaries', getSubsidiaries);
  return { data, isLoading, isError };
};

export default useGetSubsidiaries;
