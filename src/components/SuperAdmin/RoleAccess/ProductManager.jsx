import React, { useEffect, useState } from 'react';
import {
  subscribeProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from 'src/services/jira/jiraBoard';

/**
 * Products / clients that customers can report issues against from the Contact
 * page. Each issue lands in the Jira board's Backlog tagged with the product.
 * Hidden products stay on existing tickets but drop out of the Contact dropdown.
 * Writes are admin-only (firestore.rules).
 */
export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [editing, setEditing] = useState({ id: null, name: '' });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(
    () =>
      subscribeProducts(
        list => {
          setProducts(list);
          setLoading(false);
        },
        err => {
          setMsg({ type: 'danger', text: `Could not load products: ${err}` });
          setLoading(false);
        }
      ),
    []
  );

  const run = async (fn, okText) => {
    setBusy(true);
    setMsg({ type: '', text: '' });
    try {
      await fn();
      if (okText) setMsg({ type: 'success', text: okText });
    } catch (err) {
      setMsg({
        type: 'danger',
        text:
          err?.code === 'permission-denied'
            ? 'Only admins can change products.'
            : err?.message || 'Something went wrong.',
      });
    } finally {
      setBusy(false);
    }
  };

  const exists = n => products.some(p => p.name.trim().toLowerCase() === n.trim().toLowerCase());

  const add = e => {
    e.preventDefault();
    const n = name.trim();
    if (!n) return;
    if (exists(n)) {
      setMsg({ type: 'warning', text: `"${n}" is already in the list.` });
      return;
    }
    run(async () => {
      await addProduct(n);
      setName('');
    }, `Added "${n}".`);
  };

  const saveRename = p => {
    const n = editing.name.trim();
    if (!n || n === p.name) {
      setEditing({ id: null, name: '' });
      return;
    }
    run(async () => {
      await updateProduct(p.id, { name: n });
      setEditing({ id: null, name: '' });
    }, `Renamed to "${n}".`);
  };

  const remove = p => {
    if (!window.confirm(`Delete "${p.name}"? Existing tickets keep the name.`)) return;
    run(() => deleteProduct(p.id), `Deleted "${p.name}".`);
  };

  return (
    <div className="py-4" style={{ maxWidth: 720 }}>
      <h5 className="mb-1">Products &amp; Clients</h5>
      <p className="text-muted small mb-3">
        Customers pick one of these on the Contact page when they report an issue. The issue goes
        straight into the Jira board&apos;s Backlog, tagged with the product. Hidden products stay
        on existing tickets but no longer appear on the Contact page.
      </p>

      <form className="d-flex gap-2 mb-3" onSubmit={add}>
        <input
          className="form-control"
          placeholder="Product or client name"
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={100}
        />
        <button
          type="submit"
          className="btn btn-primary text-nowrap"
          disabled={busy || !name.trim()}
        >
          Add
        </button>
      </form>

      {msg.text && <div className={`alert alert-${msg.type} py-2`}>{msg.text}</div>}

      {loading ? (
        <div className="text-muted">Loading…</div>
      ) : products.length === 0 ? (
        <div className="text-muted">
          No products yet. Until you add one, the Contact page only offers general enquiries.
        </div>
      ) : (
        <ul className="list-group">
          {products.map(p => (
            <li key={p.id} className="list-group-item d-flex align-items-center gap-2 flex-wrap">
              {editing.id === p.id ? (
                <input
                  className="form-control form-control-sm flex-grow-1"
                  style={{ minWidth: 160, width: 'auto' }}
                  value={editing.name}
                  onChange={e => setEditing({ id: p.id, name: e.target.value })}
                  onKeyDown={e => {
                    if (e.key === 'Enter') saveRename(p);
                    if (e.key === 'Escape') setEditing({ id: null, name: '' });
                  }}
                  maxLength={100}
                  autoFocus
                />
              ) : (
                <span className={`flex-grow-1${p.active === false ? ' text-muted' : ''}`}>
                  {p.name}
                  {p.active === false && <span className="badge bg-secondary ms-2">Hidden</span>}
                </span>
              )}
              <div className="d-flex gap-1">
                {editing.id === p.id ? (
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={() => saveRename(p)}
                    disabled={busy}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setEditing({ id: p.id, name: p.name })}
                    disabled={busy}
                  >
                    Rename
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => run(() => updateProduct(p.id, { active: p.active === false }))}
                  disabled={busy}
                >
                  {p.active === false ? 'Show' : 'Hide'}
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => remove(p)}
                  disabled={busy}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
