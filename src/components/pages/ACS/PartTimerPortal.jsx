import React, { useEffect, useState } from "react";
import { Videos } from "../../organisms/Videos";
import useAuthStore from "../../../services/store/globalStore";
import NewParttimer from "src/components/generalComponents/ACS/NewParttimer";
import { QuestionCard } from "src/components/organisms/QuestionCard";
import { PartTimerRegistrationForm } from "../../organisms/PartTimerRegistrationForm";
import { auth } from "src/services/Authentication/firebase";
import { usePartTimerQuery } from "../../../react-query/useFetchPartTimerData";
import LoadingSpinner from "src/components/atoms/LoadingSpinner/LoadingSpinner";

export const PartTimerPortal = () => {
  const newUser = useAuthStore((state) => state.newUser);
  const parttimer_consent = useAuthStore((state) => state.parttimer_consent);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const setNewUser = useAuthStore((state) => state.setParttimer_consent);
  const setParttimer_consent = useAuthStore((state) => state.setParttimer_consent);
  // const { data: partTimerData, isLoading, isError, error } = usePartTimerQuery(auth.currentUser.uid);

  useEffect(() => {
    const fetchPartTimerData = async (user_id) => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://127.0.0.1:8000/get-part-timer/${user_id}/`);
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        setParttimer_consent(data.answered_questions);
        setIsLoading(false);
      } catch (error) {
        console.error(error); // Log the error for debugging
        setIsLoading(false);
      }
    };

    fetchPartTimerData(auth.currentUser.uid);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;

  }
  return (
    <div className="container mt-3">
      {newUser || !parttimer_consent ? <NewParttimer /> : <><Videos />
      </>}
    </div>
  );
};
