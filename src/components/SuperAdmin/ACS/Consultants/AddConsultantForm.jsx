import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import Toast from 'src/components/organisms/Toast';
import { useFetchData } from 'src/react-query/useFetchApis';
import { useAddData } from 'src/react-query/useFetchApis';
import { z } from 'zod';

const schema = z.object({
  employer_id: z.string().min(1, 'Employer is required'),
  recruiter_id: z.string().min(1, 'Recruiter is required'),
  full_name: z.string().min(1, 'Full Name is required'),
  phone_number: z.string().min(1, 'Phone Number is required'),
  email_id: z.string().email('Invalid email').min(1, 'Email ID is required'),
  dob: z.string().min(1, 'Date of Birth is required'),
  visa_status: z.string().min(1, 'Visa Status is required'),
  visa_validity: z.string().min(1, 'Visa Validity is required'),
  btech_college: z.string().min(1, 'BTech College is required'),
  btech_percentage: z.string().min(1, 'BTech Percentage is required'),
  btech_graduation_date: z.string().min(1, 'BTech Graduation Date is required'),
  masters_college: z.string().min(1, 'Masters College is required'),
  masters_cgpa: z.string().min(1, 'Masters CGPA is required'),
  masters_graduation_date: z
    .string()
    .min(1, 'Masters Graduation Date is required'),
  technologies: z.string().min(1, 'Technologies are required'),
  current_location: z.string().min(1, 'Current Location is required'),
  relocation: z.boolean(),
  experience_in_us: z.string().min(1, 'Experience in US is required'),
  experience_in_india: z.string().min(1, 'Experience in India is required'),
  relocation_preference: z.string().min(1, 'Relocation Preference is required'),
  passport_number: z.string().min(1, 'Passport Number is required'),
  driving_licence: z.string().min(1, 'Driving Licence is required'),
  rate_expectations: z.string().min(1, 'Rate Expectations are required'),
  last_4_ssn: z.string().min(4, 'Last 4 digits of SSN are required'),
  linkedin_url: z.string().url('Invalid LinkedIn URL'),
  full_name_verified: z.string().min(1, 'Full Name verification is required'),
  visa_status_verified: z
    .string()
    .min(1, 'Visa Status verification is required'),
  visa_validity_verified: z
    .string()
    .min(1, 'Visa Validity verification is required'),
  experience_in_us_verified: z
    .string()
    .min(1, 'Experience in US verification is required'),
  experience_in_india_verified: z
    .string()
    .min(1, 'Experience in India verification is required'),
  passport_number_verified: z
    .string()
    .min(1, 'Passport verification is required'),
});

