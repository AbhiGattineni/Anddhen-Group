import React, { useEffect, useState } from 'react';
import InputField from './InputField';
import Toast from '../organisms/Toast';
import { sendEmail } from '../templates/emailService';

export const PartTimerRegistrationForm = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    current_occupation: '',
    studyYear: '',
    course_name: '',
    reference: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [loading] = useState(false);
  const [disableButton, setDisableButton] = useState(true);

  useEffect(() => {
    // Check if all required fields are filled
    const allFieldsFilled = Object.entries(formData).every(([key, value]) => {
      // If current occupation is student, make sure studyYear and course_name are filled
      if (formData.current_occupation.toLowerCase() !== 'student') {
        if (key === 'studyYear' || key === 'course_name') {
          return true;
        }
      }
      // For other occupations, check all fields
      return !!value;
    });
    // Check for field errors
    const hasErrors = Object.values(fieldErrors).some((error) => error);
    // Update disableButton state
    setDisableButton(!allFieldsFilled || hasErrors);
  }, [formData, fieldErrors]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFieldError = (fieldName, error) => {
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: error,
    }));
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      current_occupation: '',
      studyYear: '',
      course_name: '',
      reference: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      sendEmail('parttimer', {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        current_occupation: formData.current_occupation,
        studyYear: formData.studyYear,
        course_name: formData.course_name,
        reference: formData.reference,
      });
      resetForm();
      // setParttimer_consent(true);
      setToastMsg('Data successfully submitted!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      setToastMsg('Something went wrong!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      console.error('Error:', error);
    }
  };

  // Render the form fields based on the current occupation
  const renderOccupationSpecificFields = () => {
    if (formData.current_occupation.toLowerCase() === 'student') {
      return (
        <>
          <InputField
            name="studyYear"
            label="Year of Study"
            placeholder="Year of Study"
            type="text"
            value={formData.studyYear}
            onChange={(e) => handleChange('studyYear', e.target.value)}
            setError={(error) => handleFieldError('studyYear', error)}
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
        <div className="col-md-12 mb-4 text-center">
          <h3 className="main-heading">Part Timer Registration Form</h3>
          <div className="underline mx-auto"></div>
        </div>
        {/* <h1 className="h3 mb-3 fw-normal"></h1> */}

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
          name="reference"
          label="Referred By"
          placeholder="Referrer Name"
          type="text"
          value={formData.reference}
          onChange={(e) => handleChange('reference', e.target.value)}
          setError={(error) => handleFieldError('reference', error)}
        />

        <div className="form-group py-3 w-100 d-flex justify-content-center">
          <button
            type="submit"
            className="btn btn-warning shadow px-5"
            disabled={disableButton}
          >
            {loading ? 'loading...' : 'Submit'}
          </button>
        </div>
      </form>
      <Toast
        show={showToast}
        message={toastMsg}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default PartTimerRegistrationForm;
