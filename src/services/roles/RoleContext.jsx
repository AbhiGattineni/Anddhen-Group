/**
 * RoleContext — exposes the signed-in user's role (from Firestore) app-wide.
 * On sign-in it ensures a User doc exists (default role `user`) and loads the
 * role; on sign-out it resets to `user`. Consumers use useRole().
 */
import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../hooks/useAuth';
import { ensureUserRole, ROLES, hasAtLeast, canManageRoles } from './roles';

const RoleContext = createContext({
  role: ROLES.USER,
  loading: true,
  refresh: () => {},
});

export function RoleProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState(ROLES.USER);
  const [loading, setLoading] = useState(true);

  // Depend the effect on the STABLE uid string, not the `user` object. Firebase
  // can re-fire onAuthStateChanged with a fresh user object for the same account
  // (e.g. token refresh, or a stale cross-project session), and depending on the
  // object reference would re-run this effect on every such fire → infinite loop.
  const uid = user ? user.uid : null;
  const userRef = useRef(user);
  userRef.current = user;

  const applyRole = useCallback(async () => {
    const u = userRef.current;
    if (!u) {
      setRole(ROLES.USER);
      setLoading(false);
      return;
    }
    setLoading(true);
    const r = await ensureUserRole(u);
    setRole(r);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authLoading) return undefined;
    let cancelled = false;
    (async () => {
      const u = userRef.current;
      if (!u) {
        if (!cancelled) {
          setRole(ROLES.USER);
          setLoading(false);
        }
        return;
      }
      setLoading(true);
      const r = await ensureUserRole(u);
      if (!cancelled) {
        setRole(r);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [uid, authLoading]);

  const value = {
    role,
    loading: loading || authLoading,
    refresh: applyRole,
    isAtLeast: required => hasAtLeast(role, required),
    canManageRoles: canManageRoles(role),
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

RoleProvider.propTypes = {
  children: PropTypes.node,
};

export const useRole = () => useContext(RoleContext);
