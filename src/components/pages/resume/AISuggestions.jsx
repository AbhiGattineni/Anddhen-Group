import { callFunction } from '../../../services/connector/functions';

// Moved server-side: the OpenAI API key no longer ships to the browser. The
// `aiSuggestions` Cloud Function performs the same gpt-3.5-turbo call and applies
// the same line cleanup, so the contract (prompt -> cleaned string) is unchanged.
export const fetchAi = async prompt => {
  try {
    return await callFunction('aiSuggestions', { prompt });
  } catch (error) {
    console.error('Error fetching AI response:', error.message);
    return [];
  }
};
