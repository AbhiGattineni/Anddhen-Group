import React from 'react';
import StatusUpdates from '../StatusUpdates';
import LoadingSpinner from 'src/components/atoms/LoadingSpinner/LoadingSpinner';
import { useCalendarData } from 'src/react-query/useCalenderData';
import { auth } from 'src/services/Authentication/firebase';

const ParttimerDashboard = () => {
  const { isLoading, isError } = useCalendarData(auth.currentUser?.uid || '');

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Error loading status data</div>;

  return (
    <div>
      <StatusUpdates />
    </div>
  );
};

export default ParttimerDashboard;
