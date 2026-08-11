import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useRole } from 'src/services/roles/RoleContext';
import { ROLE_LABELS, ROLES } from 'src/services/roles/roles';
import { cardLabel, normalizeCards } from 'src/services/roles/cards';
import { auth } from 'src/services/Authentication/firebase';

/**
 * 403 page. ProtectedRoute passes a `reason` in navigation state, so instead of
 * a bare "Access Denied" this names the missing piece — too low a role, or a
 * card nobody granted. Those need different fixes, and a bare 403 sends people
 * chasing the wrong one.
 */
const NotAuthorizedPage = () => {
  const { state } = useLocation();
  const { role: currentRole } = useRole();
  const role = state?.role || currentRole || ROLES.USER;

  const detail = (() => {
    if (state?.reason === 'card') {
      const granted = normalizeCards(state.granted);
      return {
        headline: `You don't have access to ${cardLabel(state.requiredCard)}.`,
        body: (
          <>
            Your role is <strong>{ROLE_LABELS[role] || role}</strong>
            {granted.length ? (
              <>
                , and you currently have {granted.length} card
                {granted.length === 1 ? '' : 's'}: {granted.map(cardLabel).join(', ')}.
              </>
            ) : (
              <>, and no cards have been assigned to you yet.</>
            )}
          </>
        ),
        fix: 'Ask a Super Admin to tick this card for you under Roles & Access → Card Access.',
      };
    }
    if (state?.reason === 'role') {
      return {
        headline: 'This page needs a higher role.',
        body: (
          <>
            It requires <strong>{ROLE_LABELS[state.requiredRole] || state.requiredRole}</strong> or
            above, and your role is <strong>{ROLE_LABELS[role] || role}</strong>.
          </>
        ),
        fix: 'Ask a Super Admin to change your role under Roles & Access → User Roles.',
      };
    }
    return {
      headline: 'You do not have permission to view this page.',
      body: (
        <>
          Your role is <strong>{ROLE_LABELS[role] || role}</strong>.
        </>
      ),
      fix: null,
    };
  })();

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 px-3">
      <div className="text-center" style={{ maxWidth: 560 }}>
        <h1 className="display-1 fw-bold mb-0">403</h1>
        <p className="fs-4 mb-2">
          <span className="text-danger">Access Denied</span>
        </p>
        <p className="fs-5 mb-2">{detail.headline}</p>
        <p className="text-muted">{detail.body}</p>
        {detail.fix && <p className="text-muted small">{detail.fix}</p>}
        {state?.from && <p className="text-muted small mb-1">Requested page: {state.from}</p>}
        {/* The app resolves roles from User/<uid>, so showing the uid lets an
            admin confirm they edited that exact document and not a stale
            duplicate that happens to carry the same name or email. */}
        {auth.currentUser && (
          <p className="text-muted small mb-4">
            Signed in as {auth.currentUser.email} · UID <code>{auth.currentUser.uid}</code>
          </p>
        )}
        <div className="d-flex gap-2 justify-content-center">
          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>
          <Link to="/employeedashboard" className="btn btn-outline-secondary">
            My dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotAuthorizedPage;
