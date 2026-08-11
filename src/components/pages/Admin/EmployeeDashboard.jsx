import React, { useMemo, useState } from 'react';
import { auth } from '../../../services/Authentication/firebase';
import { useStatusCalendar } from 'src/react-query/useStatusCalender';
import AssignCards from './AssignCards';
import HappinessIndex from './HappinessIndex';
import { useRole } from 'src/services/roles/RoleContext';
import { visibleCards } from 'src/services/roles/cards';
import { ROLE_LABELS } from 'src/services/roles/roles';
import './Dashboard.css';

/**
 * The one dashboard, for employees and admins alike: a grid of the cards this
 * person may open. Admins and above see every card; employees see the ones a
 * super admin granted them under Roles & Access → Card Access.
 *
 * The daily status form used to live here inline. It's a card now (behind
 * Timesheet), so landing here shows what you have access to rather than one
 * feature's form with everything else pushed below the fold.
 */
export const EmployeeDashboard = () => {
  const { role, cards } = useRole();
  const [search, setSearch] = useState('');

  // Only for the happiness prompt below — the status data itself now lives with
  // the form, on the Timesheet card.
  const { data: statusUpdates } = useStatusCalendar(auth.currentUser?.uid);
  const [openHappinessDialog, setOpenHappinessDialog] = useState(true);

  const myPlates = useMemo(() => visibleCards(role, cards), [role, cards]);

  const searchedPlates = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return myPlates;
    return myPlates.filter(
      plate =>
        plate.child.toLowerCase().includes(query) ||
        plate.route.toLowerCase().includes(query) ||
        (plate.desc || '').toLowerCase().includes(query)
    );
  }, [myPlates, search]);

  return (
    <div className="dash-wrap container-fluid px-3 px-md-5">
      {statusUpdates && statusUpdates.has_submitted_happiness_today === false && (
        <HappinessIndex
          open={openHappinessDialog}
          handleClose={() => setOpenHappinessDialog(false)}
        />
      )}

      <div className="dash-header d-flex flex-wrap justify-content-between align-items-end gap-3">
        <div>
          <h1 className="dash-title h3">Dashboard</h1>
          <p className="dash-subtitle mb-0">
            Signed in as <span className="fw-semibold">{ROLE_LABELS[role] || role}</span> ·{' '}
            {myPlates.length} section{myPlates.length === 1 ? '' : 's'}
          </p>
        </div>
        {myPlates.length > 0 && (
          <div className="dash-search w-100" style={{ maxWidth: 420 }}>
            <i className="bi bi-search"></i>
            <input
              type="search"
              className="form-control"
              placeholder="Search sections…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        )}
      </div>

      {myPlates.length === 0 ? (
        <div className="dash-empty">
          No sections have been assigned to you yet. Ask a Super Admin to grant you access under
          Roles &amp; Access → Card Access.
        </div>
      ) : (
        <AssignCards adminPlates={searchedPlates} />
      )}
    </div>
  );
};
