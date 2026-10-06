import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Badge, Button, Form, Modal, Tab, Table, Tabs } from 'react-bootstrap';
import {
  SPENDING_CATEGORIES,
  assignableCategories,
  isRecategorizable,
} from 'src/services/finance/categorize';

const newId = () => `r${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

function CategorySelect({ value, options, onChange, ariaLabel }) {
  return (
    <Form.Select
      size="sm"
      value={value}
      onChange={e => onChange(e.target.value)}
      aria-label={ariaLabel}
    >
      {!options.includes(value) && <option value={value}>{value}</option>}
      {options.map(c => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </Form.Select>
  );
}

CategorySelect.propTypes = {
  value: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  ariaLabel: PropTypes.string,
};

/**
 * Each user's own category mapper:
 *  - Rules: "description contains … → category", first match wins
 *  - My categories: categories of their own, next to the built-in ones
 *  - Merchant choices: the per-merchant picks made in the Transactions tab
 * Priority when categorising: merchant choice > rule > built-in.
 */
export default function CategoryMapper({ show, onHide, prefs, onChange, transactions, signedIn }) {
  const [contains, setContains] = useState('');
  const [ruleCat, setRuleCat] = useState(SPENDING_CATEGORIES[0]);
  const [newCat, setNewCat] = useState('');
  const [renaming, setRenaming] = useState({ from: null, to: '' });
  const [error, setError] = useState('');

  const options = useMemo(
    () => assignableCategories(prefs.customCategories),
    [prefs.customCategories]
  );

  // Rows a rule could apply to, for live "matches N" counts.
  const mappable = useMemo(
    () =>
      (transactions || []).filter(t =>
        isRecategorizable(t.originalKind || t.kind, t.description, t.amount)
      ),
    [transactions]
  );
  const matchCount = text => {
    const q = text.trim().toLowerCase();
    if (!q) return 0;
    return mappable.filter(t => `${t.description} ${t.merchant}`.toLowerCase().includes(q)).length;
  };

  const merchantNames = useMemo(() => {
    const m = {};
    (transactions || []).forEach(t => {
      if (t.merchantKey && !m[t.merchantKey]) m[t.merchantKey] = t.merchant;
    });
    return m;
  }, [transactions]);

  const update = patch => {
    setError('');
    onChange({ ...prefs, ...patch });
  };

  // ---- rules
  const addRule = e => {
    e.preventDefault();
    const text = contains.trim();
    if (text.length < 2) return setError('Type at least 2 characters to match on.');
    if (prefs.rules.some(r => r.contains.toLowerCase() === text.toLowerCase())) {
      return setError(`There is already a rule for “${text}”.`);
    }
    update({ rules: [...prefs.rules, { id: newId(), contains: text, category: ruleCat }] });
    setContains('');
    return undefined;
  };
  const setRule = (id, patch) =>
    update({ rules: prefs.rules.map(r => (r.id === id ? { ...r, ...patch } : r)) });
  const removeRule = id => update({ rules: prefs.rules.filter(r => r.id !== id) });
  const moveRule = (index, dir) => {
    const next = [...prefs.rules];
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    update({ rules: next });
  };

  // ---- custom categories
  const addCategory = e => {
    e.preventDefault();
    const name = newCat.trim();
    if (!name) return undefined;
    if (options.some(c => c.toLowerCase() === name.toLowerCase())) {
      return setError(`“${name}” already exists.`);
    }
    update({ customCategories: [...prefs.customCategories, name] });
    setNewCat('');
    return undefined;
  };
  const usages = name =>
    prefs.rules.filter(r => r.category === name).length +
    Object.values(prefs.overrides).filter(c => c === name).length;
  const renameCategory = from => {
    const to = renaming.to.trim();
    setRenaming({ from: null, to: '' });
    if (!to || to === from) return;
    if (options.some(c => c !== from && c.toLowerCase() === to.toLowerCase())) {
      setError(`“${to}” already exists.`);
      return;
    }
    const swap = c => (c === from ? to : c);
    update({
      customCategories: prefs.customCategories.map(swap),
      rules: prefs.rules.map(r => ({ ...r, category: swap(r.category) })),
      overrides: Object.fromEntries(Object.entries(prefs.overrides).map(([k, c]) => [k, swap(c)])),
    });
  };
  const deleteCategory = name => {
    const n = usages(name);
    if (
      n &&
      !window.confirm(
        `“${name}” is used by ${n} rule${n > 1 ? 's' : ''} / merchant choice${n > 1 ? 's' : ''}. Delete it and those too?`
      )
    )
      return;
    update({
      customCategories: prefs.customCategories.filter(c => c !== name),
      rules: prefs.rules.filter(r => r.category !== name),
      overrides: Object.fromEntries(Object.entries(prefs.overrides).filter(([, c]) => c !== name)),
    });
  };

  // ---- merchant choices
  const overrideEntries = Object.entries(prefs.overrides).sort((a, b) =>
    (merchantNames[a[0]] || a[0]).localeCompare(merchantNames[b[0]] || b[0])
  );
  const setOverride = (key, category) =>
    update({ overrides: { ...prefs.overrides, [key]: category } });
  const removeOverride = key => {
    const next = { ...prefs.overrides };
    delete next[key];
    update({ overrides: next });
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" scrollable>
      <Modal.Header closeButton>
        <Modal.Title className="h5">Category mapper</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="small text-muted">
          Decide how your transactions are categorised. Your merchant choices win over your rules,
          and your rules win over the built-in ones.{' '}
          {signedIn
            ? 'Changes are saved to your account and apply to every statement you analyse.'
            : 'You are not signed in, so changes last for this visit only.'}
        </p>
        {error && <div className="alert alert-warning py-2 small">{error}</div>}

        <Tabs defaultActiveKey="rules" className="mb-3">
          <Tab eventKey="rules" title={`Rules (${prefs.rules.length})`}>
            <Form onSubmit={addRule} className="fin-map-add">
              <span className="small text-nowrap">If description contains</span>
              <Form.Control
                size="sm"
                value={contains}
                onChange={e => setContains(e.target.value)}
                placeholder="e.g. ZELLE TO VIJJU"
                maxLength={60}
                aria-label="Text to match"
              />
              <span className="small">→</span>
              <CategorySelect
                value={ruleCat}
                options={options}
                onChange={setRuleCat}
                ariaLabel="Category for the new rule"
              />
              <Button size="sm" type="submit">
                Add rule
              </Button>
            </Form>
            {contains.trim().length >= 2 && (
              <div className="small text-muted mt-1">
                Matches {matchCount(contains)} transaction{matchCount(contains) === 1 ? '' : 's'} in
                the current analysis.
              </div>
            )}

            {prefs.rules.length === 0 ? (
              <p className="small text-muted mt-3 mb-0">
                No rules yet. Rules apply to purchases, refunds, ATM cash and outgoing transfers —
                e.g. map a monthly Zelle to your landlord to Housing.
              </p>
            ) : (
              <Table size="sm" className="fin-table mt-3 mb-0" responsive>
                <thead>
                  <tr>
                    <th>Contains</th>
                    <th>Category</th>
                    <th className="text-end">Matches</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {prefs.rules.map((r, i) => (
                    <tr key={r.id}>
                      <td>
                        <Form.Control
                          size="sm"
                          defaultValue={r.contains}
                          onBlur={e => {
                            const v = e.target.value.trim();
                            if (v.length >= 2 && v !== r.contains) setRule(r.id, { contains: v });
                            else e.target.value = r.contains;
                          }}
                          aria-label="Text to match"
                        />
                      </td>
                      <td>
                        <CategorySelect
                          value={r.category}
                          options={options}
                          onChange={c => setRule(r.id, { category: c })}
                          ariaLabel={`Category for rule ${r.contains}`}
                        />
                      </td>
                      <td className="text-end">{matchCount(r.contains)}</td>
                      <td className="text-end text-nowrap">
                        <button
                          type="button"
                          className="btn btn-link btn-sm p-0 me-2"
                          onClick={() => moveRule(i, -1)}
                          disabled={i === 0}
                          aria-label="Move up"
                          title="Move up (first match wins)"
                        >
                          <i className="bi bi-arrow-up" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-link btn-sm p-0 me-2"
                          onClick={() => moveRule(i, 1)}
                          disabled={i === prefs.rules.length - 1}
                          aria-label="Move down"
                          title="Move down"
                        >
                          <i className="bi bi-arrow-down" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-link btn-sm p-0 text-danger"
                          onClick={() => removeRule(r.id)}
                          aria-label={`Delete rule ${r.contains}`}
                        >
                          <i className="bi bi-trash" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Tab>

          <Tab eventKey="categories" title={`My categories (${prefs.customCategories.length})`}>
            <Form onSubmit={addCategory} className="fin-map-add">
              <Form.Control
                size="sm"
                value={newCat}
                onChange={e => setNewCat(e.target.value)}
                placeholder="New category, e.g. Kids, Pets, Business"
                maxLength={40}
                aria-label="New category name"
              />
              <Button size="sm" type="submit" disabled={!newCat.trim()}>
                Add category
              </Button>
            </Form>
            {prefs.customCategories.length > 0 && (
              <ul className="list-group mt-3">
                {prefs.customCategories.map(c => (
                  <li key={c} className="list-group-item d-flex align-items-center gap-2">
                    {renaming.from === c ? (
                      <Form.Control
                        size="sm"
                        autoFocus
                        value={renaming.to}
                        onChange={e => setRenaming({ from: c, to: e.target.value })}
                        onBlur={() => renameCategory(c)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') renameCategory(c);
                          if (e.key === 'Escape') setRenaming({ from: null, to: '' });
                        }}
                        maxLength={40}
                      />
                    ) : (
                      <span className="flex-grow-1">
                        {c}
                        {usages(c) > 0 && (
                          <Badge bg="light" text="dark" className="ms-2">
                            {usages(c)} in use
                          </Badge>
                        )}
                      </span>
                    )}
                    <button
                      type="button"
                      className="btn btn-link btn-sm p-0"
                      onClick={() => setRenaming({ from: c, to: c })}
                    >
                      Rename
                    </button>
                    <button
                      type="button"
                      className="btn btn-link btn-sm p-0 text-danger"
                      onClick={() => deleteCategory(c)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="small text-muted mt-3">
              Built-in: {SPENDING_CATEGORIES.join(', ')}, and Transfers (not counted as spending).
            </div>
          </Tab>

          <Tab eventKey="merchants" title={`Merchant choices (${overrideEntries.length})`}>
            {overrideEntries.length === 0 ? (
              <p className="small text-muted mb-0">
                None yet. Change a category in the Transactions tab and it is remembered here for
                that merchant.
              </p>
            ) : (
              <Table size="sm" className="fin-table mb-0" responsive>
                <thead>
                  <tr>
                    <th>Merchant</th>
                    <th>Category</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {overrideEntries.map(([key, cat]) => (
                    <tr key={key}>
                      <td>{merchantNames[key] || key}</td>
                      <td>
                        <CategorySelect
                          value={cat}
                          options={options}
                          onChange={c => setOverride(key, c)}
                          ariaLabel={`Category for ${merchantNames[key] || key}`}
                        />
                      </td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-link btn-sm p-0 text-danger"
                          onClick={() => removeOverride(key)}
                          title="Back to automatic"
                        >
                          Reset
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Tab>
        </Tabs>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onHide}>
          Done
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

CategoryMapper.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  prefs: PropTypes.shape({
    overrides: PropTypes.object.isRequired,
    rules: PropTypes.array.isRequired,
    customCategories: PropTypes.array.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  transactions: PropTypes.array,
  signedIn: PropTypes.bool,
};
