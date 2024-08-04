import React, { useState } from 'react';
import InputField from '../../organisms/InputField';
import Toast from '../../organisms/Toast';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from 'src/services/Authentication/firebase';

export const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: '' });
  const handleChange = (field, value) => {
    setFormData((prevFormData) => ({ ...prevFormData, [field]: value }));
  };

  const handleFieldError = (fieldName, error) => {
    setFieldErrors((prevErrors) => ({ ...prevErrors, [fieldName]: error }));
  };
  const isFormValid = () => {
    return (
      Object.values(formData).every(Boolean) &&
      !Object.values(fieldErrors).some(Boolean) &&
      !loading
    );
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, formData.email);
      setFormData({ email: '' });
      setToast({ show: true, message: 'Email sent successfully' });
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        setToast({ show: true, message: 'Email not found' });
      } else {
        setToast({ show: true, message: 'Something went wrong!' });
        console.error('Error:', error);
      }
    } finally {
      setLoading(false);
      setTimeout(() => setToast({ show: false, message: '' }), 3000);
    }
  };
  return (
    <div className="container my-3">
      <div className="w-100">
        <div className="row justify-content-center">
          <div className="col col-md-6 text-center bg-white rounded border shadow-sm p-3">
            <h2>Forgot Password?</h2>
            <p>Enter your email address associated with your account.</p>
            <form onSubmit={handleSubmit}>
              <InputField
                name="email"
                label="Email"
                placeholder="Email"
                type="email"
                className="text-start p-1"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                setError={(error) => handleFieldError('email', error)}
              />
              <div className="form-group py-3">
                <button
                  type="submit"
                  className="btn btn-warning shadow w-100"
                  disabled={!isFormValid() || loading}
                >
                  {loading ? 'Loading...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Toast
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ show: false, message: '' })}
      />
    </div>
  );
};
