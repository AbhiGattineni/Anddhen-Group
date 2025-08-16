import React, { useEffect, useState } from 'react';
import { Videos } from '../../organisms/Videos';
import useAuthStore from '../../../services/store/globalStore';
import { PartTimerRegistrationForm } from '../../organisms/PartTimerRegistrationForm';
import { auth } from 'src/services/Authentication/firebase';
import LoadingSpinner from 'src/components/atoms/LoadingSpinner/LoadingSpinner';
import ParttimerDashboard from 'src/components/generalComponents/ACS/ParttimerDashbaord';
import useErrorHandling from 'src/hooks/useErrorHandling';
import ErrorPage from '../ErrorPage';

import { KeyWordsComponent } from 'src/components/generalComponents/KeyWordsComponent';

export const PartTimerPortal = () => {
  const [isLoading, setIsLoading] = useState(false);

  const setParttimer_consent = useAuthStore(state => state.setParttimer_consent);
  const [isError, setIsError] = useState(false); // Add this line
  const [error, setError] = useState(null);
  // const { data: partTimerData, isLoading, isError, error } = usePartTimerQuery(auth.currentUser.uid);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchPartTimerData = async user_id => {
      setIsLoading(true);
      setIsError(false); // Reset error state on new fetch attempt
      try {
        const response = await fetch(`${API_BASE_URL}/get-part-timer/${user_id}/`);
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        setParttimer_consent(data.answered_questions);
      } catch (error) {
        console.error(error); // Log the error for debugging
        setIsError(true); // Set error state
        setError(error); // Save the error for further processing
      } finally {
        setIsLoading(false); // Ensure loading is false after fetch completes
      }
    };

    fetchPartTimerData(auth.currentUser.uid);
  }, []);

  const { errorCode, title, errorMessage } = useErrorHandling(error); // Use the custom hook

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorPage errorCode={errorCode} title={title} message={errorMessage} />;
  }
  return (
    <div className="container mt-3">
      {/* {newUser || !parttimer_consent ? <NewParttimer /> : <ParttimerDashboard />} */}
      <ParttimerDashboard />

      <KeyWordsComponent />

      <Videos />
      <PartTimerRegistrationForm />
    </div>
  );
};
