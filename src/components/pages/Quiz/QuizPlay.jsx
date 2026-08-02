import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useAuth } from 'src/hooks/useAuth';
import useUnifiedAuth from 'src/hooks/useUnifiedAuth';
import {
  OPTION_LABELS,
  pointsFor,
  watchQuiz,
  watchPlayers,
  getQuestionsByIds,
  joinQuiz,
  savePlayerProgress,
  getLocalPlayerId,
  fetchIpLocation,
} from 'src/services/quiz/quiz';
import './QuizPlay.css';

/**
 * Player page (reached by scanning the quiz QR → /quiz/:quizId).
 * Everyone starts at the same moment when the admin flips the quiz to 'live',
 * but each player advances at their own answer speed — faster correct answers
 * earn a speed bonus.
 */
export default function QuizPlay() {
  const { quizId } = useParams();
  const { user, loading: authLoading } = useAuth();
  const { onGoogleSignIn } = useUnifiedAuth();

  const [quiz, setQuiz] = useState(undefined); // undefined=loading, null=not found
  const [players, setPlayers] = useState([]);
  const [questions, setQuestions] = useState(null);
  const [name, setName] = useState('');
  const [joined, setJoined] = useState(false);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');

  const playerId = user ? user.uid : getLocalPlayerId();
  const me = players.find(p => p.id === playerId);

  useEffect(() => {
    const un1 = watchQuiz(quizId, setQuiz);
    const un2 = watchPlayers(quizId, setPlayers);
    return () => {
      un1();
      un2();
    };
  }, [quizId]);

  // Load the questions once the quiz doc is available.
  useEffect(() => {
    if (quiz?.questionIds?.length) {
      getQuestionsByIds(quiz.questionIds).then(qs => {
        // Preserve admin-chosen order
        const byId = Object.fromEntries(qs.map(q => [q.id, q]));
        setQuestions(quiz.questionIds.map(id => byId[id]).filter(Boolean));
      });
    }
  }, [quiz?.questionIds?.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (user?.displayName && !name) setName(user.displayName);
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // If our player doc already exists (rejoin after reload), we're in.
  useEffect(() => {
    if (me) setJoined(true);
  }, [me?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleJoin = async () => {
    if (!name.trim()) return;
    setJoining(true);
    setError('');
    try {
      // Silent, best-effort IP location for anonymous players only.
      const location = user ? null : await fetchIpLocation();
      await joinQuiz(quizId, playerId, {
        name: name.trim(),
        uid: user?.uid || null,
        photoURL: user?.photoURL || null,
        location,
      });
      setJoined(true);
    } catch (e) {
      setError(e.message || 'Could not join the quiz');
    } finally {
      setJoining(false);
    }
  };

  if (quiz === undefined || authLoading) {
    return (
      <Centered>
        <div className="spinner-border" />
      </Centered>
    );
  }
  if (quiz === null) {
    return (
      <Centered>
        <h4>Quiz not found</h4>
        <p className="text-muted">Check the QR code or link and try again.</p>
      </Centered>
    );
  }

  if (quiz.disabled) {
    return (
      <Centered>
        <div className="display-4 mb-2">🚫</div>
        <h4>This quiz is currently unavailable</h4>
        <p className="text-muted">The host has disabled it. Please check back later.</p>
      </Centered>
    );
  }

  if (!joined || !me) {
    return (
      <Centered>
        <h1 className="qz-hero-title">{quiz.title}</h1>
        <div className="qz-divider" />
        <p className="text-muted mb-4">
          {quiz.questionIds?.length || 0} questions · {quiz.secondsPerQuestion}s each
        </p>
        <div className="card quiz-join-card">
          <div className="card-body">
            {quiz.status === 'ended' ? (
              <p className="text-muted">This quiz has already ended.</p>
            ) : (
              <>
                <input
                  className="form-control mb-2"
                  placeholder="Your name"
                  value={name}
                  maxLength={40}
                  onChange={e => setName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleJoin()}
                />
                <button
                  className="btn btn-primary w-100 mb-2"
                  disabled={joining || !name.trim()}
                  onClick={handleJoin}
                >
                  {joining ? 'Joining…' : 'Join Quiz'}
                </button>
                {!user && (
                  <button className="btn btn-outline-secondary w-100" onClick={onGoogleSignIn}>
                    <i className="bi bi-google me-2" />
                    Sign in with Google
                  </button>
                )}
                {error && <div className="alert alert-danger mt-2 mb-0 py-2">{error}</div>}
              </>
            )}
          </div>
        </div>
      </Centered>
    );
  }

  if (quiz.status === 'draft' || quiz.status === 'lobby') {
    return (
      <Centered>
        <h1 className="qz-hero-title">{quiz.title}</h1>
        <div className="qz-divider" />
        <div className="spinner-grow qz-spinner my-3" />
        <p className="text-muted">Waiting for the host to start…</p>
        <div className="quiz-lobby-players">
          {players.map(p => (
            <span key={p.id} className="badge bg-light text-dark m-1">
              {p.name}
            </span>
          ))}
        </div>
      </Centered>
    );
  }

  if (quiz.status === 'live' && !me.finished) {
    if (!questions) {
      return (
        <Centered>
          <div className="spinner-border" />
        </Centered>
      );
    }
    return (
      <LiveQuiz quiz={quiz} quizId={quizId} playerId={playerId} me={me} questions={questions} />
    );
  }

  // Finished (waiting for others) or quiz ended → leaderboard + own review.
  return <Results quiz={quiz} players={players} me={me} questions={questions || []} />;
}

/* ---------------- live question flow ---------------- */

function LiveQuiz({ quiz, quizId, playerId, me, questions }) {
  // Resume from however many answers are already saved (survives reloads).
  const [index, setIndex] = useState(me.answers?.length || 0);
  const [answers, setAnswers] = useState(me.answers || []);
  const [score, setScore] = useState(me.score || 0);
  const [picked, setPicked] = useState(null); // freeze UI briefly after answering
  const [timeLeft, setTimeLeft] = useState(quiz.secondsPerQuestion);
  const startRef = useRef(Date.now());
  const savingRef = useRef(false);

  const perQ = quiz.secondsPerQuestion;
  const totalMs = questions.length * perQ * 1000;
  const startedAtMs = quiz.startedAt?.toMillis ? quiz.startedAt.toMillis() : Date.now();

  const finish = async (finalAnswers, finalScore) => {
    if (savingRef.current) return;
    savingRef.current = true;
    const correctCount = finalAnswers.filter(a => a.correct).length;
    await savePlayerProgress(quizId, playerId, {
      answers: finalAnswers,
      score: finalScore,
      correctCount,
      finished: true,
      finishedAt: new Date(),
    }).catch(() => {});
    savingRef.current = false;
  };

  const submit = async choice => {
    if (picked !== null) return;
    const ms = Date.now() - startRef.current;
    const q = questions[index];
    const correct = choice === q.correctIndex;
    const points = pointsFor(correct, ms, perQ);
    const entry = { choice, correct, points, ms };
    const nextAnswers = [...answers, entry];
    const nextScore = score + points;
    setPicked(choice);
    setAnswers(nextAnswers);
    setScore(nextScore);

    // Persist progress so the admin leaderboard updates live.
    savePlayerProgress(quizId, playerId, {
      answers: nextAnswers,
      score: nextScore,
      correctCount: nextAnswers.filter(a => a.correct).length,
    }).catch(() => {});

    setTimeout(() => {
      if (index + 1 >= questions.length) {
        finish(nextAnswers, nextScore);
      } else {
        setIndex(index + 1);
        setPicked(null);
        startRef.current = Date.now();
        setTimeLeft(perQ);
      }
    }, 900);
  };

  // Per-question countdown + overall quiz deadline.
  useEffect(() => {
    const t = setInterval(() => {
      const left = perQ - (Date.now() - startRef.current) / 1000;
      setTimeLeft(Math.max(0, left));
      if (Date.now() - startedAtMs > totalMs) {
        // Overall time is up — finish with whatever has been answered.
        clearInterval(t);
        finish(answers, score);
        return;
      }
      if (left <= 0 && picked === null) {
        submit(-1); // timed out on this question → counts as wrong
      }
    }, 200);
    return () => clearInterval(t);
  }, [index, picked, answers, score]); // eslint-disable-line react-hooks/exhaustive-deps

  const q = questions[index];
  if (!q) return null;
  const pct = Math.round((timeLeft / perQ) * 100);

  return (
    <div className="container py-4 quiz-play" style={{ maxWidth: 640 }}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="text-muted">
          Question {index + 1}/{questions.length}
        </span>
        <span className="badge bg-primary fs-6">{score} pts</span>
      </div>
      <div className="progress mb-3" style={{ height: 8 }}>
        <div
          className={`progress-bar ${pct < 25 ? 'bg-danger' : pct < 50 ? 'bg-warning' : 'bg-success'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <h4 className="mb-3">{q.text}</h4>
      <div className="d-grid gap-2">
        {q.options.map((opt, i) => {
          let cls = 'btn btn-outline-primary quiz-option';
          if (picked !== null) {
            if (i === q.correctIndex) cls = 'btn btn-success quiz-option';
            else if (i === picked) cls = 'btn btn-danger quiz-option';
            else cls = 'btn btn-outline-secondary quiz-option';
          }
          return (
            <button key={i} className={cls} disabled={picked !== null} onClick={() => submit(i)}>
              <strong className="me-2">{OPTION_LABELS[i]}.</strong>
              {opt}
            </button>
          );
        })}
      </div>
      <div className="text-center text-muted mt-3 small">{Math.ceil(timeLeft)}s left</div>
    </div>
  );
}

/* ---------------- results / leaderboard ---------------- */

function Results({ quiz, players, me, questions }) {
  const ranked = useMemo(
    () => [...players].sort((a, b) => (b.score || 0) - (a.score || 0)),
    [players]
  );
  const myRank = ranked.findIndex(p => p.id === me.id) + 1;
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="container py-4" style={{ maxWidth: 640 }}>
      <div className="text-center mb-4">
        <h1 className="qz-hero-title">{quiz.title}</h1>
        <div className="qz-divider" />
        {quiz.status === 'live' ? (
          <p className="text-muted">You finished! Waiting for the others…</p>
        ) : (
          <p className="text-muted">Quiz over — final results</p>
        )}
        <div className="display-6">
          {me.score || 0} pts
          <span className="fs-5 text-muted">
            {' '}
            · rank {myRank}/{ranked.length}
          </span>
        </div>
      </div>

      <h6>Leaderboard</h6>
      <ul className="list-group mb-4">
        {ranked.map((p, i) => (
          <li
            key={p.id}
            className={`list-group-item d-flex justify-content-between ${
              p.id === me.id ? 'active' : ''
            }`}
          >
            <span>
              {medals[i] || `${i + 1}.`} {p.name}
              {!p.finished && quiz.status === 'live' && (
                <span className="badge bg-warning text-dark ms-2">playing…</span>
              )}
            </span>
            <strong>{p.score || 0}</strong>
          </li>
        ))}
      </ul>

      {questions.length > 0 && (
        <>
          <h6>Your answers</h6>
          {questions.map((q, i) => {
            const a = me.answers?.[i];
            return (
              <div className="card mb-2" key={q.id}>
                <div className="card-body py-2">
                  <div>{q.text}</div>
                  <div className="small">
                    {a ? (
                      a.correct ? (
                        <span className="text-success">
                          ✅ {OPTION_LABELS[a.choice]}. {q.options[a.choice]} (+{a.points})
                        </span>
                      ) : (
                        <>
                          <span className="text-danger">
                            ❌{' '}
                            {a.choice >= 0
                              ? `${OPTION_LABELS[a.choice]}. ${q.options[a.choice]}`
                              : 'No answer'}
                          </span>
                          <span className="text-success ms-2">
                            → {OPTION_LABELS[q.correctIndex]}. {q.options[q.correctIndex]}
                          </span>
                        </>
                      )
                    ) : (
                      <span className="text-muted">Not reached</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

function Centered({ children }) {
  return (
    <div className="container py-5 text-center quiz-centered">
      <div className="mx-auto" style={{ maxWidth: 480 }}>
        {children}
      </div>
    </div>
  );
}

LiveQuiz.propTypes = {
  quiz: PropTypes.object.isRequired,
  quizId: PropTypes.string.isRequired,
  playerId: PropTypes.string.isRequired,
  me: PropTypes.object.isRequired,
  questions: PropTypes.array.isRequired,
};

Results.propTypes = {
  quiz: PropTypes.object.isRequired,
  players: PropTypes.array.isRequired,
  me: PropTypes.object.isRequired,
  questions: PropTypes.array.isRequired,
};

Centered.propTypes = {
  children: PropTypes.node,
};
