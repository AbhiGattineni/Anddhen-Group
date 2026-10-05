import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Modal } from 'react-bootstrap';
import { useAuth } from 'src/hooks/useAuth';
import { listUsersWithRoles, ROLES } from 'src/services/roles/roles';
import { canAccessCard } from 'src/services/roles/cards';
import {
  STAGES,
  TYPES,
  PRIORITIES,
  subscribeTickets,
  subscribeProducts,
  createTicket,
  updateTicket,
  deleteTicket,
  initials,
  avatarColor,
} from 'src/services/jira/jiraBoard';
import './JiraBoard.css';

const UNASSIGNED = '__unassigned__';

function Avatar({ name, seed, size = 26, title }) {
  return (
    <span
      className="jira-avatar"
      title={title || name || 'Unassigned'}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        background: name ? avatarColor(seed || name) : '#cbd5e1',
      }}
    >
      {name ? initials(name) : <i className="bi bi-person" />}
    </span>
  );
}

Avatar.propTypes = {
  name: PropTypes.string,
  seed: PropTypes.string,
  size: PropTypes.number,
  title: PropTypes.string,
};

const EMPTY_FORM = {
  title: '',
  description: '',
  type: 'task',
  priority: 'medium',
  status: 'todo',
  assigneeUid: '',
  product: '',
};

