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
    application_UG_fee_link: "",
    application_graduation_fee: "",
    application_graduation_fee_link: "",
    gre_score: "",
    gre_score_link: "",
    toefl_UG_score: "",
    toefl_UG_score_link: "",
    toefl_graduation_score: "",
    toefl_graduation_score_link: "",
    ielts_ug_score: "",
    ielts_ug_score_link: "",
    ielts_graduation_score: "",
    ielts_graduation_score_link: "",
    fall_deadline_UG: "",
    fall_deadline_UG_link: "",
    fall_deadline_graduation: "",
    fall_deadline_graduation_link: "",
    spring_deadline_UG: "",
    spring_deadline_UG_link: "",
    spring_deadline_graduation: "",
    spring_deadline_graduation_link: "",
    college_email: "",
    college_email_link: "",
    college_phone: "",
    college_phone_link: "",
    international_person_email: "",
    international_person_email_link: "",
    public_private: "",
    UG_courses: "",
    UG_courses_link: "",
    graduation_courses: "",
    graduation_courses_link: "",
  });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editField, setEditField] = useState("");
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
      {showForm && (
        <div className="mt-2">
          <form onSubmit={handleSubmit} className="">
            <h5>Basic Information</h5>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 gy-2 gx-4 mb-3">
              <div className="d-flex gap-2 align-items-start">
                <InputField
                  className="col"
                  disabled={editField !== "college"}
                  name="college"
                  label="College Name"
                  placeholder="College Name"
                  type="text"
                  value={formData.college}
                  onChange={(e) => handleChange("college", e.target.value)}
                  setError={(error) => handleFieldError("college", error)}
                />
                <button
                  onClick={() => setEditField("college")}
                  className="border-0 bg-primary rounded text-white"
                  style={{ height: "40px",marginTop : "25px" }}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
              </div>
              <div className="d-flex gap-2 align-items-start">
                <InputField
                  className="col"
                  disabled={editField !== "websiteLink"}
                  name="websiteLink"
                  label="Website Link"
                  placeholder="Website Link"
                  type="url"
                  value={formData.websiteLink}
                  onChange={(e) => handleChange("websiteLink", e.target.value)}
                  setError={(error) => handleFieldError("websiteLink", error)}
                />
                <button
                  onClick={() => setEditField("websiteLink")}
                  className="border-0 bg-primary rounded text-white"
                  style={{ height: "40px",marginTop : "25px" }}
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
                  disabled={editField !== "international_UG_link"}
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
                <button
                  onClick={() => setEditField("international_UG_link")}
                  className="border-0 bg-primary rounded text-white"
                  style={{ height: "40px",marginTop : "25px" }}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
              </div>
              <div className="d-flex gap-2 align-items-start">
                <InputField
                  className="col"
                  disabled={editField !== "international_graduation_link"}
                  name="international_graduation_link"
                  label="International Graduation Link"
                  placeholder="International Graduation Link"
                  type="url"
                  value={formData.international_graduation_link}
                  onChange={(e) =>
                    handleChange(
                      "international_graduation_link",
                      e.target.value
                    )
                  }
                  setError={(error) =>
                    handleFieldError("international_graduation_link", error)
                  }
                />
                <button
                  onClick={() => setEditField("international_graduation_link")}
                  className="border-0 bg-primary rounded text-white"
                  style={{ height: "40px",marginTop : "25px" }}
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
                  disabled={editField !== "application_UG_link"}
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
                <button
                  onClick={() => setEditField("application_UG_link")}
                  className="border-0 bg-primary rounded text-white"
                  style={{ height: "40px",marginTop : "25px" }}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
              </div>
              <div className="d-flex gap-2 align-items-start">
                <InputField
                  className="col"
                  disabled={editField !== "application_graduation_link"}
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
                <button
                  onClick={() => setEditField("application_graduation_link")}
                  className="border-0 bg-primary rounded text-white"
                  style={{ height: "40px",marginTop : "25px" }}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
              </div>
              <div className="d-flex gap-2 align-items-start">
                <InputField
                  className="col"
                  disabled={editField !== "application_UG_fee"}
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
                <button
                  onClick={() => setEditField("application_UG_fee")}
                  className="border-0 bg-primary rounded text-white"
                  style={{ height: "40px",marginTop : "25px" }}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
              </div>
              <div className="d-flex gap-2 align-items-start">
                <InputField
                  className="col"
                  disabled={editField !== "application_UG_fee_link"}
                  name="application_UG_fee_link"
                  label="Application UG fee link"
                  placeholder="Application UG fee link"
                  type="url"
                  value={formData.application_UG_fee_link}
                  onChange={(e) =>
                    handleChange("application_UG_fee_link", e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError("application_UG_fee_link", error)
                  }
                />
                <button
                  onClick={() => setEditField("application_UG_fee_link")}
                  className="border-0 bg-primary rounded text-white"
                  style={{ height: "40px",marginTop : "25px" }}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
              </div>
              <div className="d-flex gap-2 align-items-start">
                <InputField
                  className="col"
                  disabled={editField !== "application_graduation_fee"}
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
                <button
                  onClick={() => setEditField("application_graduation_fee")}
                  className="border-0 bg-primary rounded text-white"
                  style={{ height: "40px",marginTop : "25px" }}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
              </div>
              <div className="d-flex gap-2 align-items-start">
                <InputField
                  className="col"
                  disabled={editField !== "application_graduation_fee_link"}
                  name="application_graduation_fee_link"
                  label="Application Graduation fee link"
                  placeholder="Application Graduation fee link"
                  type="url"
                  value={formData.application_graduation_fee_link}
                  onChange={(e) =>
                    handleChange(
                      "application_graduation_fee_link",
                      e.target.value
                    )
                  }
                  setError={(error) =>
                    handleFieldError("application_graduation_fee_link", error)
                  }
                />
                <button
                  onClick={() =>
                    setEditField("application_graduation_fee_link")
                  }
                  className="border-0 bg-primary rounded text-white"
                  style={{ height: "40px",marginTop : "25px" }}
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
                  disabled={editField !== "gre_score"}
                  name="gre_score"
                  label="GRE Score"
                  placeholder="GRE Score"
                  type="text"
                  value={formData.gre_score}
                  onChange={(e) => handleChange("gre_score", e.target.value)}
                  setError={(error) => handleFieldError("gre_score", error)}
                />
                <button
                  onClick={() => setEditField("gre_score")}
                  className="border-0 bg-primary rounded text-white"
                  style={{ height: "40px",marginTop : "25px" }}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
              </div>
              <div className="d-flex gap-2 align-items-start">
                <InputField
                  className="col"
                  disabled={editField !== "gre_score_link"}
                  name="gre_score_link"
                  label="GRE Score Link"
                  placeholder="GRE Score Link"
                  type="url"
                  value={formData.gre_score_link}
                  onChange={(e) =>
                    handleChange("gre_score_link", e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError("gre_score_link", error)
                  }
                />
                <button
                  onClick={() => setEditField("gre_score_link")}
                  className="border-0 bg-primary rounded text-white"
                  style={{ height: "40px",marginTop : "25px" }}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
              </div>
              <div className="d-flex gap-2 align-items-start">
                <InputField
                  className="url w-100"
                  disabled={editField !== "toefl_UG_score"}
                  name="toefl_UG_score"
                  label="Toefl UG Score"
                  placeholder="Toefl UG Score"
                  type="text"
                  value={formData.toefl_UG_score}
                  onChange={(e) =>
                    handleChange("toefl_UG_score", e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError("toefl_UG_score", error)
                  }
                />
                <button
                  onClick={() => setEditField("toefl_UG_score")}
                  className="border-0 bg-primary rounded text-white"
                  style={{ height: "40px",marginTop : "25px" }}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
              </div>
              <div className="d-flex gap-2 align-items-start">
                <InputField
                  className="col"
                  disabled={editField !== "toefl_UG_score_link"}
                  name="toefl_UG_score_link"
                  label="Toefl UG Score Link"
                  placeholder="Toefl UG Score Link"
                  type="url"
                  value={formData.toefl_UG_score_link}
                  onChange={(e) =>
                    handleChange("toefl_UG_score_link", e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError("toefl_UG_score_link", error)
                  }
                />
                <button
                  onClick={() => setEditField("toefl_UG_score_link")}
                  className="border-0 bg-primary rounded text-white"
                  style={{ height: "40px",marginTop : "25px" }}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
              </div>
              <div className="d-flex gap-2 align-items-start">
                <InputField
                  className="col"
                  disabled={editField !== "toefl_UG_score_link"}
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
                <button
                  onClick={() => setEditField("toefl_UG_score_link")}
                  className="border-0 bg-primary rounded text-white"
                  style={{ height: "40px",marginTop : "25px" }}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
              </div>
              <div className="d-flex gap-2 align-items-start">
                <InputField
                  className="col"
                  disabled={editField !== "toefl_graduation_score_link"}
                  name="toefl_graduation_score_link"
                  label="Toefl Graduation Score Link"
                  placeholder="Toefl Graduation Score Link"
                  type="url"
                  value={formData.toefl_graduation_score_link}
                  onChange={(e) =>
                    handleChange("toefl_graduation_score_link", e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError("toefl_graduation_score_link", error)
                  }
                />
                <button
                  onClick={() => setEditField("toefl_graduation_score_link")}
                  className="border-0 bg-primary rounded text-white"
                  style={{ height: "40px",marginTop : "25px" }}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
              </div>
              <div className="d-flex gap-2 align-items-start">
                <InputField
                  className="col"
                  disabled={editField !== "ielts_ug_score"}
                  name="ielts_ug_score"
                  label="IELTS UG score"
                  placeholder="IELTS UG score"
                  type="text"
                  value={formData.ielts_ug_score}
                  onChange={(e) =>
                    handleChange("ielts_ug_score", e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError("ielts_ug_score", error)
                  }
                />
                <button
                  onClick={() => setEditField("ielts_ug_score")}
                  className="border-0 bg-primary rounded text-white"
                  style={{ height: "40px",marginTop : "25px" }}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
              </div>
              <div className="d-flex gap-2 align-items-start">
                <InputField
                  className="col"
                  disabled={editField !== "ielts_ug_score_link"}
                  name="ielts_ug_score_link"
                  label="IELTS UG score Link"
                  placeholder="IELTS UG score Link"
                  type="url"
                  value={formData.ielts_ug_score_link}
                  onChange={(e) =>
                    handleChange("ielts_ug_score_link", e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError("ielts_ug_score_link", error)
                  }
                />
                <button
                  onClick={() => setEditField("ielts_ug_score_link")}
                  className="border-0 bg-primary rounded text-white"
                  style={{ height: "40px",marginTop : "25px" }}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
              </div>
              <div className="d-flex gap-2 align-items-start">
                <InputField
                  className="col"
                  disabled={editField !== "ielts_graduation_score"}
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
                <button
                  onClick={() => setEditField("ielts_graduation_score")}
                  className="border-0 bg-primary rounded text-white"
                  style={{ height: "40px",marginTop : "25px" }}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
              </div>
              <div className="d-flex gap-2 align-items-start">
                <InputField
                  className="col"
                  disabled={editField !== "ielts_graduation_score_link"}
                  name="ielts_graduation_score_link"
                  label="IELTS graduation score link"
                  placeholder="IELTS graduation score link"
                  type="url"
                  value={formData.ielts_graduation_score_link}
                  onChange={(e) =>
                    handleChange("ielts_graduation_score_link", e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError("ielts_graduation_score_link", error)
                  }
                />
                <button
                  onClick={() => setEditField("ielts_graduation_score_link")}
                  className="border-0 bg-primary rounded text-white"
                  style={{ height: "40px",marginTop : "25px" }}
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
                  disabled={editField !== "fall_deadline_UG"}
                  name="fall_deadline_UG"
                  label="Fall Deadline UG"
                  type="date"
                  value={formData.fall_deadline_UG}
                  onChange={(e) =>
                    handleChange("fall_deadline_UG", e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError("fall_deadline_UG", error)
                  }
                />
                <button
                  onClick={() => setEditField("fall_deadline_UG")}
                  className="border-0 bg-primary rounded text-white"
                  style={{ height: "40px",marginTop : "25px" }}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
              </div>
              <div className="d-flex gap-2 align-items-start">
                <InputField
                  className="col"
                  disabled={editField !== "fall_deadline_UG_link"}
                  name="fall_deadline_UG_link"
                  label="Fall Deadline UG Link"
                  type="url"
                  value={formData.fall_deadline_UG_link}
                  onChange={(e) =>
                    handleChange("fall_deadline_UG_link", e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError("fall_deadline_UG_link", error)
                  }
                />
                <button
                  onClick={() => setEditField("fall_deadline_UG_link")}
                  className="border-0 bg-primary rounded text-white"
                  style={{ height: "40px",marginTop : "25px" }}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
              </div>
              <div className="d-flex gap-2 align-items-start">
                <InputField
                  className="col"
                  disabled={editField !== "fall_deadline_graduation"}
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
                <button
                  onClick={() => setEditField("fall_deadline_graduation")}
                  className="border-0 bg-primary rounded text-white"
                  style={{ height: "40px",marginTop : "25px" }}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
              </div>
              <div className="d-flex gap-2 align-items-start">
                <InputField
                  className="col"
                  disabled={editField !== "fall_deadline_graduation_link"}
                  name="fall_deadline_graduation_link"
                  label="Fall Deadline Graduation Link"
                  type="url"
                  value={formData.fall_deadline_graduation_link}
                  onChange={(e) =>
                    handleChange(
                      "fall_deadline_graduation_link",
                      e.target.value
                    )
                  }
                  setError={(error) =>
                    handleFieldError("fall_deadline_graduation_link", error)
                  }
                />
                <button
                  onClick={() => setEditField("fall_deadline_graduation_link")}
                  className="border-0 bg-primary rounded text-white"
                  style={{ height: "40px",marginTop : "25px" }}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
              </div>
              <div className="d-flex gap-2 align-items-start">
                <InputField
                  className="col"
                  disabled={editField !== "spring_deadline_UG"}
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
                <button
                  onClick={() => setEditField("spring_deadline_UG")}
                  className="border-0 bg-primary rounded text-white"
                  style={{ height: "40px",marginTop : "25px" }}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
              </div>
              <div className="d-flex gap-2 align-items-start">
                <InputField
                  className="col"
                  disabled={editField !== "spring_deadline_UG_link"}
                  name="spring_deadline_UG_link"
                  label="Spring Deadline UG Link"
                  type="url"
                  value={formData.spring_deadline_UG_link}
                  onChange={(e) =>
                    handleChange("spring_deadline_UG_link", e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError("spring_deadline_UG_link", error)
                  }
                />
                <button
                  onClick={() => setEditField("spring_deadline_UG_link")}
                  className="border-0 bg-primary rounded text-white"
                  style={{ height: "40px",marginTop : "25px" }}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
              </div>
              <div className="d-flex gap-2 align-items-start">
                <InputField
                  className="col"
                  disabled={editField !== "spring_deadline_graduation"}
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
                <button
                  onClick={() => setEditField("spring_deadline_graduation")}
                  className="border-0 bg-primary rounded text-white"
                  style={{ height: "40px",marginTop : "25px" }}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
              </div>
              <div className="d-flex gap-2 align-items-start">
                <InputField
                  className="col"
                  disabled={editField !== "spring_deadline_graduation_link"}
                  name="spring_deadline_graduation_link"
                  label="Spring Deadline Graduation Link"
                  type="url"
                  value={formData.spring_deadline_graduation_link}
                  onChange={(e) =>
                    handleChange(
                      "spring_deadline_graduation_link",
                      e.target.value
                    )
                  }
                  setError={(error) =>
                    handleFieldError("spring_deadline_graduation_link", error)
                  }
                />
                <button
                  onClick={() =>
                    setEditField("spring_deadline_graduation_link")
                  }
                  className="border-0 bg-primary rounded text-white"
                  style={{ height: "40px",marginTop : "25px" }}
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
                  disabled={editField !== "college_email"}
                  name="college_email"
                  label="College Email"
                  placeholder="College Email"
                  type="email"
                  value={formData.college_email}
                  onChange={(e) =>
                    handleChange("college_email", e.target.value)
                  }
                  setError={(error) => handleFieldError("college_email", error)}
                />
                <button
                  onClick={() => setEditField("college_email")}
                  className="border-0 bg-primary rounded text-white"
                  style={{ height: "40px",marginTop : "25px" }}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
              </div>
              <div className="d-flex gap-2 align-items-start">
                <InputField
                  className="col"
                  disabled={editField !== "college_email_link"}
                  name="college_email_link"
                  label="College Email Link"
                  placeholder="College Email Link"
                  type="url"
                  value={formData.college_email_link}
                  onChange={(e) =>
                    handleChange("college_email_link", e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError("college_email_link", error)
                  }
                />
                <button
                  onClick={() => setEditField("college_email_link")}
                  className="border-0 bg-primary rounded text-white"
                  style={{ height: "40px",marginTop : "25px" }}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
              </div>
              <div className="d-flex gap-2 align-items-start">
                <InputField
                  className="col"
                  disabled={editField !== "college_phone"}
                  name="college_phone"
                  label="College phone"
                  placeholder="College phone"
                  type="tel"
                  value={formData.college_phone}
                  onChange={(e) =>
                    handleChange("college_phone", e.target.value)
                  }
                  setError={(error) => handleFieldError("college_phone", error)}
                />
                <button
                  onClick={() => setEditField("college_phone")}
                  className="border-0 bg-primary rounded text-white"
                  style={{ height: "40px",marginTop : "25px" }}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
              </div>
              <div className="d-flex gap-2 align-items-start">
                <InputField
                  className="col"
                  disabled={editField !== "college_phone_link"}
                  name="college_phone_link"
                  label="College phone link"
                  placeholder="College phone link"
                  type="url"
                  value={formData.college_phone_link}
                  onChange={(e) =>
                    handleChange("college_phone_link", e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError("college_phone_link", error)
                  }
                />
                <button
                  onClick={() => setEditField("college_phone_link")}
                  className="border-0 bg-primary rounded text-white"
                  style={{ height: "40px",marginTop : "25px" }}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
              </div>
              <div className="d-flex gap-2 align-items-start">
                <InputField
                  className="col"
                  disabled={editField !== "international_person_email"}
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
                <button
                  onClick={() => setEditField("international_person_email")}
                  className="border-0 bg-primary rounded text-white"
                  style={{ height: "40px",marginTop : "25px" }}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
              </div>
              <div className="d-flex gap-2 align-items-start">
                <InputField
                  className="col"
                  disabled={editField !== "international_person_email_link"}
                  name="international_person_email_link"
                  label="International Person Email Link"
                  placeholder="International Person Email Link"
                  type="url"
                  value={formData.international_person_email_link}
                  onChange={(e) =>
                    handleChange(
                      "international_person_email_link",
                      e.target.value
                    )
                  }
                  setError={(error) =>
                    handleFieldError("international_person_email_link", error)
                  }
                />
                <button
                  onClick={() =>
                    setEditField("international_person_email_link")
                  }
                  className="border-0 bg-primary rounded text-white"
                  style={{ height: "40px",marginTop : "25px" }}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
              </div>
              <div className="d-flex gap-2 align-items-start">
                <InputField
                  className="col"
                  disabled={editField !== "public_private"}
                  name="public_private"
                  label="Public/Private"
                  placeholder="Public/Private"
                  type="text"
                  value={formData.public_private}
                  onChange={(e) =>
                    handleChange("public_private", e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError("public_private", error)
                  }
                />
                <button
                  onClick={() => setEditField("public_private")}
                  className="border-0 bg-primary rounded text-white"
                  style={{ height: "40px",marginTop : "25px" }}
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
                  disabled={editField !== "UG_courses"}
                  name="UG_courses"
                  label="UG courses"
                  placeholder="UG courses"
                  type="text"
                  value={formData.UG_courses}
                  onChange={(e) => handleChange("UG_courses", e.target.value)}
                  setError={(error) => handleFieldError("UG_courses", error)}
                />
                <button
                  onClick={() => setEditField("UG_courses")}
                  className="border-0 bg-primary rounded text-white"
                  style={{ height: "40px",marginTop : "25px" }}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
              </div>
              <div className="d-flex gap-2 align-items-start">
                <InputField
                  className="col"
                  disabled={editField !== "UG_courses_link"}
                  name="UG_courses_link"
                  label="UG courses link"
                  placeholder="UG courses link"
                  type="url"
                  value={formData.UG_courses_link}
                  onChange={(e) =>
                    handleChange("UG_courses_link", e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError("UG_courses_link", error)
                  }
                />
                <button
                  onClick={() => setEditField("UG_courses_link")}
                  className="border-0 bg-primary rounded text-white"
                  style={{ height: "40px",marginTop : "25px" }}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
              </div>
              <div className="d-flex gap-2 align-items-start">
                <InputField
                  className="col"
                  disabled={editField !== "graduation_courses"}
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
                <button
                  onClick={() => setEditField("graduation_courses")}
                  className="border-0 bg-primary rounded text-white"
                  style={{ height: "40px",marginTop : "25px" }}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
              </div>
              <div className="d-flex gap-2 align-items-start">
                <InputField
                  className="col"
                  disabled={editField !== "graduation_courses_link"}
                  name="graduation_courses_link"
                  label="Graduation courses link"
                  placeholder="Graduation courses link"
                  type="url"
                  value={formData.graduation_courses_link}
                  onChange={(e) =>
                    handleChange("graduation_courses_link", e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError("graduation_courses_link", error)
                  }
                />
                <button
                  onClick={() => setEditField("graduation_courses_link")}
                  className="border-0 bg-primary rounded text-white"
                  style={{ height: "40px",marginTop : "25px" }}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
              </div>
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
      )}
      <Toast
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ show: false, message: "" })}
      />
    </div>
  );
};
