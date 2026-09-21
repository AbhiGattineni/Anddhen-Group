import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Modal, Button } from 'react-bootstrap';
import { TextField } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import connector from 'src/services/connector';

const EMPTY_FORM = { subName: '', subsidiaryName: '', active: true };

const formErrors = ({ subName, subsidiaryName }) => ({
  subName: subName.length < 2 ? 'At least 2 characters' : null,
  subsidiaryName: subsidiaryName.trim().length < 2 ? 'At least 2 characters' : null,
});

const isValid = form => {
  const e = formErrors(form);
  return !e.subName && !e.subsidiaryName;
};

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    '& fieldset': { borderWidth: '1.5px', borderColor: '#e2e8f0' },
    '&:hover fieldset': { borderColor: '#cbd5e1' },
    '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
  },
  '& .MuiInputLabel-root': { fontSize: '13px' },
};

const AddRow = ({ onCreate, disabled }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [touched, setTouched] = useState(false);
  const errors = formErrors(form);

  const handleChange = (field, raw) => {
    const value = field === 'subName' ? raw.toUpperCase().replace(/[^A-Z0-9]/g, '') : raw;
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const submit = () => {
    setTouched(true);
    if (!isValid(form)) return;
    onCreate({
      ...form,
      subsidiaryName: form.subsidiaryName.trim(),
      parttimer_multi_status: false,
    });
    setForm(EMPTY_FORM);
    setTouched(false);
  };

  return (
    <tr style={{ backgroundColor: '#f8fafc' }}>
      <td style={{ padding: '10px 8px' }}>
        <TextField
          size="small"
          placeholder="e.g. ACS"
          value={form.subName}
          onChange={e => handleChange('subName', e.target.value)}
          error={touched && !!errors.subName}
          helperText={touched && errors.subName}
          inputProps={{ maxLength: 10 }}
          sx={inputSx}
          fullWidth
        />
      </td>
      <td style={{ padding: '10px 8px' }}>
        <TextField
          size="small"
          placeholder="e.g. Anddhen Consulting Services"
          value={form.subsidiaryName}
          onChange={e => handleChange('subsidiaryName', e.target.value)}
          error={touched && !!errors.subsidiaryName}
          helperText={touched && errors.subsidiaryName}
          sx={inputSx}
          fullWidth
        />
      </td>
      <td style={{ padding: '10px 8px', textAlign: 'center' }}>
        <input
          type="checkbox"
          checked={form.active}
          onChange={e => handleChange('active', e.target.checked)}
          style={{ width: 16, height: 16, cursor: 'pointer' }}
        />
      </td>
      <td style={{ padding: '10px 8px', textAlign: 'center' }}>
        <Button
          size="sm"
          variant="primary"
          onClick={submit}
          disabled={disabled}
          style={{ borderRadius: 6, fontSize: 13 }}
        >
          Add
        </Button>
      </td>
    </tr>
  );
};

AddRow.propTypes = {
  onCreate: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

const EditRow = ({ sub, onSave, onCancel, disabled }) => {
  const [form, setForm] = useState({
    subName: sub.subName || '',
    subsidiaryName: sub.subsidiaryName || '',
    active: sub.active !== false,
  });
  const [touched, setTouched] = useState(false);
  const errors = formErrors(form);

  const handleChange = (field, raw) => {
    const value = field === 'subName' ? raw.toUpperCase().replace(/[^A-Z0-9]/g, '') : raw;
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const submit = () => {
    setTouched(true);
    if (!isValid(form)) return;
    onSave({ ...form, subsidiaryName: form.subsidiaryName.trim() });
  };

  return (
    <tr style={{ backgroundColor: '#eff6ff' }}>
      <td style={{ padding: '8px' }}>
        <TextField
          size="small"
          value={form.subName}
          onChange={e => handleChange('subName', e.target.value)}
          error={touched && !!errors.subName}
          helperText={touched && errors.subName}
          inputProps={{ maxLength: 10 }}
          sx={inputSx}
          fullWidth
        />
      </td>
      <td style={{ padding: '8px' }}>
        <TextField
          size="small"
          value={form.subsidiaryName}
          onChange={e => handleChange('subsidiaryName', e.target.value)}
          error={touched && !!errors.subsidiaryName}
          helperText={touched && errors.subsidiaryName}
          sx={inputSx}
          fullWidth
        />
      </td>
      <td style={{ padding: '8px', textAlign: 'center' }}>
        <input
          type="checkbox"
          checked={form.active}
          onChange={e => handleChange('active', e.target.checked)}
          style={{ width: 16, height: 16, cursor: 'pointer' }}
        />
      </td>
      <td style={{ padding: '8px', textAlign: 'center' }}>
        <div className="d-flex gap-1 justify-content-center">
          <Button
            size="sm"
            variant="success"
            onClick={submit}
            disabled={disabled}
            style={{ borderRadius: 6, fontSize: 12 }}
          >
            Save
          </Button>
          <Button
            size="sm"
            variant="outline-secondary"
            onClick={onCancel}
            disabled={disabled}
            style={{ borderRadius: 6, fontSize: 12 }}
          >
            Cancel
          </Button>
        </div>
      </td>
    </tr>
  );
};

EditRow.propTypes = {
  sub: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export const ManageSubsidiariesModal = ({ show, onHide }) => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { data: subsidiaries = [], isLoading } = useQuery(
    'subsidiaries',
    () => connector.list('subsidiaries'),
    { enabled: show }
  );

  const invalidate = () => queryClient.invalidateQueries('subsidiaries');

  const { mutate: create, isLoading: creating } = useMutation(
    data => connector.create('subsidiaries', data),
    { onSuccess: invalidate }
  );

  const { mutate: update, isLoading: updating } = useMutation(
    ({ id, data }) => connector.update('subsidiaries', id, data),
    {
      onSuccess: () => {
        invalidate();
        setEditingId(null);
      },
    }
  );

  const { mutate: remove, isLoading: removing } = useMutation(
    id => connector.remove('subsidiaries', id),
    {
      onSuccess: () => {
        invalidate();
        setDeletingId(null);
      },
    }
  );

  const busy = creating || updating || removing;

  const sorted = [...subsidiaries].sort((a, b) => (a.subName || '').localeCompare(b.subName || ''));

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      size="lg"
      style={{ backdropFilter: 'blur(4px)' }}
    >
      <Modal.Header
        closeButton
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          borderBottom: '2px solid #e2e8f0',
          padding: '18px 24px',
        }}
      >
        <Modal.Title style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>
          Manage Subsidiaries
        </Modal.Title>
      </Modal.Header>

      <Modal.Body
        style={{
          padding: '20px 24px',
          backgroundColor: '#ffffff',
          maxHeight: '65vh',
          overflowY: 'auto',
        }}
      >
        {isLoading ? (
          <div className="text-center text-muted py-4">Loading subsidiaries…</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0" style={{ fontSize: 14 }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  <th
                    style={{ width: '20%', padding: '10px 8px', fontWeight: 600, color: '#475569' }}
                  >
                    Short Code
                  </th>
                  <th style={{ padding: '10px 8px', fontWeight: 600, color: '#475569' }}>
                    Full Name
                  </th>
                  <th
                    style={{
                      width: '80px',
                      padding: '10px 8px',
                      fontWeight: 600,
                      color: '#475569',
                      textAlign: 'center',
                    }}
                  >
                    Active
                  </th>
                  <th
                    style={{
                      width: '140px',
                      padding: '10px 8px',
                      fontWeight: 600,
                      color: '#475569',
                      textAlign: 'center',
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.length === 0 && !creating && (
                  <tr>
                    <td colSpan={4} className="text-center text-muted py-3">
                      No subsidiaries yet. Add one below.
                    </td>
                  </tr>
                )}
                {sorted.map(sub =>
                  editingId === sub.id ? (
                    <EditRow
                      key={sub.id}
                      sub={sub}
                      disabled={busy}
                      onSave={data => update({ id: sub.id, data })}
                      onCancel={() => setEditingId(null)}
                    />
                  ) : (
                    <tr key={sub.id}>
                      <td style={{ padding: '10px 8px', fontWeight: 600 }}>{sub.subName}</td>
                      <td style={{ padding: '10px 8px', color: '#374151' }}>
                        {sub.subsidiaryName}
                      </td>
                      <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                        <span
                          className={`badge ${sub.active !== false ? 'bg-success' : 'bg-secondary'}`}
                          style={{ fontSize: 11 }}
                        >
                          {sub.active !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                        <div className="d-flex gap-1 justify-content-center">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            style={{ borderRadius: 6, fontSize: 12 }}
                            onClick={() => setEditingId(sub.id)}
                            disabled={busy || !!editingId}
                          >
                            Edit
                          </button>
                          {deletingId === sub.id ? (
                            <>
                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                style={{ borderRadius: 6, fontSize: 12 }}
                                onClick={() => remove(sub.id)}
                                disabled={removing}
                              >
                                {removing ? '…' : 'Confirm'}
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary"
                                style={{ borderRadius: 6, fontSize: 12 }}
                                onClick={() => setDeletingId(null)}
                                disabled={removing}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              style={{ borderRadius: 6, fontSize: 12 }}
                              onClick={() => setDeletingId(sub.id)}
                              disabled={busy || !!editingId}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                )}
                <AddRow onCreate={create} disabled={busy || !!editingId} />
              </tbody>
            </table>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer
        style={{
          background: '#f8fafc',
          borderTop: '2px solid #e2e8f0',
          padding: '12px 24px',
          justifyContent: 'flex-end',
        }}
      >
        <Button
          variant="outline-secondary"
          onClick={onHide}
          style={{ borderRadius: 8, fontSize: 14 }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ManageSubsidiariesModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
};
