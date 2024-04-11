import React, { useState } from 'react';
import InputField from './InputField';
import Toast from './Toast';
import { useApi } from '../../hooks/useApi';
import Button from '../atoms/Button/Button';
import { useSubmitPartTimer } from '../../react-query/useSubmitPartTimer';
import { auth } from 'src/services/Authentication/firebase';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../../services/store/globalStore';

export const PartTimerRegistrationForm = () => {
  const { loading, callApi } = useApi();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    current_occupation: '',
    year_of_study: '',
    referred_by: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: '' });

  const { mutate, isLoading, isError, error } = useSubmitPartTimer();
  const setParttimer_consent = useAuthStore((state) => state.setParttimer_consent);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFieldError = (fieldName, error) => {
    setFieldErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const isFormValid = () => {
    // Check if all required fields are filled and not just whitespace
    const requiredFieldsFilled =
      formData.first_name.trim() !== '' &&
      formData.last_name.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.phone.trim() !== '' &&
      formData.current_occupation !== null && // Add a check for null here
      formData.current_occupation.trim() !== '';

    // Additional check for 'year_of_study' if 'current_occupation' is 'student'
    const isStudent = formData.current_occupation === 'student';
    const studentFieldsValid = !isStudent || (isStudent && formData.year_of_study.trim() !== '');

    // Check if there are no field errors
    const noFieldErrors = Object.keys(fieldErrors).every(
      key => !fieldErrors[key]
    );

    // Form is valid if all conditions are true
    return requiredFieldsFilled && studentFieldsValid && noFieldErrors && !loading;
  };




  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;
    formData.user_id = auth.currentUser.uid;
    formData.answered_questions = true;
    mutate(formData, {
      onSuccess: () => {
        // Handle success
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          current_occupation: '',
          year_of_study: '',
          referred_by: '',
        });
        setToast({ show: true, message: 'Data successfully submitted!' });
        setParttimer_consent(true);
      },
      onError: (error) => {
        setToast({ show: true, message: 'Something went wrong!' });
      },
    });
  };

  // Render the form fields based on the current occupation
  const renderOccupationSpecificFields = () => {
    if (formData.current_occupation === 'student') {
      return (
        <>
          <InputField
            name="year_of_study"
            label="Year of Study"
            placeholder="Year of Study"
            type="text"
            value={formData.year_of_study}
            onChange={(e) => handleChange('year_of_study', e.target.value)}
            setError={(error) => handleFieldError('year_of_study', error)}
          />
          <InputField
            name="course_name"
            label="Course Name"
            placeholder="Course Name"
            type="text"
            value={formData.course_name}
            onChange={(e) => handleChange('course_name', e.target.value)}
            setError={(error) => handleFieldError('course_name', error)}
          />
        </>
      );
    }
    return null;
  };

  return (
    <div className="py-3">
      <form onSubmit={handleSubmit}>
        <h1 className="h3 mb-3 fw-normal">Part Timer Registration Form</h1>

        <InputField
          name="first_name"
          label="First Name"
          placeholder="First Name"
          type="text"
          value={formData.first_name}
          onChange={(e) => handleChange('first_name', e.target.value)}
          setError={(error) => handleFieldError('first_name', error)}
        />

        <InputField
          name="last_name"
          label="Last Name"
          placeholder="Last Name"
          type="text"
          value={formData.last_name}
          onChange={(e) => handleChange('last_name', e.target.value)}
          setError={(error) => handleFieldError('last_name', error)}
        />

        <InputField
          name="email"
          label="Email"
          placeholder="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          setError={(error) => handleFieldError('email', error)}
        />

        <InputField
          name="phone"
          label="Phone"
          placeholder="Phone Number"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          setError={(error) => handleFieldError('phone', error)}
        />

        <InputField
          name="current_occupation"
          label="Current Occupation"
          placeholder="Current Occupation"
          type="text"
          value={formData.current_occupation}
          onChange={(e) => handleChange('current_occupation', e.target.value)}
          setError={(error) => handleFieldError('current_occupation', error)}
        />

        {renderOccupationSpecificFields()}

        <InputField
          name="referred_by"
          label="Referred By"
          placeholder="Referrer Name"
          type="text"
          value={formData.referred_by}
          onChange={(e) => handleChange('referred_by', e.target.value)}
          setError={(error) => handleFieldError('referred_by', error)}
        />

        <button className="w-100 btn btn-lg btn-primary" type="submit" disabled={!isFormValid()} >Submit</button>
      </form>
    </div>
  );
};

export default PartTimerRegistrationForm;
