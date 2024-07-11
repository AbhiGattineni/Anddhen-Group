import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchData, addData, updateData, deleteData } from './useApis';

export const useFetchData = (key,url) => {
  return useQuery([key, url], () => fetchData(url));
};

export const useAddData = (key,url) => {
  const queryClient = useQueryClient();
  return useMutation((newData) => addData(url, newData), {
    onSuccess: () => {
      queryClient.invalidateQueries([key, url]);
    },
  });
};

export const useUpdateData = (key,url) => {
  const queryClient = useQueryClient();
  return useMutation((updatedData) => updateData(url, updatedData), {
    onSuccess: () => {
      queryClient.invalidateQueries([key, url]);
    },
  });
};

export const useDeleteData = (key,url) => {
  const queryClient = useQueryClient();
  return useMutation(() => deleteData(url), {
    onSuccess: () => {
      queryClient.invalidateQueries([key, url]);
    },
  });
};
