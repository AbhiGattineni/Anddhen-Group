import React, { useState, useEffect } from "react";
import BasicForm from "../../organisms/Forms/BasicForm";
import BasicTable from "../../organisms/Table/BasicTable";

const Consultants = () => {
  const [consultants, setConsultants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    fullName: "",
    visaStatus: "",
    college: "",
    technology: "",
    dob: "", // Date of Birth
    originalResume: "", // This could be a file or a link to a file
    title: "",
    email: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/consultants/")
      .then((response) => response.json())
      .then((data) => {
        setConsultants(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, []);

  const validateForm = () => {
    let newErrors = {};
    // Simple front-end validation, you can expand this based on your needs
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.fullName.trim())
      newErrors.fullName = "Full name is required.";
    if (!formData.visaStatus.trim())
      newErrors.visaStatus = "Visa status is required.";
    if (!formData.college.trim()) newErrors.college = "College is required.";
    if (!formData.technology.trim())
      newErrors.technology = "Technology is required.";
    if (!formData.dob.trim()) newErrors.dob = "Date of birth is required.";
    // Assuming originalResume is a URL to a file
    if (!formData.originalResume.trim())
      newErrors.originalResume = "Original resume is required.";
    if (!formData.title.trim()) newErrors.title = "Title is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const method = formData.id ? "PUT" : "POST";
    const url = formData.id
      ? `http://127.0.0.1:8000/api/consultants/${formData.id}/`
      : "http://127.0.0.1:8000/api/consultants/";

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        const updatedConsultants = formData.id
          ? consultants.map((consultant) =>
              consultant.id === formData.id ? data : consultant
            )
          : [...consultants, data];
        setConsultants(updatedConsultants);
        setFormData({
          name: "",
          fullName: "",
          visaStatus: "",
          college: "",
          technology: "",
          dob: "",
          originalResume: "",
          title: "",
          email: "",
        }); // Reset form
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
      });
  };

  const handleEdit = (consultant) => {
    setFormData(consultant);
  };

  return (
    <div className="container mt-3">
      <h1>Consultants</h1>
      <div className="card card-body mt-4 mb-4">
        <BasicForm
          formData={formData}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          errors={errors}
        />
      </div>
      {isLoading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <BasicTable data={consultants} onEdit={handleEdit} />
      )}
    </div>
  );
};

export default Consultants;
