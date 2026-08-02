/**
 * Quiz service — Firebase-native (like the stocks/roles services). Collections:
 *
 *  quizQuestions       — approved MCQ bank (admin-created or approved community).
 *      { text, options: [4 strings], correctIndex, category, source, submitterName, createdAt }
 *  questionSubmissions — community-submitted questions awaiting admin review.
 *      { text, options, correctIndex, category, submitterName, submitterUid,
 *        location, status: 'pending'|'approved'|'rejected', createdAt }
 *  quizzes             — admin-built, time-bound quizzes.
 *      { title, questionIds: [], secondsPerQuestion, status: 'draft'|'lobby'|'live'|'ended',
 *        startedAt, createdBy, createdAt }
 *  quizzes/{id}/players — one doc per player (doc id = uid or a local anonymous id).
 *      { name, uid, photoURL, location, joinedAt, score, correctCount,
 *        answers: [{ choice, correct, points, ms }], finished, finishedAt }
 *
 * Everyone starts together (admin flips status to 'live'), but each player
 * advances at their own answer speed; faster correct answers earn bonus points.
 */
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../connector/firebase';

const QUESTIONS = 'quizQuestions';
const SUBMISSIONS = 'questionSubmissions';
const QUIZZES = 'quizzes';

const withId = s => ({ id: s.id, ...s.data() });

export const OPTION_LABELS = ['A', 'B', 'C', 'D'];
export const DEFAULT_SECONDS_PER_QUESTION = 20;

/** Points for a correct answer: 100 base + up to 100 speed bonus. */
export function pointsFor(correct, msTaken, secondsPerQuestion) {
  if (!correct) return 0;
  const total = secondsPerQuestion * 1000;
  const left = Math.max(0, total - msTaken);
  return 100 + Math.round((100 * left) / total);
}

/** Starter questions (grouped in sections) seeded on first admin visit so the
 *  feature is usable immediately — same idea as stocks' ensureDefaultParameters. */
