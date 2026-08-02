import { useQuery } from 'react-query';
import connector from '../services/connector';

// Reference migration: this hook now goes through the connector instead of a raw
// fetch to REACT_APP_API_BASE_URL. With provider='django' it hits the same
// /subsidiaries/ endpoint as before; with provider='firebase' it reads the
// `subsidiary` Firestore collection. Same shape returned to callers.
const useGetSubsidiaries = () => {
  const getSubsidiaries = () => connector.list('subsidiaries');

  const { data, isLoading, isError } = useQuery('subsidiaries', getSubsidiaries);
  return { data, isLoading, isError };
};

export default useGetSubsidiaries;
