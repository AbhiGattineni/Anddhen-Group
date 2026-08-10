/**
 * Card access — which dashboard cards a given user may open.
 *
 * The role hierarchy in roles.js answers "how much of the app is this person
 * allowed into"; this module answers "which sections did an admin actually hand
 * them". Grants live on the same Firestore doc as the role
 * (`User/{uid}.cardAccess`), so one read resolves both and firestore.rules can
 * protect them together (a user may edit their own profile but never their own
 * grants).
 *
 * A grant is stored as the card's `route` from `adminPlates` — the same string
 * the router uses — so a granted card and the page behind it can never drift.
 */
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../connector/firebase';
import { adminPlates } from '../../dataconfig';
import { ROLES, hasAtLeast } from './roles';

/** Every assignable card, in dashboard order. `key` is the card's route. */
export const CARD_CATALOG = adminPlates.map(plate => ({
  key: plate.route,
  label: plate.child,
  icon: plate.icon,
  desc: plate.desc,
}));

export const CARD_KEYS = CARD_CATALOG.map(card => card.key);

const CARD_LABELS = CARD_CATALOG.reduce((acc, card) => {
  acc[card.key] = card.label;
  return acc;
}, {});

/** Human-readable name for a stored grant (falls back to the raw key). */
export const cardLabel = key => CARD_LABELS[key] || key;

/**
 * Coerce a stored `cardAccess` value into a clean list of known card keys.
 * Tolerates the legacy comma-separated string shape and silently drops keys for
 * cards that no longer exist, so a renamed route can never grant a dead page.
 */
export function normalizeCards(value) {
  const raw = Array.isArray(value) ? value : typeof value === 'string' ? value.split(',') : [];
  const seen = new Set();
  return raw
    .map(key => String(key).trim())
    .filter(key => CARD_KEYS.includes(key) && !seen.has(key) && seen.add(key));
}

/** Admin and above implicitly hold every card; nobody needs to grant them. */
export const hasAllCards = role => hasAtLeast(role, ROLES.ADMIN);

/** The cards this person should see on their dashboard. */
export function visibleCards(role, cards) {
  if (hasAllCards(role)) return adminPlates;
  const granted = new Set(normalizeCards(cards));
  return adminPlates.filter(plate => granted.has(plate.route));
}

/** Can this person open the page behind `key`? */
export function canAccessCard(role, cards, key) {
  if (hasAllCards(role)) return true;
  if (!key) return true;
  return normalizeCards(cards).includes(key);
}

/**
 * Replace a user's grants. Authorization is enforced by firestore.rules
 * (admin/superadmin only); callers should gate the UI to match.
 */
export async function setUserCards(uid, cards) {
  await updateDoc(doc(db, 'User', uid), {
    cardAccess: normalizeCards(cards),
    updatedAt: serverTimestamp(),
  });
}
