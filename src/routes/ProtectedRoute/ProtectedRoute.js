import React, { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import LoadingSpinner from 'src/components/atoms/LoadingSpinner/LoadingSpinner';
import PropTypes from 'prop-types';
import { useRole } from 'src/services/roles/RoleContext';
import { hasAtLeast } from 'src/services/roles/roles';
import { canAccessCard } from 'src/services/roles/cards';

/**
 * Route guard driven by the Firebase role system.
 *  - `minRole`: minimum role required (user < employee < admin < superadmin).
 *    Omitted → any signed-in user may access.
 *  - `card`: dashboard-card key this route sits behind. The user must have been
 *    granted that card (admins and above hold every card). Omitted → no grant
 *    needed, so role alone decides.
 *  - `requiredRoles`: legacy prop; its highest entry is treated as the min role.
 */
const ProtectedRoute = ({ children, minRole, card, requiredRoles }) => {
  const { user, loading, error } = useAuth();
  const { role, cards, loading: roleLoading, error: roleError, refresh } = useRole();
  const location = useLocation();
  const navigate = useNavigate();
  const storedEmptyFields = localStorage.getItem('empty_fields');

  useEffect(() => {
    if (storedEmptyFields && location.pathname !== '/profile') {
      localStorage.setItem('preLoginPath', location.pathname);
      navigate('/profile', { replace: true });
    }
  }, [storedEmptyFields, navigate, location.pathname]);

  if ((loading || roleLoading) && !user) {
    return <LoadingSpinner />;
  }

  if (error || !user) {
    if (location.pathname !== '/profile') {
      localStorage.setItem('preLoginPath', location.pathname);
    }
    return <Navigate to="/login" replace />;
  }

  // Wait for the role to resolve before making an access decision.
  if (roleLoading) {
    return <LoadingSpinner />;
  }

  // Effective minimum role: explicit minRole wins; else fall back to the
  // highest of any legacy requiredRoles entries.
  const effectiveMin =
    minRole ||
    (requiredRoles && requiredRoles.length
      ? requiredRoles.reduce((hi, r) => (hasAtLeast(r, hi) ? r : hi), requiredRoles[0])
      : null);

  // A failed role lookup is NOT a denial. Falling through here would tell a
  // legitimate employee their role is "User" — the exact misdiagnosis that sent
  // us hunting through Firestore documents that turned out to be correct. Say
  // the check failed, show why, and offer a retry.
  if (roleError && (effectiveMin || card)) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 px-3">
        <div className="text-center" style={{ maxWidth: 560 }}>
          <h1 className="h3 fw-bold">Couldn&apos;t verify your access</h1>
          <p className="text-muted">
            We couldn&apos;t read your role from the server, so we don&apos;t know what you&apos;re
            allowed to see. This is a connection or permissions problem, not a decision about your
            account.
          </p>
          <p className="text-muted small">
            Error: <code>{String(roleError)}</code>
          </p>
          <button type="button" className="btn btn-primary" onClick={refresh}>
            Try again
          </button>
        </div>
      </div>
    );
  }

  // Pass the reason along so /not-authorized can say what's actually missing
  // instead of a bare 403 — the difference between "your role is too low" and
  // "nobody granted you this card" is the difference between two fixes.
  if (effectiveMin && !hasAtLeast(role, effectiveMin)) {
    return (
      <Navigate
        to="/not-authorized"
        replace
        state={{ reason: 'role', role, requiredRole: effectiveMin, from: location.pathname }}
      />
    );
  }

  // The role opens the dashboard; the grant opens the individual card.
  if (card && !canAccessCard(role, cards, card)) {
    return (
      <Navigate
        to="/not-authorized"
        replace
        state={{
          reason: 'card',
          role,
          requiredCard: card,
          granted: cards,
          from: location.pathname,
        }}
      />
    );
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  minRole: PropTypes.string,
  card: PropTypes.string,
  requiredRoles: PropTypes.arrayOf(PropTypes.string),
};

ProtectedRoute.defaultProps = {
  minRole: null,
  card: null,
  requiredRoles: [],
};

export default ProtectedRoute;
