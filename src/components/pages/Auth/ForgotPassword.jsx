import React, { useState } from 'react';
import InputField from '../../organisms/InputField';
import Toast from '../../organisms/Toast';
import {
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from 'src/services/Authentication/firebase';
import { useNavigate } from 'react-router-dom';

export const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: '' });
  const navigate = useNavigate();
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
      // Step 1: Check if the email exists
      const signInMethods = await fetchSignInMethodsForEmail(
        auth,
        formData.email,
      );
      if (signInMethods.length === 0) {
        setToast({ show: true, message: 'Email not found' });
        setLoading(false);
        return;
      }

      // Step 2: Send password reset email if email exists
      await sendPasswordResetEmail(auth, formData.email);
      setFormData({ email: '' });
      setToast({ show: true, message: 'Email sent successfully' });

      // Redirect to login after 3 seconds
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setToast({ show: true, message: 'Something went wrong!' });
      console.error('Error:', error);
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
