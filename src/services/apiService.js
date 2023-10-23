const API_BASE_URL = process.env.REACT_APP_SPREAD_SHEET_LINK;

export const submitFormData = async (formData) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    throw error;
  }
};
