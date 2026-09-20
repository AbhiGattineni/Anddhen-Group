import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQueryClient } from 'react-query';
import { Modal, Button } from 'react-bootstrap';
import { TextField } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import connector from 'src/services/connector';

export const AddSubsidiaryModal = ({ show, onHide }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ subName: '', subsidiaryName: '', active: true });
  const [fieldErrors, setFieldErrors] = useState({});
  const [disableButton, setDisableButton] = useState(true);

  const resetForm = () => {
    setFormData({ subName: '', subsidiaryName: '', active: true });
    setFieldErrors({});
  };

  const handleChange = (field, value) => {
    if (field === 'subName') {
      const upper = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      setFormData(prev => ({ ...prev, subName: upper }));
      setFieldErrors(prev => ({
        ...prev,
        subName: upper.length < 2 ? 'Short code must be at least 2 characters' : null,
      }));
      return;
    }
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'subsidiaryName') {
      setFieldErrors(prev => ({
        ...prev,
        subsidiaryName: value.trim().length < 2 ? 'Name must be at least 2 characters' : null,
      }));
    }
  };

  useEffect(() => {
    const filled = formData.subName.length >= 2 && formData.subsidiaryName.trim().length >= 2;
    const hasErrors = Object.values(fieldErrors).some(Boolean);
    setDisableButton(!filled || hasErrors);
  }, [formData, fieldErrors]);

  const { mutate: createSubsidiary, isLoading } = useMutation(
    data => connector.create('subsidiaries', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('subsidiaries');
        resetForm();
        onHide();
      },
    }
  );

  const handleSubmit = e => {
    e.preventDefault();
    createSubsidiary({
      subName: formData.subName,
      subsidiaryName: formData.subsidiaryName.trim(),
      active: formData.active,
      parttimer_multi_status: false,
    });
  };

  const handleClose = () => {
    resetForm();
    onHide();
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      backgroundColor: '#ffffff',
      '& fieldset': { borderWidth: '2px', borderColor: '#e2e8f0' },
      '&:hover fieldset': { borderColor: '#cbd5e1' },
      '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
    },
    '& .MuiInputLabel-root': { fontSize: '14px', fontWeight: '500' },
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
      size="md"
      style={{ backdropFilter: 'blur(4px)' }}
    >
      <Modal.Header
        closeButton
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          borderBottom: '2px solid #e2e8f0',
          padding: '20px 24px',
        }}
      >
        <Modal.Title
          style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', letterSpacing: '-0.5px' }}
        >
          Add Subsidiary
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ padding: '24px', backgroundColor: '#ffffff' }}>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12">
              <TextField
                label="Short Code"
                placeholder="e.g. ACS, AMS"
                required
                fullWidth
                size="small"
                value={formData.subName}
                onChange={e => handleChange('subName', e.target.value)}
                error={!!fieldErrors.subName}
                helperText={fieldErrors.subName || 'Uppercase letters and numbers only'}
                inputProps={{ maxLength: 10 }}
                sx={inputSx}
              />
            </div>

            <div className="col-12">
              <TextField
                label="Full Name"
                placeholder="e.g. Anddhen Consulting Services"
                required
                fullWidth
                size="small"
                value={formData.subsidiaryName}
                onChange={e => handleChange('subsidiaryName', e.target.value)}
                error={!!fieldErrors.subsidiaryName}
                helperText={fieldErrors.subsidiaryName}
                sx={inputSx}
              />
            </div>

            <div className="col-12 d-flex align-items-center gap-2">
              <input
                type="checkbox"
                id="sub-active"
                checked={formData.active}
                onChange={e => handleChange('active', e.target.checked)}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <label
                htmlFor="sub-active"
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#475569',
                  cursor: 'pointer',
                  margin: 0,
                }}
              >
                Active (visible in transaction subsidiary dropdown)
              </label>
            </div>
          </div>
        </form>
      </Modal.Body>

      <Modal.Footer
        style={{
          background: '#f8fafc',
          borderTop: '2px solid #e2e8f0',
          padding: '16px 24px',
          justifyContent: 'center',
        }}
      >
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={disableButton || isLoading}
          style={{
            padding: '12px 40px',
            fontSize: '15px',
            fontWeight: '600',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            border: 'none',
            color: '#ffffff',
            boxShadow: disableButton ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.3)',
            transition: 'all 0.3s ease',
          }}
        >
          {isLoading ? 'Adding...' : 'Add Subsidiary'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

AddSubsidiaryModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
};
