import React, { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import InputField from 'src/components/organisms/InputField';
import { Search } from 'src/components/organisms/Search';
import Toast from 'src/components/organisms/Toast';
import { useUpdateData } from 'src/react-query/useFetchApis';
import { useDeleteData } from 'src/react-query/useFetchApis';
import { useAddData } from 'src/react-query/useFetchApis';
import { useFetchData } from 'src/react-query/useFetchApis';
import useAuthStore from 'src/services/store/globalStore';

export const AddColleges = () => {
  const queryClient = useQueryClient();
  const collegesList = useAuthStore((state) => state.collegesList);
  const [selectedcollege, setSelectedcollege] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading] = useState(false);
  const [addedColleges, setAddedColleges] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [disableButton, setDisableButton] = useState(true);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: '',
    color: undefined,
  });
  const [formData, setFormData] = useState({
    college_name: '',
    website_link: '',
    college_email: '',
    college_email_link: '',
    college_phone: '',
    college_phone_link: '',
    public_private: '',
    international_UG_link: '',
    international_graduation_link: '',
    international_person_email: '',
    international_person_email_link: '',
    application_UG_link: '',
    application_graduation_link: '',
    application_UG_fee: '',
    application_UG_fee_link: '',
    application_graduation_fee: '',
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
    UG_courses: '',
    UG_courses_link: '',
    graduation_courses: '',
    graduation_courses_link: '',
  });

  const resetForm = () => {
    setFormData({
      college_name: '',
      website_link: '',
      college_email: '',
      college_email_link: '',
      college_phone: '',
      college_phone_link: '',
      public_private: '',
      international_UG_link: '',
      international_graduation_link: '',
      international_person_email: '',
      international_person_email_link: '',
      application_UG_link: '',
      application_graduation_link: '',
      application_UG_fee: '',
      application_UG_fee_link: '',
      application_graduation_fee: '',
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
      UG_courses: '',
      UG_courses_link: '',
      graduation_courses: '',
      graduation_courses_link: '',
    });
  };

  const {
    data = [], // Provide a default value of an empty array
  } = useFetchData('colleges', `/colleges/all/`);
  useEffect(() => {
    useAuthStore.setState({ collegesList: data });
  }, [data]);
  useEffect(() => {
    setAddedColleges(() => {
      const collegeNames = collegesList.map((college) => ({
        value: college.id,
        label: college.college_name,
      }));
      return collegeNames;
    });
  }, [collegesList]);

  useEffect(() => {
    const selectedCollegeData = collegesList.find(
      (college) => college.id === selectedcollege?.value
    );

    if (selectedCollegeData) {
      const {
        college_name,
        website_link,
        college_email,
        college_email_link,
        college_phone,
        college_phone_link,
        public_private,
        international_UG_link,
        international_graduation_link,
        international_person_email,
        international_person_email_link,
        application_UG_link,
        application_graduation_link,
        application_UG_fee,
        application_UG_fee_link,
        application_graduation_fee,
        application_graduation_fee_link,
        gre_score,
        gre_score_link,
        toefl_UG_score,
        toefl_UG_score_link,
        toefl_graduation_score,
        toefl_graduation_score_link,
        ielts_ug_score,
        ielts_ug_score_link,
        ielts_graduation_score,
        ielts_graduation_score_link,
        fall_deadline_UG,
        fall_deadline_UG_link,
        fall_deadline_graduation,
        fall_deadline_graduation_link,
        spring_deadline_UG,
        spring_deadline_UG_link,
        spring_deadline_graduation,
        spring_deadline_graduation_link,
        UG_courses,
        UG_courses_link,
        graduation_courses,
        graduation_courses_link,
      } = selectedCollegeData;

      setFormData({
        college_name,
        website_link,
        college_email,
        college_email_link,
        college_phone,
        college_phone_link,
        public_private,
        international_UG_link,
        international_graduation_link,
        international_person_email,
        international_person_email_link,
        application_UG_link,
        application_graduation_link,
        application_UG_fee,
        application_UG_fee_link,
        application_graduation_fee,
        application_graduation_fee_link,
        gre_score,
        gre_score_link,
        toefl_UG_score,
        toefl_UG_score_link,
        toefl_graduation_score,
        toefl_graduation_score_link,
        ielts_ug_score,
        ielts_ug_score_link,
        ielts_graduation_score,
        ielts_graduation_score_link,
        fall_deadline_UG,
        fall_deadline_UG_link,
        fall_deadline_graduation,
        fall_deadline_graduation_link,
        spring_deadline_UG,
        spring_deadline_UG_link,
        spring_deadline_graduation,
        spring_deadline_graduation_link,
        UG_courses,
        UG_courses_link,
        graduation_courses,
        graduation_courses_link,
      });
      setIsEdit(true);
      setInputDisabled(true);
    }
  }, [selectedcollege, collegesList]);

  // Extracting keys from formData
  useEffect(() => {
    const allFieldsFilled = Object.values(formData).every(
      (value) => value !== ''
    );
    const hasErrors = Object.values(fieldErrors).some((error) => error);
    setDisableButton(!allFieldsFilled || hasErrors);
  }, [formData, fieldErrors]);

  const handleChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  const handleFieldError = (fieldName, error) => {
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: error,
    }));
  };

  const { mutate: addCollege, isLoading } = useAddData(
    'colleges',
    `/colleges/create/`
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    addCollege(formData, {
      onSuccess: () => {
        queryClient.invalidateQueries('colleges');
        resetForm();
        setToast({
          show: true,
          message: 'College added successfully!',
          color: '#82DD55',
        });
        setTimeout(
          () => setToast({ show: false, message: '', color: undefined }),
          3000
        );
      },
      onError: (error) => {
        console.error('An error occurred:', error);
        setToast({
          show: true,
          message: 'Something went wrong!',
          color: '#E23636',
        });
        setTimeout(
          () => setToast({ show: false, message: '', color: undefined }),
          3000
        );
        // Handle error state or display error message
      },
    });
    resetForm();
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setInputDisabled(false);
  };

  // Using the custom hook for updating college
  const { mutate: updateCollege, isLoading: isUpdating } = useUpdateData(
    'colleges',
    `/colleges/${selectedcollege?.value}/update/`
  );

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateCollege(formData, {
        onSuccess: () => {
          queryClient.invalidateQueries('colleges');
          // resetForm();
          setInputDisabled(true);
          setToast({
            show: true,
            message: 'College updated successfully!',
            color: '#82DD55',
          });
          setTimeout(
            () => setToast({ show: false, message: '', color: undefined }),
            3000
          );
        },
        onError: (error) => {
          console.error('An error occurred:', error);
          setToast({
            show: true,
            message: 'Something went wrong!',
            color: '#E23636',
          });
          setTimeout(
            () => setToast({ show: false, message: '', color: undefined }),
            3000
          );
        },
      });
    } catch (error) {
      console.error('Update error:', error.message);
      setToast({
        show: true,
        message: `Update failed: ${error.message}`,
        color: '#E23636',
      });
      setTimeout(
        () => setToast({ show: false, message: '', color: undefined }),
        3000
      );
    }
  };

  // Using the custom hook for deleting college
  const { mutate: deleteCollege, isLoading: isDeleting } = useDeleteData(
    'colleges',
    `/colleges/${selectedcollege?.value}/delete/`
  );

  const handleDelete = (e) => {
    e.preventDefault();
    // eslint-disable-next-line no-restricted-globals
    let confirmation = confirm('Are you sure you want to delete?');
    if (confirmation) {
      deleteCollege(null, {
        onSuccess: () => {
          queryClient.invalidateQueries('colleges');
          resetForm();
          setSelectedcollege(null);
          setInputDisabled(false);
          setToast({
            show: true,
            message: 'College deleted successfully!',
            color: '#82DD55',
          });
          setTimeout(
            () => setToast({ show: false, message: '', color: undefined }),
            3000
          );
          setIsEdit(false);
        },
        onError: (error) => {
          console.error('An error occurred:', error);
          setToast({
            show: true,
            message: 'Something went wrong!',
            color: '#E23636',
          });
          setTimeout(
            () => setToast({ show: false, message: '', color: undefined }),
            3000
          );
        },
      });
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    resetForm();
    setSelectedcollege(null);
    setInputDisabled(false);
    setIsEdit(false);
  };

  return (
    <div className="container py-3 border">
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
          <Search
            selectedOption={selectedcollege}
            setSelectedOption={setSelectedcollege}
            placeholder={'search colleges ...'}
            options={addedColleges}
            isMulti={false}
          />
          <form>
            <div className="my-3">
              <h5>College Details</h5>
              <div className="underline"></div>
              <InputField
                disabled={inputDisabled}
                name="college_name"
                label="College Name"
                type="text"
                className="col p-1"
                value={formData.college_name}
                onChange={(e) => handleChange('college_name', e.target.value)}
                setError={(error) => handleFieldError('college_name', error)}
              />
              <div className="row row-cols-md-2 row row-cols-sm-2 row-cols-1 g-2">
                <InputField
                  disabled={inputDisabled}
                  notRequired={true}
                  name="website_link"
                  label="Website Link"
                  type="url"
                  className="col p-1"
                  value={formData.website_link}
                  onChange={(e) => handleChange('website_link', e.target.value)}
                  setError={(error) => handleFieldError('website_link', error)}
                />
                <InputField
                  disabled={inputDisabled}
                  notRequired={true}
                  name="college_email"
                  label="College Email"
                  type="email"
                  className="col p-1"
                  value={formData.college_email}
                  onChange={(e) =>
                    handleChange('college_email', e.target.value)
                  }
                  setError={(error) => handleFieldError('college_email', error)}
                />
                <InputField
                  disabled={inputDisabled}
                  notRequired={true}
                  name="college_email_link"
                  label="College Email Link"
                  type="url"
                  className="col p-1"
                  value={formData.college_email_link}
                  onChange={(e) =>
                    handleChange('college_email_link', e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError('college_email_link', error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  notRequired={true}
                  name="college_phone"
                  label="College Phone"
                  type="tel"
                  className="col p-1"
                  value={formData.college_phone}
                  onChange={(e) =>
                    handleChange('college_phone', e.target.value)
                  }
                  setError={(error) => handleFieldError('college_phone', error)}
                />
                <InputField
                  disabled={inputDisabled}
                  notRequired={true}
                  name="college_phone_link"
                  label="College Phone Link"
                  type="url"
                  className="col p-1"
                  value={formData.college_phone_link}
                  onChange={(e) =>
                    handleChange('college_phone_link', e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError('college_phone_link', error)
                  }
                />
                <div className="col">
                  <label htmlFor="public_private" className="form-label">
                    Public/Private
                    <span
                      className="text-danger"
                      style={{ userSelect: 'none' }}
                    >
                      {' '}
                      *
                    </span>
                  </label>
                  <select
                    name="public_private"
                    id="public_private"
                    className="form-select"
                    value={formData.public_private}
                    disabled={inputDisabled}
                    onChange={(e) =>
                      handleChange('public_private', e.target.value)
                    }
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="my-3">
              <h5>International Links</h5>
              <div className="underline"></div>
              <div className="row row-cols-md-2 row row-cols-sm-2 row-cols-1 g-2">
                <InputField
                  disabled={inputDisabled}
                  notRequired={true}
                  name="international_UG_link"
                  label="International UG Link"
                  type="url"
                  className="col p-1"
                  value={formData.international_UG_link}
                  onChange={(e) =>
                    handleChange('international_UG_link', e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError('international_UG_link', error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  notRequired={true}
                  name="international_graduation_link"
                  label="International Graduation Link"
                  type="url"
                  className="col p-1"
                  value={formData.international_graduation_link}
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
                <InputField
                  disabled={inputDisabled}
                  notRequired={true}
                  name="international_person_email"
                  label="International Person Email"
                  type="email"
                  className="col p-1"
                  value={formData.international_person_email}
                  onChange={(e) =>
                    handleChange('international_person_email', e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError('international_person_email', error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  notRequired={true}
                  name="international_person_email_link"
                  label="International Person Email Link"
                  type="url"
                  className="col p-1"
                  value={formData.international_person_email_link}
                  onChange={(e) =>
                    handleChange(
                      'international_person_email_link',
                      e.target.value
                    )
                  }
                  setError={(error) =>
                    handleFieldError('international_person_email_link', error)
                  }
                />
              </div>
            </div>

            <div className="my-3">
              <h5>Application Links and Fees</h5>
              <div className="underline"></div>
              <div className="row row-cols-md-2 row row-cols-sm-2 row-cols-1 g-2">
                <InputField
                  disabled={inputDisabled}
                  notRequired={true}
                  name="application_UG_link"
                  label="Application UG Link"
                  type="url"
                  className="col p-1"
                  value={formData.application_UG_link}
                  onChange={(e) =>
                    handleChange('application_UG_link', e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError('application_UG_link', error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  notRequired={true}
                  name="application_graduation_link"
                  label="Application Graduation Link"
                  type="url"
                  className="col p-1"
                  value={formData.application_graduation_link}
                  onChange={(e) =>
                    handleChange('application_graduation_link', e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError('application_graduation_link', error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  notRequired={true}
                  name="application_UG_fee"
                  label="Application UG Fee"
                  type="text"
                  className="col p-1"
                  value={formData.application_UG_fee}
                  onChange={(e) =>
                    handleChange('application_UG_fee', e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError('application_UG_fee', error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  notRequired={true}
                  name="application_UG_fee_link"
                  label="Application UG Fee Link"
                  type="url"
                  className="col p-1"
                  value={formData.application_UG_fee_link}
                  onChange={(e) =>
                    handleChange('application_UG_fee_link', e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError('application_UG_fee_link', error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  notRequired={true}
                  name="application_graduation_fee"
                  label="Application Graduation Fee"
                  type="text"
                  className="col p-1"
                  value={formData.application_graduation_fee}
                  onChange={(e) =>
                    handleChange('application_graduation_fee', e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError('application_graduation_fee', error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  notRequired={true}
                  name="application_graduation_fee_link"
                  label="Application Graduation Fee Link"
                  type="url"
                  className="col p-1"
                  value={formData.application_graduation_fee_link}
                  onChange={(e) =>
                    handleChange(
                      'application_graduation_fee_link',
                      e.target.value
                    )
                  }
                  setError={(error) =>
                    handleFieldError('application_graduation_fee_link', error)
                  }
                />
              </div>
            </div>

            <div className="my-3">
              <h5>Test Scores and Links</h5>
              <div className="underline"></div>
              <div className="row row-cols-md-2 row row-cols-sm-2 row-cols-1 g-2">
                <InputField
                  disabled={inputDisabled}
                  notRequired={true}
                  name="gre_score"
                  label="GRE Score"
                  type="text"
                  className="col p-1"
                  value={formData.gre_score}
                  onChange={(e) => handleChange('gre_score', e.target.value)}
                  setError={(error) => handleFieldError('gre_score', error)}
                />
                <InputField
                  disabled={inputDisabled}
                  notRequired={true}
                  name="gre_score_link"
                  label="GRE Score Link"
                  type="url"
                  className="col p-1"
                  value={formData.gre_score_link}
                  onChange={(e) =>
                    handleChange('gre_score_link', e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError('gre_score_link', error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  notRequired={true}
                  name="toefl_UG_score"
                  label="TOEFL UG Score"
                  type="text"
                  className="col p-1"
                  value={formData.toefl_UG_score}
                  onChange={(e) =>
                    handleChange('toefl_UG_score', e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError('toefl_UG_score', error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  notRequired={true}
                  name="toefl_UG_score_link"
                  label="TOEFL UG Score Link"
                  type="url"
                  className="col p-1"
                  value={formData.toefl_UG_score_link}
                  onChange={(e) =>
                    handleChange('toefl_UG_score_link', e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError('toefl_UG_score_link', error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  notRequired={true}
                  name="toefl_graduation_score"
                  label="TOEFL Graduation Score"
                  type="text"
                  className="col p-1"
                  value={formData.toefl_graduation_score}
                  onChange={(e) =>
                    handleChange('toefl_graduation_score', e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError('toefl_graduation_score', error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  notRequired={true}
                  name="toefl_graduation_score_link"
                  label="TOEFL Graduation Score Link"
                  type="url"
                  className="col p-1"
                  value={formData.toefl_graduation_score_link}
                  onChange={(e) =>
                    handleChange('toefl_graduation_score_link', e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError('toefl_graduation_score_link', error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  notRequired={true}
                  name="ielts_ug_score"
                  label="IELTS UG Score"
                  type="text"
                  className="col p-1"
                  value={formData.ielts_ug_score}
                  onChange={(e) =>
                    handleChange('ielts_ug_score', e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError('ielts_ug_score', error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  notRequired={true}
                  name="ielts_ug_score_link"
                  label="IELTS UG Score Link"
                  type="url"
                  className="col p-1"
                  value={formData.ielts_ug_score_link}
                  onChange={(e) =>
                    handleChange('ielts_ug_score_link', e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError('ielts_ug_score_link', error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  notRequired={true}
                  name="ielts_graduation_score"
                  label="IELTS Graduation Score"
                  type="text"
                  className="col p-1"
                  value={formData.ielts_graduation_score}
                  onChange={(e) =>
                    handleChange('ielts_graduation_score', e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError('ielts_graduation_score', error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  notRequired={true}
                  name="ielts_graduation_score_link"
                  label="IELTS Graduation Score Link"
                  type="url"
                  className="col p-1"
                  value={formData.ielts_graduation_score_link}
                  onChange={(e) =>
                    handleChange('ielts_graduation_score_link', e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError('ielts_graduation_score_link', error)
                  }
                />
              </div>
            </div>

            <div className="my-3">
              <h5>Deadlines</h5>
              <div className="underline"></div>
              <div className="row row-cols-md-2 row row-cols-sm-2 row-cols-1 g-2">
                <InputField
                  disabled={inputDisabled}
                  notRequired={true}
                  name="fall_deadline_UG"
                  label="Fall Deadline UG"
                  type="text"
                  className="col p-1"
                  value={formData.fall_deadline_UG}
                  onChange={(e) =>
                    handleChange('fall_deadline_UG', e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError('fall_deadline_UG', error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  notRequired={true}
                  name="fall_deadline_UG_link"
                  label="Fall Deadline UG Link"
                  type="url"
                  className="col p-1"
                  value={formData.fall_deadline_UG_link}
                  onChange={(e) =>
                    handleChange('fall_deadline_UG_link', e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError('fall_deadline_UG_link', error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  notRequired={true}
                  name="fall_deadline_graduation"
                  label="Fall Deadline Graduation"
                  type="text"
                  className="col p-1"
                  value={formData.fall_deadline_graduation}
                  onChange={(e) =>
                    handleChange('fall_deadline_graduation', e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError('fall_deadline_graduation', error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  notRequired={true}
                  name="fall_deadline_graduation_link"
                  label="Fall Deadline Graduation Link"
                  type="url"
                  className="col p-1"
                  value={formData.fall_deadline_graduation_link}
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
                <InputField
                  disabled={inputDisabled}
                  notRequired={true}
                  name="spring_deadline_UG"
                  label="Spring Deadline UG"
                  type="text"
                  className="col p-1"
                  value={formData.spring_deadline_UG}
                  onChange={(e) =>
                    handleChange('spring_deadline_UG', e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError('spring_deadline_UG', error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  notRequired={true}
                  name="spring_deadline_UG_link"
                  label="Spring Deadline UG Link"
                  type="url"
                  className="col p-1"
                  value={formData.spring_deadline_UG_link}
                  onChange={(e) =>
                    handleChange('spring_deadline_UG_link', e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError('spring_deadline_UG_link', error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  notRequired={true}
                  name="spring_deadline_graduation"
                  label="Spring Deadline Graduation"
                  type="text"
                  className="col p-1"
                  value={formData.spring_deadline_graduation}
                  onChange={(e) =>
                    handleChange('spring_deadline_graduation', e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError('spring_deadline_graduation', error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  notRequired={true}
                  name="spring_deadline_graduation_link"
                  label="Spring Deadline Graduation Link"
                  type="url"
                  className="col p-1"
                  value={formData.spring_deadline_graduation_link}
                  onChange={(e) =>
                    handleChange(
                      'spring_deadline_graduation_link',
                      e.target.value
                    )
                  }
                  setError={(error) =>
                    handleFieldError('spring_deadline_graduation_link', error)
                  }
                />
              </div>
            </div>

            <div className="my-3">
              <h5>Courses</h5>
              <div className="underline"></div>
              <div className="row row-cols-md-2 row row-cols-sm-2 row-cols-1 g-2">
                <InputField
                  disabled={inputDisabled}
                  notRequired={true}
                  name="UG_courses"
                  label="UG Courses"
                  type="text"
                  className="col p-1"
                  value={formData.UG_courses}
                  onChange={(e) => handleChange('UG_courses', e.target.value)}
                  setError={(error) => handleFieldError('UG_courses', error)}
                />
                <InputField
                  disabled={inputDisabled}
                  notRequired={true}
                  name="UG_courses_link"
                  label="UG Courses Link"
                  type="url"
                  className="col p-1"
                  value={formData.UG_courses_link}
                  onChange={(e) =>
                    handleChange('UG_courses_link', e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError('UG_courses_link', error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  notRequired={true}
                  name="graduation_courses"
                  label="Graduation Courses"
                  type="text"
                  className="col p-1"
                  value={formData.graduation_courses}
                  onChange={(e) =>
                    handleChange('graduation_courses', e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError('graduation_courses', error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  notRequired={true}
                  name="graduation_courses_link"
                  label="Graduation Courses Link"
                  type="url"
                  className="col p-1"
                  value={formData.graduation_courses_link}
                  onChange={(e) =>
                    handleChange('graduation_courses_link', e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError('graduation_courses_link', error)
                  }
                />
              </div>
            </div>
            <div className="form-group py-3 w-100 d-flex justify-content-center gap-3">
              {!isEdit ? (
                <button
                  type="submit"
                  className="btn btn-warning shadow px-5"
                  onClick={handleSubmit}
                  disabled={disableButton}
                >
                  {isLoading ? 'loading...' : 'Submit'}
                </button>
              ) : (
                <>
                  <button
                    type="submit"
                    className="btn btn-primary shadow px-5"
                    onClick={handleAdd}
                  >
                    {'Add College'}
                  </button>
                  {inputDisabled ? (
                    <button
                      type="submit"
                      className="btn btn-primary shadow px-5"
                      onClick={handleEdit}
                    >
                      {'Edit'}
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-primary shadow px-5"
                      disabled={disableButton}
                      onClick={handleSave}
                    >
                      {isUpdating ? 'loading...' : 'Save'}
                    </button>
                  )}
                  <button
                    type="submit"
                    className="btn btn-danger shadow px-5"
                    onClick={handleDelete}
                  >
                    {isDeleting ? 'loading...' : 'Delete'}
                  </button>
                </>
              )}
            </div>
          </form>
          <Toast
            show={toast.show}
            message={toast.message}
            color={toast.color}
            onClose={() =>
              setToast({ show: false, message: '', color: undefined })
            }
          />
        </>
      )}
    </div>
  );
};
