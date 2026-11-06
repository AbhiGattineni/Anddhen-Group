import React from 'react';
import { useAuth } from 'src/hooks/useAuth';
import DailyStatus from 'src/components/pages/Admin/DailyStatus';
import './Timesheet.css';

/**
 * Timesheet = the daily status. Each working-day entry names the Jira
 * tickets worked on (see DailyStatus); the old free-form "My time" log and
 * its team rollup were removed.
 */
export default function Timesheet() {
  const { user } = useAuth();

  return (
    <div className="tsh-wrap container-fluid px-3 px-md-5">
      <div className="py-3">
        <h1 className="tsh-title h3">Timesheet</h1>
        <p className="tsh-subtitle">Submit your daily status with the tickets you worked on.</p>
      </div>
      {!user ? <p className="text-muted">Sign in to submit your timesheet.</p> : <DailyStatus />}
    </div>
  );
}
