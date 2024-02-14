// useErrorHandling.js
const useErrorHandling = (error) => {
    // Initialize default error details
    let errorCode = "ACSXXX";
    let title = "Unexpected Error";
    let message = "An unexpected error occurred. Please try again later.";

    if (error) {
        if (error.response) {
            // Error from server response
            errorCode = error.response.status.toString();
            title = "Server Error";
            message = `Server responded with status code ${error.response.status}.`;
        } else if (error.request) {
            // Request made but no response received
            title = "Network Issue";
            message = "No response was received from the server. Please check your internet connection.";
        } else if (error.message && error.message.includes("Network Error")) {
            // Network error
            title = "Network Error";
            message = "Network Error. Please check your connection.";
        } else if (error.code === "ECONNABORTED") {
            // Timeout error
            title = "Timeout";
            message = "The request timed out. Please try again later.";
        }
        // Add other error types as needed
    }

    return { errorCode, title, message };
};

export default useErrorHandling;
