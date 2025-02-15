import axios from 'axios';

export const fetchAi = async (prompt) => {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  const response = await axios.post(
    'https://api.openai.com/v1/completions',
    {
      model: 'gpt-4',
      prompt: prompt,
      max_tokens: 30,
      temperature: 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    },
  );
  console.log('response : ', response.data.choices[0].text.trim().split('\n'));

  return response.data.choices[0].text.trim().split('\n');
};
