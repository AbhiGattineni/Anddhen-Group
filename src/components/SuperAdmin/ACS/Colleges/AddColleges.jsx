import { isDisabled } from "@testing-library/user-event/dist/utils";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import InputField from "src/components/organisms/InputField";
import { Search } from "src/components/organisms/Search";
import Toast from "src/components/organisms/Toast";
import { usStates } from "src/dataconfig";

export const AddColleges = () => {
  const queryClient = useQueryClient();
  const [selectedcollege, setSelectedcollege] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [addedColleges, setAddedColleges] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [disableButton, setDisableButton] = useState(true);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [formData, setFormData] = useState({
    college_name: "",
    website_link: "",
    college_email: "",
    college_email_link: "",
    college_phone: "",
    college_phone_link: "",
    public_private: "",
    international_UG_link: "",
    international_graduation_link: "",
    international_person_email: "",
    international_person_email_link: "",
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
    UG_courses: "",
    UG_courses_link: "",
    graduation_courses: "",
    graduation_courses_link: "",
  });

  const resetForm = () => {
    setFormData({
      college_name: "",
      website_link: "",
      college_email: "",
      college_email_link: "",
      college_phone: "",
      college_phone_link: "",
      public_private: "",
      international_UG_link: "",
      international_graduation_link: "",
      international_person_email: "",
      international_person_email_link: "",
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
      UG_courses: "",
      UG_courses_link: "",
      graduation_courses: "",
      graduation_courses_link: "",
    });
  };

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const fetchColleges = async () => {
    const response = await fetch(`${API_BASE_URL}/colleges/all/`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const {
    data: colleges = [], // Provide a default value of an empty array
    error,
  } = useQuery("colleges", fetchColleges);
  useEffect(() => {
    setAddedColleges(() => {
      const collegeNames = colleges.map((college) => ({
        value: college.id,
        label: college.college_name,
      }));
      return collegeNames;
    });
  }, [colleges]);

  useEffect(() => {
    const selectedCollegeData = colleges.find(
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
  }, [selectedcollege, colleges]);

  // Extracting keys from formData
  useEffect(() => {
    const allFieldsFilled = Object.values(formData).every(
      (value) => value !== ""
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

  const { mutate: addCollege, isLoading } = useMutation(
    (formData) =>
      fetch(`${API_BASE_URL}/colleges/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }).then((res) => res.json()),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("colleges");
        resetForm();
        setToast({ show: true, message: "College added successfully!" });
        setTimeout(() => setToast({ show: false, message: "" }), 3000);
      },
      onError: (error) => {
        console.error("An error occurred:", error);
        setToast({ show: true, message: "Something went wrong!" });
        setTimeout(() => setToast({ show: false, message: "" }), 3000);
        // Handle error state or display error message
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    addCollege(formData);
    resetForm();
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setInputDisabled(false);
  };

  const { mutate: updateCollege, isLoading: isUpdating } = useMutation(
    ({ id, formData }) =>
      fetch(`${API_BASE_URL}/colleges/${id}/update/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }).then((res) => res.json()),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("colleges");
        resetForm();
        setToast({ show: true, message: "College updated successfully!" });
        setTimeout(() => setToast({ show: false, message: "" }), 3000);
      },
      onError: (error) => {
        console.error("An error occurred:", error);
        setToast({ show: true, message: "Something went wrong!" });
        setTimeout(() => setToast({ show: false, message: "" }), 3000);
        // Handle error state or display error message
      },
    }
  );

  const handleSave = (e) => {
    e.preventDefault();
    updateCollege({ id: selectedcollege?.value, formData });
  };

  const { mutate: deleteCollege, isLoading: isDeleting } = useMutation(
    (id) =>
      fetch(`${API_BASE_URL}/colleges/${id}/delete/`, {
        method: "DELETE",
      }).then((res) => {
        // Only attempt to parse JSON if the response is not 204 No Content
        if (res.ok && res.status !== 204) {
          return res.json();
        } else {
          // Handle no content response or other HTTP status codes as needed
          return res;
        }
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("colleges");
        resetForm()
        setSelectedcollege(null)
        setInputDisabled(false)
        setToast({ show: true, message: "College deleted successfully!" });
        setTimeout(() => setToast({ show: false, message: "" }), 3000);
        setIsEdit(false);
      },
      onError: (error) => {
        console.error("An error occurred:", error);
        setToast({ show: true, message: "Something went wrong!" });
        setTimeout(() => setToast({ show: false, message: "" }), 3000);
      },
    }
  );

  const handleDelete = (e) => {
    e.preventDefault();
    deleteCollege(selectedcollege?.value);
  };

  return (
    <div className="container py-3 border">
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "90vh" }}
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
            placeholder={"search colleges ..."}
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
                onChange={(e) => handleChange("college_name", e.target.value)}
                setError={(error) => handleFieldError("college_name", error)}
              />
              <div className="row row-cols-md-2 row row-cols-sm-2 row-cols-1 g-2">
                <InputField
                  disabled={inputDisabled}
                  name="website_link"
                  label="Website Link"
                  type="url"
                  className="col p-1"
                  value={formData.website_link}
                  onChange={(e) => handleChange("website_link", e.target.value)}
                  setError={(error) => handleFieldError("website_link", error)}
                />
                <InputField
                  disabled={inputDisabled}
                  name="college_email"
                  label="College Email"
                  type="email"
                  className="col p-1"
                  value={formData.college_email}
                  onChange={(e) =>
                    handleChange("college_email", e.target.value)
                  }
                  setError={(error) => handleFieldError("college_email", error)}
                />
                <InputField
                  disabled={inputDisabled}
                  name="college_email_link"
                  label="College Email Link"
                  type="url"
                  className="col p-1"
                  value={formData.college_email_link}
                  onChange={(e) =>
                    handleChange("college_email_link", e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError("college_email_link", error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  name="college_phone"
                  label="College Phone"
                  type="tel"
                  className="col p-1"
                  value={formData.college_phone}
                  onChange={(e) =>
                    handleChange("college_phone", e.target.value)
                  }
                  setError={(error) => handleFieldError("college_phone", error)}
                />
                <InputField
                  disabled={inputDisabled}
                  name="college_phone_link"
                  label="College Phone Link"
                  type="url"
                  className="col p-1"
                  value={formData.college_phone_link}
                  onChange={(e) =>
                    handleChange("college_phone_link", e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError("college_phone_link", error)
                  }
                />
                <div className="col">
                  <label htmlFor="public_private" className="form-label">
                    Public/Private
                    <span
                      className="text-danger"
                      style={{ userSelect: "none" }}
                    >
                      {" "}
                      *
                    </span>
                  </label>
                  <select
                    name="public_private"
                    id="public_private"
                    className="form-select"
                    value={formData.public_private}
                    onChange={(e) =>
                      handleChange("public_private", e.target.value)
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
                  name="international_UG_link"
                  label="International UG Link"
                  type="url"
                  className="col p-1"
                  value={formData.international_UG_link}
                  onChange={(e) =>
                    handleChange("international_UG_link", e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError("international_UG_link", error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  name="international_graduation_link"
                  label="International Graduation Link"
                  type="url"
                  className="col p-1"
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
                <InputField
                  disabled={inputDisabled}
                  name="international_person_email"
                  label="International Person Email"
                  type="email"
                  className="col p-1"
                  value={formData.international_person_email}
                  onChange={(e) =>
                    handleChange("international_person_email", e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError("international_person_email", error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  name="international_person_email_link"
                  label="International Person Email Link"
                  type="url"
                  className="col p-1"
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
              </div>
            </div>

            <div className="my-3">
              <h5>Application Links and Fees</h5>
              <div className="underline"></div>
              <div className="row row-cols-md-2 row row-cols-sm-2 row-cols-1 g-2">
                <InputField
                  disabled={inputDisabled}
                  name="application_UG_link"
                  label="Application UG Link"
                  type="url"
                  className="col p-1"
                  value={formData.application_UG_link}
                  onChange={(e) =>
                    handleChange("application_UG_link", e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError("application_UG_link", error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  name="application_graduation_link"
                  label="Application Graduation Link"
                  type="url"
                  className="col p-1"
                  value={formData.application_graduation_link}
                  onChange={(e) =>
                    handleChange("application_graduation_link", e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError("application_graduation_link", error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  name="application_UG_fee"
                  label="Application UG Fee"
                  type="text"
                  className="col p-1"
                  value={formData.application_UG_fee}
                  onChange={(e) =>
                    handleChange("application_UG_fee", e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError("application_UG_fee", error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  name="application_UG_fee_link"
                  label="Application UG Fee Link"
                  type="url"
                  className="col p-1"
                  value={formData.application_UG_fee_link}
                  onChange={(e) =>
                    handleChange("application_UG_fee_link", e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError("application_UG_fee_link", error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  name="application_graduation_fee"
                  label="Application Graduation Fee"
                  type="text"
                  className="col p-1"
                  value={formData.application_graduation_fee}
                  onChange={(e) =>
                    handleChange("application_graduation_fee", e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError("application_graduation_fee", error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  name="application_graduation_fee_link"
                  label="Application Graduation Fee Link"
                  type="url"
                  className="col p-1"
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
              </div>
            </div>

            <div className="my-3">
              <h5>Test Scores and Links</h5>
              <div className="underline"></div>
              <div className="row row-cols-md-2 row row-cols-sm-2 row-cols-1 g-2">
                <InputField
                  disabled={inputDisabled}
                  name="gre_score"
                  label="GRE Score"
                  type="text"
                  className="col p-1"
                  value={formData.gre_score}
                  onChange={(e) => handleChange("gre_score", e.target.value)}
                  setError={(error) => handleFieldError("gre_score", error)}
                />
                <InputField
                  disabled={inputDisabled}
                  name="gre_score_link"
                  label="GRE Score Link"
                  type="url"
                  className="col p-1"
                  value={formData.gre_score_link}
                  onChange={(e) =>
                    handleChange("gre_score_link", e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError("gre_score_link", error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  name="toefl_UG_score"
                  label="TOEFL UG Score"
                  type="text"
                  className="col p-1"
                  value={formData.toefl_UG_score}
                  onChange={(e) =>
                    handleChange("toefl_UG_score", e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError("toefl_UG_score", error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  name="toefl_UG_score_link"
                  label="TOEFL UG Score Link"
                  type="url"
                  className="col p-1"
                  value={formData.toefl_UG_score_link}
                  onChange={(e) =>
                    handleChange("toefl_UG_score_link", e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError("toefl_UG_score_link", error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  name="toefl_graduation_score"
                  label="TOEFL Graduation Score"
                  type="text"
                  className="col p-1"
                  value={formData.toefl_graduation_score}
                  onChange={(e) =>
                    handleChange("toefl_graduation_score", e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError("toefl_graduation_score", error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  name="toefl_graduation_score_link"
                  label="TOEFL Graduation Score Link"
                  type="url"
                  className="col p-1"
                  value={formData.toefl_graduation_score_link}
                  onChange={(e) =>
                    handleChange("toefl_graduation_score_link", e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError("toefl_graduation_score_link", error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  name="ielts_ug_score"
                  label="IELTS UG Score"
                  type="text"
                  className="col p-1"
                  value={formData.ielts_ug_score}
                  onChange={(e) =>
                    handleChange("ielts_ug_score", e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError("ielts_ug_score", error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  name="ielts_ug_score_link"
                  label="IELTS UG Score Link"
                  type="url"
                  className="col p-1"
                  value={formData.ielts_ug_score_link}
                  onChange={(e) =>
                    handleChange("ielts_ug_score_link", e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError("ielts_ug_score_link", error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  name="ielts_graduation_score"
                  label="IELTS Graduation Score"
                  type="text"
                  className="col p-1"
                  value={formData.ielts_graduation_score}
                  onChange={(e) =>
                    handleChange("ielts_graduation_score", e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError("ielts_graduation_score", error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  name="ielts_graduation_score_link"
                  label="IELTS Graduation Score Link"
                  type="url"
                  className="col p-1"
                  value={formData.ielts_graduation_score_link}
                  onChange={(e) =>
                    handleChange("ielts_graduation_score_link", e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError("ielts_graduation_score_link", error)
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
                  name="fall_deadline_UG"
                  label="Fall Deadline UG"
                  type="text"
                  className="col p-1"
                  value={formData.fall_deadline_UG}
                  onChange={(e) =>
                    handleChange("fall_deadline_UG", e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError("fall_deadline_UG", error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  name="fall_deadline_UG_link"
                  label="Fall Deadline UG Link"
                  type="url"
                  className="col p-1"
                  value={formData.fall_deadline_UG_link}
                  onChange={(e) =>
                    handleChange("fall_deadline_UG_link", e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError("fall_deadline_UG_link", error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  name="fall_deadline_graduation"
                  label="Fall Deadline Graduation"
                  type="text"
                  className="col p-1"
                  value={formData.fall_deadline_graduation}
                  onChange={(e) =>
                    handleChange("fall_deadline_graduation", e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError("fall_deadline_graduation", error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  name="fall_deadline_graduation_link"
                  label="Fall Deadline Graduation Link"
                  type="url"
                  className="col p-1"
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
                <InputField
                  disabled={inputDisabled}
                  name="spring_deadline_UG"
                  label="Spring Deadline UG"
                  type="text"
                  className="col p-1"
                  value={formData.spring_deadline_UG}
                  onChange={(e) =>
                    handleChange("spring_deadline_UG", e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError("spring_deadline_UG", error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  name="spring_deadline_UG_link"
                  label="Spring Deadline UG Link"
                  type="url"
                  className="col p-1"
                  value={formData.spring_deadline_UG_link}
                  onChange={(e) =>
                    handleChange("spring_deadline_UG_link", e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError("spring_deadline_UG_link", error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  name="spring_deadline_graduation"
                  label="Spring Deadline Graduation"
                  type="text"
                  className="col p-1"
                  value={formData.spring_deadline_graduation}
                  onChange={(e) =>
                    handleChange("spring_deadline_graduation", e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError("spring_deadline_graduation", error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  name="spring_deadline_graduation_link"
                  label="Spring Deadline Graduation Link"
                  type="url"
                  className="col p-1"
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
              </div>
            </div>

            <div className="my-3">
              <h5>Courses</h5>
              <div className="underline"></div>
              <div className="row row-cols-md-2 row row-cols-sm-2 row-cols-1 g-2">
                <InputField
                  disabled={inputDisabled}
                  name="UG_courses"
                  label="UG Courses"
                  type="text"
                  className="col p-1"
                  value={formData.UG_courses}
                  onChange={(e) => handleChange("UG_courses", e.target.value)}
                  setError={(error) => handleFieldError("UG_courses", error)}
                />
                <InputField
                  disabled={inputDisabled}
                  name="UG_courses_link"
                  label="UG Courses Link"
                  type="url"
                  className="col p-1"
                  value={formData.UG_courses_link}
                  onChange={(e) =>
                    handleChange("UG_courses_link", e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError("UG_courses_link", error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  name="graduation_courses"
                  label="Graduation Courses"
                  type="text"
                  className="col p-1"
                  value={formData.graduation_courses}
                  onChange={(e) =>
                    handleChange("graduation_courses", e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError("graduation_courses", error)
                  }
                />
                <InputField
                  disabled={inputDisabled}
                  name="graduation_courses_link"
                  label="Graduation Courses Link"
                  type="url"
                  className="col p-1"
                  value={formData.graduation_courses_link}
                  onChange={(e) =>
                    handleChange("graduation_courses_link", e.target.value)
                  }
                  setError={(error) =>
                    handleFieldError("graduation_courses_link", error)
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
                  {isLoading ? "loading..." : "Submit"}
                </button>
              ) : (
                <>
                  {inputDisabled ? (
                    <button
                      type="submit"
                      className="btn btn-primary shadow px-5"
                      onClick={handleEdit}
                    >
                      {"Edit"}
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-primary shadow px-5"
                      onClick={handleSave}
                    >
                      {isUpdating ? "loading..." : "Save"}
                    </button>
                  )}
                  <button
                    type="submit"
                    className="btn btn-danger shadow px-5"
                    onClick={handleDelete}
                  >
                    {isDeleting ? "loading..." : "Delete"}
                  </button>
                </>
              )}
            </div>
          </form>
          <Toast
            show={toast.show}
            message={toast.message}
            onClose={() => setToast({ show: false, message: "" })}
          />
        </>
      )}
    </div>
  );
};