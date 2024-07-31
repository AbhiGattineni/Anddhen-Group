import React, { useState } from 'react';
import Toast from '../../organisms/Toast';
import InputField from '../../organisms/InputField';

export const AddColleges = () => {
  const [formData, setFormData] = useState({
    college_name: '',
    website_link: '',
    international_UG_link: '',
    international_graduation_link: '',
    application_UG_link: '',
    application_graduation_link: '',
    application_UG_fee: 0,
    application_UG_fee_link: '',
    application_graduation_fee: 0,
    application_graduation_fee_link: '',
    gre_score: '',
    gre_score_link: '',
    toefl_UG_score: '',
    toefl_UG_score_link: '',
    toefl_graduation_score: '',
    toefl_graduation_score_link: '',
    ielts_ug_score: '',
    ielts_ug_score_link: '',
    ielts_graduation_score: '',
    ielts_graduation_score_link: '',
    fall_deadline_UG: '',
    fall_deadline_UG_link: '',
    fall_deadline_graduation: '',
    fall_deadline_graduation_link: '',
    spring_deadline_UG: '',
    spring_deadline_UG_link: '',
    spring_deadline_graduation: '',
    spring_deadline_graduation_link: '',
    college_email: '',
    college_email_link: '',
    college_phone: '',
    college_phone_link: '',
    international_person_email: '',
    international_person_email_link: '',
    public_private: '',
    UG_courses: '',
    UG_courses_link: '',
    graduation_courses: '',
    graduation_courses_link: '',
  });
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: '' });
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleChange = (field, value) => {
    setFormData((prevFormData) => ({ ...prevFormData, [field]: value }));
  };

  const handleFieldError = (fieldName, error) => {
    setFieldErrors((prevErrors) => ({ ...prevErrors, [fieldName]: error }));
  };

  const isFormValid = () => {
    return (
      Object.values(formData).every(Boolean) &&
      !Object.values(fieldErrors).some(Boolean)
    );
  };
  console.log(fieldErrors);
  const handleSubmit = (event) => {
    event.preventDefault();

    const jsonPayload = JSON.stringify(formData);
    console.log(jsonPayload);

    fetch(`${API_BASE_URL}/colleges/create/`, {
      method: 'POST',
      body: jsonPayload,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            setToast({
              show: true,
              message: `check the ${Object.keys(err)[0]} field`,
            });
            setTimeout(() => setToast({ show: false, message: '' }), 3000);
            throw new Error('Server error');
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log('Success:', data);
        setFormData({
          college_name: '',
          website_link: '',
          international_UG_link: '',
          international_graduation_link: '',
          application_UG_link: '',
          application_graduation_link: '',
          application_UG_fee: 0,
          application_UG_fee_link: '',
          application_graduation_fee: 0,
          application_graduation_fee_link: '',
          gre_score: '',
          gre_score_link: '',
          toefl_UG_score: '',
          toefl_UG_score_link: '',
          toefl_graduation_score: '',
          toefl_graduation_score_link: '',
          ielts_ug_score: '',
          ielts_ug_score_link: '',
          ielts_graduation_score: '',
          ielts_graduation_score_link: '',
          fall_deadline_UG: '',
          fall_deadline_UG_link: '',
          fall_deadline_graduation: '',
          fall_deadline_graduation_link: '',
          spring_deadline_UG: '',
          spring_deadline_UG_link: '',
          spring_deadline_graduation: '',
          spring_deadline_graduation_link: '',
          college_email: '',
          college_email_link: '',
          college_phone: '',
          college_phone_link: '',
          international_person_email: '',
          international_person_email_link: '',
          public_private: '',
          UG_courses: '',
          UG_courses_link: '',
          graduation_courses: '',
          graduation_courses_link: '',
        });
        setFieldErrors({});
        setToast({ show: true, message: 'Data successfully submitted!' });
        setTimeout(() => setToast({ show: false, message: '' }), 3000);
      })
      .catch((error) => {
        console.error('Error:', error.message);
        setToast({ show: true, message: 'Something went wrong!' });
        setTimeout(() => setToast({ show: false, message: '' }), 3000);
      });
  };
  return (
    <div className="container mt-2">
      <h1 className="main-heading">Add colleges</h1>
      <div className="underline"></div>
      <div className="">
        <form onSubmit={handleSubmit} className="">
          <h5>Basic Information</h5>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 gy-2 gx-4 mb-3">
            <InputField
              className="col"
              name="college_name"
              label="College Name"
              placeholder="College Name"
              type="text"
              value={formData.college_name}
              onChange={(e) => handleChange('college_name', e.target.value)}
              setError={(error) => handleFieldError('college_name', error)}
            />
            <InputField
              className="col"
              name="website_link"
              label="Website Link"
              placeholder="Website Link"
              type="url"
              value={formData.website_link}
              onChange={(e) => handleChange('website_link', e.target.value)}
              setError={(error) => handleFieldError('website_link', error)}
            />
          </div>
          <h5>International Links</h5>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 gy-2 gx-4 mb-3">
            <InputField
              className="col"
              name="international_UG_link"
              label="International UG Link"
              placeholder="International UG Link"
              type="url"
              value={formData.international_UG_link}
              onChange={(e) =>
                handleChange('international_UG_link', e.target.value)
              }
              setError={(error) =>
                handleFieldError('international_UG_link', error)
              }
            />
            <InputField
              className="col"
              name="international_graduation_link"
              label="International Graduation Link"
              placeholder="International Graduation Link"
              type="url"
              value={formData.international_graduation_link}
              onChange={(e) =>
                handleChange('international_graduation_link', e.target.value)
              }
              setError={(error) =>
                handleFieldError('international_graduation_link', error)
              }
            />
          </div>
          <h5>Application Links and Fees</h5>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 gy-2 gx-4 mb-3">
            <InputField
              className="col"
              name="application_UG_link"
              label="Application UG Link"
              placeholder="Application UG Link"
              type="url"
              value={formData.application_UG_link}
              onChange={(e) =>
                handleChange('application_UG_link', e.target.value)
              }
              setError={(error) =>
                handleFieldError('application_UG_link', error)
              }
            />
            <InputField
              className="col"
              name="application_graduation_link"
              label="Application Graduation Link"
              placeholder="Application Graduation Link"
              type="url"
              value={formData.application_graduation_link}
              onChange={(e) =>
                handleChange('application_graduation_link', e.target.value)
              }
              setError={(error) =>
                handleFieldError('application_graduation_link', error)
              }
            />
            <InputField
              className="col"
              name="application_UG_fee"
              label="Application UG fee"
              placeholder="Application UG fee"
              type="text"
              value={formData.application_UG_fee}
              onChange={(e) =>
                handleChange('application_UG_fee', e.target.value)
              }
              setError={(error) =>
                handleFieldError('application_UG_fee', error)
              }
            />
            <InputField
              className="col"
              name="application_UG_fee_link"
              label="Application UG fee link"
              placeholder="Application UG fee link"
              type="url"
              value={formData.application_UG_fee_link}
              onChange={(e) =>
                handleChange('application_UG_fee_link', e.target.value)
              }
              setError={(error) =>
                handleFieldError('application_UG_fee_link', error)
              }
            />
            <InputField
              className="col"
              name="application_graduation_fee"
              label="Application Graduation fee"
              placeholder="Application Graduation fee"
              type="text"
              value={formData.application_graduation_fee}
              onChange={(e) =>
                handleChange('application_graduation_fee', e.target.value)
              }
              setError={(error) =>
                handleFieldError('application_graduation_fee', error)
              }
            />
            <InputField
              className="col"
              name="application_graduation_fee_link"
              label="Application Graduation fee link"
              placeholder="Application Graduation fee link"
              type="url"
              value={formData.application_graduation_fee_link}
              onChange={(e) =>
                handleChange('application_graduation_fee_link', e.target.value)
              }
              setError={(error) =>
                handleFieldError('application_graduation_fee_link', error)
              }
            />
          </div>
          <h5>Test Scores</h5>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 gy-2 gx-4 mb-3">
            <InputField
              className="col"
              name="gre_score"
              label="GRE Score"
              placeholder="GRE Score"
              type="text"
              value={formData.gre_score}
              onChange={(e) => handleChange('gre_score', e.target.value)}
              setError={(error) => handleFieldError('gre_score', error)}
            />
            <InputField
              className="col"
              name="gre_score_link"
              label="GRE Score Link"
              placeholder="GRE Score Link"
              type="url"
              value={formData.gre_score_link}
              onChange={(e) => handleChange('gre_score_link', e.target.value)}
              setError={(error) => handleFieldError('gre_score_link', error)}
            />
            <InputField
              className="url"
              name="toefl_UG_score"
              label="Toefl UG Score"
              placeholder="Toefl UG Score"
              type="text"
              value={formData.toefl_UG_score}
              onChange={(e) => handleChange('toefl_UG_score', e.target.value)}
              setError={(error) => handleFieldError('toefl_UG_score', error)}
            />
            <InputField
              className="col"
              name="toefl_UG_score_link"
              label="Toefl UG Score Link"
              placeholder="Toefl UG Score Link"
              type="url"
              value={formData.toefl_UG_score_link}
              onChange={(e) =>
                handleChange('toefl_UG_score_link', e.target.value)
              }
              setError={(error) =>
                handleFieldError('toefl_UG_score_link', error)
              }
            />
            <InputField
              className="col"
              name="toefl_graduation_score"
              label="Toefl Graduation Score"
              placeholder="Toefl Graduation Score"
              type="text"
              value={formData.toefl_graduation_score}
              onChange={(e) =>
                handleChange('toefl_graduation_score', e.target.value)
              }
              setError={(error) =>
                handleFieldError('toefl_graduation_score', error)
              }
            />
            <InputField
              className="col"
              name="toefl_graduation_score_link"
              label="Toefl Graduation Score Link"
              placeholder="Toefl Graduation Score Link"
              type="url"
              value={formData.toefl_graduation_score_link}
              onChange={(e) =>
                handleChange('toefl_graduation_score_link', e.target.value)
              }
              setError={(error) =>
                handleFieldError('toefl_graduation_score_link', error)
              }
            />
            <InputField
              className="col"
              name="ielts_ug_score"
              label="IELTS UG score"
              placeholder="IELTS UG score"
              type="text"
              value={formData.ielts_ug_score}
              onChange={(e) => handleChange('ielts_ug_score', e.target.value)}
              setError={(error) => handleFieldError('ielts_ug_score', error)}
            />
            <InputField
              className="col"
              name="ielts_ug_score_link"
              label="IELTS UG score Link"
              placeholder="IELTS UG score Link"
              type="url"
              value={formData.ielts_ug_score_link}
              onChange={(e) =>
                handleChange('ielts_ug_score_link', e.target.value)
              }
              setError={(error) =>
                handleFieldError('ielts_ug_score_link', error)
              }
            />
            <InputField
              className="col"
              name="ielts_graduation_score"
              label="IELTS graduation score"
              placeholder="IELTS graduation score"
              type="text"
              value={formData.ielts_graduation_score}
              onChange={(e) =>
                handleChange('ielts_graduation_score', e.target.value)
              }
              setError={(error) =>
                handleFieldError('ielts_graduation_score', error)
              }
            />
            <InputField
              className="col"
              name="ielts_graduation_score_link"
              label="IELTS graduation score link"
              placeholder="IELTS graduation score link"
              type="url"
              value={formData.ielts_graduation_score_link}
              onChange={(e) =>
                handleChange('ielts_graduation_score_link', e.target.value)
              }
              setError={(error) =>
                handleFieldError('ielts_graduation_score_link', error)
              }
            />
          </div>
          <h5>Deadlines</h5>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 gy-2 gx-4 mb-3">
            <InputField
              className="col"
              name="fall_deadline_UG"
              label="Fall Deadline UG"
              type="date"
              value={formData.fall_deadline_UG}
              onChange={(e) => handleChange('fall_deadline_UG', e.target.value)}
              setError={(error) => handleFieldError('fall_deadline_UG', error)}
            />
            <InputField
              className="col"
              name="fall_deadline_UG_link"
              label="Fall Deadline UG Link"
              type="url"
              value={formData.fall_deadline_UG_link}
              onChange={(e) =>
                handleChange('fall_deadline_UG_link', e.target.value)
              }
              setError={(error) =>
                handleFieldError('fall_deadline_UG_link', error)
              }
            />
            <InputField
              className="col"
              name="fall_deadline_graduation"
              label="Fall Deadline Graduation"
              type="date"
              value={formData.fall_deadline_graduation}
              onChange={(e) =>
                handleChange('fall_deadline_graduation', e.target.value)
              }
              setError={(error) =>
                handleFieldError('fall_deadline_graduation', error)
              }
            />
            <InputField
              className="col"
              name="fall_deadline_graduation_link"
              label="Fall Deadline Graduation Link"
              type="url"
              value={formData.fall_deadline_graduation_link}
              onChange={(e) =>
                handleChange('fall_deadline_graduation_link', e.target.value)
              }
              setError={(error) =>
                handleFieldError('fall_deadline_graduation_link', error)
              }
            />
            <InputField
              className="col"
              name="spring_deadline_UG"
              label="Spring Deadline UG"
              type="date"
              value={formData.spring_deadline_UG}
              onChange={(e) =>
                handleChange('spring_deadline_UG', e.target.value)
              }
              setError={(error) =>
                handleFieldError('spring_deadline_UG', error)
              }
            />
            <InputField
              className="col"
              name="spring_deadline_UG_link"
              label="Spring Deadline UG Link"
              type="url"
              value={formData.spring_deadline_UG_link}
              onChange={(e) =>
                handleChange('spring_deadline_UG_link', e.target.value)
              }
              setError={(error) =>
                handleFieldError('spring_deadline_UG_link', error)
              }
            />
            <InputField
              className="col"
              name="spring_deadline_graduation"
              label="Spring Deadline Graduation"
              type="date"
              value={formData.spring_deadline_graduation}
              onChange={(e) =>
                handleChange('spring_deadline_graduation', e.target.value)
              }
              setError={(error) =>
                handleFieldError('spring_deadline_graduation', error)
              }
            />
            <InputField
              className="col"
              name="spring_deadline_graduation_link"
              label="Spring Deadline Graduation Link"
              type="url"
              value={formData.spring_deadline_graduation_link}
              onChange={(e) =>
                handleChange('spring_deadline_graduation_link', e.target.value)
              }
              setError={(error) =>
                handleFieldError('spring_deadline_graduation_link', error)
              }
            />
          </div>
          <h5>Contact Information</h5>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 gy-2 gx-4 mb-3">
            <InputField
              className="col"
              name="college_email"
              label="College Email"
              placeholder="College Email"
              type="email"
              value={formData.college_email}
              onChange={(e) => handleChange('college_email', e.target.value)}
              setError={(error) => handleFieldError('college_email', error)}
            />
            <InputField
              className="col"
              name="college_email_link"
              label="College Email Link"
              placeholder="College Email Link"
              type="url"
              value={formData.college_email_link}
              onChange={(e) =>
                handleChange('college_email_link', e.target.value)
              }
              setError={(error) =>
                handleFieldError('college_email_link', error)
              }
            />
            <InputField
              className="col"
              name="college_phone"
              label="College phone"
              placeholder="College phone"
              type="tel"
              value={formData.college_phone}
              onChange={(e) => handleChange('college_phone', e.target.value)}
              setError={(error) => handleFieldError('college_phone', error)}
            />
            <InputField
              className="col"
              name="college_phone_link"
              label="College phone link"
              placeholder="College phone link"
              type="url"
              value={formData.college_phone_link}
              onChange={(e) =>
                handleChange('college_phone_link', e.target.value)
              }
              setError={(error) =>
                handleFieldError('college_phone_link', error)
              }
            />
            <InputField
              className="col"
              name="international_person_email"
              label="International Person Email"
              placeholder="International Person Email"
              type="email"
              value={formData.international_person_email}
              onChange={(e) =>
                handleChange('international_person_email', e.target.value)
              }
              setError={(error) =>
                handleFieldError('international_person_email', error)
              }
            />
            <InputField
              className="col"
              name="international_person_email_link"
              label="International Person Email Link"
              placeholder="International Person Email Link"
              type="url"
              value={formData.international_person_email_link}
              onChange={(e) =>
                handleChange('international_person_email_link', e.target.value)
              }
              setError={(error) =>
                handleFieldError('international_person_email_link', error)
              }
            />
            <InputField
              className="col"
              name="public_private"
              label="Public/Private"
              placeholder="Public/Private"
              type="text"
              value={formData.public_private}
              onChange={(e) => handleChange('public_private', e.target.value)}
              setError={(error) => handleFieldError('public_private', error)}
            />
          </div>
          <h5>Courses</h5>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 gy-2 gx-4 mb-3">
            <InputField
              className="col"
              name="UG_courses"
              label="UG courses"
              placeholder="UG courses"
              type="text"
              value={formData.UG_courses}
              onChange={(e) => handleChange('UG_courses', e.target.value)}
              setError={(error) => handleFieldError('UG_courses', error)}
            />
            <InputField
              className="col"
              name="UG_courses_link"
              label="UG courses link"
              placeholder="UG courses link"
              type="url"
              value={formData.UG_courses_link}
              onChange={(e) => handleChange('UG_courses_link', e.target.value)}
              setError={(error) => handleFieldError('UG_courses_link', error)}
            />
            <InputField
              className="col"
              name="graduation_courses"
              label="Graduation courses"
              placeholder="Graduation courses"
              type="text"
              value={formData.graduation_courses}
              onChange={(e) =>
                handleChange('graduation_courses', e.target.value)
              }
              setError={(error) =>
                handleFieldError('graduation_courses', error)
              }
            />
            <InputField
              className="col"
              name="graduation_courses_link"
              label="Graduation courses link"
              placeholder="Graduation courses link"
              type="url"
              value={formData.graduation_courses_link}
              onChange={(e) =>
                handleChange('graduation_courses_link', e.target.value)
              }
              setError={(error) =>
                handleFieldError('graduation_courses_link', error)
              }
            />
          </div>
          <div className="form-group py-3 text-center">
            <button
              type="submit"
              className="btn btn-warning shadow w-auto"
              disabled={!isFormValid()}
            >
              {loading ? 'Loading...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
      <Toast
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ show: false, message: '' })}
      />
    </div>
  );
};
