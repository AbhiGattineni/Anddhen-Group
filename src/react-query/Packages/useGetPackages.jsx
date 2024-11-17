import { useQuery } from 'react-query';

const useGetPackages = () => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const getPackages = async () => {
    const response = await fetch(`${API_BASE_URL}/packages/`);
    if (!response.ok) {
      throw new Error(
        `Error fetching data: ${response.status} - ${response.statusText}`,
      );
    }
    const data = await response.json();
    return data;
  };
  const { data, isLoading, isError } = useQuery('packages', getPackages);
  return { data, isLoading, isError };
};

export default useGetPackages;
