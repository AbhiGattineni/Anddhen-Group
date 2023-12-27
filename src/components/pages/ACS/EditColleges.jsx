import React, { useState } from "react";
import Toast from "../../organisms/Toast";
import InputField from "../../organisms/InputField";
import { Search } from "../../organisms/Search";
import { usStates } from "../../../dataconfig";

export const EditColleges = () => {
  const [formData, setFormData] = useState({
    college: "",
    websiteLink: "",
    international_UG_link: "",
    international_graduation_link: "",
    application_UG_link: "",
    application_graduation_link: "",
    application_UG_fee: "",
    application_graduation_fee: "",
    gre_score: "",
    toefl_UG_score: "",
    toefl_graduation_score: "",
    fall_deadline_UG: "",
    fall_deadline_graduation: "",
    spring_deadline_UG: "",
    spring_deadline_graduation: "",
    ielts_ug_score: "",
    ielts_graduation_score: "",
    college_email: "",
    college_phone: "",
    international_person_email: "",
    public_private: "",
    UG_courses: "",
    graduation_courses: "",
  });
  const [loading, setLoading] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: "" });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;
  };
  return (
    <div className="container mt-2">
      <h1 className="main-heading">Edit colleges</h1>
      <div className="underline"></div>
      <Search
        selectedOption={selectedCollege}
        setSelectedOption={setSelectedCollege}
        placeholder={"select college to edit"}
        options={usStates}
        isMulti={false}
      />
      <div className="mt-2">
        <form onSubmit={handleSubmit} className="">
          <h5>Basic Information</h5>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 gy-2 gx-4 mb-3">
            <InputField
              className="col"
              name="college"
              label="College Name"
              placeholder="College Name"
              type="text"
              value={formData.college}
              onChange={(e) => handleChange("college", e.target.value)}
              setError={(error) => handleFieldError("college", error)}
            />
            <InputField
              className="col"
              name="websiteLink"
              label="Website Link"
              placeholder="Website Link"
              type="url"
              value={formData.websiteLink}
              onChange={(e) => handleChange("websiteLink", e.target.value)}
              setError={(error) => handleFieldError("websiteLink", error)}
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
                handleChange("international_UG_link", e.target.value)
              }
              setError={(error) =>
                handleFieldError("international_UG_link", error)
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
                handleChange("international_graduation_link", e.target.value)
              }
              setError={(error) =>
                handleFieldError("international_graduation_link", error)
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
                handleChange("application_UG_link", e.target.value)
              }
              setError={(error) =>
                handleFieldError("application_UG_link", error)
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
                handleChange("application_graduation_link", e.target.value)
              }
              setError={(error) =>
                handleFieldError("application_graduation_link", error)
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
                handleChange("application_UG_fee", e.target.value)
              }
              setError={(error) =>
                handleFieldError("application_UG_fee", error)
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
                handleChange("application_graduation_fee", e.target.value)
              }
              setError={(error) =>
                handleFieldError("application_graduation_fee", error)
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
              onChange={(e) => handleChange("gre_score", e.target.value)}
              setError={(error) => handleFieldError("gre_score", error)}
            />
            <InputField
              className="col"
              name="toefl_UG_score"
              label="Toefl UG Score"
              placeholder="Toefl UG Score"
              type="text"
              value={formData.toefl_UG_score}
              onChange={(e) => handleChange("toefl_UG_score", e.target.value)}
              setError={(error) => handleFieldError("toefl_UG_score", error)}
            />
            <InputField
              className="col"
              name="toefl_graduation_score"
              label="Toefl Graduation Score"
              placeholder="Toefl Graduation Score"
              type="text"
              value={formData.toefl_graduation_score}
              onChange={(e) =>
                handleChange("toefl_graduation_score", e.target.value)
              }
              setError={(error) =>
                handleFieldError("toefl_graduation_score", error)
              }
            />
            <InputField
              className="col"
              name="ielts_ug_score"
              label="IELTS UG score"
              placeholder="IELTS UG score"
              type="text"
              value={formData.ielts_ug_score}
              onChange={(e) => handleChange("ielts_ug_score", e.target.value)}
              setError={(error) => handleFieldError("ielts_ug_score", error)}
            />
            <InputField
              className="col"
              name="ielts_graduation_score"
              label="IELTS graduation score"
              placeholder="IELTS graduation score"
              type="text"
              value={formData.ielts_graduation_score}
              onChange={(e) =>
                handleChange("ielts_graduation_score", e.target.value)
              }
              setError={(error) =>
                handleFieldError("ielts_graduation_score", error)
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
              onChange={(e) => handleChange("fall_deadline_UG", e.target.value)}
              setError={(error) => handleFieldError("fall_deadline_UG", error)}
            />
            <InputField
              className="col"
              name="fall_deadline_graduation"
              label="Fall Deadline Graduation"
              type="date"
              value={formData.fall_deadline_graduation}
              onChange={(e) =>
                handleChange("fall_deadline_graduation", e.target.value)
              }
              setError={(error) =>
                handleFieldError("fall_deadline_graduation", error)
              }
            />
            <InputField
              className="col"
              name="spring_deadline_UG"
              label="Spring Deadline UG"
              type="date"
              value={formData.spring_deadline_UG}
              onChange={(e) =>
                handleChange("spring_deadline_UG", e.target.value)
              }
              setError={(error) =>
                handleFieldError("spring_deadline_UG", error)
              }
            />
            <InputField
              className="col"
              name="spring_deadline_graduation"
              label="Spring Deadline Graduation"
              type="date"
              value={formData.spring_deadline_graduation}
              onChange={(e) =>
                handleChange("spring_deadline_graduation", e.target.value)
              }
              setError={(error) =>
                handleFieldError("spring_deadline_graduation", error)
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
              onChange={(e) => handleChange("college_email", e.target.value)}
              setError={(error) => handleFieldError("college_email", error)}
            />
            <InputField
              className="col"
              name="college_phone"
              label="College phone"
              placeholder="College phone"
              type="tel"
              value={formData.college_phone}
              onChange={(e) => handleChange("college_phone", e.target.value)}
              setError={(error) => handleFieldError("college_phone", error)}
            />
            <InputField
              className="col"
              name="international_person_email"
              label="International Person Email"
              placeholder="International Person Email"
              type="email"
              value={formData.international_person_email}
              onChange={(e) =>
                handleChange("international_person_email", e.target.value)
              }
              setError={(error) =>
                handleFieldError("international_person_email", error)
              }
            />
            <InputField
              className="col"
              name="public_private"
              label="Public/Private"
              placeholder="Public/Private"
              type="text"
              value={formData.public_private}
              onChange={(e) => handleChange("public_private", e.target.value)}
              setError={(error) => handleFieldError("public_private", error)}
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
              onChange={(e) => handleChange("UG_courses", e.target.value)}
              setError={(error) => handleFieldError("UG_courses", error)}
            />
            <InputField
              className="col"
              name="graduation_courses"
              label="Graduation courses"
              placeholder="Graduation courses"
              type="text"
              value={formData.graduation_courses}
              onChange={(e) =>
                handleChange("graduation_courses", e.target.value)
              }
              setError={(error) =>
                handleFieldError("graduation_courses", error)
              }
            />
          </div>
          <div className="form-group py-3 text-center">
            <button
              type="submit"
              className="btn btn-warning shadow w-auto"
              disabled={!isFormValid()}
            >
              {loading ? "Loading..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
      <Toast
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ show: false, message: "" })}
      />
    </div>
  );
};
