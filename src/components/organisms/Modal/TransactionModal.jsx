import React, { useCallback, useEffect, useState } from 'react';
import InputField from '../InputField';
import { auth } from 'src/services/Authentication/firebase';
import { useMutation, useQueryClient } from 'react-query';
import PropTypes from 'prop-types';

export const TransactionModal = ({ showModal, setShowModal }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    receiver_name: '',
    receiver_id: '',
    sender_name: '',
    sender_id: '',
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

  const resetForm = () => {
    setFormData({
      receiver_name: '',
      receiver_id: '',
      sender_name: '',
      sender_id: '',
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
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFieldError = (fieldName, error) => {
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: error,
    }));
  };

  const { mutate: createTransaction, isLoading } = useMutation(
    (formData) =>
      fetch('http://127.0.0.1:8000/transactions/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      }).then((res) => res.json()),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('transactions');
        resetForm();
        toggleModal();
      },
      onError: (error) => {
        console.error('An error occurred:', error);
        // Handle error state or display error message
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    let upload_data = {
      accountant_id: auth.currentUser.uid,
      accountant_name: auth.currentUser.displayName,
      credited_amount: 0.0,
      currency: formData.currency,
      debited_amount: 0.0,
      description: formData.description,
      receiver_id: formData.receiver_id,
      receiver_name: formData.receiver_name,
      sender_id: formData.sender_id,
      sender_name: formData.sender_name,
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
    resetForm();
    toggleModal();
  };

  useEffect(() => {
    const allFieldsFilled = Object.values(formData).every(
      (value) => value !== ''
    );
    const hasErrors = Object.values(fieldErrors).some((error) => error);
    setDisableButton(!allFieldsFilled || hasErrors);
  }, [formData, fieldErrors]);

  const toggleModal = useCallback(() => {
    resetForm();
    document.body.style.overflow = 'auto'; // Restore body overflow
    setShowModal(false);
  }, [setShowModal]);

  useEffect(() => {
    const handleBodyOverflow = () => {
      document.body.style.overflow = showModal ? 'hidden' : 'auto';
    };

    handleBodyOverflow();

    return () => {
      document.body.style.overflow = 'auto'; // Ensure body overflow is restored when unmounting
    };
  }, [showModal]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showModal && !event.target.closest('.modal-content')) {
        toggleModal();
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showModal, toggleModal]);

  return (
    <div
      className={`position-fixed top-50 start-50 translate-middle bg-white rounded shadow overflow-hidden modal-dialog-centered ${
        showModal ? 'd-block' : 'd-none'
      }`}
      style={{ maxHeight: '90vh', maxWidth: '90vw', overflowY: 'auto' }} // Limiting modal height and width, allowing overflow
    >
      <div className="modal-content p-0 h-100">
        <div className="modal-header py-2 px-3">
          <h1 className="modal-title fs-6" id="exampleModalLabel">
            Add Transaction
          </h1>
          <button
            type="button"
            className="btn-close"
            onClick={toggleModal}
          ></button>
        </div>
        <div
          className="modal-body row px-3 py-2"
          style={{ overflowY: 'auto', maxHeight: '80vh' }}
        >
          <form onSubmit={handleSubmit} className="w-100">
            <div className="row">
              <InputField
                className="col-12 col-md-6 mb-3"
                name="receiver_name"
                label="Receiver Name"
                placeholder="Receiver Name"
                type="text"
                value={formData.receiver_name}
                onChange={(e) => handleChange('receiver_name', e.target.value)}
                setError={(error) => handleFieldError('receiver_name', error)}
              />
              <InputField
                className="col-12 col-md-6 mb-3"
                name="receiver_id"
                label="Receiver ID"
                placeholder="Receiver ID"
                type="text"
                value={formData.receiver_id}
                onChange={(e) => handleChange('receiver_id', e.target.value)}
                setError={(error) => handleFieldError('receiver_id', error)}
              />
            </div>
            <div className="row">
              <InputField
                className="col-12 col-md-6 mb-3"
                name="sender_name"
                label="Sender Name"
                placeholder="Sender Name"
                type="text"
                value={formData.sender_name}
                onChange={(e) => handleChange('sender_name', e.target.value)}
                setError={(error) => handleFieldError('sender_name', error)}
              />
              <InputField
                className="col-12 col-md-6 mb-3"
                name="sender_id"
                label="Sender ID"
                placeholder="Sender ID"
                type="text"
                value={formData.sender_id}
                onChange={(e) => handleChange('sender_id', e.target.value)}
                setError={(error) => handleFieldError('sender_id', error)}
              />
            </div>
            <div className="row">
              <InputField
                className="col-12 col-md-6 mb-3"
                name="amount"
                label="Amount"
                placeholder="Amount"
                type="number"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                setError={(error) => handleFieldError('amount', error)}
              />
              <InputField
                className="col-12 col-md-6 mb-3"
                name="transaction_datetime"
                label="Transaction Date & Time"
                placeholder="Transaction Date & Time"
                type="datetime-local"
                value={formData.transaction_datetime}
                onChange={(e) =>
                  handleChange('transaction_datetime', e.target.value)
                }
                setError={(error) =>
                  handleFieldError('transaction_datetime', error)
                }
              />
            </div>
            <div className="row">
              <div className="col-12 col-md-6 mb-3">
                <label htmlFor="transaction_type" className="form-label">
                  Credit/Debit{' '}
                  <span className="text-danger" style={{ userSelect: 'none' }}>
                    {' '}
                    *
                  </span>
                </label>
                <select
                  id="transaction_type"
                  name="transaction_type"
                  className="form-select"
                  value={formData.transaction_type}
                  onChange={(e) =>
                    handleChange('transaction_type', e.target.value)
                  }
                >
                  <option value="">Select</option>
                  <option value="credit">Credit</option>
                  <option value="debit">Debit</option>
                </select>
              </div>
              <div className="col-12 col-md-6 mb-3">
                <label htmlFor="payment_type" className="form-label">
                  Transaction Type{' '}
                  <span className="text-danger" style={{ userSelect: 'none' }}>
                    {' '}
                    *
                  </span>
                </label>
                <select
                  id="payment_type"
                  name="payment_type"
                  className="form-select"
                  value={formData.payment_type}
                  onChange={(e) => handleChange('payment_type', e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="cash">Cash</option>
                  <option value="upi">UPI</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-md-6 mb-3">
                <label htmlFor="subsidiary" className="form-label">
                  Subsidiary{' '}
                  <span className="text-danger" style={{ userSelect: 'none' }}>
                    {' '}
                    *
                  </span>
                </label>
                <select
                  id="subsidiary"
                  name="subsidiary"
                  className="form-select"
                  value={formData.subsidiary}
                  onChange={(e) => handleChange('subsidiary', e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="AMS">AMS</option>
                  <option value="ACS">ACS</option>
                  <option value="ASS">ASS</option>
                  <option value="APS">APS</option>
                  <option value="ATI">ATI</option>
                </select>
              </div>
              <div className="col-12 col-md-6 mb-3">
                <label htmlFor="currency" className="form-label">
                  Currency{' '}
                  <span className="text-danger" style={{ userSelect: 'none' }}>
                    {' '}
                    *
                  </span>
                </label>
                <select
                  id="currency"
                  name="currency"
                  className="form-select"
                  value={formData.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                </select>
              </div>
              <InputField
                className="col-12 mb-3"
                name="description"
                label="Description"
                placeholder="Description"
                type="text"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                setError={(error) => handleFieldError('description', error)}
              />
            </div>
            <div className="form-group py-3 w-100 d-flex justify-content-center">
              <button
                type="submit"
                className="btn btn-warning shadow px-5"
                disabled={disableButton || isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

TransactionModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
};
