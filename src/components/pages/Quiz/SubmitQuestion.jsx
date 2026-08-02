import React, { useEffect, useState } from 'react';
import { useAuth } from 'src/hooks/useAuth';
import { QuestionFields } from 'src/components/SuperAdmin/Quiz/QuizAdmin';
import { submitQuestion, fetchIpLocation } from 'src/services/quiz/quiz';
import './QuizPlay.css';

const EMPTY = { text: '', options: ['', '', '', ''], correctIndex: 0, section: '' };

/**
 * Public page — anyone can contribute a question to the community pool.
 * No login required; anonymous submissions get a silent IP-based location.
 * Questions land in an admin approval queue before entering the bank.
 */
export default function SubmitQuestion() {
  const { user } = useAuth();
  const [form, setForm] = useState({ ...EMPTY });
  const [submitterName, setSubmitterName] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.displayName && !submitterName) setSubmitterName(user.displayName);
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const valid = form.text.trim() && form.options.every(o => o.trim());

  const handleSubmit = async () => {
    setBusy(true);
    setError('');
    try {
      const location = user ? null : await fetchIpLocation();
      await submitQuestion({
        ...form,
        text: form.text.trim(),
        options: form.options.map(o => o.trim()),
        submitterName: submitterName.trim() || 'Anonymous',
        submitterUid: user?.uid || null,
        location,
      });
      setDone(true);
    } catch (e) {
      setError(e.message || 'Could not submit — please try again.');
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="container py-5 text-center" style={{ maxWidth: 480 }}>
        <div className="display-4 mb-2">🙌</div>
        <h4>Thanks for contributing!</h4>
        <p className="text-muted">
          Your question was sent for review. Once approved, it can appear in upcoming quizzes.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => {
            setForm({ ...EMPTY });
            setDone(false);
          }}
        >
          Submit another question
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: 560 }}>
      <div className="text-center mb-4">
        <h1 className="qz-hero-title">Contribute a Quiz Question</h1>
        <div className="qz-divider" />
        <p className="text-muted">
          Share something worth knowing — traffic rules, finance, general knowledge, anything. Your
          question goes into a review queue and, once approved, can show up in group quizzes.
        </p>
      </div>
      <div className="card qz-card">
        <div className="card-body">
          <QuestionFields form={form} setForm={setForm} />
          <label className="form-label mt-2">Your name (optional)</label>
          <input
            className="form-control mb-3"
            value={submitterName}
            maxLength={40}
            placeholder="Anonymous"
            onChange={e => setSubmitterName(e.target.value)}
          />
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <button className="btn btn-primary" disabled={busy || !valid} onClick={handleSubmit}>
            {busy ? 'Submitting…' : 'Submit for review'}
          </button>
        </div>
      </div>
    </div>
  );
}
