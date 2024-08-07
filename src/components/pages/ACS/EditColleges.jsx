import React, { useEffect, useState } from 'react';
import Toast from '../../organisms/Toast';
import InputField from '../../organisms/InputField';
import { Search } from '../../organisms/Search';
import { useNavigate } from 'react-router-dom';

export const EditColleges = () => {
  const [loading, setLoading] = useState(false);
  const [collegesData, setCollegesData] = useState([]);
  const [collegeData, setCollegeData] = useState([]);
  const [editField, setEditField] = useState('');
  const [selectedCollege, setSelectedCollege] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: '' });
  const [showButton] = useState(true);
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
    fetchColleges();
  }, []);
  useEffect(() => {
    if (Object.keys(selectedCollege).length) {
      fetchCollege();
    }
  }, [selectedCollege]);

  const fetchColleges = () => {
    setLoading(true);

    fetch(`${API_BASE_URL}/colleges/all/`)
      .then((response) => response.json())
      .then((data) => {
        data.forEach((element) => {
          setCollegesData((college) => [
            {
              value: element.id,
              label: element.college_name,
            },
            ...college,
          ]);
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error.message);
        setToast({ show: true, message: 'Something went wrong!' });
        setTimeout(() => setToast({ show: false, message: '' }), 3000);
        setLoading(false);
      });
  };
  const fetchCollege = () => {
    setLoading(true);

    fetch(`${API_BASE_URL}/colleges/${selectedCollege.value}/`)
      .then((response) => response.json())
      .then((data) => {
        setCollegeData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error.message);
        setToast({ show: true, message: 'Something went wrong!' });
        setTimeout(() => setToast({ show: false, message: '' }), 3000);
        setLoading(false);
      });
  };

  const handleChange = (field, value) => {
    setCollegeData((prevFormData) => ({ ...prevFormData, [field]: value }));
  };

  const handleFieldError = (fieldName, error) => {
    setFieldErrors((prevErrors) => ({ ...prevErrors, [fieldName]: error }));
  };

  const isFormValid = () => {
    return (
      Object.keys(collegeData).length > 0 &&
      Object.values(collegeData).every(Boolean) &&
      !Object.values(fieldErrors).some(Boolean)
    );
  };

  const handleUpdate = (event) => {
    event.preventDefault();

    const jsonPayload = JSON.stringify(collegeData);

    fetch(`${API_BASE_URL}/colleges/${selectedCollege.value}/update/`, {
      method: 'PUT',
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
              message: `Check the ${Object.keys(err)[0]} field`,
            });
            setTimeout(() => setToast({ show: false, message: '' }), 3000);
            throw new Error('Server error');
          });
        }
        return response.json();
      })
      .then((data) => {
        setToast({ show: true, message: 'College successfully updated!' });
        setTimeout(() => {
          setToast({ show: false, message: '' });
          navigate('/acs');
        }, 3000);
        setCollegeData([]);
        setCollegesData([]);
        setSelectedCollege({});
        setEditField({});
      })
      .catch((error) => {
        console.error('Error:', error.message);
        setToast({ show: true, message: 'Something went wrong!' });
        setTimeout(() => setToast({ show: false, message: '' }), 3000);
      });
  };
  const handleDelete = () => {
    fetch(`${API_BASE_URL}/colleges/${selectedCollege.value}/delete/`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Server error');
        }

        // Check if the status is 204 No Content
        if (response.status === 204) {
          // No need to parse JSON, as there's no content
          return null;
        }

        return response.json();
      })
      .then((data) => {
        setSelectedCollege({});
        setCollegeData([]);
        setCollegesData([]);
        setEditField({});
        setToast({ show: true, message: 'College successfully deleted!' });
        setTimeout(() => {
          setToast({ show: false, message: '' });
          navigate('/acs');
        }, 3000);
      })
      .catch((error) => {
        console.error('Error:', error.message);
        setToast({ show: true, message: 'Something went wrong!' });
        setTimeout(() => setToast({ show: false, message: '' }), 3000);
      });
  };

  return (
    <div className="container mt-2">
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: '90vh' }}
        >
          <div className="spinner-border" role="status">
            <span className="visually-hidden"></span>
          </div>
        </div>
      ) : (
        <>
          <h1 className="main-heading">Edit colleges</h1>
          <div className="underline"></div>
          <h6>select college to edit</h6>
          <Search
            selectedOption={selectedCollege}
            setSelectedOption={setSelectedCollege}
            placeholder={'select college to edit'}
            options={collegesData}
            isMulti={false}
          />
          {Object.keys(selectedCollege).length !== 0 && (
            <div className="mt-2">
              <button
                type="button"
                className="btn btn-danger shadow w-auto"
                onClick={handleDelete}
              >
                Delete
              </button>
              <form className="">
                <h5>Basic Information</h5>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 gy-2 gx-4 mb-3">
                  <div className="d-flex gap-2 align-items-start">
                    <InputField
                      className="col"
                      disabled={editField !== 'college_name'}
                      name="college_name"
                      label="College Name"
                      placeholder="College Name"
                      type="text"
                      value={collegeData.college_name}
                      onChange={(e) =>
                        handleChange('college_name', e.target.value)
                      }
                      setError={(error) =>
                        handleFieldError('college_name', error)
                      }
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditField('college_name');
                      }}
                      className="border-0 bg-primary rounded text-white"
                      style={{ height: '40px', marginTop: '25px' }}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </div>
                  <div className="d-flex gap-2 align-items-start">
                    <InputField
                      className="col"
                      disabled={editField !== 'website_link'}
                      name="website_link"
                      label="Website Link"
                      placeholder="Website Link"
                      type="url"
                      value={collegeData.website_link}
                      onChange={(e) =>
                        handleChange('website_link', e.target.value)
                      }
                      setError={(error) =>
                        handleFieldError('website_link', error)
                      }
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditField('website_link');
                      }}
                      className="border-0 bg-primary rounded text-white"
                      style={{ height: '40px', marginTop: '25px' }}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </div>
                </div>
                <h5>International Links</h5>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 gy-2 gx-4 mb-3">
                  <div className="d-flex gap-2 align-items-start">
                    <InputField
                      className="col"
                      disabled={editField !== 'international_UG_link'}
                      name="international_UG_link"
                      label="International UG Link"
                      placeholder="International UG Link"
                      type="url"
                      value={collegeData.international_UG_link}
                      onChange={(e) =>
                        handleChange('international_UG_link', e.target.value)
                      }
                      setError={(error) =>
                        handleFieldError('international_UG_link', error)
                      }
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditField('international_UG_link');
                      }}
                      className="border-0 bg-primary rounded text-white"
                      style={{ height: '40px', marginTop: '25px' }}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </div>
                  <div className="d-flex gap-2 align-items-start">
                    <InputField
                      className="col"
                      disabled={editField !== 'international_graduation_link'}
                      name="international_graduation_link"
                      label="International Graduation Link"
                      placeholder="International Graduation Link"
                      type="url"
                      value={collegeData.international_graduation_link}
                      onChange={(e) =>
                        handleChange(
                          'international_graduation_link',
                          e.target.value
                        )
                      }
                      setError={(error) =>
                        handleFieldError('international_graduation_link', error)
                      }
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditField('international_graduation_link');
                      }}
                      className="border-0 bg-primary rounded text-white"
                      style={{ height: '40px', marginTop: '25px' }}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </div>
                </div>
                <h5>Application Links and Fees</h5>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 gy-2 gx-4 mb-3">
                  <div className="d-flex gap-2 align-items-start">
                    <InputField
                      className="col"
                      disabled={editField !== 'application_UG_link'}
                      name="application_UG_link"
                      label="Application UG Link"
                      placeholder="Application UG Link"
                      type="url"
                      value={collegeData.application_UG_link}
                      onChange={(e) =>
                        handleChange('application_UG_link', e.target.value)
                      }
                      setError={(error) =>
                        handleFieldError('application_UG_link', error)
                      }
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditField('application_UG_link');
                      }}
                      className="border-0 bg-primary rounded text-white"
                      style={{ height: '40px', marginTop: '25px' }}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </div>
                  <div className="d-flex gap-2 align-items-start">
                    <InputField
                      className="col"
                      disabled={editField !== 'application_graduation_link'}
                      name="application_graduation_link"
                      label="Application Graduation Link"
                      placeholder="Application Graduation Link"
                      type="url"
                      value={collegeData.application_graduation_link}
                      onChange={(e) =>
                        handleChange(
                          'application_graduation_link',
                          e.target.value
                        )
                      }
                      setError={(error) =>
                        handleFieldError('application_graduation_link', error)
                      }
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditField('application_graduation_link');
                      }}
                      className="border-0 bg-primary rounded text-white"
                      style={{ height: '40px', marginTop: '25px' }}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </div>
                  <div className="d-flex gap-2 align-items-start">
                    <InputField
                      className="col"
                      disabled={editField !== 'application_UG_fee'}
                      name="application_UG_fee"
                      label="Application UG fee"
                      placeholder="Application UG fee"
                      type="text"
                      value={collegeData.application_UG_fee}
                      onChange={(e) =>
                        handleChange('application_UG_fee', e.target.value)
                      }
                      setError={(error) =>
                        handleFieldError('application_UG_fee', error)
                      }
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditField('application_UG_fee');
                      }}
                      className="border-0 bg-primary rounded text-white"
                      style={{ height: '40px', marginTop: '25px' }}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </div>
                  <div className="d-flex gap-2 align-items-start">
                    <InputField
                      className="col"
                      disabled={editField !== 'application_UG_fee_link'}
                      name="application_UG_fee_link"
                      label="Application UG fee link"
                      placeholder="Application UG fee link"
                      type="url"
                      value={collegeData.application_UG_fee_link}
                      onChange={(e) =>
                        handleChange('application_UG_fee_link', e.target.value)
                      }
                      setError={(error) =>
                        handleFieldError('application_UG_fee_link', error)
                      }
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditField('application_UG_fee_link');
                      }}
                      className="border-0 bg-primary rounded text-white"
                      style={{ height: '40px', marginTop: '25px' }}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </div>
                  <div className="d-flex gap-2 align-items-start">
                    <InputField
                      className="col"
                      disabled={editField !== 'application_graduation_fee'}
                      name="application_graduation_fee"
                      label="Application Graduation fee"
                      placeholder="Application Graduation fee"
                      type="text"
                      value={collegeData.application_graduation_fee}
                      onChange={(e) =>
                        handleChange(
                          'application_graduation_fee',
                          e.target.value
                        )
                      }
                      setError={(error) =>
                        handleFieldError('application_graduation_fee', error)
                      }
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditField('application_graduation_fee');
                      }}
                      className="border-0 bg-primary rounded text-white"
                      style={{ height: '40px', marginTop: '25px' }}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </div>
                  <div className="d-flex gap-2 align-items-start">
                    <InputField
                      className="col"
                      disabled={editField !== 'application_graduation_fee_link'}
                      name="application_graduation_fee_link"
                      label="Application Graduation fee link"
                      placeholder="Application Graduation fee link"
                      type="url"
                      value={collegeData.application_graduation_fee_link}
                      onChange={(e) =>
                        handleChange(
                          'application_graduation_fee_link',
                          e.target.value
                        )
                      }
                      setError={(error) =>
                        handleFieldError(
                          'application_graduation_fee_link',
                          error
                        )
                      }
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditField('application_graduation_fee_link');
                      }}
                      className="border-0 bg-primary rounded text-white"
                      style={{ height: '40px', marginTop: '25px' }}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </div>
                </div>
                <h5>Test Scores</h5>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 gy-2 gx-4 mb-3">
                  <div className="d-flex gap-2 align-items-start">
                    <InputField
                      className="col"
                      disabled={editField !== 'gre_score'}
                      name="gre_score"
                      label="GRE Score"
                      placeholder="GRE Score"
                      type="text"
                      value={collegeData.gre_score}
                      onChange={(e) =>
                        handleChange('gre_score', e.target.value)
                      }
                      setError={(error) => handleFieldError('gre_score', error)}
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditField('gre_score');
                      }}
                      className="border-0 bg-primary rounded text-white"
                      style={{ height: '40px', marginTop: '25px' }}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </div>
                  <div className="d-flex gap-2 align-items-start">
                    <InputField
                      className="col"
                      disabled={editField !== 'gre_score_link'}
                      name="gre_score_link"
                      label="GRE Score Link"
                      placeholder="GRE Score Link"
                      type="url"
                      value={collegeData.gre_score_link}
                      onChange={(e) =>
                        handleChange('gre_score_link', e.target.value)
                      }
                      setError={(error) =>
                        handleFieldError('gre_score_link', error)
                      }
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditField('gre_score_link');
                      }}
                      className="border-0 bg-primary rounded text-white"
                      style={{ height: '40px', marginTop: '25px' }}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </div>
                  <div className="d-flex gap-2 align-items-start">
                    <InputField
                      className="url w-100"
                      disabled={editField !== 'toefl_UG_score'}
                      name="toefl_UG_score"
                      label="Toefl UG Score"
                      placeholder="Toefl UG Score"
                      type="text"
                      value={collegeData.toefl_UG_score}
                      onChange={(e) =>
                        handleChange('toefl_UG_score', e.target.value)
                      }
                      setError={(error) =>
                        handleFieldError('toefl_UG_score', error)
                      }
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditField('toefl_UG_score');
                      }}
                      className="border-0 bg-primary rounded text-white"
                      style={{ height: '40px', marginTop: '25px' }}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </div>
                  <div className="d-flex gap-2 align-items-start">
                    <InputField
                      className="col"
                      disabled={editField !== 'toefl_UG_score_link'}
                      name="toefl_UG_score_link"
                      label="Toefl UG Score Link"
                      placeholder="Toefl UG Score Link"
                      type="url"
                      value={collegeData.toefl_UG_score_link}
                      onChange={(e) =>
                        handleChange('toefl_UG_score_link', e.target.value)
                      }
                      setError={(error) =>
                        handleFieldError('toefl_UG_score_link', error)
                      }
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditField('toefl_UG_score_link');
                      }}
                      className="border-0 bg-primary rounded text-white"
                      style={{ height: '40px', marginTop: '25px' }}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </div>
                  <div className="d-flex gap-2 align-items-start">
                    <InputField
                      className="col"
                      disabled={editField !== 'toefl_UG_score_link'}
                      name="toefl_graduation_score"
                      label="Toefl Graduation Score"
                      placeholder="Toefl Graduation Score"
                      type="text"
                      value={collegeData.toefl_graduation_score}
                      onChange={(e) =>
                        handleChange('toefl_graduation_score', e.target.value)
                      }
                      setError={(error) =>
                        handleFieldError('toefl_graduation_score', error)
                      }
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditField('toefl_UG_score_link');
                      }}
                      className="border-0 bg-primary rounded text-white"
                      style={{ height: '40px', marginTop: '25px' }}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </div>
                  <div className="d-flex gap-2 align-items-start">
                    <InputField
                      className="col"
                      disabled={editField !== 'toefl_graduation_score_link'}
                      name="toefl_graduation_score_link"
                      label="Toefl Graduation Score Link"
                      placeholder="Toefl Graduation Score Link"
                      type="url"
                      value={collegeData.toefl_graduation_score_link}
                      onChange={(e) =>
                        handleChange(
                          'toefl_graduation_score_link',
                          e.target.value
                        )
                      }
                      setError={(error) =>
                        handleFieldError('toefl_graduation_score_link', error)
                      }
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditField('toefl_graduation_score_link');
                      }}
                      className="border-0 bg-primary rounded text-white"
                      style={{ height: '40px', marginTop: '25px' }}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </div>
                  <div className="d-flex gap-2 align-items-start">
                    <InputField
                      className="col"
                      disabled={editField !== 'ielts_ug_score'}
                      name="ielts_ug_score"
                      label="IELTS UG score"
                      placeholder="IELTS UG score"
                      type="text"
                      value={collegeData.ielts_ug_score}
                      onChange={(e) =>
                        handleChange('ielts_ug_score', e.target.value)
                      }
                      setError={(error) =>
                        handleFieldError('ielts_ug_score', error)
                      }
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditField('ielts_ug_score');
                      }}
                      className="border-0 bg-primary rounded text-white"
                      style={{ height: '40px', marginTop: '25px' }}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </div>
                  <div className="d-flex gap-2 align-items-start">
                    <InputField
                      className="col"
                      disabled={editField !== 'ielts_ug_score_link'}
                      name="ielts_ug_score_link"
                      label="IELTS UG score Link"
                      placeholder="IELTS UG score Link"
                      type="url"
                      value={collegeData.ielts_ug_score_link}
                      onChange={(e) =>
                        handleChange('ielts_ug_score_link', e.target.value)
                      }
                      setError={(error) =>
                        handleFieldError('ielts_ug_score_link', error)
                      }
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditField('ielts_ug_score_link');
                      }}
                      className="border-0 bg-primary rounded text-white"
                      style={{ height: '40px', marginTop: '25px' }}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </div>
                  <div className="d-flex gap-2 align-items-start">
                    <InputField
                      className="col"
                      disabled={editField !== 'ielts_graduation_score'}
                      name="ielts_graduation_score"
                      label="IELTS graduation score"
                      placeholder="IELTS graduation score"
                      type="text"
                      value={collegeData.ielts_graduation_score}
                      onChange={(e) =>
                        handleChange('ielts_graduation_score', e.target.value)
                      }
                      setError={(error) =>
                        handleFieldError('ielts_graduation_score', error)
                      }
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditField('ielts_graduation_score');
                      }}
                      className="border-0 bg-primary rounded text-white"
                      style={{ height: '40px', marginTop: '25px' }}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </div>
                  <div className="d-flex gap-2 align-items-start">
                    <InputField
                      className="col"
                      disabled={editField !== 'ielts_graduation_score_link'}
                      name="ielts_graduation_score_link"
                      label="IELTS graduation score link"
                      placeholder="IELTS graduation score link"
                      type="url"
                      value={collegeData.ielts_graduation_score_link}
                      onChange={(e) =>
                        handleChange(
                          'ielts_graduation_score_link',
                          e.target.value
                        )
                      }
                      setError={(error) =>
                        handleFieldError('ielts_graduation_score_link', error)
                      }
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditField('ielts_graduation_score_link');
                      }}
                      className="border-0 bg-primary rounded text-white"
                      style={{ height: '40px', marginTop: '25px' }}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </div>
                </div>
                <h5>Deadlines</h5>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 gy-2 gx-4 mb-3">
                  <div className="d-flex gap-2 align-items-start">
                    <InputField
                      className="col"
                      disabled={editField !== 'fall_deadline_UG'}
                      name="fall_deadline_UG"
                      label="Fall Deadline UG"
                      type="date"
                      value={collegeData.fall_deadline_UG}
                      onChange={(e) =>
                        handleChange('fall_deadline_UG', e.target.value)
                      }
                      setError={(error) =>
                        handleFieldError('fall_deadline_UG', error)
                      }
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditField('fall_deadline_UG');
                      }}
                      className="border-0 bg-primary rounded text-white"
                      style={{ height: '40px', marginTop: '25px' }}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </div>
                  <div className="d-flex gap-2 align-items-start">
                    <InputField
                      className="col"
                      disabled={editField !== 'fall_deadline_UG_link'}
                      name="fall_deadline_UG_link"
                      label="Fall Deadline UG Link"
                      type="url"
                      value={collegeData.fall_deadline_UG_link}
                      onChange={(e) =>
                        handleChange('fall_deadline_UG_link', e.target.value)
                      }
                      setError={(error) =>
                        handleFieldError('fall_deadline_UG_link', error)
                      }
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditField('fall_deadline_UG_link');
                      }}
                      className="border-0 bg-primary rounded text-white"
                      style={{ height: '40px', marginTop: '25px' }}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </div>
                  <div className="d-flex gap-2 align-items-start">
                    <InputField
                      className="col"
                      disabled={editField !== 'fall_deadline_graduation'}
                      name="fall_deadline_graduation"
                      label="Fall Deadline Graduation"
                      type="date"
                      value={collegeData.fall_deadline_graduation}
                      onChange={(e) =>
                        handleChange('fall_deadline_graduation', e.target.value)
                      }
                      setError={(error) =>
                        handleFieldError('fall_deadline_graduation', error)
                      }
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditField('fall_deadline_graduation');
                      }}
                      className="border-0 bg-primary rounded text-white"
                      style={{ height: '40px', marginTop: '25px' }}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </div>
                  <div className="d-flex gap-2 align-items-start">
                    <InputField
                      className="col"
                      disabled={editField !== 'fall_deadline_graduation_link'}
                      name="fall_deadline_graduation_link"
                      label="Fall Deadline Graduation Link"
                      type="url"
                      value={collegeData.fall_deadline_graduation_link}
                      onChange={(e) =>
                        handleChange(
                          'fall_deadline_graduation_link',
                          e.target.value
                        )
                      }
                      setError={(error) =>
                        handleFieldError('fall_deadline_graduation_link', error)
                      }
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditField('fall_deadline_graduation_link');
                      }}
                      className="border-0 bg-primary rounded text-white"
                      style={{ height: '40px', marginTop: '25px' }}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </div>
                  <div className="d-flex gap-2 align-items-start">
                    <InputField
                      className="col"
                      disabled={editField !== 'spring_deadline_UG'}
                      name="spring_deadline_UG"
                      label="Spring Deadline UG"
                      type="date"
                      value={collegeData.spring_deadline_UG}
                      onChange={(e) =>
                        handleChange('spring_deadline_UG', e.target.value)
                      }
                      setError={(error) =>
                        handleFieldError('spring_deadline_UG', error)
                      }
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditField('spring_deadline_UG');
                      }}
                      className="border-0 bg-primary rounded text-white"
                      style={{ height: '40px', marginTop: '25px' }}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </div>
                  <div className="d-flex gap-2 align-items-start">
                    <InputField
                      className="col"
                      disabled={editField !== 'spring_deadline_UG_link'}
                      name="spring_deadline_UG_link"
                      label="Spring Deadline UG Link"
                      type="url"
                      value={collegeData.spring_deadline_UG_link}
                      onChange={(e) =>
                        handleChange('spring_deadline_UG_link', e.target.value)
                      }
                      setError={(error) =>
                        handleFieldError('spring_deadline_UG_link', error)
                      }
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditField('spring_deadline_UG_link');
                      }}
                      className="border-0 bg-primary rounded text-white"
                      style={{ height: '40px', marginTop: '25px' }}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </div>
                  <div className="d-flex gap-2 align-items-start">
                    <InputField
                      className="col"
                      disabled={editField !== 'spring_deadline_graduation'}
                      name="spring_deadline_graduation"
                      label="Spring Deadline Graduation"
                      type="date"
                      value={collegeData.spring_deadline_graduation}
                      onChange={(e) =>
                        handleChange(
                          'spring_deadline_graduation',
                          e.target.value
                        )
                      }
                      setError={(error) =>
                        handleFieldError('spring_deadline_graduation', error)
                      }
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditField('spring_deadline_graduation');
                      }}
                      className="border-0 bg-primary rounded text-white"
                      style={{ height: '40px', marginTop: '25px' }}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </div>
                  <div className="d-flex gap-2 align-items-start">
                    <InputField
                      className="col"
                      disabled={editField !== 'spring_deadline_graduation_link'}
                      name="spring_deadline_graduation_link"
                      label="Spring Deadline Graduation Link"
                      type="url"
                      value={collegeData.spring_deadline_graduation_link}
                      onChange={(e) =>
                        handleChange(
                          'spring_deadline_graduation_link',
                          e.target.value
                        )
                      }
                      setError={(error) =>
                        handleFieldError(
                          'spring_deadline_graduation_link',
                          error
                        )
                      }
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditField('spring_deadline_graduation_link');
                      }}
                      className="border-0 bg-primary rounded text-white"
                      style={{ height: '40px', marginTop: '25px' }}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </div>
                </div>
                <h5>Contact Information</h5>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 gy-2 gx-4 mb-3">
                  <div className="d-flex gap-2 align-items-start">
                    <InputField
                      className="col"
                      disabled={editField !== 'college_email'}
                      name="college_email"
                      label="College Email"
                      placeholder="College Email"
                      type="email"
                      value={collegeData.college_email}
                      onChange={(e) =>
                        handleChange('college_email', e.target.value)
                      }
                      setError={(error) =>
                        handleFieldError('college_email', error)
                      }
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditField('college_email');
                      }}
                      className="border-0 bg-primary rounded text-white"
                      style={{ height: '40px', marginTop: '25px' }}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </div>
                  <div className="d-flex gap-2 align-items-start">
                    <InputField
                      className="col"
                      disabled={editField !== 'college_email_link'}
                      name="college_email_link"
                      label="College Email Link"
                      placeholder="College Email Link"
                      type="url"
                      value={collegeData.college_email_link}
                      onChange={(e) =>
                        handleChange('college_email_link', e.target.value)
                      }
                      setError={(error) =>
                        handleFieldError('college_email_link', error)
                      }
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditField('college_email_link');
                      }}
                      className="border-0 bg-primary rounded text-white"
                      style={{ height: '40px', marginTop: '25px' }}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </div>
                  <div className="d-flex gap-2 align-items-start">
                    <InputField
                      className="col"
                      disabled={editField !== 'college_phone'}
                      name="college_phone"
                      label="College phone"
                      placeholder="College phone"
                      type="tel"
                      value={collegeData.college_phone}
                      onChange={(e) =>
                        handleChange('college_phone', e.target.value)
                      }
                      setError={(error) =>
                        handleFieldError('college_phone', error)
                      }
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditField('college_phone');
                      }}
                      className="border-0 bg-primary rounded text-white"
                      style={{ height: '40px', marginTop: '25px' }}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </div>
                  <div className="d-flex gap-2 align-items-start">
                    <InputField
                      className="col"
                      disabled={editField !== 'college_phone_link'}
                      name="college_phone_link"
                      label="College phone link"
                      placeholder="College phone link"
                      type="url"
                      value={collegeData.college_phone_link}
                      onChange={(e) =>
                        handleChange('college_phone_link', e.target.value)
                      }
                      setError={(error) =>
                        handleFieldError('college_phone_link', error)
                      }
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditField('college_phone_link');
                      }}
                      className="border-0 bg-primary rounded text-white"
                      style={{ height: '40px', marginTop: '25px' }}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </div>
                  <div className="d-flex gap-2 align-items-start">
                    <InputField
                      className="col"
                      disabled={editField !== 'international_person_email'}
                      name="international_person_email"
                      label="International Person Email"
                      placeholder="International Person Email"
                      type="email"
                      value={collegeData.international_person_email}
                      onChange={(e) =>
                        handleChange(
                          'international_person_email',
                          e.target.value
                        )
                      }
                      setError={(error) =>
                        handleFieldError('international_person_email', error)
                      }
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditField('international_person_email');
                      }}
                      className="border-0 bg-primary rounded text-white"
                      style={{ height: '40px', marginTop: '25px' }}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </div>
                  <div className="d-flex gap-2 align-items-start">
                    <InputField
                      className="col"
                      disabled={editField !== 'international_person_email_link'}
                      name="international_person_email_link"
                      label="International Person Email Link"
                      placeholder="International Person Email Link"
                      type="url"
                      value={collegeData.international_person_email_link}
                      onChange={(e) =>
                        handleChange(
                          'international_person_email_link',
                          e.target.value
                        )
                      }
                      setError={(error) =>
                        handleFieldError(
                          'international_person_email_link',
                          error
                        )
                      }
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditField('international_person_email_link');
                      }}
                      className="border-0 bg-primary rounded text-white"
                      style={{ height: '40px', marginTop: '25px' }}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </div>
                  <div className="d-flex gap-2 align-items-start">
                    <InputField
                      className="col"
                      disabled={editField !== 'public_private'}
                      name="public_private"
                      label="Public/Private"
                      placeholder="Public/Private"
                      type="text"
                      value={collegeData.public_private}
                      onChange={(e) =>
                        handleChange('public_private', e.target.value)
                      }
                      setError={(error) =>
                        handleFieldError('public_private', error)
                      }
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditField('public_private');
                      }}
                      className="border-0 bg-primary rounded text-white"
                      style={{ height: '40px', marginTop: '25px' }}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </div>
                </div>
                <h5>Courses</h5>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 gy-2 gx-4 mb-3">
                  <div className="d-flex gap-2 align-items-start">
                    <InputField
                      className="col"
                      disabled={editField !== 'UG_courses'}
                      name="UG_courses"
                      label="UG courses"
                      placeholder="UG courses"
                      type="text"
                      value={collegeData.UG_courses}
                      onChange={(e) =>
                        handleChange('UG_courses', e.target.value)
                      }
                      setError={(error) =>
                        handleFieldError('UG_courses', error)
                      }
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditField('UG_courses');
                      }}
                      className="border-0 bg-primary rounded text-white"
                      style={{ height: '40px', marginTop: '25px' }}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </div>
                  <div className="d-flex gap-2 align-items-start">
                    <InputField
                      className="col"
                      disabled={editField !== 'UG_courses_link'}
                      name="UG_courses_link"
                      label="UG courses link"
                      placeholder="UG courses link"
                      type="url"
                      value={collegeData.UG_courses_link}
                      onChange={(e) =>
                        handleChange('UG_courses_link', e.target.value)
                      }
                      setError={(error) =>
                        handleFieldError('UG_courses_link', error)
                      }
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditField('UG_courses_link');
                      }}
                      className="border-0 bg-primary rounded text-white"
                      style={{ height: '40px', marginTop: '25px' }}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </div>
                  <div className="d-flex gap-2 align-items-start">
                    <InputField
                      className="col"
                      disabled={editField !== 'graduation_courses'}
                      name="graduation_courses"
                      label="Graduation courses"
                      placeholder="Graduation courses"
                      type="text"
                      value={collegeData.graduation_courses}
                      onChange={(e) =>
                        handleChange('graduation_courses', e.target.value)
                      }
                      setError={(error) =>
                        handleFieldError('graduation_courses', error)
                      }
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditField('graduation_courses');
                      }}
                      className="border-0 bg-primary rounded text-white"
                      style={{ height: '40px', marginTop: '25px' }}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </div>
                  <div className="d-flex gap-2 align-items-start">
                    <InputField
                      className="col"
                      disabled={editField !== 'graduation_courses_link'}
                      name="graduation_courses_link"
                      label="Graduation courses link"
                      placeholder="Graduation courses link"
                      type="url"
                      value={collegeData.graduation_courses_link}
                      onChange={(e) =>
                        handleChange('graduation_courses_link', e.target.value)
                      }
                      setError={(error) =>
                        handleFieldError('graduation_courses_link', error)
                      }
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditField('graduation_courses_link');
                      }}
                      className="border-0 bg-primary rounded text-white"
                      style={{ height: '40px', marginTop: '25px' }}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </div>
                </div>
                <div className="form-group py-3 text-center">
                  <button
                    type="submit"
                    className="btn btn-warning shadow w-auto"
                    onClick={handleUpdate}
                    disabled={!isFormValid() && showButton}
                  >
                    {loading ? 'Loading...' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          )}
          <Toast
            show={toast.show}
            message={toast.message}
            onClose={() => setToast({ show: false, message: '' })}
          />
        </>
      )}
    </div>
  );
};
