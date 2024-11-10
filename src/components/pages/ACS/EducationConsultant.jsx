import React from 'react';
// import InputField from '../../organisms/InputField';
// import { bTechBranches, usStates } from '../../../dataconfig';
// import Toast from '../../organisms/Toast';
// import { Search } from '../../organisms/Search';
// import { ViewColleges } from 'src/components/SuperAdmin/ACS/Colleges/ViewColleges';
import { ViewCollege } from 'src/components/SuperAdmin/ACS/Colleges/CollapsibleTable';

export const EducationConsultant = () => {
  // const [formData, setFormData] = useState({
  //   firstName: '',
  //   lastName: '',
  //   email: '',
  //   phone: '',
  //   schoolName: '',
  //   schoolGradeType: 'CGPA',
  //   schoolGrade: '',
  //   schoolGraduateYear: '',
  //   middleName: '',
  //   middleGradeType: 'CGPA',
  //   middleGrade: '',
  //   middleGraduateYear: '',
  //   bachelorsName: '',
  //   bachelorGradeType: 'CGPA',
  //   bachelorGrade: '',
  //   bachelorGraduateYear: '',
  //   branchStream: '',
  //   selectedOptions: [],
  //   greValues: { AWA: '', Quantitative: '', Verbal: '' },
  //   greTotalScore: '',
  //   ieltsValue: '',
  //   tofelValue: '',
  // });
  // const [loading] = useState(false);
  // const [selectedState, setSelectedState] = useState(null);
  // const [fieldErrors, setFieldErrors] = useState({});
  // const [toast, setToast] = useState({ show: false, message: '' });
  // const handleCheckboxChange = (option) => {
  //   if (formData.selectedOptions.includes(option)) {
  //     // If the checkbox is being unchecked
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       selectedOptions: prevData.selectedOptions.filter(
  //         (item) => item !== option
  //       ),
  //       // Reset values based on the unchecked checkbox
  //       ...(option === 'TOFEL' && { tofelValue: '' }),
  //       ...(option === 'GRE' && {
  //         greValues: { AWA: '', Quantitative: '', Verbal: '' },
  //       }),
  //       ...(option === 'IELTS' && { ieltsValue: '' }),
  //     }));
  //   } else {
  //     // If the checkbox is being checked
  //     if (option === 'GRE') {
  //       setFormData((prevData) => ({
  //         ...prevData,
  //         selectedOptions: [...prevData.selectedOptions, option],
  //         greTotalScore: '', // Initialize total score when GRE is selected
  //       }));
  //     } else {
  //       setFormData((prevData) => ({
  //         ...prevData,
  //         selectedOptions: [...prevData.selectedOptions, option],
  //       }));
  //     }
  //   }
  // };

  // const isFormValid = () => {
  //   const formFields = Object.keys(formData).filter(
  //     (key) =>
  //       key !== 'greValues' && key !== 'ieltsValue' && key !== 'tofelValue'
  //   );

  //   const isGreSelected = formData.selectedOptions.includes('GRE');
  //   const isIeltsSelected = formData.selectedOptions.includes('IELTS');
  //   const isTofelSelected = formData.selectedOptions.includes('TOFEL');

  //   return (
  //     formFields.every((key) => Boolean(formData[key])) &&
  //     !Object.values(fieldErrors).some(Boolean) &&
  //     (!isGreSelected ||
  //       (Boolean(formData.greValues.AWA) &&
  //         Boolean(formData.greValues.Quantitative) &&
  //         Boolean(formData.greValues.Verbal))) &&
  //     (!isIeltsSelected || Boolean(formData.ieltsValue)) &&
  //     (!isTofelSelected || Boolean(formData.tofelValue)) &&
  //     formData.selectedOptions.length
  //   );
  // };

  // function handleChange(field, value) {
  //   setFormData((previousData) => ({ ...previousData, [field]: value }));
  // }
  // const handleFieldError = (fieldName, error) => {
  //   setFieldErrors((prevErrors) => ({ ...prevErrors, [fieldName]: error }));
  // };
  // const handleInputChange = (field, value) => {
  //   switch (field) {
  //     case 'AWA':
  //     case 'Quantitative':
  //     case 'Verbal':
  //       setFormData((prevData) => ({
  //         ...prevData,
  //         greValues: { ...prevData.greValues, [field]: value },
  //       }));
  //       break;
  //     case 'IELTS':
  //       setFormData((prevData) => ({ ...prevData, ieltsValue: value }));
  //       break;
  //     case 'TOFEL':
  //       setFormData((prevData) => ({ ...prevData, tofelValue: value }));
  //       break;
  //     default:
  //       break;
  //   }
  // };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!isFormValid()) return;

  //   try {
  //     setFormData({
  //       firstName: '',
  //       lastName: '',
  //       email: '',
  //       phone: '',
  //       schoolName: '',
  //       schoolGradeType: 'CGPA',
  //       schoolGrade: '',
  //       schoolGraduateYear: '',
  //       middleName: '',
  //       middleGradeType: 'CGPA',
  //       middleGrade: '',
  //       middleGraduateYear: '',
  //       bachelorsName: '',
  //       bachelorGradeType: 'CGPA',
  //       bachelorGrade: '',
  //       bachelorGraduateYear: '',
  //       branchStream: '',
  //       selectedOptions: [],
  //     });
  //     setToast({ show: true, message: 'Login successfully' });
  //     setTimeout(() => setToast({ show: false, message: '' }), 3000);
  //   } catch (error) {
  //     setToast({ show: true, message: 'Something went wrong!' });
  //     setTimeout(() => setToast({ show: false, message: '' }), 3000);
  //     console.error('Error:', error);
  //   }
  // };
  return (
    <div className="container my-3">
      <h2 className="main-heading">
        Enter details to check eligible colleges list
      </h2>
      {/* <div className="">
        <form onSubmit={handleSubmit}>
          <div className="my-3">
            <h5>General Details</h5>
            <div className="underline"></div>
            <div className="row row-cols-md-2 row row-cols-sm-2 row-cols-1 g-2">
              <InputField
                name="name"
                label="First Name"
                placeholder="First Name"
                type="text"
                className="col"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                setError={(error) => handleFieldError('name', error)}
              />
              <InputField
                name="name"
                label="Last Name"
                placeholder="Last Name"
                type="text"
                className="col"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                setError={(error) => handleFieldError('name', error)}
              />
              <InputField
                name="email"
                label="Email"
                placeholder="Email"
                type="email"
                className="col"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                setError={(error) => handleFieldError('email', error)}
              />
              <InputField
                name="phone"
                label="Phone Number"
                placeholder="Phone"
                type="tel"
                className="col"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                setError={(error) => handleFieldError('phone', error)}
              />
            </div>
          </div>
          <div className="my-3">
            <h5>Schooling Details</h5>
            <div className="underline"></div>
            <div className="row g-2">
              <InputField
                name="college"
                label="School Name"
                placeholder="School Name"
                type="text"
                className="col col-12"
                value={formData.schoolName}
                onChange={(e) => handleChange('schoolName', e.target.value)}
                setError={(error) => handleFieldError('college', error)}
              />
              <div className="col col-auto">
                <label className="mb-1">Grading type</label>
                <div className="dropdown">
                  <select
                    value={formData.schoolGradeType}
                    onChange={(e) =>
                      handleChange('schoolGradeType', e.target.value)
                    }
                    className="btn btn-secondary dropdown"
                  >
                    <option className="bg-white text-black" value="CGPA">
                      CGPA
                    </option>
                    <option className="bg-white text-black" value="Percentage">
                      Percentage
                    </option>
                  </select>
                </div>
              </div>
              <InputField
                name={'score'}
                label={formData.schoolGradeType}
                placeholder={formData.schoolGradeType}
                type="number"
                className="col"
                value={formData.schoolGrade}
                onChange={(e) => handleChange('schoolGrade', e.target.value)}
                setError={(error) =>
                  handleFieldError(formData.schoolGradeType, error)
                }
              />
              <InputField
                name="studyYear"
                label="Graduation year"
                placeholder="YYYY"
                type="number"
                className="col col-12 col-md-4 col-sm-4"
                value={formData.schoolGraduateYear}
                onChange={(e) =>
                  handleChange('schoolGraduateYear', e.target.value)
                }
                setError={(error) => handleFieldError('studyYear', error)}
              />
            </div>
          </div>
          <div className="my-3">
            <h5>Middle School/Intermediate details</h5>
            <div className="underline"></div>
            <div className="row g-2">
              <InputField
                name="college"
                label="College Name"
                placeholder="College Name"
                type="text"
                className="col col-12"
                value={formData.middleName}
                onChange={(e) => handleChange('middleName', e.target.value)}
                setError={(error) => handleFieldError('college', error)}
              />
              <div className="col col-auto">
                <label className="mb-1">Grading type</label>
                <div className="dropdown">
                  <select
                    value={formData.middleGradeType}
                    onChange={(e) =>
                      handleChange('middleGradeType', e.target.value)
                    }
                    className="btn btn-secondary dropdown"
                  >
                    <option className="bg-white text-black" value="CGPA">
                      CGPA
                    </option>
                    <option className="bg-white text-black" value="Percentage">
                      Percentage
                    </option>
                  </select>
                </div>
              </div>
              <InputField
                name={'score'}
                label={formData.middleGradeType}
                placeholder={formData.middleGradeType}
                type="number"
                className="col"
                value={formData.middleGrade}
                onChange={(e) => handleChange('middleGrade', e.target.value)}
                setError={(error) =>
                  handleFieldError(formData.middleGradeType, error)
                }
              />
              <InputField
                name="studyYear"
                label="Graduation year"
                placeholder="YYYY"
                type="number"
                className="col col-12 col-md-4 col-sm-4"
                value={formData.middleGraduateYear}
                onChange={(e) =>
                  handleChange('middleGraduateYear', e.target.value)
                }
                setError={(error) => handleFieldError('studyYear', error)}
              />
            </div>
          </div>
          <div className="my-3">
            <h5>Bachelors details</h5>
            <div className="underline"></div>
            <InputField
              name="college"
              label="College Name"
              placeholder="College Name"
              type="text"
              className="col col-12"
              value={formData.bachelorsName}
              onChange={(e) => handleChange('bachelorsName', e.target.value)}
              setError={(error) => handleFieldError('college', error)}
            />
            <div className="row row-cols-2 row-cols-lg-4 row-cols-md-4">
              <div className="col">
                <label className="mb-1">Grading type</label>
                <div className="dropdown">
                  <select
                    value={formData.bachelorGradeType}
                    onChange={(e) =>
                      handleChange('bachelorGradeType', e.target.value)
                    }
                    className="btn btn-secondary dropdown w-100"
                  >
                    <option className="bg-white text-black" value="CGPA">
                      CGPA
                    </option>
                    <option className="bg-white text-black" value="Percentage">
                      Percentage
                    </option>
                  </select>
                </div>
              </div>
              <InputField
                name={formData.bachelorGradeType}
                label={formData.bachelorGradeType}
                placeholder={formData.bachelorGradeType}
                type="number"
                className="col"
                value={formData.bachelorGrade}
                onChange={(e) => handleChange('bachelorGrade', e.target.value)}
                setError={(error) =>
                  handleFieldError(formData.bachelorGradeType, error)
                }
              />
              <div className="col">
                <label className="mb-1">
                  Branch/Stream <span className="text-danger">*</span>
                </label>
                <div className="dropdown">
                  <select
                    value={formData.branchStream}
                    onChange={(e) =>
                      handleChange('branchStream', e.target.value)
                    }
                    className="btn btn-secondary bg-transparent text-black dropdown w-100"
                  >
                    <option value="" disabled>
                      Select Branch/Stream
                    </option>
                    {bTechBranches.map((branch, index) => (
                      <option
                        key={index}
                        className="bg-white text-black"
                        value={branch}
                      >
                        {branch}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <InputField
                name="studyYear"
                label="Graduation year"
                placeholder="YYYY"
                type="number"
                className="col"
                value={formData.bachelorGraduateYear}
                onChange={(e) =>
                  handleChange('bachelorGraduateYear', e.target.value)
                }
                setError={(error) => handleFieldError('studyYear', error)}
              />
            </div>
          </div>
          <div className="my-3">
            <h5>Other Exams</h5>
            <div className="underline"></div>
            <div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="greCheckbox"
                  checked={formData.selectedOptions.includes('GRE')}
                  onChange={() => handleCheckboxChange('GRE')}
                />
                <label className="form-check-label" htmlFor="greCheckbox">
                  GRE
                </label>
                {formData.selectedOptions.includes('GRE') && (
                  <div className="row">
                    <InputField
                      name="score"
                      label="AWA"
                      placeholder="AWA"
                      type="number"
                      className="form-control col"
                      value={formData.greValues.AWA}
                      onChange={(e) => handleInputChange('AWA', e.target.value)}
                      setError={(error) => handleFieldError('score', error)}
                    />
                    <InputField
                      name="score"
                      label="Quantitative"
                      placeholder="Quantitative"
                      type="number"
                      className="form-control col"
                      value={formData.greValues.Quantitative}
                      onChange={(e) =>
                        handleInputChange('Quantitative', e.target.value)
                      }
                      setError={(error) => handleFieldError('score', error)}
                    />
                    <InputField
                      name="score"
                      label="Verbal"
                      placeholder="Verbal"
                      type="number"
                      className="form-control col"
                      value={formData.greValues.Verbal}
                      onChange={(e) =>
                        handleInputChange('Verbal', e.target.value)
                      }
                      setError={(error) => handleFieldError('score', error)}
                    />
                    <InputField
                      name="score"
                      label="Total Score"
                      placeholder="Total Score"
                      type="number"
                      className="form-control col"
                      value={formData.greTotalScore}
                      onChange={(e) =>
                        handleChange('greTotalScore', e.target.value)
                      }
                      setError={(error) => handleFieldError('score', error)}
                    />
                  </div>
                )}
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="ieltsCheckbox"
                  checked={formData.selectedOptions.includes('IELTS')}
                  onChange={() => handleCheckboxChange('IELTS')}
                />
                <label className="form-check-label" htmlFor="ieltsCheckbox">
                  IELTS
                </label>
                {formData.selectedOptions.includes('IELTS') && (
                  <InputField
                    name="score"
                    label="IELTS Score"
                    placeholder="IELTS Score"
                    type="number"
                    className="form-control"
                    value={formData.ieltsValue}
                    onChange={(e) => handleInputChange('IELTS', e.target.value)}
                    setError={(error) => handleFieldError('score', error)}
                  />
                )}
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="tofelCheckbox"
                  checked={formData.selectedOptions.includes('TOFEL')}
                  onChange={() => handleCheckboxChange('TOFEL')}
                />
                <label className="form-check-label" htmlFor="tofelCheckbox">
                  TOFEL
                </label>
                {formData.selectedOptions.includes('TOFEL') && (
                  <InputField
                    name="score"
                    label="TOFEL Score"
                    placeholder="TOFEL Score"
                    type="number"
                    className="form-control"
                    value={formData.tofelValue}
                    onChange={(e) => handleInputChange('TOFEL', e.target.value)}
                    setError={(error) => handleFieldError('score', error)}
                  />
                )}
              </div>
            </div>
          </div>
          <Search
            selectedOption={selectedState}
            setSelectedOption={setSelectedState}
            placeholder={'search states ...'}
            options={usStates}
            isMulti={true}
          />
          <div className="form-group py-3 d-flex justify-content-center">
            <button
              type="submit"
              className="btn btn-warning shadow"
              disabled={!isFormValid()}
            >
              {loading ? 'Loading...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
      <ViewColleges /> */}
      <ViewCollege />
      {/* <Toast
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ show: false, message: '' })}
      /> */}
    </div>
  );
};
