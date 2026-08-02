import { useQuery } from 'react-query';
import connector from '../../services/connector';

// Migrated to the connector. Django: GET /packages/. Firebase: `Packages` collection.
const useGetPackages = () => {
  const getPackages = () => connector.list('packages');

  const { data, isLoading, isError } = useQuery('packages', getPackages);
  return { data, isLoading, isError };
};

export default useGetPackages;
