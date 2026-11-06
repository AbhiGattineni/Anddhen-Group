import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  STAGES,
  TYPES,
  PRIORITIES,
  LOGGED_FIELDS,
  subscribeActivity,
  addComment,
  editComment,
  deleteComment,
} from 'src/services/jira/jiraBoard';
import Avatar from './JiraAvatar';

const FILTERS = [
  ['all', 'All'],
  ['comment', 'Comments'],
  ['change', 'History'],
];

const toDate = ts => (ts?.toDate ? ts.toDate() : ts instanceof Date ? ts : null);

function when(ts) {
  const d = toDate(ts);
  if (!d) return 'just now';
  const s = Math.round((Date.now() - d.getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  if (s < 7 * 86400) return `${Math.floor(s / 86400)} d ago`;
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

const fullTime = ts => toDate(ts)?.toLocaleString() || '';

/** Human label for a logged value. */
function valueLabel(field, v) {
  if (!v) return 'None';
  if (field === 'status') return STAGES.find(s => s.id === v)?.label || v;
  if (field === 'priority') return PRIORITIES[v]?.label || v;
  if (field === 'type') return TYPES[v]?.label || v;
  return v;
}

/** "moved this from To Do to In Progress", etc. */
function describe(e) {
  const from = valueLabel(e.field, e.from);
  const to = valueLabel(e.field, e.to);
  switch (e.field) {
    case 'status':
      return (
        <>
          moved this from <span className="jira-pill">{from}</span> to{' '}
          <span className="jira-pill">{to}</span>
        </>
      );
    case 'assignee':
      if (!e.to) return <>unassigned {from}</>;
      if (!e.from) return <>assigned this to {to}</>;
      return (
        <>
          reassigned this from {from} to {to}
        </>
      );
    case 'description':
      return <>updated the description</>;
    case 'title':
      return (
        <>
          changed the summary from <q>{from}</q> to <q>{to}</q>
        </>
      );
    default:
      return (
        <>
          changed {LOGGED_FIELDS[e.field]?.toLowerCase() || e.field} from <strong>{from}</strong> to{' '}
          <strong>{to}</strong>
        </>
      );
  }
}

function Comment({ entry, mine, ticketId }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(entry.text);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const save = async () => {
    if (!text.trim()) return;
    setBusy(true);
    setError('');
    try {
      await editComment(ticketId, entry.id, text);
      setEditing(false);
    } catch (err) {
      setError(err?.message || 'Could not save.');
    } finally {
      setBusy(false);
    }
  };
  const remove = async () => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await deleteComment(ticketId, entry.id);
    } catch (err) {
      setError(err?.message || 'Could not delete.');
    }
  };

  return (
    <li className="jira-act jira-act-comment">
      <Avatar name={entry.actorName} seed={entry.actorUid} size={30} />
      <div className="jira-act-body">
        <div className="jira-act-head">
          <strong>{entry.actorName}</strong>
          <span className="text-muted" title={fullTime(entry.createdAt)}>
            {when(entry.createdAt)}
          </span>
          {entry.editedAt && (
            <span className="text-muted" title={`Edited ${fullTime(entry.editedAt)}`}>
              (edited)
            </span>
          )}
        </div>
        {editing ? (
          <>
            <textarea
              className="form-control form-control-sm"
              rows={3}
              value={text}
              onChange={e => setText(e.target.value)}
              maxLength={5000}
              aria-label="Edit comment"
            />
            <div className="d-flex gap-2 mt-1">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={save}
                disabled={busy || !text.trim()}
              >
                Save
              </button>
              <button
                type="button"
                className="btn btn-light btn-sm"
                onClick={() => {
                  setEditing(false);
                  setText(entry.text);
                }}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div className="jira-act-text">{entry.text}</div>
        )}
        {mine && !editing && (
          <div className="jira-act-actions">
            <button
              type="button"
              className="btn btn-link btn-sm p-0"
              onClick={() => setEditing(true)}
            >
              Edit
            </button>
            <button type="button" className="btn btn-link btn-sm p-0 text-danger" onClick={remove}>
              Delete
            </button>
          </div>
        )}
        {error && <div className="text-danger small">{error}</div>}
      </div>
    </li>
  );
}

Comment.propTypes = {
  entry: PropTypes.object.isRequired,
  mine: PropTypes.bool,
  ticketId: PropTypes.string.isRequired,
};

/**
 * Comments and the full change log of one ticket — every move between stages,
 * reassignment and edit, with who did it and when. Newest first.
 */
export default function TicketActivity({ ticket, user }) {
  const [entries, setEntries] = useState(null);
  const [filter, setFilter] = useState('all');
  const [text, setText] = useState('');
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setEntries(null);
    return subscribeActivity(ticket.id, setEntries, setError);
  }, [ticket.id]);

  const list = useMemo(() => {
    const created = {
      id: '__created',
      kind: 'created',
      actorName: ticket.reporterName || (ticket.source === 'contact' ? 'Contact form' : 'Someone'),
      actorUid: ticket.reporterUid || ticket.reporterName || '',
      createdAt: ticket.createdAt,
    };
    return [created, ...(entries || [])]
      .filter(
        e => filter === 'all' || e.kind === filter || (filter === 'change' && e.kind === 'created')
      )
      .reverse();
  }, [entries, filter, ticket]);

  const counts = useMemo(
    () => ({
      comment: (entries || []).filter(e => e.kind === 'comment').length,
      change: (entries || []).filter(e => e.kind === 'change').length + 1,
    }),
    [entries]
  );

  const post = async () => {
    if (!text.trim() || !user) return;
    setPosting(true);
    setError('');
    try {
      await addComment(ticket.id, text, user);
      setText('');
    } catch (err) {
      setError(err?.message || 'Could not post the comment.');
    } finally {
      setPosting(false);
    }
  };

  return (
    <section className="jira-activity" aria-label="Activity">
      <div className="jira-activity-head">
        <h6 className="mb-0">Activity</h6>
        <div className="jira-activity-tabs" role="tablist">
          {FILTERS.map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={filter === id}
              className={filter === id ? 'on' : ''}
              onClick={() => setFilter(id)}
            >
              {label}
              {id !== 'all' && <span className="jira-activity-count">{counts[id]}</span>}
            </button>
          ))}
        </div>
      </div>

      {filter !== 'change' && user && (
        <div className="jira-comment-box">
          <Avatar name={user.displayName || user.email} seed={user.uid} size={30} />
          <div className="flex-grow-1">
            <textarea
              className="form-control"
              rows={2}
              placeholder="Add a comment…"
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  post();
                }
              }}
              maxLength={5000}
              aria-label="Add a comment"
            />
            {text.trim() && (
              <div className="d-flex align-items-center gap-2 mt-1">
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={post}
                  disabled={posting}
                >
                  {posting ? 'Posting…' : 'Comment'}
                </button>
                <button type="button" className="btn btn-light btn-sm" onClick={() => setText('')}>
                  Cancel
                </button>
                <span className="text-muted small">Ctrl + Enter to post</span>
              </div>
            )}
          </div>
        </div>
      )}

      {error && <div className="alert alert-warning py-1 small">{String(error)}</div>}

      {entries === null ? (
        <div className="text-muted small py-2">Loading activity…</div>
      ) : (
        <ul className="jira-act-list">
          {list.map(e =>
            e.kind === 'comment' ? (
              <Comment
                key={e.id}
                entry={e}
                ticketId={ticket.id}
                mine={!!user && e.actorUid === user.uid}
              />
            ) : (
              <li key={e.id} className="jira-act jira-act-change">
                <Avatar name={e.actorName} seed={e.actorUid} size={22} />
                <div className="jira-act-body">
                  <strong>{e.actorName}</strong>{' '}
                  {e.kind === 'created' ? (
                    ticket.source === 'contact' ? (
                      <>reported this via the Contact page</>
                    ) : (
                      <>created this ticket</>
                    )
                  ) : (
                    describe(e)
                  )}
                  <span className="text-muted ms-2" title={fullTime(e.createdAt)}>
                    {when(e.createdAt)}
                  </span>
                </div>
              </li>
            )
          )}
          {filter === 'comment' && counts.comment === 0 && (
            <li className="text-muted small py-2">No comments yet.</li>
          )}
        </ul>
      )}
    </section>
  );
}

TicketActivity.propTypes = {
  ticket: PropTypes.object.isRequired,
  user: PropTypes.object,
};
