import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { QRCodeCanvas } from 'qrcode.react';
import { useAuth } from 'src/hooks/useAuth';
import {
  OPTION_LABELS,
  DEFAULT_SECONDS_PER_QUESTION,
  listQuestions,
  ensureDefaultQuestions,
  saveQuestion,
  deleteQuestion,
  listSubmissions,
  approveSubmission,
  rejectSubmission,
  listQuizzes,
  saveQuiz,
  deleteQuiz,
  duplicateQuiz,
  setQuizDisabled,
  setQuizStatus,
  watchQuiz,
  watchPlayers,
} from 'src/services/quiz/quiz';
import './QuizAdmin.css';

const EMPTY_QUESTION = { text: '', options: ['', '', '', ''], correctIndex: 0, section: '' };
const EMPTY_QUIZ = {
  title: '',
  secondsPerQuestion: DEFAULT_SECONDS_PER_QUESTION,
  questionIds: [],
};

/** Common per-question timings selectable when building a quiz. */
const SECONDS_OPTIONS = [10, 15, 20, 30, 45, 60, 90, 120];

const STATUS_BADGE = {
  draft: 'secondary',
  lobby: 'warning',
  live: 'success',
  ended: 'dark',
};

export default function QuizAdmin() {
  const { user } = useAuth();
  const [tab, setTab] = useState('quizzes');
  const [questions, setQuestions] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const refresh = async () => {
    try {
      // Seed the starter question bank on first visit (no-op once questions exist;
      // falls back to a plain read if the visitor lacks write access).
      const [qs, subs, qz] = await Promise.all([
        ensureDefaultQuestions().catch(() => listQuestions()),
        listSubmissions(),
        listQuizzes(),
      ]);
      setQuestions(qs);
      setSubmissions(subs);
      setQuizzes(qz);
    } catch (e) {
      setError(e.message || 'Failed to load quiz data');
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const pendingCount = submissions.filter(s => s.status === 'pending').length;

  return (
    <div className="quiz-admin container-fluid px-3 px-md-5">
      <div className="py-3">
        <h1 className="qz-title h3">Quiz Manager</h1>
        <p className="qz-subtitle">
          Build time-bound quizzes, curate the question bank, and run live games players join by QR.
        </p>
      </div>
      <ul className="nav nav-pills gap-2 mb-3">
        {[
          ['quizzes', 'Quizzes', 'bi-collection-play'],
          ['bank', 'Question Bank', 'bi-stack'],
          ['submissions', 'Submissions', 'bi-inbox'],
        ].map(([key, label, icon]) => (
          <li className="nav-item" key={key}>
            <button
              className={`nav-link qz-tab ${tab === key ? 'active' : ''}`}
              onClick={() => setTab(key)}
            >
              <i className={`bi ${icon} me-1`} />
              {label}
              {key === 'submissions' && pendingCount > 0 && (
                <span className="qz-tab-badge">{pendingCount}</span>
              )}
            </button>
          </li>
        ))}
      </ul>

      {error && (
        <div className="alert alert-danger" onClick={() => setError('')}>
          {error}
        </div>
      )}

      {tab === 'quizzes' && (
        <QuizzesTab
          quizzes={quizzes}
          questions={questions}
          user={user}
          busy={busy}
          setBusy={setBusy}
          setError={setError}
          refresh={refresh}
        />
      )}
      {tab === 'bank' && (
        <BankTab
          questions={questions}
          busy={busy}
          setBusy={setBusy}
          setError={setError}
          refresh={refresh}
        />
      )}
      {tab === 'submissions' && (
        <SubmissionsTab
          submissions={submissions}
          busy={busy}
          setBusy={setBusy}
          setError={setError}
          refresh={refresh}
        />
      )}
    </div>
  );
}

/* ---------------- Quizzes tab ---------------- */

function QuizzesTab({ quizzes, questions, user, busy, setBusy, setError, refresh }) {
  const [form, setForm] = useState(null); // null = list view, object = create/edit form
  const [openQuizId, setOpenQuizId] = useState(null);

  const run = async fn => {
    setBusy(true);
    try {
      await fn();
      await refresh();
    } catch (e) {
      setError(e.message || 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  if (form) {
    return (
      <QuizForm
        form={form}
        setForm={setForm}
        questions={questions}
        busy={busy}
        onSave={quiz =>
          run(async () => {
            await saveQuiz({ ...quiz, createdBy: quiz.createdBy || user?.email || '' });
            setForm(null);
          })
        }
      />
    );
  }

  return (
    <>
      <button className="btn btn-primary mb-3" onClick={() => setForm({ ...EMPTY_QUIZ })}>
        <i className="bi bi-plus-lg me-1" /> New Quiz
      </button>
      {quizzes.length === 0 && <p className="text-muted">No quizzes yet — create one.</p>}
      <div className="row g-3">
        {quizzes.map(qz => (
          <div className="col-12" key={qz.id}>
            <div className="card quiz-card">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <div>
                    <strong>{qz.title}</strong>{' '}
                    <span className={`badge bg-${STATUS_BADGE[qz.status] || 'secondary'} ms-1`}>
                      {qz.status}
                    </span>
                    {qz.disabled && <span className="badge bg-danger ms-1">disabled</span>}
                    <div className="text-muted small">
                      {qz.questionIds?.length || 0} questions · {qz.secondsPerQuestion}s each ·{' '}
                      {Math.round(((qz.questionIds?.length || 0) * qz.secondsPerQuestion) / 60) ||
                        '<1'}{' '}
                      min total
                    </div>
                  </div>
                  <div className="d-flex gap-2 flex-wrap">
                    {qz.status === 'draft' && !qz.disabled && (
                      <>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          disabled={busy}
                          onClick={() => setForm({ ...qz })}
                        >
                          <i className="bi bi-pencil me-1" />
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-warning"
                          disabled={busy || !(qz.questionIds?.length > 0)}
                          onClick={() =>
                            run(() => setQuizStatus(qz.id, 'lobby')).then(() =>
                              setOpenQuizId(qz.id)
                            )
                          }
                        >
                          <i className="bi bi-broadcast me-1" />
                          Open Lobby
                        </button>
                      </>
                    )}
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => setOpenQuizId(openQuizId === qz.id ? null : qz.id)}
                    >
                      {openQuizId === qz.id ? 'Hide' : 'Details'}
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      title="Create a new draft quiz with the same questions and timing"
                      disabled={busy}
                      onClick={() => run(() => duplicateQuiz(qz))}
                    >
                      <i className="bi bi-copy me-1" />
                      Duplicate
                    </button>
                    <button
                      className={`btn btn-sm ${qz.disabled ? 'btn-success' : 'btn-outline-dark'}`}
                      title={
                        qz.disabled
                          ? 'Re-enable this quiz'
                          : 'Disable this quiz — players cannot join or play it'
                      }
                      disabled={busy}
                      onClick={() => run(() => setQuizDisabled(qz.id, !qz.disabled))}
                    >
                      <i
                        className={`bi ${qz.disabled ? 'bi-play-circle' : 'bi-slash-circle'} me-1`}
                      />
                      {qz.disabled ? 'Enable' : 'Disable'}
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      disabled={busy}
                      onClick={() => {
                        if (window.confirm(`Delete quiz "${qz.title}"?`))
                          run(() => deleteQuiz(qz.id));
                      }}
                    >
                      <i className="bi bi-trash me-1" />
                      Delete
                    </button>
                  </div>
                </div>
                {openQuizId === qz.id && <QuizLiveDetail quizId={qz.id} busy={busy} run={run} />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/** QR code, join link, live player list / leaderboard and start-end controls. */
function QuizLiveDetail({ quizId, busy, run }) {
  const [quiz, setQuiz] = useState(null);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const un1 = watchQuiz(quizId, setQuiz);
    const un2 = watchPlayers(quizId, setPlayers);
    return () => {
      un1();
      un2();
    };
  }, [quizId]);

  if (!quiz) return <div className="mt-3 text-muted">Loading…</div>;

  const joinUrl = `${window.location.origin}/quiz/${quizId}`;
  const finished = players.filter(p => p.finished).length;

  return (
    <div className="row g-3 mt-1 align-items-start">
      <div className="col-12 col-md-auto text-center">
        <QRCodeCanvas value={joinUrl} size={180} includeMargin />
        <div className="small mt-1">
          <a href={joinUrl} target="_blank" rel="noreferrer">
            {joinUrl}
          </a>
          <button
            className="btn btn-sm btn-link p-0 ms-1"
            title="Copy link"
            onClick={() => navigator.clipboard?.writeText(joinUrl)}
          >
            <i className="bi bi-clipboard" />
          </button>
        </div>
      </div>
      <div className="col">
        <div className="d-flex gap-2 mb-2 flex-wrap">
          {quiz.status === 'lobby' && (
            <button
              className="btn btn-success"
              disabled={busy}
              onClick={() => run(() => setQuizStatus(quizId, 'live'))}
            >
              <i className="bi bi-play-fill" /> Start Quiz ({players.length} joined)
            </button>
          )}
          {quiz.status === 'live' && (
            <button
              className="btn btn-danger"
              disabled={busy}
              onClick={() => run(() => setQuizStatus(quizId, 'ended'))}
            >
              <i className="bi bi-stop-fill" /> End Quiz ({finished}/{players.length} finished)
            </button>
          )}
          {quiz.status === 'ended' && (
            <span className="badge bg-dark align-self-center">Quiz ended</span>
          )}
        </div>
        {players.length === 0 ? (
          <p className="text-muted mb-0">No players yet — share the QR code.</p>
        ) : (
          <table className="table table-sm align-middle mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>Player</th>
                <th>Score</th>
                <th>Correct</th>
                <th>Location</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {players.map((p, i) => (
                <tr key={p.id}>
                  <td>{i + 1}</td>
                  <td>{p.name || 'Anonymous'}</td>
                  <td>{p.score || 0}</td>
                  <td>
                    {p.correctCount || 0}/{quiz.questionIds?.length || 0}
                  </td>
                  <td className="text-muted small">
                    {p.location
                      ? [p.location.city, p.location.country].filter(Boolean).join(', ')
                      : '—'}
                  </td>
                  <td>
                    {p.finished ? '✅ done' : quiz.status === 'live' ? '▶ playing' : 'waiting'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function QuizForm({ form, setForm, questions, busy, onSave }) {
  const [filter, setFilter] = useState('');
  const sections = useMemo(
    () => [...new Set(questions.map(q => q.section).filter(Boolean))],
    [questions]
  );
  const shown = questions.filter(
    q => !filter || q.section === filter || q.text.toLowerCase().includes(filter.toLowerCase())
  );

  const toggle = id =>
    setForm(f => ({
      ...f,
      questionIds: f.questionIds.includes(id)
        ? f.questionIds.filter(x => x !== id)
        : [...f.questionIds, id],
    }));

  const totalMin = Math.ceil((form.questionIds.length * (form.secondsPerQuestion || 0)) / 60);

  return (
    <div className="card">
      <div className="card-body">
        <h5>{form.id ? 'Edit Quiz' : 'New Quiz'}</h5>
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label">Title</label>
            <input
              className="form-control"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Traffic Rules Friday Quiz"
            />
          </div>
          <div className="col-6 col-md-3">
            <label className="form-label">Time per question</label>
            <select
              className="form-select"
              value={form.secondsPerQuestion}
              onChange={e => setForm({ ...form, secondsPerQuestion: Number(e.target.value) })}
            >
              {SECONDS_OPTIONS.map(s => (
                <option key={s} value={s}>
                  {s} seconds
                </option>
              ))}
            </select>
            <div className="form-text">Applies to every question in this quiz.</div>
          </div>
          <div className="col-6 col-md-3 d-flex align-items-end">
            <span className="text-muted small">
              {form.questionIds.length} selected · ~{totalMin} min total
            </span>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2 mt-3 mb-2 flex-wrap">
          <strong>Pick questions</strong>
          <select
            className="form-select form-select-sm w-auto"
            value={sections.includes(filter) ? filter : ''}
            onChange={e => setFilter(e.target.value)}
          >
            <option value="">All sections</option>
            {sections.map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <input
            className="form-control form-control-sm w-auto"
            placeholder="Search…"
            value={sections.includes(filter) ? '' : filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>

        {questions.length === 0 && (
          <p className="text-muted">
            Question bank is empty — add questions in the Question Bank tab first.
          </p>
        )}
        <div className="quiz-question-picker">
          {shown.map(q => (
            <label key={q.id} className="quiz-pick d-flex gap-2 align-items-start">
              <input
                type="checkbox"
                className="form-check-input mt-1"
                checked={form.questionIds.includes(q.id)}
                onChange={() => toggle(q.id)}
              />
              <span>
                {q.text}
                {q.section && <span className="badge bg-light text-dark ms-2">{q.section}</span>}
                {q.source === 'community' && (
                  <span className="badge bg-info text-dark ms-1">community</span>
                )}
              </span>
            </label>
          ))}
        </div>

        <div className="d-flex gap-2 mt-3">
          <button
            className="btn btn-primary"
            disabled={busy || !form.title.trim() || form.questionIds.length === 0}
            onClick={() => onSave(form)}
          >
            Save Quiz
          </button>
          <button className="btn btn-outline-secondary" onClick={() => setForm(null)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Question bank tab ---------------- */

function BankTab({ questions, busy, setBusy, setError, refresh }) {
  const [form, setForm] = useState({ ...EMPTY_QUESTION });

  const save = async () => {
    setBusy(true);
    try {
      await saveQuestion({ ...form, source: form.source || 'admin' });
      setForm({ ...EMPTY_QUESTION });
      await refresh();
    } catch (e) {
      setError(e.message || 'Failed to save question');
    } finally {
      setBusy(false);
    }
  };

  const valid = form.text.trim() && form.options.every(o => o.trim());

  return (
    <div className="row g-3">
      <div className="col-12 col-lg-5">
        <div className="card">
          <div className="card-body">
            <h6>{form.id ? 'Edit question' : 'Add a question'}</h6>
            <QuestionFields form={form} setForm={setForm} />
            <div className="d-flex gap-2 mt-3">
              <button className="btn btn-primary" disabled={busy || !valid} onClick={save}>
                {form.id ? 'Update' : 'Add to bank'}
              </button>
              {form.id && (
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setForm({ ...EMPTY_QUESTION })}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 col-lg-7">
        {questions.length === 0 && <p className="text-muted">No questions yet.</p>}
        {Object.entries(
          questions.reduce((acc, q) => {
            const key = q.section || 'Uncategorized';
            (acc[key] = acc[key] || []).push(q);
            return acc;
          }, {})
        ).map(([section, qs]) => (
          <div key={section} className="mb-3">
            <h6 className="quiz-section-heading">
              {section} <span className="text-muted fw-normal">({qs.length})</span>
            </h6>
            {qs.map(q => (
              <div className="card mb-2" key={q.id}>
                <div className="card-body py-2">
                  <div className="d-flex justify-content-between gap-2">
                    <div>
                      <div>{q.text}</div>
                      <div className="small text-muted">
                        {q.options?.map((o, i) => (
                          <span
                            key={i}
                            className={i === q.correctIndex ? 'text-success fw-bold' : ''}
                          >
                            {OPTION_LABELS[i]}. {o}{' '}
                          </span>
                        ))}
                      </div>
                      {q.source === 'community' && (
                        <span className="badge bg-info text-dark">
                          community{q.submitterName ? ` · ${q.submitterName}` : ''}
                        </span>
                      )}
                    </div>
                    <div className="d-flex gap-1 align-items-start">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() =>
                          setForm({
                            id: q.id,
                            text: q.text,
                            options: [...q.options],
                            correctIndex: q.correctIndex,
                            section: q.section || '',
                            source: q.source,
                          })
                        }
                      >
                        <i className="bi bi-pencil" />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        disabled={busy}
                        onClick={async () => {
                          if (!window.confirm('Delete this question?')) return;
                          setBusy(true);
                          try {
                            await deleteQuestion(q.id);
                            await refresh();
                          } catch (e) {
                            setError(e.message);
                          } finally {
                            setBusy(false);
                          }
                        }}
                      >
                        <i className="bi bi-trash" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Shared MCQ fields: text, 4 options with correct-answer radio, section. */
export function QuestionFields({ form, setForm }) {
  return (
    <>
      <label className="form-label">Question</label>
      <textarea
        className="form-control mb-2"
        rows="2"
        value={form.text}
        onChange={e => setForm({ ...form, text: e.target.value })}
        placeholder="e.g. What is the penalty for jumping a red light?"
      />
      {form.options.map((opt, i) => (
        <div className="input-group input-group-sm mb-1" key={i}>
          <span className="input-group-text">
            <input
              type="radio"
              className="form-check-input mt-0"
              name="correct"
              title="Correct answer"
              checked={form.correctIndex === i}
              onChange={() => setForm({ ...form, correctIndex: i })}
            />
          </span>
          <span className="input-group-text">{OPTION_LABELS[i]}</span>
          <input
            className="form-control"
            value={opt}
            placeholder={`Option ${OPTION_LABELS[i]}`}
            onChange={e => {
              const options = [...form.options];
              options[i] = e.target.value;
              setForm({ ...form, options });
            }}
          />
        </div>
      ))}
      <div className="form-text mb-2">Select the radio next to the correct answer.</div>
      <label className="form-label">Section</label>
      <input
        className="form-control"
        value={form.section}
        onChange={e => setForm({ ...form, section: e.target.value })}
        placeholder="e.g. Traffic Rules, Personal Finance, General Knowledge"
      />
    </>
  );
}

/* ---------------- Submissions tab ---------------- */

function SubmissionsTab({ submissions, busy, setBusy, setError, refresh }) {
  const act = async fn => {
    setBusy(true);
    try {
      await fn();
      await refresh();
    } catch (e) {
      setError(e.message || 'Action failed');
    } finally {
      setBusy(false);
    }
  };

  const pending = submissions.filter(s => s.status === 'pending');
  const reviewed = submissions.filter(s => s.status !== 'pending');

  const renderCard = (s, actions) => (
    <div className="card mb-2" key={s.id}>
      <div className="card-body py-2 d-flex justify-content-between gap-2">
        <div>
          <div>{s.text}</div>
          <div className="small text-muted">
            {s.options?.map((o, i) => (
              <span key={i} className={i === s.correctIndex ? 'text-success fw-bold' : ''}>
                {OPTION_LABELS[i]}. {o}{' '}
              </span>
            ))}
          </div>
          <div className="small text-muted">
            By {s.submitterName || 'Anonymous'}
            {s.location && ` · ${[s.location.city, s.location.country].filter(Boolean).join(', ')}`}
            {s.section && <span className="badge bg-light text-dark ms-1">{s.section}</span>}
            {s.status !== 'pending' && (
              <span className={`badge ms-1 bg-${s.status === 'approved' ? 'success' : 'danger'}`}>
                {s.status}
              </span>
            )}
          </div>
        </div>
        {actions}
      </div>
    </div>
  );

  return (
    <>
      <h6>Pending review ({pending.length})</h6>
      {pending.length === 0 && <p className="text-muted">Nothing waiting for review.</p>}
      {pending.map(s =>
        renderCard(
          s,
          <div className="d-flex gap-1 align-items-start">
            <button
              className="btn btn-sm btn-success"
              disabled={busy}
              onClick={() => act(() => approveSubmission(s))}
            >
              Approve
            </button>
            <button
              className="btn btn-sm btn-outline-danger"
              disabled={busy}
              onClick={() => act(() => rejectSubmission(s.id))}
            >
              Reject
            </button>
          </div>
        )
      )}
      {reviewed.length > 0 && (
        <>
          <h6 className="mt-4">Reviewed</h6>
          {reviewed.map(s => renderCard(s, null))}
        </>
      )}
    </>
  );
}

const tabShape = {
  busy: PropTypes.bool.isRequired,
  setBusy: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
};

QuizzesTab.propTypes = {
  ...tabShape,
  quizzes: PropTypes.array.isRequired,
  questions: PropTypes.array.isRequired,
  user: PropTypes.object,
};

QuizLiveDetail.propTypes = {
  quizId: PropTypes.string.isRequired,
  busy: PropTypes.bool.isRequired,
  run: PropTypes.func.isRequired,
};

QuizForm.propTypes = {
  form: PropTypes.object.isRequired,
  setForm: PropTypes.func.isRequired,
  questions: PropTypes.array.isRequired,
  busy: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
};

BankTab.propTypes = {
  ...tabShape,
  questions: PropTypes.array.isRequired,
};

QuestionFields.propTypes = {
  form: PropTypes.object.isRequired,
  setForm: PropTypes.func.isRequired,
};

SubmissionsTab.propTypes = {
  ...tabShape,
  submissions: PropTypes.array.isRequired,
};
