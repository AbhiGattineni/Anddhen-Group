import axios from 'axios';

export const fetchAi = async (prompt) => {
  try {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo', // Change to 'gpt-3.5-turbo' if needed
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 100,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const result = response.data.choices[0].message.content
      .trim()
      .split('\n')
      .map((line) => line.replace(/^-\s*/, ''))
      .join('\n');

    return result;
  } catch (error) {
    console.error(
      'Error fetching AI response:',
      error.response?.data || error.message,
    );
    return [];
  }
};
