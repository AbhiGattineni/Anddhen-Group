/**
 * RoleContext — exposes the signed-in user's role AND their dashboard-card
 * grants (both from Firestore) app-wide. On sign-in it ensures a User doc
 * exists (default role `user`, no grants) and loads the access; on sign-out it
 * resets. Consumers use useRole().
 */
import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../hooks/useAuth';
import { ensureUserProfile, ROLES, hasAtLeast, canManageRoles } from './roles';
import { canAccessCard, visibleCards } from './cards';

const RoleContext = createContext({
  role: ROLES.USER,
  cards: [],
  loading: true,
  refresh: () => {},
});

export function RoleProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState(ROLES.USER);
  const [cards, setCards] = useState([]);
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
      setCards([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const access = await ensureUserProfile(u);
    setRole(access.role);
    setCards(access.cards);
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
          setCards([]);
          setLoading(false);
        }
        return;
      }
      setLoading(true);
      const access = await ensureUserProfile(u);
      if (!cancelled) {
        setRole(access.role);
        setCards(access.cards);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [uid, authLoading]);

  const value = {
    role,
    cards,
    loading: loading || authLoading,
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
