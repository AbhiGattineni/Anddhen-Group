const API_BASE_URL =
  'https://script.google.com/macros/s/AKfycbxVOG0xdYGY_3nGOc_6kwqDP7rYlaHi02-mRXMnJDmHS0VJHebJzxsvHRRtC8MBMUJL_Q/exec';

export const submitFormData = async (formData) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
};
