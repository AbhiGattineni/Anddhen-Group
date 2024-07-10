import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchData = async (url) => {
  const response = await axios.get(`${API_BASE_URL}${url}`);
  return response.data;
};

export const addData = async (url, newData) => {
  const response = await axios.post(`${API_BASE_URL}${url}`, newData);
  return response.data;
};

export const updateData = async (url, updatedData) => {
  const response = await axios.put(`${API_BASE_URL}${url}`, updatedData);
  return response.data;
};

export const deleteData = async (url) => {
  await axios.delete(`${API_BASE_URL}${url}`);
  return url;
};
