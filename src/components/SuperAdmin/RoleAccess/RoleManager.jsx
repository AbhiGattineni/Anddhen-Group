import React, { useEffect, useState, useCallback } from 'react';
import { useRole } from 'src/services/roles/RoleContext';
import {
  listUsersWithRoles,
  setUserRole,
  deleteUserProfile,
  canAssign,
  assignableOptions,
  ROLE_LABELS,
  ROLES,
} from 'src/services/roles/roles';
import { auth } from 'src/services/Authentication/firebase';
import ConfirmationDialog from 'src/components/organisms/Modal/ConfirmationDialog';

const ROLE_BADGE = {
  superadmin: 'bg-danger',
  admin: 'bg-primary',
  employee: 'bg-info text-dark',
  user: 'bg-secondary',
};

/**
 * Firebase user-role manager. Lists User docs and lets an admin/superadmin change
 * each user's role. Authorization is enforced by firestore.rules; the UI mirrors
 * it with canAssign() so users only see valid options.
 */
const RoleManager = () => {
  const { role: myRole, canManageRoles: canManage } = useRole();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [query, setQuery] = useState('');
  // Pending role change awaiting confirmation: { user, newRole } | null
  const [pending, setPending] = useState(null);
  // Pending profile deletion awaiting confirmation: user | null
  const [pendingDelete, setPendingDelete] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setUsers(await listUsersWithRoles());
    } catch (e) {
      setError(e.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (canManage) load();
    else setLoading(false);
  }, [canManage, load]);

  if (!canManage) {
    return (
      <div className="alert alert-warning my-4">
        You need an <strong>Admin</strong> or <strong>Super Admin</strong> role to manage user
        roles.
      </div>
    );
  }

  // Open the confirmation modal instead of applying the change immediately.
  const requestChange = (u, newRole) => {
    const current = u.role || ROLES.USER;
    if (newRole === current) return;
    setPending({ user: u, newRole });
  };

  const confirmChange = async () => {
    if (!pending) return;
    const { user: u, newRole } = pending;
    setSavingId(u.id);
    setError(null);
    try {
      await setUserRole(u.id, newRole);
      await load();
      setPending(null);
    } catch (e) {
      setError(`Could not update ${u.email_id || u.id}: ${e.message || e}`);
      setPending(null);
    } finally {
      setSavingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const u = pendingDelete;
    setSavingId(u.id);
    setError(null);
    try {
      await deleteUserProfile(u.id);
      await load();
      setPendingDelete(null);
    } catch (e) {
      setError(`Could not remove ${u.email_id || u.id}: ${e.message || e}`);
      setPendingDelete(null);
    } finally {
      setSavingId(null);
    }
  };

  // You can't remove your own profile, and an admin can't remove someone they
  // aren't allowed to manage — same rule the role dropdown enforces.
  const canDelete = u =>
    u.id !== auth.currentUser?.uid && canAssign(myRole, u.role || ROLES.USER, ROLES.USER);

  const q = query.trim().toLowerCase();
  const filtered = users.filter(
    u =>
      !q ||
      (u.email_id || '').toLowerCase().includes(q) ||
      (u.full_name || '').toLowerCase().includes(q)
  );

  // Same email on more than one document means only one of them is the doc the
  // app actually reads (User/{firebase-uid}); a role set on the other is
  // invisible at runtime. Catching it by email also flags legacy rows that
  // carry no user_id field at all, which the per-row id check can't see.
  const emailCounts = users.reduce((acc, u) => {
    const key = (u.email_id || '').toLowerCase();
    if (key) acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const isDuplicated = u => (emailCounts[(u.email_id || '').toLowerCase()] || 0) > 1;
  const duplicateCount = Object.values(emailCounts).filter(n => n > 1).length;

  const badgeClass = role => ROLE_BADGE[role] || 'bg-secondary';

  return (
    <div className="my-3">
      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3">
        <h5 className="mb-0">User Roles</h5>
        <input
          type="search"
          className="form-control form-control-sm"
          style={{ maxWidth: 260 }}
          placeholder="Search name or email"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      {duplicateCount > 0 && (
        <div className="alert alert-warning py-2">
          {duplicateCount} email{duplicateCount === 1 ? ' is' : 's are'} on more than one document.
          Access is decided by the document whose <strong>Doc ID</strong> equals the user&apos;s
          Firebase UID — a role set on any other copy is ignored. The user can read their UID off
          the 403 page.
        </div>
      )}

      {loading ? (
        <div className="text-muted">Loading users…</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Doc ID (UID)</th>
                <th>Current role</th>
                <th style={{ minWidth: 180 }}>Change role</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-4">
                    No users found.
                  </td>
                </tr>
              )}
              {filtered.map(u => {
                const current = u.role || ROLES.USER;
                const options = assignableOptions(myRole, current);
                const locked = !canAssign(myRole, current, ROLES.EMPLOYEE) && options.length <= 1;
                // The app resolves a role by reading User/{firebase-uid}, so a doc
                // whose id doesn't match its own user_id is a stale/duplicate row:
                // editing it changes nothing the signed-in user will ever see.
                const orphaned = !!u.user_id && u.user_id !== u.id;
                return (
                  <tr key={u.id}>
                    <td>{u.full_name || '—'}</td>
                    <td>{u.email_id || u.id}</td>
                    <td>
                      <code className="small">{u.id}</code>
                      {(orphaned || isDuplicated(u)) && (
                        <span
                          className="badge bg-warning text-dark ms-2"
                          title={
                            orphaned
                              ? `This document's id does not match its user_id field (${u.user_id}). The app reads User/<uid>, so a role set here has no effect.`
                              : 'Another document shares this email. Only the one whose Doc ID equals the signed-in UID governs access — a role set on the other is ignored. The user can read their UID off the 403 page.'
                          }
                        >
                          check UID
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${badgeClass(current)}`}>
                        {ROLE_LABELS[current] || current}
                      </span>
                    </td>
                    <td>
                      <select
                        className="form-select form-select-sm"
                        value={current}
                        disabled={locked || savingId === u.id}
                        onChange={e => requestChange(u, e.target.value)}
                      >
                        {options.map(r => (
                          <option key={r} value={r}>
                            {ROLE_LABELS[r] || r}
                          </option>
                        ))}
                      </select>
                      {savingId === u.id && <small className="text-muted ms-2">saving…</small>}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        disabled={!canDelete(u) || savingId === u.id}
                        title={
                          canDelete(u)
                            ? 'Remove this profile document (role and card grants). Does not delete their Auth account.'
                            : u.id === auth.currentUser?.uid
                              ? "You can't remove your own profile."
                              : 'You are not allowed to manage this user.'
                        }
                        onClick={() => setPendingDelete(u)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmationDialog
        show={!!pending}
        title="Change user role"
        isLoading={!!pending && savingId === pending.user.id}
        message={
          pending
            ? `Change ${pending.user.email_id || pending.user.full_name || pending.user.id} from ` +
              `"${ROLE_LABELS[pending.user.role || ROLES.USER]}" to ` +
              `"${ROLE_LABELS[pending.newRole]}"?`
            : ''
        }
        onConfirm={confirmChange}
        onCancel={() => setPending(null)}
      />

      <ConfirmationDialog
        show={!!pendingDelete}
        title="Remove user profile"
        isLoading={!!pendingDelete && savingId === pendingDelete.id}
        message={
          pendingDelete
            ? `Remove the profile for ${
                pendingDelete.email_id || pendingDelete.full_name || pendingDelete.id
              }? This deletes their role and card grants. It does NOT delete their sign-in account — if that still exists, a fresh profile is created as a plain User next time they sign in.`
            : ''
        }
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
};

export default RoleManager;
