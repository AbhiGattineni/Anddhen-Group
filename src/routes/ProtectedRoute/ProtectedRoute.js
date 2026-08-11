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
  const { role, cards, loading: roleLoading } = useRole();
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