function AddConsultantForm() {
  const initialFormData = {
    employer_id: '',
    recruiter_id: '',
    full_name: '',
    phone_number: '',
    email_id: '',
    dob: '',
    visa_status: '',
    visa_validity: '',
    btech_college: '',
    btech_percentage: '',
    btech_graduation_date: '',
    masters_college: '',
    masters_cgpa: '',
    masters_graduation_date: '',
    technologies: '',
    current_location: '',
    relocation: null,
    experience_in_us: '',
    experience_in_india: '',
    relocation_preference: '',
    passport_number: '',
    driving_licence: '',
    rate_expectations: '',
    last_4_ssn: '',
    linkedin_url: '',
    full_name_verified: '',
    visa_status_verified: '',
    visa_validity_verified: '',
    experience_in_us_verified: '',
    experience_in_india_verified: '',
    passport_number_verified: '',
    original_resume: null,
    consulting_resume: null,
    status_consultant: {
      description: '',
    },
  };
  const [formData, setFormData] = useState(initialFormData);
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const queryClient = useQueryClient();
  const [toast, setToast] = useState({
    show: false,
    message: '',
    color: undefined,
  });

  const { data: employers = [] } = useFetchData('employer', `/employers/`);
  const { data: recruiters = [] } = useFetchData('recruiter', `/recruiters/`);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'file') {
      setFormData((prevState) => ({
        ...prevState,
        [name]: e.target.files[0],
      }));
    } else if (name === 'technologies') {
      const technologiesArray = value.split(',').map((item) => item.trim());
      setFormData((prevState) => ({
        ...prevState,
        [name]: JSON.stringify(technologiesArray),
      }));
    } else if (name === 'relocation') {
      setFormData((prevState) => ({
        ...prevState,
        relocation: value === 'yes', // Set relocation as boolean (true/false)
      }));
    } else if (name === 'description') {
      setFormData((prevData) => ({
        ...prevData,
        status_consultant: {
          ...prevData.status_consultant,
          description: value,
        },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const renderVerificationRadioButtons = (fieldName) => (
    <>
      <div>
        <input
          type="radio"
          className="form-check-input"
          id={`${fieldName}Yes`}
          name={fieldName}
          value="yes"
          onChange={handleChange}
          checked={formData[fieldName] === 'yes'}
        />
        <label htmlFor={`${fieldName}Yes`}>Yes</label>
      </div>
      <div>
        <input
          type="radio"
          className="form-check-input"
          id={`${fieldName}No`}
          name={fieldName}
          value="no"
          onChange={handleChange}
          checked={formData[fieldName] === 'no'}
        />
        <label htmlFor={`${fieldName}No`}>No</label>
      </div>
    </>
  );

  const { mutate: addConsultant, isLoading } = useAddData(
    'consultant',
    `/api/consultant/`
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessages({});
    setIsSubmitted(false);

    try {
      schema.parse(formData); // Validate formData using Zod schema
      setIsSubmitted(true);

      // Create a FormData instance to handle file uploads and other form fields
      const submitData = new FormData();

      // const statusConsultant = {
      //   employer_id: formData.employer_id,
      //   recruiter_id: formData.recruiter_id,
      //   description: formData.status_consultant.description,
      // };

      // formData.status_consultant = statusConsultant;

      // Append each field to FormData
      Object.keys(formData).forEach((key) => {
        if (key === 'technologies') {
          // Ensure technologies data remains a JSON string
          submitData.append(key, formData[key]);
        } else if (formData[key] instanceof File) {
          // For file inputs, append the actual file
          submitData.append(key, formData[key]);
        } else if (key === 'status_consultant') {
          submitData.append(
            'status_consultant',
            JSON.stringify({
              recruiter_id: formData.recruiter_id,
              employer_id: formData.employer_id,
              date: new Date().toISOString().split('T')[0],
              ...formData.status_consultant, // Merges the dynamic fields from formData.status_consultant
            })
          );
        } else {
          // Append other form data as strings
          submitData.append(key, String(formData[key]));
        }
      });

      submitData.forEach((value, key) => {
        console.log(key, value);
      });

      addConsultant(submitData, {
        onSuccess: () => {
          queryClient.invalidateQueries('consultant');
          setIsSubmitted(true);
          setFormData(initialFormData);
          setToast({
            show: true,
            message: 'Details added successfully!',
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
    } catch (e) {
      if (e instanceof z.ZodError) {
        const formattedErrors = e.errors.reduce((acc, error) => {
          acc[error.path[0]] = error.message;
          return acc;
        }, {});
        setErrorMessages(formattedErrors);
      }
    }
  };

  return (
    <>
      {isSubmitted && (
        <div className="alert alert-success" role="alert">
          Data posted successfully!
        </div>
      )}
      <form
        className="border border-2 mb-3 px-3 pb-3 rounded"
        onSubmit={handleSubmit}
      >
        <div className="row mt-3">
          <div className="col-md-6 form-group mb-3">
            <label htmlFor="employer_id">Employer</label>
            <select
              className="form-control"
              id="employer_id"
              name="employer_id"
              value={formData.employer_id}
              onChange={handleChange}
            >
              <option value="">Select Employer</option>
              {employers.map((employer) => (
                <option key={employer.id} value={employer.id}>
                  {employer.name}
                </option>
              ))}
            </select>
            {errorMessages.employer_id && (
              <p className="text-danger">{errorMessages.employer_id}</p>
            )}
          </div>
          <div className="col-md-6 form-group mb-3">
            <label htmlFor="recruiter_id">Recruiter</label>
            <select
              className="form-control"
              id="recruiter_id"
              name="recruiter_id"
              value={formData.recruiter_id}
              onChange={handleChange}
            >
              <option value="">Select Recruiter</option>
              {recruiters.map((recruiter) => (
                <option key={recruiter.id} value={recruiter.id}>
                  {recruiter.name}
                </option>
              ))}
            </select>
            {errorMessages.recruiter_id && (
              <p className="text-danger">{errorMessages.recruiter_id}</p>
            )}
          </div>
        </div>
        {/* Basic Information Section */}
        <div className="row mb-5 mt-3">
          <div className="col-md-6 form-group mb-3">
            <label htmlFor="full_name">Full Name</label>
            <input
              type="text"
              className="form-control"
              id="full_name"
              name="full_name"
              onChange={handleChange}
            />
            {errorMessages.full_name && (
              <p className="text-danger">{errorMessages.full_name}</p>
            )}
          </div>
          <div className="col-md-6 form-group mb-3">
            <label htmlFor="phone_number">Phone Number</label>
            <input
              type="text"
              className="form-control"
              id="phone_number"
              name="phone_number"
              onChange={handleChange}
            />
            {errorMessages.phone_number && (
              <p className="text-danger">{errorMessages.phone_number}</p>
            )}
          </div>
          <div className="col-md-6 form-group mb-3">
            <label htmlFor="email_id">Email ID</label>
            <input
              type="email"
              className="form-control"
              id="email_id"
              name="email_id"
              onChange={handleChange}
            />
            {errorMessages.email_id && (
              <p className="text-danger">{errorMessages.email_id}</p>
            )}
          </div>
          <div className="col-md-6 form-group mb-3">
            <label htmlFor="dob">Date of Birth</label>
            <input
              type="date"
              className="form-control"
              id="dob"
              name="dob"
              onChange={handleChange}
            />
            {errorMessages.dob && (
              <p className="text-danger">{errorMessages.dob}</p>
            )}
          </div>
          <div className="col-md-6 form-group mb-3">
            <label htmlFor="visa_status">Visa Status</label>
            <select
              className="form-control"
              id="visa_status"
              name="visa_status"
              onChange={handleChange}
            >
              <option value="">Select Visa Status</option>
              <option value="OPT">OPT</option>
              <option value="CPT">CPT</option>
              <option value="H1B">H1B</option>
              <option value="H4 EAD">H4 EAD</option>
            </select>
            {errorMessages.visa_status && (
              <p className="text-danger">{errorMessages.visa_status}</p>
            )}
          </div>
          <div className="col-md-6 form-group mb-3">
            <label htmlFor="visa_validity">Visa Validity</label>
            <input
              type="date"
              className="form-control"
              id="visa_validity"
              name="visa_validity"
              onChange={handleChange}
            />
            {errorMessages.visa_validity && (
              <p className="text-danger">{errorMessages.visa_validity}</p>
            )}
          </div>
        </div>

        {/* Education Details Section */}
        <div className="row my-5">
          <div className="col-md-6 form-group mb-3">
            <label htmlFor="btech_college">BTech College</label>
            <input
              type="text"
              className="form-control"
              id="btech_college"
              name="btech_college"
              onChange={handleChange}
            />
            {errorMessages.btech_college && (
              <p className="text-danger">{errorMessages.btech_college}</p>
            )}
          </div>
          <div className="col-md-6 form-group mb-3">
            <label htmlFor="btech_percentage">BTech Percentage</label>
            <input
              type="number"
              className="form-control"
              id="btech_percentage"
              name="btech_percentage"
              onChange={handleChange}
            />
            {errorMessages.btech_percentage && (
              <p className="text-danger">{errorMessages.btech_percentage}</p>
            )}
          </div>
          <div className="col-md-6 form-group mb-3">
            <label htmlFor="btech_graduation_date">BTech Graduation Date</label>
            <input
              type="date"
              className="form-control"
              id="btech_graduation_date"
              name="btech_graduation_date"
              onChange={handleChange}
            />
            {errorMessages.btech_graduation_date && (
              <p className="text-danger">
                {errorMessages.btech_graduation_date}
              </p>
            )}
          </div>
        </div>

        <div className="row my-5">
          <div className="col-md-6 form-group mb-3">
            <label htmlFor="masters_college">Masters College</label>
            <input
              type="text"
              className="form-control"
              id="masters_college"
              name="masters_college"
              onChange={handleChange}
            />
            {errorMessages.masters_college && (
              <p className="text-danger">{errorMessages.masters_college}</p>
            )}
          </div>
          <div className="col-md-6 form-group mb-3">
            <label htmlFor="masters_cgpa">Masters CGPA</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              id="masters_cgpa"
              name="masters_cgpa"
              onChange={handleChange}
            />
            {errorMessages.masters_cgpa && (
              <p className="text-danger">{errorMessages.masters_cgpa}</p>
            )}
          </div>
          <div className="col-md-6 form-group mb-3">
            <label htmlFor="masters_graduation_date">
              Masters Graduation Date
            </label>
            <input
              type="date"
              className="form-control"
              id="masters_graduation_date"
              name="masters_graduation_date"
              onChange={handleChange}
            />
            {errorMessages.masters_graduation_date && (
              <p className="text-danger">
                {errorMessages.masters_graduation_date}
              </p>
            )}
          </div>
        </div>

        {/* Professional Details Section */}
        <div className="form-group">
          <label htmlFor="technologies">Technologies (comma-separated)</label>
          <textarea
            className="form-control"
            id="technologies"
            name="technologies"
            onChange={handleChange}
          />
          {errorMessages.technologies && (
            <p className="text-danger">{errorMessages.technologies}</p>
          )}
        </div>

        <div className="row my-5">
          <div className="col-md-6 form-group mb-3">
            <label htmlFor="current_location">Current Location</label>
            <input
              type="text"
              className="form-control"
              id="current_location"
              name="current_location"
              onChange={handleChange}
            />
            {errorMessages.current_location && (
              <p className="text-danger">{errorMessages.current_location}</p>
            )}
          </div>
          <div className="col-md-6 form-group mb-3">
            <label htmlFor="relocation">Willing to Relocate?</label>
            <>
              <div>
                <input
                  type="radio"
                  className="form-check-input"
                  id="relocationYes"
                  name="relocation"
                  value="yes"
                  onChange={handleChange}
                  checked={formData.relocation === true}
                />
                <label htmlFor="relocationYes">Yes</label>
              </div>
              <div>
                <input
                  type="radio"
                  className="form-check-input"
                  id="relocationNo"
                  name="relocation"
                  value="no"
                  onChange={handleChange}
                  checked={formData.relocation === false}
                />
                <label htmlFor="relocationNo">No</label>
              </div>
            </>
            {errorMessages.relocation && (
              <p className="text-danger">{errorMessages.relocation}</p>
            )}
          </div>
        </div>
        <div className="row my-5">
          <div className="col-md-6 form-group mb-3">
            <label htmlFor="experience_in_us">Experience in US</label>
            <input
              type="text"
              className="form-control"
              id="experience_in_us"
              name="experience_in_us"
              onChange={handleChange}
            />
            {errorMessages.experience_in_us && (
              <p className="text-danger">{errorMessages.experience_in_us}</p>
            )}
          </div>

          <div className="col-md-6 form-group mb-3">
            <label htmlFor="experience_in_india">Experience in India</label>
            <input
              type="text"
              className="form-control"
              id="experience_in_india"
              name="experience_in_india"
              onChange={handleChange}
            />
            {errorMessages.experience_in_india && (
              <p className="text-danger">{errorMessages.experience_in_india}</p>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="relocation_preference">
            Relocation Preference (Cities and States)
          </label>
          <textarea
            className="form-control"
            id="relocation_preference"
            name="relocation_preference"
            onChange={handleChange}
          ></textarea>
          {errorMessages.relocation_preference && (
            <p className="text-danger">{errorMessages.relocation_preference}</p>
          )}
        </div>

        {/* Personal Details Section */}
        <div className="row my-5">
          <div className="col-md-6 form-group mb-3">
            <label htmlFor="passport_number">Passport Number</label>
            <input
              type="text"
              className="form-control"
              id="passport_number"
              name="passport_number"
              onChange={handleChange}
            />
            {errorMessages.passport_number && (
              <p className="text-danger">{errorMessages.passport_number}</p>
            )}
          </div>
          <div className="col-md-6 form-group mb-3">
            <label htmlFor="driving_licence">Driving Licence</label>
            <input
              type="text"
              className="form-control"
              id="driving_licence"
              name="driving_licence"
              onChange={handleChange}
            />
            {errorMessages.driving_licence && (
              <p className="text-danger">{errorMessages.driving_licence}</p>
            )}
          </div>
          <div className="col-md-6 form-group mb-3">
            <label htmlFor="rate_expectations">Rate Expectations</label>
            <input
              type="text"
              className="form-control"
              id="rate_expectations"
              name="rate_expectations"
              onChange={handleChange}
            />
            {errorMessages.rate_expectations && (
              <p className="text-danger">{errorMessages.rate_expectations}</p>
            )}
          </div>
          <div className="col-md-6 form-group mb-3">
            <label htmlFor="last_4_ssn">Last 4 Digits of SSN</label>
            <input
              type="text"
              className="form-control"
              id="last_4_ssn"
              name="last_4_ssn"
              onChange={handleChange}
            />
            {errorMessages.last_4_ssn && (
              <p className="text-danger">{errorMessages.last_4_ssn}</p>
            )}
          </div>
          <div className="col-md-6 form-group mb-3">
            <label htmlFor="linkedin_url">LinkedIn URL</label>
            <input
              type="url"
              className="form-control"
              id="linkedin_url"
              name="linkedin_url"
              onChange={handleChange}
            />
            {errorMessages.linkedin_url && (
              <p className="text-danger">{errorMessages.linkedin_url}</p>
            )}
          </div>
        </div>

        {/* Resume Fields Section */}
        <div className="form-group" style={{ margin: '10px 0' }}>
          <label
            htmlFor="original_resume"
            style={{ display: 'block', marginBottom: '5px' }}
          >
            Original Resume
          </label>
          <input
            type="file"
            className="form-control-file"
            id="original_resume"
            name="original_resume"
            onChange={handleChange}
            style={{
              display: 'block',
              width: '100%',
              padding: '6px 12px',
              backgroundColor: '#f8f9fa',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              transition:
                'border-color .15s ease-in-out,box-shadow .15s ease-in-out',
            }}
          />
        </div>
        <div className="form-group" style={{ margin: '10px 0' }}>
          <label
            htmlFor="consulting_resume"
            style={{ display: 'block', marginBottom: '5px' }}
          >
            Consulting Resume
          </label>
          <input
            type="file"
            className="form-control-file"
            id="consulting_resume"
            name="consulting_resume"
            onChange={handleChange}
            style={{
              display: 'block',
              width: '100%',
              padding: '6px 12px',
              backgroundColor: '#f8f9fa',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              transition:
                'border-color .15s ease-in-out,box-shadow .15s ease-in-out',
            }}
          />
        </div>
        <div className="row my-5">
          {/* Verification fields */}
          <div className="col-md-6 form-group mb-3">
            <label>Full Name Verified</label>
            {renderVerificationRadioButtons('full_name_verified')}
            {errorMessages.full_name_verified && (
              <p className="text-danger">{errorMessages.full_name_verified}</p>
            )}
          </div>
          <div className="col-md-6 form-group mb-3">
            <label>Visa Status Verified</label>
            {renderVerificationRadioButtons('visa_status_verified')}
            {errorMessages.visa_status_verified && (
              <p className="text-danger">
                {errorMessages.visa_status_verified}
              </p>
            )}
          </div>
          <div className="col-md-6 form-group mb-3">
            <label>Visa Validity Verified</label>
            {renderVerificationRadioButtons('visa_validity_verified')}
            {errorMessages.visa_validity_verified && (
              <p className="text-danger">
                {errorMessages.visa_validity_verified}
              </p>
            )}
          </div>
          <div className="col-md-6 form-group mb-3">
            <label>Experience in US Verified</label>
            {renderVerificationRadioButtons('experience_in_us_verified')}
            {errorMessages.experience_in_us_verified && (
              <p className="text-danger">
                {errorMessages.experience_in_us_verified}
              </p>
            )}
          </div>
          <div className="col-md-6 form-group mb-3">
            <label>Experience in India Verified</label>
            {renderVerificationRadioButtons('experience_in_india_verified')}
            {errorMessages.experience_in_india_verified && (
              <p className="text-danger">
                {errorMessages.experience_in_india_verified}
              </p>
            )}
          </div>
          <div className="col-md-6 form-group mb-3">
            <label>Passport Number Verified</label>
            {renderVerificationRadioButtons('passport_number_verified')}
            {errorMessages.passport_number_verified && (
              <p className="text-danger">
                {errorMessages.passport_number_verified}
              </p>
            )}
          </div>
        </div>
        <textarea
          name="description"
          value={formData.status_consultant.description}
          onChange={handleChange}
          placeholder="Type something here..."
          rows="5"
          cols="50"
        />
        <br />
        <button type="submit" className="btn btn-primary">
          {isLoading ? 'loading...' : 'Submit'}
        </button>
      </form>
      <Toast
        show={toast.show}
        message={toast.message}
        color={toast.color}
        onClose={() => setToast({ show: false, message: '', color: undefined })}
      />
    </>
  );
}

export default AddConsultantForm;
