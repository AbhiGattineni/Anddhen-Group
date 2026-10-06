import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Button, Card, Col, Form, Row, Spinner, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'src/hooks/useAuth';
import { readPdfLines } from 'src/services/finance/pdfText';
import { parseStatement } from 'src/services/finance/parseStatement';
import { analyze } from 'src/services/finance/analyze';
import {
  saveAnalysis,
  listAnalyses,
  loadAnalysis,
  deleteAnalysis,
  fileUrl,
  getCategoryOverrides,
  setCategoryOverride,
} from 'src/services/finance/financeStore';
import { stashFiles, takeStashedFiles, clearStash } from 'src/services/finance/pendingStash';
import FinanceAnalytics from './FinanceAnalytics';
import './FinanceDataUpload.css';

const MAX_FILES = 24;
const MAX_MB = 25;

const fmtSize = b =>
  b > 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1e3))} KB`;
const fmtDay = d =>
  d
    ? new Date(`${d}T00:00:00`).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

let nextId = 1;

/** Read + parse one file; never throws (errors land on the entry). */
async function parseFile(file) {
  try {
    const { lines } = await readPdfLines(file);
    const statement = parseStatement(lines, file.name);
    return { status: statement.transactions.length ? 'ok' : 'empty', statement };
  } catch (err) {
    return { status: 'error', error: err?.message || 'Could not read this file.' };
  }
}

const statementKey = s => `${s.label}|${s.periodStart}|${s.periodEnd}|${s.transactions.length}`;

function defaultName(statements) {
  const dates = statements
    .flatMap(s => [s.periodStart, s.periodEnd])
    .filter(Boolean)
    .sort();
  if (!dates.length) return 'Statements';
  const m = d =>
    new Date(`${d}T00:00:00`).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const a = m(dates[0]);
  const b = m(dates[dates.length - 1]);
  return a === b ? `Statements ${a}` : `Statements ${a} – ${b}`;
}

const FinanceDataUpload = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [entries, setEntries] = useState([]); // { id, file, status, statement?, error? }
  const entriesRef = useRef(entries);
  entriesRef.current = entries;
  const [dragging, setDragging] = useState(false);
  const [notice, setNotice] = useState(null); // { variant, text }
  const [saveName, setSaveName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState([]);
  const [savedLoading, setSavedLoading] = useState(false);
  const [openSaved, setOpenSaved] = useState(null); // loaded saved analysis
  // merchantKey -> category the user picked. Saved to their account when
  // signed in; kept only for this tab when signed out.
  const [overrides, setOverrides] = useState({});

  const addFiles = useCallback(async list => {
    const incoming = Array.from(list || []);
    const pdfs = incoming.filter(f => f.type === 'application/pdf' || /\.pdf$/i.test(f.name || ''));
    const msgs = [];
    if (pdfs.length < incoming.length)
      msgs.push('Only PDF statements are supported; other files were skipped.');
    const tooBig = pdfs.filter(f => f.size > MAX_MB * 1e6);
    if (tooBig.length) msgs.push(`Files over ${MAX_MB} MB were skipped.`);

    const prev = entriesRef.current;
    const have = new Set(prev.map(e => `${e.file.name}|${e.file.size}`));
    const fresh = pdfs
      .filter(f => f.size <= MAX_MB * 1e6 && !have.has(`${f.name}|${f.size}`))
      .slice(0, Math.max(0, MAX_FILES - prev.length))
      .map(file => ({ id: nextId++, file, status: 'reading' }));
    if (pdfs.length > fresh.length + tooBig.length) {
      msgs.push(`Files already added, or past the ${MAX_FILES}-statement limit, were skipped.`);
    }
    entriesRef.current = [...prev, ...fresh];
    setEntries(p => [...p, ...fresh]);
    if (msgs.length) setNotice({ variant: 'warning', text: msgs.join(' ') });
    setOpenSaved(null);

    // Parse sequentially: pdf.js is CPU-heavy and statements are small.
    for (const entry of fresh) {
      const result = await parseFile(entry.file);
      setEntries(prev => prev.map(e => (e.id === entry.id ? { ...e, ...result } : e)));
    }
  }, []);

  // Back from the login page: restore the statements stashed before sign-in.
  useEffect(() => {
    if (authLoading || !user) return;
    let cancelled = false;
    takeStashedFiles().then(files => {
      if (cancelled || !files?.length) return;
      addFiles(files);
      setNotice({
        variant: 'success',
        text: `Welcome back — your ${files.length} statement${files.length > 1 ? 's were' : ' was'} restored. Click “Save analysis” to keep it.`,
      });
    });
    return () => {
      cancelled = true;
    };
  }, [authLoading, user, addFiles]);

  const refreshSaved = useCallback(async () => {
    if (!user) return;
    setSavedLoading(true);
    try {
      setSaved(await listAnalyses(user.uid));
    } catch (err) {
      console.error('listAnalyses failed:', err);
    } finally {
      setSavedLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) refreshSaved();
    else setSaved([]);
  }, [user, refreshSaved]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    getCategoryOverrides(user.uid)
      .then(saved => {
        // Choices made before the load finished win over the stored ones.
        if (!cancelled) setOverrides(prev => ({ ...saved, ...prev }));
      })
      .catch(err => console.error('getCategoryOverrides failed:', err));
    return () => {
      cancelled = true;
    };
  }, [user]);

  const changeCategory = useCallback(
    (merchantKey, category) => {
      if (!merchantKey) return;
      setOverrides(prev => {
        const next = { ...prev };
        if (category) next[merchantKey] = category;
        else delete next[merchantKey];
        return next;
      });
      if (user) {
        setCategoryOverride(user.uid, merchantKey, category).catch(err => {
          console.error('setCategoryOverride failed:', err);
          setNotice({
            variant: 'warning',
            text: 'Your category change applies here but could not be saved to your account.',
          });
        });
      }
    },
    [user]
  );

  // Statements that parsed, minus exact duplicates (same file uploaded twice).
  const { statements, duplicateIds } = useMemo(() => {
    const seen = new Set();
    const dup = new Set();
    const list = [];
    entries.forEach(e => {
      if (e.status !== 'ok') return;
      const key = statementKey(e.statement);
      if (seen.has(key)) dup.add(e.id);
      else {
        seen.add(key);
        list.push(e.statement);
      }
    });
    return { statements: list, duplicateIds: dup };
  }, [entries]);

  const shownStatements = openSaved ? openSaved.statements : statements;
  const analysis = useMemo(
    () => (shownStatements.length ? analyze(shownStatements, overrides) : null),
    [shownStatements, overrides]
  );
  const reading = entries.some(e => e.status === 'reading');

  useEffect(() => {
    setSaveName(statements.length ? defaultName(statements) : '');
  }, [statements]);

  const removeEntry = id => setEntries(prev => prev.filter(e => e.id !== id));

  const clearAll = () => {
    setEntries([]);
    setOpenSaved(null);
    setNotice(null);
    clearStash();
  };

  const signInToSave = async () => {
    try {
      await stashFiles(entries.filter(e => e.status === 'ok').map(e => e.file));
    } catch (err) {
      console.error('Could not stash statements before sign-in:', err);
    }
    localStorage.setItem('preLoginPath', '/ati/finance-data');
    navigate('/login');
  };

  const save = async () => {
    if (!user || !statements.length) return;
    setSaving(true);
    setNotice(null);
    try {
      const okEntries = entries.filter(e => e.status === 'ok' && !duplicateIds.has(e.id));
      await saveAnalysis({
        uid: user.uid,
        name: saveName.trim() || defaultName(statements),
        files: okEntries.map(e => e.file),
        statements: okEntries.map(e => e.statement),
        totals: analysis.totals,
      });
      setNotice({ variant: 'success', text: 'Saved to your account.' });
      clearStash();
      refreshSaved();
    } catch (err) {
      console.error('saveAnalysis failed:', err);
      setNotice({
        variant: 'danger',
        text:
          err?.code === 'permission-denied' || err?.code === 'storage/unauthorized'
            ? 'You don’t have permission to save here. Try signing out and back in.'
            : 'Saving failed. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  const open = async item => {
    setNotice(null);
    try {
      setOpenSaved(await loadAnalysis(item.id, user.uid));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setNotice({ variant: 'danger', text: err?.message || 'Could not open that analysis.' });
    }
  };

  const remove = async item => {
    if (!window.confirm(`Delete “${item.name}” and its statement files? This can’t be undone.`))
      return;
    try {
      await deleteAnalysis(item.id, user.uid);
      if (openSaved?.id === item.id) setOpenSaved(null);
      refreshSaved();
    } catch (err) {
      setNotice({ variant: 'danger', text: 'Could not delete that analysis.' });
    }
  };

  const download = async f => {
    try {
      window.open(await fileUrl(f.storagePath), '_blank', 'noopener');
    } catch (err) {
      setNotice({ variant: 'danger', text: 'Could not open that file.' });
    }
  };

  const onDrop = e => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  return (
    <div className="fin-wrap">
      <div className="mb-3">
        <h2 className="fin-title">Statement Analyzer</h2>
        <p className="text-muted mb-0">
          Upload Chase, American Express or Discover statements — credit card or checking — and get
          a combined assessment. Files are read right here in your browser.
        </p>
      </div>

      {!authLoading && !user && (
        <Alert
          variant="info"
          className="d-flex flex-wrap align-items-center gap-2 justify-content-between"
        >
          <span>
            <i className="bi bi-shield-lock me-1" />
            You&apos;re not signed in, so this analysis is <strong>temporary</strong>: it stays in
            this tab only and is gone when you leave. Sign in to save it.
          </span>
          {entries.some(e => e.status === 'ok') ? (
            <Button size="sm" variant="primary" onClick={signInToSave}>
              Sign in to save
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline-primary"
              onClick={() => {
                localStorage.setItem('preLoginPath', '/ati/finance-data');
                navigate('/login');
              }}
            >
              Sign in
            </Button>
          )}
        </Alert>
      )}

      {notice && (
        <Alert variant={notice.variant} dismissible onClose={() => setNotice(null)}>
          {notice.text}
        </Alert>
      )}

      <Row className="g-4">
        <Col
          lg={openSaved || entries.length ? 12 : 8}
          className={openSaved || entries.length ? '' : 'mx-auto'}
        >
          <Card className="fin-card">
            <Card.Body>
              {openSaved ? (
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                  <div>
                    <div className="small text-muted">Viewing saved analysis</div>
                    <div className="fw-semibold">{openSaved.name}</div>
                    <div className="small mt-1">
                      {(openSaved.files || []).map(f => (
                        <button
                          type="button"
                          key={f.storagePath}
                          className="btn btn-link btn-sm p-0 me-3"
                          onClick={() => download(f)}
                        >
                          <i className="bi bi-file-earmark-pdf me-1" />
                          {f.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline-secondary" size="sm" onClick={() => setOpenSaved(null)}>
                    Close
                  </Button>
                </div>
              ) : (
                <>
                  <div
                    className={`fin-drop${dragging ? ' active' : ''}`}
                    onDragOver={e => {
                      e.preventDefault();
                      setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop}
                    onClick={() => inputRef.current?.click()}
                    onKeyDown={e =>
                      (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()
                    }
                    role="button"
                    tabIndex={0}
                  >
                    <i className="bi bi-cloud-arrow-up fs-2 d-block mb-1" />
                    <div className="fw-semibold">Drop statement PDFs here or click to choose</div>
                    <div className="small text-muted">
                      Several at once is fine — mix cards, banks and months (up to {MAX_FILES}).
                    </div>
                    <input
                      ref={inputRef}
                      type="file"
                      accept="application/pdf,.pdf"
                      multiple
                      hidden
                      onChange={e => {
                        addFiles(e.target.files);
                        e.target.value = '';
                      }}
                    />
                  </div>

                  {entries.length > 0 && (
                    <>
                      <Table size="sm" className="fin-table mt-3 mb-2" responsive>
                        <thead>
                          <tr>
                            <th>File</th>
                            <th>Detected</th>
                            <th>Period</th>
                            <th className="text-end">Rows</th>
                            <th />
                          </tr>
                        </thead>
                        <tbody>
                          {entries.map(e => (
                            <tr key={e.id}>
                              <td>
                                <div className="text-break">{e.file.name}</div>
                                <div className="small text-muted">{fmtSize(e.file.size)}</div>
                              </td>
                              <td>
                                {e.status === 'reading' && (
                                  <span className="text-muted">
                                    <Spinner animation="border" size="sm" className="me-1" />
                                    Reading…
                                  </span>
                                )}
                                {e.status === 'error' && (
                                  <span className="text-danger">{e.error}</span>
                                )}
                                {(e.status === 'ok' || e.status === 'empty') && (
                                  <>
                                    <div>{e.statement.label}</div>
                                    <div className="small text-muted">
                                      {e.statement.accountType === 'debit'
                                        ? 'Checking / debit'
                                        : 'Credit card'}
                                    </div>
                                    {duplicateIds.has(e.id) && (
                                      <div className="small text-warning">
                                        Duplicate — counted once
                                      </div>
                                    )}
                                    {e.statement.warnings.map(w => (
                                      <div key={w} className="small text-warning">
                                        {w}
                                      </div>
                                    ))}
                                  </>
                                )}
                              </td>
                              <td className="small text-nowrap">
                                {e.statement && (
                                  <>
                                    {fmtDay(e.statement.periodStart)}
                                    <br />
                                    {fmtDay(e.statement.periodEnd)}
                                  </>
                                )}
                              </td>
                              <td className="text-end">
                                {e.statement ? e.statement.transactions.length : ''}
                              </td>
                              <td className="text-end">
                                <button
                                  type="button"
                                  className="btn btn-link btn-sm text-danger p-0"
                                  onClick={() => removeEntry(e.id)}
                                  aria-label={`Remove ${e.file.name}`}
                                >
                                  <i className="bi bi-x-lg" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>

                      <div className="d-flex flex-wrap gap-2 align-items-center">
                        {user && statements.length > 0 && (
                          <>
                            <Form.Control
                              size="sm"
                              style={{ maxWidth: 280 }}
                              value={saveName}
                              onChange={e => setSaveName(e.target.value)}
                              maxLength={80}
                              aria-label="Name for this analysis"
                            />
                            <Button size="sm" onClick={save} disabled={saving || reading}>
                              {saving ? (
                                <>
                                  <Spinner animation="border" size="sm" className="me-1" />
                                  Saving…
                                </>
                              ) : (
                                'Save analysis'
                              )}
                            </Button>
                          </>
                        )}
                        {!user && statements.length > 0 && (
                          <Button size="sm" onClick={signInToSave}>
                            Sign in to save
                          </Button>
                        )}
                        <Button size="sm" variant="outline-secondary" onClick={clearAll}>
                          Clear all
                        </Button>
                        {user && statements.length > 0 && (
                          <span className="small text-muted">
                            Saves the statements and their transactions privately to your account.
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {analysis ? (
        <Card className="fin-card mt-4">
          <Card.Body>
            <FinanceAnalytics
              analysis={analysis}
              onCategoryChange={changeCategory}
              signedIn={!!user}
            />
          </Card.Body>
        </Card>
      ) : reading ? (
        <div className="text-center text-muted py-5">
          <Spinner animation="border" className="mb-2" />
          <div>Reading your statements…</div>
        </div>
      ) : null}

      {user && (
        <Card className="fin-card mt-4">
          <Card.Body>
            <h6 className="fin-h">Your saved analyses</h6>
            {savedLoading ? (
              <div className="text-muted small">Loading…</div>
            ) : saved.length === 0 ? (
              <div className="text-muted small">Nothing saved yet.</div>
            ) : (
              <Table size="sm" className="fin-table mb-0" responsive hover>
                <tbody>
                  {saved.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div className="fw-semibold">{item.name}</div>
                        <div className="small text-muted">
                          {item.fileCount} statement{item.fileCount === 1 ? '' : 's'} ·{' '}
                          {item.txnCount} transactions · {fmtDay(item.from)} – {fmtDay(item.to)}
                        </div>
                      </td>
                      <td className="text-end text-nowrap">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          className="me-2"
                          onClick={() => open(item)}
                        >
                          Open
                        </Button>
                        <Button size="sm" variant="outline-danger" onClick={() => remove(item)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default FinanceDataUpload;
