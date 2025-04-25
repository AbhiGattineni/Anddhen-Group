import React, { useCallback, useEffect, useState } from 'react';
import InputField from '../InputField';
import { auth } from 'src/services/Authentication/firebase';
import { useMutation, useQueryClient } from 'react-query';
import PropTypes from 'prop-types';
import { useUpdateData } from 'src/react-query/useFetchApis';
import { capitalizeName } from '../Utils';

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
  useEffect(() => {
    if (editTransaction) {
      // Convert ISO string to the format 'YYYY-MM-DDTHH:MM'
      const formattedDate = new Date(editTransaction.transaction_datetime)
        .toISOString()
        .slice(0, 16); // Remove the 'Z' and keep only 'YYYY-MM-DDTHH:MM'

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
      // receiver_id: '',
      sender_name: '',
      // sender_id: '',
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
      fetch(`${API_BASE_URL}/transactions/create/`, {
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
      },
    },
  );

  const { mutate: updateCollege, isLoading: isUpdating } = useUpdateData(
    'transactions',
    `/transactions/${editTransaction?.id}/update/`,
  );

  const handleEdit = async (e) => {
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
          resetForm();
          toggleModal();
          setEditTransaction(null);
        },
        onError: (error) => {
          console.error('An error occurred:', error);
        },
      });
    } catch (error) {
      console.error('Update error:', error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let upload_data = {
      accountant_id: auth.currentUser.uid,
      accountant_name: capitalizeName(auth.currentUser.displayName),
      credited_amount: 0.0,
      currency: formData.currency,
      debited_amount: 0.0,
      description: formData.description,
      // receiver_id: formData.receiver_id,
      receiver_name: capitalizeName(formData.receiver_name),
      // sender_id: formData.sender_id,
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
    resetForm();
    toggleModal();
  };

  useEffect(() => {
    if (formData || fieldErrors) {
      const allFieldsFilled = Object.values(formData).every(
        (value) => value !== '',
      );
      const hasErrors = Object.values(fieldErrors).some((error) => error);
      setDisableButton(!allFieldsFilled || hasErrors);
    }
  }, [formData, fieldErrors]);

  const toggleModal = useCallback(() => {
    resetForm();
    document.body.style.overflow = 'auto';
    setShowModal(false);
    setEditTransaction(null);
  }, [setShowModal]);

  useEffect(() => {
    if (showModal) {
      const handleBodyOverflow = () => {
        document.body.style.overflow = showModal ? 'hidden' : 'auto';
      };

      handleBodyOverflow();

      return () => {
        document.body.style.overflow = 'auto'; // Ensure body overflow is restored when unmounting
      };
    }
  }, [showModal]);

  useEffect(() => {
    if (showModal || toggleModal) {
      const handleClickOutside = (event) => {
        if (showModal && !event.target.closest('.modal-content')) {
          toggleModal();
        }
      };

      document.addEventListener('click', handleClickOutside);

      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [showModal, toggleModal]);

  return (
    <div
      className={`position-fixed top-50 start-50 translate-middle bg-white rounded shadow overflow-hidden modal-dialog-centered ${
        showModal ? 'd-block' : 'd-none'
      }`}
      style={{
        maxHeight: '90vh',
        maxWidth: '90vw',
        overflowY: 'auto',
        zIndex: 105,
      }} // Limiting modal height and width, allowing overflow
    >
      <div className="modal-content p-0 h-100">
        <div className="modal-header py-2 px-3 d-flex justify-content-between">
          <h1 className="modal-title fs-6" id="exampleModalLabel">
            {editTransaction ? 'Edit' : 'Add'} Transaction
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
          <form className="w-100">
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
                name="sender_name"
                label="Sender Name"
                placeholder="Sender Name"
                type="text"
                value={formData.sender_name}
                onChange={(e) => handleChange('sender_name', e.target.value)}
                setError={(error) => handleFieldError('sender_name', error)}
              />
              {/* <InputField
                className="col-12 col-md-6 mb-3"
                name="receiver_id"
                label="Receiver ID"
                placeholder="Receiver ID"
                type="text"
                value={formData.receiver_id}
                onChange={(e) => handleChange('receiver_id', e.target.value)}
                setError={(error) => handleFieldError('receiver_id', error)}
              /> */}
            </div>
            {/* <div className="row">
              
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
            </div> */}
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
                  {/* <option value="USD">USD</option> */}
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
              {editTransaction ? (
                // If editTransaction has data, show the Edit button
                <button
                  onClick={handleEdit}
                  type="button"
                  className="btn btn-warning shadow px-5"
                  disabled={disableButton || isLoading}
                >
                  {isUpdating ? 'Updating...' : 'Update'}
                </button>
              ) : (
                // If no editTransaction data, show the Submit button
                <button
                  onClick={handleSubmit}
                  type="submit"
                  className="btn btn-warning shadow px-5"
                  disabled={disableButton || isLoading}
                >
                  {isLoading ? 'Submitting...' : 'Submit'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
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
  }).isRequired,
  setEditTransaction: PropTypes.func.isRequired,
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
};