function TicketModal({ show, ticket, people, products, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!show) return;
    setError('');
    setForm(
      ticket
        ? {
            title: ticket.title || '',
            description: ticket.description || '',
            type: ticket.type || 'task',
            priority: ticket.priority || 'medium',
            status: ticket.status || 'todo',
            assigneeUid: ticket.assigneeUid || '',
            product: ticket.product || '',
          }
        : EMPTY_FORM
    );
  }, [show, ticket]);

  const set = field => e => setForm(f => ({ ...f, [field]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Give the ticket a summary.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err?.message || 'Could not save the ticket.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete ${ticket.key}? This cannot be undone.`)) return;
    setSaving(true);
    try {
      await onDelete();
      onClose();
    } catch (err) {
      setError(err?.message || 'Could not delete the ticket.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <form onSubmit={submit}>
        <Modal.Header closeButton>
          <Modal.Title className="h5">
            {ticket ? (
              <span>
                <span className="text-muted me-2">{ticket.key}</span>Edit ticket
              </span>
            ) : (
              'Create ticket'
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label fw-semibold" htmlFor="jira-title">
              Summary
            </label>
            <input
              id="jira-title"
              className="form-control"
              value={form.title}
              onChange={set('title')}
              maxLength={200}
              autoFocus
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold" htmlFor="jira-desc">
              Description
            </label>
            <textarea
              id="jira-desc"
              className="form-control"
              rows={4}
              value={form.description}
              onChange={set('description')}
              maxLength={5000}
            />
          </div>
          <div className="row g-3">
            <div className="col-sm-6">
              <label className="form-label fw-semibold" htmlFor="jira-assignee">
                Assignee
              </label>
              <select
                id="jira-assignee"
                className="form-select"
                value={form.assigneeUid}
                onChange={set('assigneeUid')}
              >
                <option value="">Unassigned</option>
                {people.map(p => (
                  <option key={p.uid} value={p.uid}>
                    {p.name}
                  </option>
                ))}
                {ticket?.assigneeUid && !people.some(p => p.uid === ticket.assigneeUid) && (
                  <option value={ticket.assigneeUid}>
                    {ticket.assigneeName || 'Unknown'} (no Jira access)
                  </option>
                )}
              </select>
            </div>
            <div className="col-sm-6">
              <label className="form-label fw-semibold" htmlFor="jira-status">
                Stage
              </label>
              <select
                id="jira-status"
                className="form-select"
                value={form.status}
                onChange={set('status')}
              >
                {STAGES.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-sm-6">
              <label className="form-label fw-semibold" htmlFor="jira-type">
                Type
              </label>
              <select
                id="jira-type"
                className="form-select"
                value={form.type}
                onChange={set('type')}
              >
                {Object.entries(TYPES).map(([id, t]) => (
                  <option key={id} value={id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-sm-6">
              <label className="form-label fw-semibold" htmlFor="jira-priority">
                Priority
              </label>
              <select
                id="jira-priority"
                className="form-select"
                value={form.priority}
                onChange={set('priority')}
              >
                {Object.entries(PRIORITIES).map(([id, p]) => (
                  <option key={id} value={id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-3">
            <label className="form-label fw-semibold" htmlFor="jira-product">
              Product / Client
            </label>
            <select
              id="jira-product"
              className="form-select"
              value={form.product}
              onChange={set('product')}
            >
              <option value="">None (internal)</option>
              {products.map(name => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          {ticket?.source === 'contact' && ticket.contact && (
            <div className="jira-contact mt-3">
              <div className="fw-semibold mb-1">
                <i className="bi bi-envelope-paper me-1" />
                Reported via the Contact page
              </div>
              <div>{ticket.contact.name}</div>
              {ticket.contact.company && <div>{ticket.contact.company}</div>}
              {ticket.contact.email && (
                <div>
                  <a
                    href={`mailto:${ticket.contact.email}?subject=${encodeURIComponent(`${ticket.key}: ${ticket.title}`)}`}
                  >
                    {ticket.contact.email}
                  </a>
                </div>
              )}
              {ticket.contact.phone && (
                <div>
                  <a href={`tel:${ticket.contact.phone}`}>{ticket.contact.phone}</a>
                </div>
              )}
            </div>
          )}
          {ticket && ticket.source !== 'contact' && (
            <p className="text-muted small mt-3 mb-0">
              Reported by {ticket.reporterName || 'unknown'}
            </p>
          )}
          {error && <div className="alert alert-danger mt-3 mb-0 py-2">{error}</div>}
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <div>
            {ticket && (
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={remove}
                disabled={saving}
              >
                Delete
              </button>
            )}
          </div>
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-light" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : ticket ? 'Save' : 'Create'}
            </button>
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

TicketModal.propTypes = {
  show: PropTypes.bool.isRequired,
  ticket: PropTypes.object,
  people: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

/** Click the avatar on a card to reassign it without opening the editor. */
function AssigneePicker({ ticket, people, onAssign }) {
  const stop = e => e.stopPropagation();
  return (
    // Keep clicks/keys inside the picker from opening the ticket editor.
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <span onClick={stop} onKeyDown={stop}>
      <Dropdown align="end">
        <Dropdown.Toggle
          as="button"
          type="button"
          className="jira-assign-toggle"
          title={ticket.assigneeName ? `Assigned to ${ticket.assigneeName}` : 'Assign'}
          aria-label={
            ticket.assigneeName ? `Assigned to ${ticket.assigneeName}. Change` : 'Assign ticket'
          }
        >
          <Avatar name={ticket.assigneeName} seed={ticket.assigneeUid} size={24} />
        </Dropdown.Toggle>
        <Dropdown.Menu className="jira-assign-menu" popperConfig={{ strategy: 'fixed' }}>
          <Dropdown.Header>Assign to</Dropdown.Header>
          <Dropdown.Item active={!ticket.assigneeUid} onClick={() => onAssign(ticket, null)}>
            <Avatar size={22} /> <span className="ms-2">Unassigned</span>
          </Dropdown.Item>
          {people.map(p => (
            <Dropdown.Item
              key={p.uid}
              active={ticket.assigneeUid === p.uid}
              onClick={() => onAssign(ticket, p)}
            >
              <Avatar name={p.name} seed={p.uid} size={22} />
              <span className="ms-2">{p.name}</span>
            </Dropdown.Item>
          ))}
          {people.length === 0 && (
            <Dropdown.ItemText className="text-muted small">
              Nobody has Jira access yet.
            </Dropdown.ItemText>
          )}
        </Dropdown.Menu>
      </Dropdown>
    </span>
  );
}

AssigneePicker.propTypes = {
  ticket: PropTypes.object.isRequired,
  people: PropTypes.array.isRequired,
  onAssign: PropTypes.func.isRequired,
};

function TicketCard({ ticket, people, onOpen, onDragStart, onAssign }) {
  const type = TYPES[ticket.type] || TYPES.task;
  const priority = PRIORITIES[ticket.priority] || PRIORITIES.medium;
  return (
    <div
      className="jira-card"
      draggable
      onDragStart={e => onDragStart(e, ticket)}
      onClick={() => onOpen(ticket)}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onOpen(ticket)}
      role="button"
      tabIndex={0}
    >
      <div className="jira-card-title">{ticket.title}</div>
      {ticket.product && (
        <div className="mb-2">
          <span className="jira-product" title="Product / client">
            {ticket.product}
          </span>
          {ticket.source === 'contact' && (
            <i className="bi bi-envelope-paper ms-2 text-muted" title="Reported by a customer" />
          )}
        </div>
      )}
      <div className="jira-card-meta">
        <span className="d-flex align-items-center gap-2">
          <i className={`bi ${type.icon}`} style={{ color: type.color }} title={type.label} />
          <span className={`jira-card-key${ticket.status === 'done' ? ' done' : ''}`}>
            {ticket.key}
          </span>
        </span>
        <span className="d-flex align-items-center gap-2">
          <i
            className={`bi ${priority.icon}`}
            style={{ color: priority.color }}
            title={`${priority.label} priority`}
          />
          <AssigneePicker ticket={ticket} people={people} onAssign={onAssign} />
        </span>
      </div>
    </div>
  );
}

TicketCard.propTypes = {
  ticket: PropTypes.object.isRequired,
  people: PropTypes.array.isRequired,
  onOpen: PropTypes.func.isRequired,
  onDragStart: PropTypes.func.isRequired,
  onAssign: PropTypes.func.isRequired,
};

const byPriorityThenNewest = (a, b) =>
  (PRIORITIES[a.priority]?.rank ?? 2) - (PRIORITIES[b.priority]?.rank ?? 2) ||
  (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);

export default function JiraBoard() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState([]);
  const [productFilter, setProductFilter] = useState('');
  const [productDocs, setProductDocs] = useState([]);
  const [modal, setModal] = useState({ show: false, ticket: null });
  const [dragOver, setDragOver] = useState(null);

  useEffect(
    () =>
      subscribeTickets(
        list => {
          setTickets(list);
          setLoading(false);
        },
        err => {
          setError(err);
          setLoading(false);
        }
      ),
    []
  );

  useEffect(() => subscribeProducts(setProductDocs), []);

  // Product names for the filter and editor: managed products plus any still
  // used by tickets (renamed or deleted products stay readable).
  const productNames = useMemo(() => {
    const names = new Set(productDocs.map(p => p.name).filter(Boolean));
    tickets.forEach(t => t.product && names.add(t.product));
    return [...names].sort((a, b) => a.localeCompare(b));
  }, [productDocs, tickets]);

  useEffect(() => {
    listUsersWithRoles()
      .then(setUsers)
      .catch(err => console.error('Could not load people for the Jira board:', err));
  }, []);

  // Everyone who can be assigned work: whoever can open this board — admins and
  // above, plus employees granted the Jira card under Roles & Access.
  const people = useMemo(
    () =>
      users
        .filter(u => (u.role || ROLES.USER) !== ROLES.USER)
        .filter(u => canAccessCard(u.role, u.cardAccess, 'jira'))
        .map(u => ({ uid: u.id, name: u.full_name || u.email_id || u.id }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [users]
  );

  // Avatars in the filter bar: people who hold tickets first, then everyone else.
  const filterPeople = useMemo(() => {
    const counts = {};
    tickets.forEach(t => {
      const k = t.assigneeUid || UNASSIGNED;
      counts[k] = (counts[k] || 0) + 1;
    });
    const list = people.map(p => ({ ...p, count: counts[p.uid] || 0 }));
    // Keep assignees who have tickets but are no longer employees.
    tickets.forEach(t => {
      if (t.assigneeUid && !list.some(p => p.uid === t.assigneeUid)) {
        list.push({ uid: t.assigneeUid, name: t.assigneeName, count: counts[t.assigneeUid] });
      }
    });
    return list.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [people, tickets]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tickets.filter(t => {
      if (assigneeFilter.length && !assigneeFilter.includes(t.assigneeUid || UNASSIGNED)) {
        return false;
      }
      if (productFilter && (t.product || '') !== productFilter) return false;
      if (!q) return true;
      return (
        (t.title || '').toLowerCase().includes(q) ||
        (t.product || '').toLowerCase().includes(q) ||
        (t.key || '').toLowerCase().includes(q) ||
        (t.assigneeName || '').toLowerCase().includes(q)
      );
    });
  }, [tickets, search, assigneeFilter, productFilter]);

  const columns = useMemo(
    () =>
      STAGES.map(stage => ({
        ...stage,
        tickets: visible.filter(t => (t.status || 'todo') === stage.id).sort(byPriorityThenNewest),
      })),
    [visible]
  );

  const toggleAssignee = uid =>
    setAssigneeFilter(f => (f.includes(uid) ? f.filter(x => x !== uid) : [...f, uid]));

  const nameFor = uid => people.find(p => p.uid === uid)?.name || '';

  const save = async form => {
    const fields = {
      title: form.title.trim(),
      description: form.description.trim(),
      type: form.type,
      priority: form.priority,
      status: form.status,
      product: form.product,
      assigneeUid: form.assigneeUid || '',
      assigneeName: form.assigneeUid
        ? nameFor(form.assigneeUid) || modal.ticket?.assigneeName || ''
        : '',
    };
    if (modal.ticket) {
      await updateTicket(modal.ticket.id, fields);
    } else {
      await createTicket({
        ...fields,
        reporterUid: user?.uid || '',
        reporterName: user?.displayName || user?.email || '',
      });
    }
  };

  const assign = async (ticket, person) => {
    const fields = { assigneeUid: person?.uid || '', assigneeName: person?.name || '' };
    if (ticket.assigneeUid === fields.assigneeUid) return;
    // Optimistic; the live listener confirms (or reverts) it.
    setTickets(list => list.map(t => (t.id === ticket.id ? { ...t, ...fields } : t)));
    try {
      await updateTicket(ticket.id, fields);
    } catch (err) {
      setError(err?.message || 'Could not assign the ticket.');
      setTickets(list =>
        list.map(t =>
          t.id === ticket.id
            ? { ...t, assigneeUid: ticket.assigneeUid, assigneeName: ticket.assigneeName }
            : t
        )
      );
    }
  };

  const onDragStart = (e, ticket) => {
    e.dataTransfer.setData('text/plain', ticket.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDrop = async (e, stageId) => {
    e.preventDefault();
    setDragOver(null);
    const id = e.dataTransfer.getData('text/plain');
    const ticket = tickets.find(t => t.id === id);
    if (!ticket || ticket.status === stageId) return;
    // Optimistic move; the live listener confirms (or reverts) it.
    setTickets(list => list.map(t => (t.id === id ? { ...t, status: stageId } : t)));
    try {
      await updateTicket(id, { status: stageId });
    } catch (err) {
      setError(err?.message || 'Could not move the ticket.');
      setTickets(list => list.map(t => (t.id === id ? { ...t, status: ticket.status } : t)));
    }
  };

  const filtersOn = search.trim() || assigneeFilter.length || productFilter;

  return (
    <div className="jira-wrap">
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-3">
        <div>
          <h2 className="jira-title h3">Jira Board</h2>
          <p className="jira-subtitle mb-0">
            Drag tickets between stages, or click one to edit it.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setModal({ show: true, ticket: null })}
        >
          <i className="bi bi-plus-lg me-1" />
          Create
        </button>
      </div>

      <div className="jira-toolbar">
        <div className="jira-search">
          <i className="bi bi-search" />
          <input
            type="search"
            className="form-control"
            placeholder="Search this board"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {productNames.length > 0 && (
          <select
            className="form-select jira-product-filter"
            value={productFilter}
            onChange={e => setProductFilter(e.target.value)}
            aria-label="Filter by product"
          >
            <option value="">All products</option>
            {productNames.map(n => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        )}
        <div className="jira-people">
          {filterPeople.map(p => (
            <button
              key={p.uid}
              type="button"
              className={`jira-person${assigneeFilter.includes(p.uid) ? ' active' : ''}`}
              onClick={() => toggleAssignee(p.uid)}
              title={`${p.name} · ${p.count} ticket${p.count === 1 ? '' : 's'}`}
            >
              <Avatar name={p.name} seed={p.uid} size={32} title={p.name} />
            </button>
          ))}
          <button
            type="button"
            className={`jira-person${assigneeFilter.includes(UNASSIGNED) ? ' active' : ''}`}
            onClick={() => toggleAssignee(UNASSIGNED)}
            title="Unassigned"
          >
            <Avatar size={32} title="Unassigned" />
          </button>
        </div>
        {user && (
          <button
            type="button"
            className={`btn btn-sm ${
              assigneeFilter.length === 1 && assigneeFilter[0] === user.uid
                ? 'btn-primary'
                : 'btn-outline-secondary'
            }`}
            onClick={() =>
              setAssigneeFilter(f => (f.length === 1 && f[0] === user.uid ? [] : [user.uid]))
            }
          >
            Only my issues
          </button>
        )}
        {filtersOn ? (
          <button
            type="button"
            className="btn btn-sm btn-link"
            onClick={() => {
              setSearch('');
              setAssigneeFilter([]);
              setProductFilter('');
            }}
          >
            Clear filters
          </button>
        ) : null}
      </div>

      {error && <div className="alert alert-danger py-2">{String(error)}</div>}

      {loading ? (
        <div className="text-center text-muted py-5">Loading board…</div>
      ) : (
        <div className="jira-board">
          {columns.map(col => (
            <div
              key={col.id}
              className={`jira-column${dragOver === col.id ? ' drag-over' : ''}`}
              onDragOver={e => {
                e.preventDefault();
                if (dragOver !== col.id) setDragOver(col.id);
              }}
              onDragLeave={e => {
                if (!e.currentTarget.contains(e.relatedTarget)) setDragOver(null);
              }}
              onDrop={e => onDrop(e, col.id)}
            >
              <div className="jira-column-head">
                <span>{col.label}</span>
                <span className="jira-count">{col.tickets.length}</span>
              </div>
              <div className="jira-column-body">
                {col.tickets.map(t => (
                  <TicketCard
                    key={t.id}
                    ticket={t}
                    people={people}
                    onAssign={assign}
                    onOpen={ticket => setModal({ show: true, ticket })}
                    onDragStart={onDragStart}
                  />
                ))}
                {col.tickets.length === 0 && <div className="jira-empty">No tickets</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      <TicketModal
        show={modal.show}
        ticket={modal.ticket}
        people={people}
        products={productNames}
        onClose={() => setModal({ show: false, ticket: null })}
        onSave={save}
        onDelete={() => deleteTicket(modal.ticket.id)}
      />
    </div>
  );
}
