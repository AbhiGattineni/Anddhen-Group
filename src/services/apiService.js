const API_BASE_URL =
  "https://script.google.com/macros/s/AKfycbx0BXbdKE-M1_ncjZGixx4ZBV8dTxVwd6-6FpnKnHGMDkY75Z9PR0Qe10tHxjDyG5GD3Q/exec";

export const submitFormData = async (formData) => {
  console.log("form", formData);
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
