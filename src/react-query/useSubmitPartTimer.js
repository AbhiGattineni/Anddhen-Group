// hooks/useSubmitPartTimer.js

import { useMutation } from 'react-query';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const useSubmitPartTimer = () => {
    const submitPartTimer = async (formData) => {
        // Replace with your actual API endpoint
        const response = await fetch(`${API_BASE_URL}/part-timer/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return response.json();
    };

    return useMutation(submitPartTimer);
};

export default useSubmitPartTimer;