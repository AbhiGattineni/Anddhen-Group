import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import { useRole } from 'src/services/roles/RoleContext';
import { listUsersWithRoles, ROLE_LABELS, ROLES } from 'src/services/roles/roles';
import {
  CARD_CATALOG,
  CARD_KEYS,
  cardLabel,
  hasAllCards,
  normalizeCards,
  setUserCards,
} from 'src/services/roles/cards';
import ConfirmationDialog from 'src/components/organisms/Modal/ConfirmationDialog';

/**
 * Grant dashboard cards to a user. Picking a user loads their current grants
 * into the checklist; saving replaces them. Admins and superadmins already hold
 * every card by virtue of their role, so the checklist is read-only for them.
 */
const AssignCardAccess = () => {
  const { canManageRoles: canManage, refresh } = useRole();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [checked, setChecked] = useState([]);
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [notice, setNotice] = useState(null);
  const [query, setQuery] = useState('');

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

  const userOptions = useMemo(
    () =>
      users.map(u => ({
        value: u.id,
        label: `${u.full_name || u.email_id || u.id} · ${ROLE_LABELS[u.role || ROLES.USER]}`,
      })),
    [users]
  );

  const target = useMemo(
    () => users.find(u => u.id === selectedUser?.value) || null,
    [users, selectedUser]
  );
  const targetRole = target?.role || ROLES.USER;
  // Admin/superadmin grants are implied by the role — nothing to hand out.
  const targetHasAll = hasAllCards(targetRole);

  // Load the selected user's saved grants into the checklist. Also re-syncs
  // after a save reloads the list, so the checklist always mirrors Firestore.
  // The success notice is cleared on user change, not here — this effect fires
  // during the post-save reload and would otherwise race the message away.
  useEffect(() => {
    setChecked(target ? normalizeCards(target.cardAccess) : []);
  }, [target]);

  if (!canManage) {
    return (
      <div className="alert alert-warning my-4">
        You need an <strong>Admin</strong> or <strong>Super Admin</strong> role to assign card
        access.
      </div>
    );
  }

  const toggle = key =>
    setChecked(prev => (prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]));

  const saved = normalizeCards(target?.cardAccess);
  const dirty =
    !!target && (checked.length !== saved.length || checked.some(key => !saved.includes(key)));

  const save = async () => {
    if (!target) return;
    setSaving(true);
    setError(null);
    try {
      await setUserCards(target.id, checked);
      await load();
      // If an admin edited their own grants, refresh this session's context too.
      await refresh();
      setNotice(
        checked.length
          ? `Saved — ${target.full_name || target.email_id} can now open ${checked.length} card${
              checked.length === 1 ? '' : 's'
            }.`
          : `Saved — all card access removed for ${target.full_name || target.email_id}.`
      );
    } catch (e) {
      setError(`Could not save access: ${e.message || e}`);
    } finally {
      setSaving(false);
      setConfirming(false);
    }
  };

  const q = query.trim().toLowerCase();
  const granted = users
    .map(u => ({ ...u, grants: normalizeCards(u.cardAccess) }))
    .filter(u => u.grants.length > 0 || hasAllCards(u.role))
    .filter(
      u =>
        !q ||
        (u.email_id || '').toLowerCase().includes(q) ||
        (u.full_name || '').toLowerCase().includes(q)
    );

  return (
    <div className="my-3">
      <h5 className="mb-1">Card Access</h5>
      <p className="text-muted small">
        Pick a user, tick the cards they should get, and save. Those cards then appear on their
        Employee Dashboard and the pages behind them become reachable. Admins and Super Admins
        always have every card.
      </p>

      {error && <div className="alert alert-danger py-2">{error}</div>}
      {notice && <div className="alert alert-success py-2">{notice}</div>}

      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="cardUserSelect" className="form-label">
            User
          </label>
          <Select
            inputId="cardUserSelect"
            options={userOptions}
            value={selectedUser}
            onChange={option => {
              setSelectedUser(option);
              setNotice(null);
            }}
            placeholder={loading ? 'Loading users…' : 'Select user'}
            isDisabled={loading}
            isClearable
            isSearchable
          />
        </div>
      </div>

      {target && (
        <div className="card mb-4">
          <div className="card-body">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
              <div>
                <strong>{target.full_name || target.email_id || target.id}</strong>{' '}
                <span className="badge bg-secondary">{ROLE_LABELS[targetRole] || targetRole}</span>
              </div>
              {!targetHasAll && (
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setChecked(CARD_KEYS)}
                    disabled={saving}
                  >
                    Select all
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setChecked([])}
                    disabled={saving}
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {targetHasAll ? (
              <div className="alert alert-info mb-0">
                {ROLE_LABELS[targetRole]}s already have access to every card. To limit this person
                to specific cards, first set their role to <strong>Employee</strong> on the User
                Roles tab.
              </div>
            ) : (
              <>
                {targetRole === ROLES.USER && (
                  <div className="alert alert-warning">
                    This person&apos;s role is <strong>User</strong>, so they cannot open the
                    Employee Dashboard at all yet. Set their role to <strong>Employee</strong> on
                    the User Roles tab, otherwise these cards will never show up for them.
                  </div>
                )}
                <div className="row g-2">
                  {CARD_CATALOG.map(card => (
                    <div className="col-12 col-md-6 col-xl-4" key={card.key}>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`card-${card.key}`}
                          checked={checked.includes(card.key)}
                          onChange={() => toggle(card.key)}
                          disabled={saving}
                        />
                        <label className="form-check-label" htmlFor={`card-${card.key}`}>
                          <i className={`bi ${card.icon || 'bi-grid'} me-2`}></i>
                          {card.label}
                          <span className="d-block text-muted small">{card.desc}</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="d-flex align-items-center gap-3 mt-3">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setConfirming(true)}
                    disabled={!dirty || saving}
                  >
                    {saving ? 'Saving…' : 'Save access'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={() => setChecked(saved)}
                    disabled={!dirty || saving}
                  >
                    Reset
                  </button>
                  <span className="text-muted small">
                    {checked.length} of {CARD_KEYS.length} selected
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-2">
        <h6 className="mb-0">Who has what</h6>
        <input
          type="search"
          className="form-control form-control-sm"
          style={{ maxWidth: 260 }}
          placeholder="Search name or email"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-muted">Loading users…</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle rt-stack">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Cards</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {granted.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-4">
                    Nobody has been granted a card yet.
                  </td>
                </tr>
              )}
              {granted.map(u => (
                <tr key={u.id}>
                  <td data-label="Name">{u.full_name || '—'}</td>
                  <td data-label="Email">{u.email_id || u.id}</td>
                  <td data-label="Role">
                    <span className="badge bg-secondary">
                      {ROLE_LABELS[u.role || ROLES.USER] || u.role}
                    </span>
                  </td>
                  <td data-label="Cards" className="rt-block">
                    {hasAllCards(u.role) ? (
                      <span className="text-muted">All cards (by role)</span>
                    ) : (
                      <div className="d-flex flex-wrap gap-1">
                        {u.grants.map(key => (
                          <span className="badge bg-light text-dark border" key={key}>
                            {cardLabel(key)}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td data-label="Actions">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => {
                        setSelectedUser(
                          userOptions.find(o => o.value === u.id) || {
                            value: u.id,
                            label: u.full_name || u.email_id || u.id,
                          }
                        );
                        setNotice(null);
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmationDialog
        show={confirming}
        title="Update card access"
        isLoading={saving}
        message={
          target
            ? `Give ${target.full_name || target.email_id || target.id} access to ${
                checked.length
              } card(s)? This replaces their current access.`
            : ''
        }
        onConfirm={save}
        onCancel={() => setConfirming(false)}
      />
    </div>
  );
};

export default AssignCardAccess;