export const DEFAULT_QUESTIONS = [
  // --- Traffic Rules ---
  {
    id: 'seed_traffic_1',
    section: 'Traffic Rules',
    text: 'What should you do when an ambulance approaches from behind with its siren on?',
    options: [
      'Speed up so it can follow you',
      'Pull to the side and give way',
      'Keep driving at the same speed',
      'Stop immediately in your lane',
    ],
    correctIndex: 1,
  },
  {
    id: 'seed_traffic_2',
    section: 'Traffic Rules',
    text: 'Under the Motor Vehicles (Amendment) Act 2019, riding a two-wheeler without a helmet can attract a fine of…',
    options: ['₹100', '₹500', '₹1,000', '₹5,000'],
    correctIndex: 2,
  },
  {
    id: 'seed_traffic_3',
    section: 'Traffic Rules',
    text: 'A solid yellow line in the middle of the road means…',
    options: [
      'Overtaking is allowed freely',
      'Do not cross the line to overtake',
      'Parking zone ahead',
      'One-way street',
    ],
    correctIndex: 1,
  },
  // --- Personal Finance ---
  {
    id: 'seed_finance_1',
    section: 'Personal Finance',
    text: 'What does SIP stand for in investing?',
    options: [
      'Systematic Investment Plan',
      'Secure Income Policy',
      'Standard Interest Payment',
      'Savings Insurance Premium',
    ],
    correctIndex: 0,
  },
  {
    id: 'seed_finance_2',
    section: 'Personal Finance',
    text: 'The "Rule of 72" is a quick way to estimate…',
    options: [
      'Your monthly budget',
      'How long money takes to double at a given interest rate',
      'Your income-tax slab',
      'The EMI on a loan',
    ],
    correctIndex: 1,
  },
  {
    id: 'seed_finance_3',
    section: 'Personal Finance',
    text: 'A credit score in India is most commonly checked from which bureau?',
    options: ['SEBI', 'CIBIL', 'IRDAI', 'NPCI'],
    correctIndex: 1,
  },
  // --- General Knowledge ---
  {
    id: 'seed_gk_1',
    section: 'General Knowledge',
    text: 'Which is the largest planet in our solar system?',
    options: ['Earth', 'Saturn', 'Jupiter', 'Neptune'],
    correctIndex: 2,
  },
  {
    id: 'seed_gk_2',
    section: 'General Knowledge',
    text: 'How many states does India have?',
    options: ['27', '28', '29', '30'],
    correctIndex: 1,
  },
  {
    id: 'seed_gk_3',
    section: 'General Knowledge',
    text: 'What is the currency of Japan?',
    options: ['Won', 'Yuan', 'Yen', 'Ringgit'],
    correctIndex: 2,
  },
  // --- Health & Safety ---
  {
    id: 'seed_health_1',
    section: 'Health & Safety',
    text: 'What is the single all-in-one emergency helpline number in India?',
    options: ['100', '108', '112', '911'],
    correctIndex: 2,
  },
  {
    id: 'seed_health_2',
    section: 'Health & Safety',
    text: 'The correct first response to a minor burn is to…',
    options: [
      'Apply toothpaste',
      'Cool it under running water',
      'Cover it with ice directly',
      'Burst any blisters',
    ],
    correctIndex: 1,
  },
  {
    id: 'seed_health_3',
    section: 'Health & Safety',
    text: 'Roughly how much water should an average adult drink per day?',
    options: ['0.5 litre', '1 litre', '2–3 litres', '6–7 litres'],
    correctIndex: 2,
  },
  // --- Technology ---
  {
    id: 'seed_tech_1',
    section: 'Technology',
    text: 'What does "HTTP" stand for?',
    options: [
      'HyperText Transfer Protocol',
      'High Tech Transfer Process',
      'HyperText Type Program',
      'Home Tool Transfer Protocol',
    ],
    correctIndex: 0,
  },
  {
    id: 'seed_tech_2',
    section: 'Technology',
    text: 'Who co-founded Microsoft?',
    options: ['Steve Jobs', 'Bill Gates', 'Elon Musk', 'Larry Page'],
    correctIndex: 1,
  },
  {
    id: 'seed_tech_3',
    section: 'Technology',
    text: 'In AI, what does "LLM" stand for?',
    options: [
      'Large Language Model',
      'Linear Learning Machine',
      'Local Logic Module',
      'Layered Learning Method',
    ],
    correctIndex: 0,
  },
];

/** Seed the bank once (idempotent — deterministic doc ids, skipped if any questions exist). */
export async function ensureDefaultQuestions() {
  const existing = await listQuestions();
  if (existing.length > 0) return existing;
  const batch = writeBatch(db);
  DEFAULT_QUESTIONS.forEach(({ id, ...q }) => {
    batch.set(doc(db, QUESTIONS, id), { ...q, source: 'seed', createdAt: serverTimestamp() });
  });
  await batch.commit();
  return listQuestions();
}

// ---- Question bank (admin) ----
export async function listQuestions() {
  const snap = await getDocs(collection(db, QUESTIONS));
  return snap.docs
    .map(withId)
    .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
}

export async function saveQuestion(question) {
  if (question.id) {
    const { id, ...data } = question;
    await setDoc(
      doc(db, QUESTIONS, id),
      { ...data, updatedAt: serverTimestamp() },
      { merge: true }
    );
    return question;
  }
  const ref = doc(collection(db, QUESTIONS));
  await setDoc(ref, { ...question, createdAt: serverTimestamp() });
  return { id: ref.id, ...question };
}

export async function deleteQuestion(id) {
  await deleteDoc(doc(db, QUESTIONS, id));
}

/** Fetch selected questions preserving the quiz's chosen order. */
export async function getQuestionsByIds(ids) {
  const snaps = await Promise.all(ids.map(id => getDoc(doc(db, QUESTIONS, id))));
  return snaps.filter(s => s.exists()).map(withId);
}

// ---- Community submissions (public create, admin review) ----
export async function submitQuestion(submission) {
  const ref = doc(collection(db, SUBMISSIONS));
  await setDoc(ref, { ...submission, status: 'pending', createdAt: serverTimestamp() });
  return { id: ref.id, ...submission };
}

