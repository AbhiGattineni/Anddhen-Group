/**
 * RoleContext — exposes the signed-in user's role AND their dashboard-card
 * grants (both from Firestore) app-wide. On sign-in it ensures a User doc
 * exists (default role `user`, no grants) and loads the access; on sign-out it
 * resets. Consumers use useRole().
 */
import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../hooks/useAuth';
import {
  ensureUserProfile,
  subscribeUserProfile,
  ROLES,
  hasAtLeast,
  canManageRoles,
} from './roles';
import { canAccessCard, visibleCards } from './cards';

const RoleContext = createContext({
  role: ROLES.USER,
  cards: [],
  error: null,
  loading: true,
  refresh: () => {},
});

export function RoleProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState(ROLES.USER);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  // Non-null when the role lookup itself failed, as opposed to resolving to a
  // genuine plain `user`. Consumers must not treat this as a denial.
  const [error, setError] = useState(null);
  // Which uid the current role/cards were actually resolved for. Effects run
  // AFTER the render that follows a sign-in, so without this there is one
  // commit where `uid` is the new user but `role` is still the signed-out
  // default and `loading` is already false from the previous run — long enough
  // for ProtectedRoute to read `user` and bounce a real employee to
  // /not-authorized on their first login. Undefined until the first resolve.
  const [resolvedFor, setResolvedFor] = useState(undefined);

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
      setCards([]);
      setResolvedFor(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const access = await ensureUserProfile(u);
    setRole(access.role);
    setCards(access.cards);
    setError(access.error || null);
    setResolvedFor(u.uid);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authLoading) return undefined;
    let cancelled = false;
    let unsubscribe = () => {};
    (async () => {
      const u = userRef.current;
      if (!u) {
        if (!cancelled) {
          setRole(ROLES.USER);
          setCards([]);
          setError(null);
          setResolvedFor(null);
          setLoading(false);
        }
        return;
      }
      setLoading(true);
      // One read first: it creates the doc on first sign-in and honors the
      // bootstrap superadmin, neither of which a listener can do.
      const access = await ensureUserProfile(u);
      if (cancelled) return;
      setRole(access.role);
      setCards(access.cards);
      setError(access.error || null);
      setResolvedFor(u.uid);
      setLoading(false);

      // Then keep it live, so an admin changing a role or granting a card takes
      // effect in an open tab instead of waiting for the next sign-in.
      unsubscribe = subscribeUserProfile(
        u,
        next => {
          if (cancelled) return;
          setRole(next.role);
          setCards(next.cards);
          setError(null);
        },
        err => {
          if (!cancelled) setError(err);
        }
      );
    })();
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [uid, authLoading]);

  // Stale until the resolved uid matches the signed-in one, so consumers keep
  // waiting instead of acting on another session's (or the default) role.
  const stale = resolvedFor !== uid;

  const value = {
    role,
    cards,
    error,
    // The uid these values were resolved for. Consumers hold their own view of
    // who is signed in; comparing against this is the only way to know the role
    // in hand actually belongs to the user they are gating.
    roleUid: resolvedFor,
    loading: loading || authLoading || stale,
    refresh: applyRole,
    isAtLeast: required => hasAtLeast(role, required),
    canManageRoles: canManageRoles(role),
    // Card grants: admin and above implicitly hold every card.
    canAccessCard: key => canAccessCard(role, cards, key),
    myCards: () => visibleCards(role, cards),
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

RoleProvider.propTypes = {
  children: PropTypes.node,
};

export const useRole = () => useContext(RoleContext);
