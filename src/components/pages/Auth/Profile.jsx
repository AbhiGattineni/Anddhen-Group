import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from 'src/components/atoms/LoadingSpinner/LoadingSpinner';
import InputField from 'src/components/organisms/InputField';
import usePostUserData from 'src/hooks/usePostUserData';
import { auth } from 'src/services/Authentication/firebase';

export const Profile = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [emptyFields, setEmptyFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const { postUserData } = usePostUserData();

  useEffect(() => {
    const storedEmptyFields = localStorage.getItem('empty_fields');
    if (storedEmptyFields) {
      const parsedEmptyFields = storedEmptyFields.split(',');
      setEmptyFields(parsedEmptyFields);
      setFormData(
        parsedEmptyFields.reduce((acc, field) => {
          acc[field] = '';
          return acc;
        }, {})
      );
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const isFormValid = () => {
    return Object.values(formData).every(Boolean) && !Object.values(fieldErrors).some(Boolean);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFieldError = (fieldName, error) => {
    setFieldErrors(prevErrors => ({
      ...prevErrors,
      [fieldName]: error,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = {
        ...formData,
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
      };
      const response = await postUserData(userData);
      if (response.empty_fields.length > 0) {
        localStorage.setItem('empty_fields', response.empty_fields);
        window.location.reload();
      } else {
        localStorage.setItem('empty_fields', response.empty_fields);
        localStorage.setItem('roles', userData.roles);
        navigate(localStorage.getItem('preLoginPath') || '/');
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="bg-light py-5 d-flex align-items-center user-select-none">
          <div className="container">
            <div className="card shadow-lg rounded p-4 mx-auto" style={{ maxWidth: '600px' }}>
              <div className="text-center mb-4">
                <h2>Profile</h2>
              </div>
              {emptyFields.length > 0 && (
                <form>
                  {emptyFields.map((field, index) => (
                    <InputField
                      key={index}
                      name={field}
                      label={field.replace(/_/g, ' ')}
                      placeholder={field.replace(/_/g, ' ')}
                      type="text"
                      value={formData[field]}
                      onChange={e => handleChange(field, e.target.value)}
                      setError={error => handleFieldError(field, error)}
                    />
                  ))}
                  <div className="form-group py-3 text-center">
                    <button
                      type="submit"
                      className="btn btn-warning shadow w-auto"
                      onClick={handleSubmit}
                      disabled={!isFormValid() || loading}
                    >
                      {loading ? 'Loading...' : 'Submit'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