export async function listSubmissions() {
  const snap = await getDocs(collection(db, SUBMISSIONS));
  return snap.docs
    .map(withId)
    .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
}

/** Approve: copy into the question bank, then mark the submission. */
export async function approveSubmission(submission) {
  const { id, status, location, submitterUid, createdAt, ...q } = submission;
  const saved = await saveQuestion({ ...q, source: 'community' });
  await updateDoc(doc(db, SUBMISSIONS, id), { status: 'approved' });
  return saved;
}

export async function rejectSubmission(id) {
  await updateDoc(doc(db, SUBMISSIONS, id), { status: 'rejected' });
}

// ---- Quizzes (admin) ----
export async function listQuizzes() {
  const snap = await getDocs(collection(db, QUIZZES));
  return snap.docs
    .map(withId)
    .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
}

export async function saveQuiz(quiz) {
  if (quiz.id) {
    const { id, ...data } = quiz;
    await setDoc(doc(db, QUIZZES, id), { ...data, updatedAt: serverTimestamp() }, { merge: true });
    return quiz;
  }
  const ref = doc(collection(db, QUIZZES));
  await setDoc(ref, { ...quiz, status: 'draft', createdAt: serverTimestamp() });
  return { id: ref.id, ...quiz };
}

export async function deleteQuiz(id) {
  await deleteDoc(doc(db, QUIZZES, id));
}

/** Copy an existing quiz (same questions & timing) into a fresh draft. */
export async function duplicateQuiz(quiz) {
  return saveQuiz({
    title: `${quiz.title} (copy)`,
    questionIds: [...(quiz.questionIds || [])],
    secondsPerQuestion: quiz.secondsPerQuestion || DEFAULT_SECONDS_PER_QUESTION,
    createdBy: quiz.createdBy || '',
  });
}

/** Disabled quizzes cannot be joined or played until re-enabled. */
export async function setQuizDisabled(id, disabled) {
  await updateDoc(doc(db, QUIZZES, id), { disabled });
}

export async function setQuizStatus(id, status) {
  const patch = { status };
  if (status === 'live') patch.startedAt = serverTimestamp();
  await updateDoc(doc(db, QUIZZES, id), patch);
}

/** Live listener on one quiz doc. Returns the unsubscribe fn. */
export function watchQuiz(id, onChange) {
  return onSnapshot(
    doc(db, QUIZZES, id),
    snap => onChange(snap.exists() ? withId(snap) : null),
    () => onChange(null) // permission denied / offline → treat as not found
  );
}

// ---- Players (public: anonymous or signed-in) ----
export async function joinQuiz(quizId, playerId, player) {
  await setDoc(
    doc(db, QUIZZES, quizId, 'players', playerId),
    {
      ...player,
      score: 0,
      correctCount: 0,
      answers: [],
      finished: false,
      joinedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function savePlayerProgress(quizId, playerId, progress) {
  await updateDoc(doc(db, QUIZZES, quizId, 'players', playerId), progress);
}

/** Live listener on the players of a quiz, sorted by score. */
export function watchPlayers(quizId, onChange) {
  return onSnapshot(
    collection(db, QUIZZES, quizId, 'players'),
    snap => {
      const players = snap.docs.map(withId).sort((a, b) => (b.score || 0) - (a.score || 0));
      onChange(players);
    },
    () => onChange([])
  );
}

/** Stable anonymous player id kept in localStorage so a reload rejoins as the same player. */
export function getLocalPlayerId() {
  const KEY = 'anddhen_quiz_player_id';
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = `anon_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
    localStorage.setItem(KEY, id);
  }
  return id;
}

/** Best-effort silent IP-based location for anonymous users. Never throws. */
export async function fetchIpLocation() {
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (!res.ok) return null;
    const j = await res.json();
    return {
      city: j.city || '',
      region: j.region || '',
      country: j.country_name || '',
      ip: j.ip || '',
    };
  } catch {
    return null;
  }
}
