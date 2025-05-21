import { useQuery } from 'react-query';

const useFetchQuestions = () => {
  return useQuery('questions', async () => {
    const response = await fetch(`http://localhost:5000/api/questions/ACS part timer questions`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  });
};

export default useFetchQuestions;
