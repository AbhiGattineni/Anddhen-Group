import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchData, addData, updateData, deleteData } from './useApis';

export const useFetchData = (key, url) => {
  const { data, isLoading, error } = useQuery([key, url], () => fetchData(url));

  return { data, isLoading, error };
};

export const useAddData = (key, url) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(newData => addData(url, newData), {
    onSuccess: () => {
      queryClient.invalidateQueries([key, url]);
    },
  });

  const { isLoading, error } = mutation;

  return { ...mutation, isLoading, error };
};

export const useUpdateData = (key, url) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(updatedData => updateData(url, updatedData), {
    onSuccess: () => {
      queryClient.invalidateQueries([key, url]);
    },
  });

  const { isLoading, error } = mutation;

  return { ...mutation, isLoading, error };
};

export const useDeleteData = (key, url) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(() => deleteData(url), {
    onSuccess: () => {
      queryClient.invalidateQueries([key, url]);
    },
  });

  const { isLoading, error } = mutation;

  return { ...mutation, isLoading, error };
};
