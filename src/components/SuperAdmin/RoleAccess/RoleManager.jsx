import React, { useEffect, useState, useCallback } from 'react';
import { useRole } from 'src/services/roles/RoleContext';
import {
  listUsersWithRoles,
  setUserRole,
  canAssign,
  assignableOptions,
  ROLE_LABELS,
  ROLES,
} from 'src/services/roles/roles';
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

  const q = query.trim().toLowerCase();
  const filtered = users.filter(
    u =>
      !q ||
      (u.email_id || '').toLowerCase().includes(q) ||
      (u.full_name || '').toLowerCase().includes(q)
  );

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

      {loading ? (
        <div className="text-muted">Loading users…</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Current role</th>
                <th style={{ minWidth: 180 }}>Change role</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-muted py-4">
                    No users found.
                  </td>
                </tr>
              )}
              {filtered.map(u => {
                const current = u.role || ROLES.USER;
                const options = assignableOptions(myRole, current);
                const locked = !canAssign(myRole, current, ROLES.EMPLOYEE) && options.length <= 1;
                return (
                  <tr key={u.id}>
                    <td>{u.full_name || '—'}</td>
                    <td>{u.email_id || u.id}</td>
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
    </div>
  );
};

export default RoleManager;
