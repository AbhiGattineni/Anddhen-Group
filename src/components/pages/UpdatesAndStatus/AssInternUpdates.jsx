import React, { useState } from "react";
import InputField from "../../organisms/InputField";
import Toast from "../../organisms/Toast";
import { useApi } from "../../../hooks/useApi";
import TextAreaField from "../../atoms/TextAreaField";

const AssInternUpdates = () => {
  const [showToast, setShowToast] = useState(false);

  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { loading, callApi } = useApi();

  const resetForm = () => {
    setDate("");
    setName("");
    setDescription("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("date", date);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("sheetName", "Intern Status");

    try {
      await callApi(formData);
      resetForm();
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="py-3">
      <div className="col-md-12 mb-4 text-center">
        <h3 className="main-heading">ACS Interns Daily Updates</h3>
        <div className="underline mx-auto"></div>
      </div>
      <div className="card shadow-sm p-3 my-3">
        <div className="d-flex align-items-center justify-content-center">
          <div className="col-md-6">
            <h5 className="">Daily Updates</h5>
            <div className="underline"></div>
            <form onSubmit={handleSubmit}>
              <InputField
                name="date"
                label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <InputField
                name="name"
                label="Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextAreaField
                name="description"
                label="Description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="form-group py-3">
                <button
                  type="submit"
                  className="btn btn-warning shadow w-100"
                  disabled={!date || !name || !description}
                >
                  {loading ? "Loading..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Toast show={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
};

export default AssInternUpdates;
