import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { auth } from 'src/services/Authentication/firebase';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import PropTypes from 'prop-types';
import { useUpdateData } from 'src/react-query/useFetchApis';
import { capitalizeName } from '../Utils';
import { Autocomplete, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export const TransactionModal = ({
  editTransaction,
  setEditTransaction,
  showModal,
  setShowModal,
}) => {
  const queryClient = useQueryClient();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [formData, setFormData] = useState({
    receiver_name: '',
    sender_name: '',
    amount: '',
    transaction_datetime: '',
    transaction_type: '',
    payment_type: '',
    subsidiary: '',
    currency: '',
    description: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [disableButton, setDisableButton] = useState(true);

  // Fetch all transactions to get existing names
  const { data: transactions = [] } = useQuery('transactions', async () => {
    const response = await fetch(`${API_BASE_URL}/transactions/`);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  });

  // Extract unique sender and receiver names
  const { senderNames, receiverNames } = useMemo(() => {
    const senders = new Set();
    const receivers = new Set();

    transactions.forEach(tx => {
      if (tx.sender_name) senders.add(tx.sender_name);
      if (tx.receiver_name) receivers.add(tx.receiver_name);
    });

    return {
      senderNames: Array.from(senders).sort(),
      receiverNames: Array.from(receivers).sort(),
    };
  }, [transactions]);

  useEffect(() => {
    if (editTransaction) {
      const formattedDate = new Date(editTransaction.transaction_datetime)
        .toISOString()
        .slice(0, 16);

      setFormData({
        receiver_name: editTransaction.receiver_name || '',
        sender_name: editTransaction.sender_name || '',
        amount:
          parseInt(editTransaction.credited_amount || 0, 10) +
          parseInt(editTransaction.debited_amount || 0, 10),
        transaction_datetime: formattedDate || '',
        transaction_type: editTransaction.transaction_type || '',
        payment_type: editTransaction.payment_type || '',
        subsidiary: editTransaction.subsidiary || '',
        currency: editTransaction.currency || '',
        description: editTransaction.description || '',
      });
    }
  }, [editTransaction]);

  const resetForm = () => {
    setFormData({
      receiver_name: '',
      sender_name: '',
      amount: '',
      transaction_datetime: '',
      transaction_type: '',
      payment_type: '',
      subsidiary: '',
      currency: '',
      description: '',
    });
    setFieldErrors({});
  };

  const handleChange = (field, value) => {
    if (field === 'amount') {
      const numValue = parseFloat(value);
      if (value && numValue <= 0) {
        handleFieldError('amount', 'Amount must be greater than 0');
        setFormData(prev => ({ ...prev, [field]: value }));
        return;
      }
      handleFieldError('amount', null);
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFieldError = (fieldName, error) => {
    setFieldErrors(prevErrors => ({
      ...prevErrors,
      [fieldName]: error,
    }));
  };

  const { mutate: createTransaction, isLoading } = useMutation(
    formData =>
      fetch(`${API_BASE_URL}/transactions/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      }).then(res => res.json()),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('transactions');
        toggleModal();
      },
      onError: error => {
        console.error('An error occurred:', error);
      },
    }
  );

  const { mutate: updateCollege, isLoading: isUpdating } = useUpdateData(
    'transactions',
    `/transactions/${editTransaction?.id}/update/`
  );

  const handleEdit = async e => {
    e.preventDefault();
    try {
      const submitData = { ...editTransaction, ...formData };

      let amount = parseFloat(formData.amount).toFixed(2);

      if (formData.transaction_type === 'credit') {
        submitData.credited_amount = parseFloat(amount);
        submitData.debited_amount = 0;
      } else if (formData.transaction_type === 'debit') {
        submitData.debited_amount = parseFloat(amount);
        submitData.credited_amount = 0;
      }
      await updateCollege(submitData, {
        onSuccess: () => {
          queryClient.invalidateQueries('transactions');
          toggleModal();
        },
        onError: error => {
          console.error('An error occurred:', error);
        },
      });
    } catch (error) {
      console.error('Update error:', error.message);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    let upload_data = {
      accountant_id: auth.currentUser.uid,
      accountant_name: capitalizeName(auth.currentUser.displayName),
      credited_amount: 0.0,
      currency: formData.currency,
      debited_amount: 0.0,
      description: formData.description,
      receiver_name: capitalizeName(formData.receiver_name),
      sender_name: capitalizeName(formData.sender_name),
      subsidiary: formData.subsidiary,
      transaction_datetime: formData.transaction_datetime,
      payment_type: formData.payment_type,
      transaction_type: formData.transaction_type,
    };

    let amount = parseFloat(formData.amount).toFixed(2);

    if (formData.transaction_type === 'credit') {
      upload_data.credited_amount = parseFloat(amount);
    } else if (formData.transaction_type === 'debit') {
      upload_data.debited_amount = parseFloat(amount);
    }

    createTransaction(upload_data);
    toggleModal();
  };

  useEffect(() => {
    if (formData || fieldErrors) {
      const allFieldsFilled = Object.values(formData).every(value => value !== '');
      const hasErrors = Object.values(fieldErrors).some(error => error);
      setDisableButton(!allFieldsFilled || hasErrors);
    }
  }, [formData, fieldErrors]);

  const toggleModal = useCallback(() => {
    resetForm();
    setShowModal(false);
    setEditTransaction(null);
  }, [setShowModal, setEditTransaction]);

  return (
    <Modal
      show={showModal}
      onHide={toggleModal}
      centered
      backdrop="static"
      size="lg"
      style={{
        backdropFilter: 'blur(4px)',
      }}
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
          style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#1e293b',
            letterSpacing: '-0.5px',
          }}
        >
          {editTransaction ? 'Edit' : 'Add'} Transaction
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ padding: '24px', backgroundColor: '#ffffff' }}>
        <form>
          <div className="row g-3">
            {/* Receiver Name */}
            <div className="col-md-6">
              <Autocomplete
                freeSolo
                options={receiverNames}
                value={formData.receiver_name}
                onChange={(event, newValue) => {
                  handleChange('receiver_name', newValue || '');
                }}
                onInputChange={(event, newInputValue) => {
                  handleChange('receiver_name', newInputValue);
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Receiver Name"
                    placeholder="Type or select"
                    required
                    fullWidth
                    size="small"
                    error={!!fieldErrors.receiver_name}
                    helperText={fieldErrors.receiver_name}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        backgroundColor: '#ffffff',
                        '& fieldset': {
                          borderWidth: '2px',
                          borderColor: '#e2e8f0',
                        },
                        '&:hover fieldset': {
                          borderColor: '#cbd5e1',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#3b82f6',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: '14px',
                        fontWeight: '500',
                      },
                    }}
                  />
                )}
              />
            </div>

            {/* Sender Name */}
            <div className="col-md-6">
              <Autocomplete
                freeSolo
                options={senderNames}
                value={formData.sender_name}
                onChange={(event, newValue) => {
                  handleChange('sender_name', newValue || '');
                }}
                onInputChange={(event, newInputValue) => {
                  handleChange('sender_name', newInputValue);
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Sender Name"
                    placeholder="Type or select"
                    required
                    fullWidth
                    size="small"
                    error={!!fieldErrors.sender_name}
                    helperText={fieldErrors.sender_name}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        backgroundColor: '#ffffff',
                        '& fieldset': {
                          borderWidth: '2px',
                          borderColor: '#e2e8f0',
                        },
                        '&:hover fieldset': {
                          borderColor: '#cbd5e1',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#3b82f6',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: '14px',
                        fontWeight: '500',
                      },
                    }}
                  />
                )}
              />
            </div>

            {/* Amount */}
            <div className="col-md-6">
              <TextField
                label="Amount"
                placeholder="Amount"
                type="number"
                required
                fullWidth
                size="small"
                value={formData.amount}
                onChange={e => handleChange('amount', e.target.value)}
                error={!!fieldErrors.amount}
                helperText={fieldErrors.amount}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    '& fieldset': {
                      borderWidth: '2px',
                      borderColor: '#e2e8f0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#cbd5e1',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3b82f6',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '14px',
                    fontWeight: '500',
                  },
                }}
              />
            </div>

            {/* Transaction Date & Time */}
            <div className="col-md-6">
              <TextField
                label="Transaction Date & Time"
                type="datetime-local"
                required
                fullWidth
                size="small"
                value={formData.transaction_datetime}
                onChange={e => handleChange('transaction_datetime', e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    '& fieldset': {
                      borderWidth: '2px',
                      borderColor: '#e2e8f0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#cbd5e1',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3b82f6',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '14px',
                    fontWeight: '500',
                  },
                }}
              />
            </div>

            {/* Credit/Debit */}
            <div className="col-md-6">
              <FormControl fullWidth size="small" required>
                <InputLabel
                  sx={{
                    fontSize: '14px',
                    fontWeight: '500',
                    '&.Mui-focused': {
                      color: '#3b82f6',
                    },
                  }}
                >
                  Credit/Debit
                </InputLabel>
                <Select
                  value={formData.transaction_type}
                  label="Credit/Debit"
                  onChange={e => handleChange('transaction_type', e.target.value)}
                  sx={{
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderWidth: '2px',
                      borderColor: '#e2e8f0',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#cbd5e1',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#3b82f6',
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Select</em>
                  </MenuItem>
                  <MenuItem value="credit">Credit</MenuItem>
                  <MenuItem value="debit">Debit</MenuItem>
                </Select>
              </FormControl>
            </div>

            {/* Payment Type */}
            <div className="col-md-6">
              <FormControl fullWidth size="small" required>
                <InputLabel
                  sx={{
                    fontSize: '14px',
                    fontWeight: '500',
                    '&.Mui-focused': {
                      color: '#3b82f6',
                    },
                  }}
                >
                  Payment Type
                </InputLabel>
                <Select
                  value={formData.payment_type}
                  label="Payment Type"
                  onChange={e => handleChange('payment_type', e.target.value)}
                  sx={{
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderWidth: '2px',
                      borderColor: '#e2e8f0',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#cbd5e1',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#3b82f6',
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Select</em>
                  </MenuItem>
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="upi">UPI</MenuItem>
                  <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                </Select>
              </FormControl>
            </div>

            {/* Subsidiary */}
            <div className="col-md-6">
              <FormControl fullWidth size="small" required>
                <InputLabel
                  sx={{
                    fontSize: '14px',
                    fontWeight: '500',
                    '&.Mui-focused': {
                      color: '#3b82f6',
                    },
                  }}
                >
                  Subsidiary
                </InputLabel>
                <Select
                  value={formData.subsidiary}
                  label="Subsidiary"
                  onChange={e => handleChange('subsidiary', e.target.value)}
                  sx={{
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderWidth: '2px',
                      borderColor: '#e2e8f0',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#cbd5e1',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#3b82f6',
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Select</em>
                  </MenuItem>
                  <MenuItem value="AMS">AMS</MenuItem>
                  <MenuItem value="ACS">ACS</MenuItem>
                  <MenuItem value="ASS">ASS</MenuItem>
                  <MenuItem value="APS">APS</MenuItem>
                  <MenuItem value="ATI">ATI</MenuItem>
                </Select>
              </FormControl>
            </div>

            {/* Currency */}
            <div className="col-md-6">
              <FormControl fullWidth size="small" required>
                <InputLabel
                  sx={{
                    fontSize: '14px',
                    fontWeight: '500',
                    '&.Mui-focused': {
                      color: '#3b82f6',
                    },
                  }}
                >
                  Currency
                </InputLabel>
                <Select
                  value={formData.currency}
                  label="Currency"
                  onChange={e => handleChange('currency', e.target.value)}
                  sx={{
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderWidth: '2px',
                      borderColor: '#e2e8f0',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#cbd5e1',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#3b82f6',
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Select</em>
                  </MenuItem>
                  <MenuItem value="INR">INR</MenuItem>
                </Select>
              </FormControl>
            </div>

            {/* Description */}
            <div className="col-12">
              <TextField
                label="Description"
                placeholder="Description"
                type="text"
                required
                fullWidth
                size="small"
                multiline
                rows={2}
                value={formData.description}
                onChange={e => handleChange('description', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    '& fieldset': {
                      borderWidth: '2px',
                      borderColor: '#e2e8f0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#cbd5e1',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3b82f6',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '14px',
                    fontWeight: '500',
                  },
                }}
              />
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
        {editTransaction ? (
          <Button
            variant="warning"
            onClick={handleEdit}
            disabled={disableButton || isUpdating}
            style={{
              padding: '12px 40px',
              fontSize: '15px',
              fontWeight: '600',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              border: 'none',
              color: '#ffffff',
              boxShadow: disableButton ? 'none' : '0 4px 12px rgba(245, 158, 11, 0.3)',
              transition: 'all 0.3s ease',
            }}
          >
            {isUpdating ? 'Updating...' : 'Update Transaction'}
          </Button>
        ) : (
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
            {isLoading ? 'Submitting...' : 'Add Transaction'}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

TransactionModal.propTypes = {
  editTransaction: PropTypes.shape({
    accountant_id: PropTypes.string.isRequired,
    accountant_name: PropTypes.string.isRequired,
    credited_amount: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
    debited_amount: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    payment_type: PropTypes.string.isRequired,
    receiver_id: PropTypes.string.isRequired,
    receiver_name: PropTypes.string.isRequired,
    sender_id: PropTypes.string.isRequired,
    sender_name: PropTypes.string.isRequired,
    subsidiary: PropTypes.string.isRequired,
    transaction_datetime: PropTypes.string.isRequired,
    transaction_id: PropTypes.string.isRequired,
    transaction_type: PropTypes.string.isRequired,
    uploaded_datetime: PropTypes.string.isRequired,
  }),
  setEditTransaction: PropTypes.func.isRequired,
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
};
