import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap';
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
  getFinancePrefs,
  saveFinancePrefs,
  EMPTY_PREFS,
} from 'src/services/finance/financeStore';
import { stashFiles, takeStashedFiles, clearStash } from 'src/services/finance/pendingStash';
import FinanceAnalytics from './FinanceAnalytics';
import CategoryMapper from './CategoryMapper';
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
  // The user's category mapper (merchant choices, rules, own categories).
  // Saved to their account when signed in; kept only for this tab otherwise.
  const [prefs, setPrefs] = useState(EMPTY_PREFS);
  const [prefsLoaded, setPrefsLoaded] = useState(false);
  const [showMapper, setShowMapper] = useState(false);

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
    setPrefsLoaded(false);
    if (!user) return undefined;
    let cancelled = false;
    getFinancePrefs(user.uid)
      .then(saved => {
        if (cancelled) return;
        // Anything changed before the load finished wins over the stored copy.
        setPrefs(prev => ({
          overrides: { ...saved.overrides, ...prev.overrides },
          rules: [...saved.rules, ...prev.rules.filter(r => !saved.rules.some(x => x.id === r.id))],
          customCategories: [...new Set([...saved.customCategories, ...prev.customCategories])],
        }));
        setPrefsLoaded(true);
      })
      .catch(err => console.error('getFinancePrefs failed:', err));
    return () => {
      cancelled = true;
    };
  }, [user]);

  // Save the mapper shortly after the last change (signed in only).
  const prefsDirty = useRef(false);
  useEffect(() => {
    if (!user || !prefsLoaded || !prefsDirty.current) return undefined;
    const timer = setTimeout(() => {
      prefsDirty.current = false;
      saveFinancePrefs(user.uid, prefs).catch(err => {
        console.error('saveFinancePrefs failed:', err);
        setNotice({
          variant: 'warning',
          text: 'Your category changes apply here but could not be saved to your account.',
        });
      });
    }, 600);
    return () => clearTimeout(timer);
  }, [prefs, user, prefsLoaded]);

  const updatePrefs = useCallback(next => {
    prefsDirty.current = true;
    setPrefs(next);
  }, []);

  const changeCategory = useCallback((merchantKey, category) => {
    if (!merchantKey) return;
    prefsDirty.current = true;
    setPrefs(prev => {
      const overrides = { ...prev.overrides };
      if (category) overrides[merchantKey] = category;
      else delete overrides[merchantKey];
      return { ...prev, overrides };
    });
  }, []);

  // One list for the sidebar, whether showing fresh uploads or a saved analysis.
  const items = useMemo(() => {
    if (openSaved) {
      return (openSaved.statements || []).map((statement, i) => ({
        id: `s${i}`,
        name: openSaved.files?.[i]?.name || statement.fileName,
        size: openSaved.files?.[i]?.size,
        storedFile: openSaved.files?.[i],
        status: 'ok',
        statement,
      }));
    }
    return entries.map(e => ({
      id: `u${e.id}`,
      entryId: e.id,
      name: e.file.name,
      size: e.file.size,
      file: e.file,
      status: e.status,
      statement: e.statement,
      error: e.error,
    }));
  }, [entries, openSaved]);

  // Which statements feed the analysis. Stored as the excluded set so newly
  // added statements are included by default.
  const [excluded, setExcluded] = useState(() => new Set());
  useEffect(() => setExcluded(new Set()), [openSaved]);

  // Statements that parsed, minus exact duplicates (same file uploaded twice).
  const { selectable, duplicateIds } = useMemo(() => {
    const seen = new Set();
    const dup = new Set();
    const list = [];
    items.forEach(it => {
      if (it.status !== 'ok') return;
      const key = statementKey(it.statement);
      if (seen.has(key)) dup.add(it.id);
      else {
        seen.add(key);
        list.push(it);
      }
    });
    return { selectable: list, duplicateIds: dup };
  }, [items]);

  const selected = useMemo(
    () => selectable.filter(it => !excluded.has(it.id)),
    [selectable, excluded]
  );
  const statements = useMemo(() => selected.map(it => it.statement), [selected]);

  const analysis = useMemo(
    () => (statements.length ? analyze(statements, prefs) : null),
    [statements, prefs]
  );
  const reading = entries.some(e => e.status === 'reading');

  useEffect(() => {
    if (!openSaved) setSaveName(statements.length ? defaultName(statements) : '');
  }, [statements, openSaved]);

  const toggle = id =>
    setExcluded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const selectAll = () => setExcluded(new Set());
  const selectNone = () => setExcluded(new Set(selectable.map(it => it.id)));

  const removeEntry = id => setEntries(prev => prev.filter(e => e.id !== id));

  const clearAll = () => {
    setEntries([]);
    setOpenSaved(null);
    setNotice(null);
    clearStash();
  };

  const signInToSave = async () => {
    try {
      await stashFiles(selected.filter(it => it.file).map(it => it.file));
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
      // Saves the statements currently selected in the sidebar.
      const okEntries = selected.map(it => entries.find(e => e.id === it.entryId)).filter(Boolean);
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

  const sidebar = (
    <div className="fin-side">
      <Card className="fin-card mb-3">
        <Card.Body>
          {openSaved ? (
            <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
              <div>
                <div className="small text-muted">Saved analysis</div>
                <div className="fw-semibold">{openSaved.name}</div>
              </div>
              <Button variant="outline-secondary" size="sm" onClick={() => setOpenSaved(null)}>
                Close
              </Button>
            </div>
          ) : (
            <div
              className={`fin-drop fin-drop-compact${dragging ? ' active' : ''}`}
              onDragOver={e => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
              role="button"
              tabIndex={0}
            >
              <i className="bi bi-cloud-arrow-up fs-4 d-block" />
              <div className="fw-semibold small">Add statement PDFs</div>
              <div className="small text-muted">Drop here or click · up to {MAX_FILES}</div>
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
          )}

          {items.length > 0 && (
            <>
              <div className="d-flex justify-content-between align-items-center mt-3 mb-1">
                <span className="fin-side-h">
                  Statements
                  <span className="text-muted fw-normal ms-1">
                    {selected.length}/{selectable.length} selected
                  </span>
                </span>
                <span className="small text-nowrap">
                  <button
                    type="button"
                    className="btn btn-link btn-sm p-0 me-2"
                    onClick={selectAll}
                    disabled={selected.length === selectable.length}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    className="btn btn-link btn-sm p-0"
                    onClick={selectNone}
                    disabled={selected.length === 0}
                  >
                    None
                  </button>
                </span>
              </div>
              <ul className="fin-doc-list">
                {items.map(it => {
                  const usable = it.status === 'ok' && !duplicateIds.has(it.id);
                  const checked = usable && !excluded.has(it.id);
                  const s = it.statement;
                  return (
                    <li key={it.id} className={`fin-doc${checked ? ' on' : ''}`}>
                      <Form.Check
                        type="checkbox"
                        id={`fin-doc-${it.id}`}
                        checked={checked}
                        disabled={!usable}
                        onChange={() => toggle(it.id)}
                        aria-label={`Include ${it.name}`}
                      />
                      <label htmlFor={`fin-doc-${it.id}`} className="fin-doc-body">
                        {it.status === 'reading' ? (
                          <span className="text-muted">
                            <Spinner animation="border" size="sm" className="me-1" />
                            Reading…
                          </span>
                        ) : s ? (
                          <>
                            <span className="fin-doc-title">{s.label}</span>
                            <span className="fin-doc-sub">
                              {fmtDay(s.periodStart)} – {fmtDay(s.periodEnd)} ·{' '}
                              {s.transactions.length} rows
                            </span>
                          </>
                        ) : null}
                        <span className="fin-doc-file" title={it.name}>
                          <i className="bi bi-file-earmark-pdf me-1" />
                          {it.name}
                          {it.size ? ` · ${fmtSize(it.size)}` : ''}
                        </span>
                        {it.status === 'error' && (
                          <span className="text-danger small">{it.error}</span>
                        )}
                        {duplicateIds.has(it.id) && (
                          <span className="text-warning small">Duplicate — counted once</span>
                        )}
                        {s?.warnings.map(w => (
                          <span key={w} className="text-warning small">
                            {w}
                          </span>
                        ))}
                      </label>
                      {it.storedFile ? (
                        <button
                          type="button"
                          className="btn btn-link btn-sm p-0 text-secondary"
                          onClick={() => download(it.storedFile)}
                          aria-label={`Download ${it.name}`}
                          title="Download PDF"
                        >
                          <i className="bi bi-download" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-link btn-sm p-0 text-danger"
                          onClick={() => removeEntry(it.entryId)}
                          aria-label={`Remove ${it.name}`}
                          title="Remove"
                        >
                          <i className="bi bi-x-lg" />
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>

              {!openSaved && (
                <div className="d-grid gap-2 mt-3">
                  {user && selected.length > 0 && (
                    <>
                      <Form.Control
                        size="sm"
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
                          `Save ${selected.length} selected`
                        )}
                      </Button>
                    </>
                  )}
                  {!user && selected.length > 0 && (
                    <Button size="sm" onClick={signInToSave}>
                      Sign in to save
                    </Button>
                  )}
                  <Button size="sm" variant="outline-secondary" onClick={clearAll}>
                    Clear all
                  </Button>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      <Card className="fin-card mb-3">
        <Card.Body className="d-flex align-items-center justify-content-between gap-2">
          <div>
            <div className="fin-side-h">Category mapper</div>
            <div className="small text-muted">
              {prefs.rules.length} rule{prefs.rules.length === 1 ? '' : 's'} ·{' '}
              {prefs.customCategories.length} own categor
              {prefs.customCategories.length === 1 ? 'y' : 'ies'} ·{' '}
              {Object.keys(prefs.overrides).length} merchant choice
              {Object.keys(prefs.overrides).length === 1 ? '' : 's'}
            </div>
          </div>
          <Button size="sm" variant="outline-primary" onClick={() => setShowMapper(true)}>
            <i className="bi bi-sliders me-1" />
            Edit
          </Button>
        </Card.Body>
      </Card>

      {user && (
        <Card className="fin-card">
          <Card.Body>
            <div className="fin-side-h mb-2">Saved analyses</div>
            {savedLoading ? (
              <div className="text-muted small">Loading…</div>
            ) : saved.length === 0 ? (
              <div className="text-muted small">Nothing saved yet.</div>
            ) : (
              <ul className="fin-doc-list">
                {saved.map(item => (
                  <li key={item.id} className={`fin-doc${openSaved?.id === item.id ? ' on' : ''}`}>
                    <button
                      type="button"
                      className="fin-doc-body btn btn-link p-0 text-start text-decoration-none"
                      onClick={() => open(item)}
                    >
                      <span className="fin-doc-title">{item.name}</span>
                      <span className="fin-doc-sub">
                        {item.fileCount} statement{item.fileCount === 1 ? '' : 's'} ·{' '}
                        {item.txnCount} rows
                      </span>
                      <span className="fin-doc-sub">
                        {fmtDay(item.from)} – {fmtDay(item.to)}
                      </span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-link btn-sm p-0 text-danger"
                      onClick={() => remove(item)}
                      aria-label={`Delete ${item.name}`}
                      title="Delete"
                    >
                      <i className="bi bi-trash" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  );

  return (
    <div className="fin-wrap">
      <CategoryMapper
        show={showMapper}
        onHide={() => setShowMapper(false)}
        prefs={prefs}
        onChange={updatePrefs}
        transactions={analysis?.transactions || []}
        signedIn={!!user}
      />
      <div className="mb-3">
        <h2 className="fin-title">Statement Analyzer</h2>
        <p className="text-muted mb-0">
          Upload Chase, American Express, Discover or U.S. Bank statements — credit card or checking
          — and get a combined assessment. Files are read right here in your browser.
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
          {selected.length > 0 ? (
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
        <Col lg={4} xl={3}>
          {sidebar}
        </Col>
        <Col lg={8} xl={9}>
          {analysis ? (
            <Card className="fin-card">
              <Card.Body>
                <FinanceAnalytics
                  analysis={analysis}
                  onCategoryChange={changeCategory}
                  onOpenMapper={() => setShowMapper(true)}
                  customCategories={prefs.customCategories}
                  signedIn={!!user}
                />
              </Card.Body>
            </Card>
          ) : reading ? (
            <div className="fin-empty">
              <Spinner animation="border" className="mb-2" />
              <div>Reading your statements…</div>
            </div>
          ) : selectable.length > 0 ? (
            <div className="fin-empty">
              <i className="bi bi-ui-checks fs-2 d-block mb-2" />
              No statements selected. Tick one or more in the list to see the analysis.
            </div>
          ) : (
            <div className="fin-empty">
              <i className="bi bi-bar-chart-line fs-2 d-block mb-2" />
              Add statements on the left to see your spending, card comparison, insights and card
              recommendations.
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default FinanceDataUpload;
