import React, { useState, useEffect } from "react";
import { StatusCalendar } from "../templates/StatusCalender";
import { auth } from "../../services/Authentication/firebase";
import { useCalendarData } from "../../react-query/useCalenderData";
import { usePostStatus } from "../../react-query/usePostStatus";

const mockData = [
  ["2024-01-10", "John"],
  ["2024-01-15", "Alice"],
  ["2024-01-20", "Bob"],
  // Add more data as needed
];

const empName = "";

const StatusUpdates = () => {
  const [department, setDepartment] = useState("");
  const [formValues, setFormValues] = useState({
    parttimerName: "",
    studentName: "",
    date: "",
    sharedApplications: "",
    searchedApplications: "",
    easyApply: "",
    connectMessages: "",
    recruiterMessages: "",
    reason: "",
    description: "",
  });
  const { data, isLoading, isError } = useCalendarData(auth.currentUser.uid);
  const { mutate } = usePostStatus();

  const [fieldsToShow, setFieldsToShow] = useState({
    parttimerName: true,
    studentName: true,
    date: true,
    sharedApplications: false,
    searchedApplications: false,
    easyApply: false,
    connectMessages: false,
    recruiterMessages: false,
    reason: false,
    description: false,
  });

  useEffect(() => {
    // Get the department from the URL (you can replace this with your actual logic)
    const currentDepartment = window.location.pathname.includes(
      "/parttimerportal"
    )
      ? "ACS"
      : "";
    setDepartment(currentDepartment);
    updateFieldsToShow(currentDepartment);

    if (auth.currentUser.displayName) {
      setFormValues({
        ...formValues,
        parttimerName: auth.currentUser.displayName,
      });
    }
  }, []);

  const updateFieldsToShow = (currentDepartment) => {
    if (currentDepartment === "ACS") {
      // Show ACS-related fields
      setFieldsToShow({
        parttimerName: true,
        studentName: true,
        date: true,
        sharedApplications: true,
        searchedApplications: true,
        easyApply: true,
        connectMessages: true,
        recruiterMessages: true,
        reason: true,
        description: true,
      });
    } else {
      // Show default fields
      setFieldsToShow({
        parttimerName: true,
        studentName: true,
        date: true,
        sharedApplications: false,
        searchedApplications: false,
        easyApply: false,
        connectMessages: false,
        recruiterMessages: false,
        reason: true,
        description: true,
      });
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormValues({
      ...formValues,
      [id]: value,
    });
  };
  const formattedData = data ? data.map((item) => [item.date, item.name]) : [];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Combine all form field values into a single string
      let combinedStatus = formValues.status; // Start with the existing status

      // Loop through formValues and concatenate all non-empty fields
      for (const key in formValues) {
        if ((key !== "reason" || key!=="description") && formValues[key]) {
          combinedStatus += ` ${formValues[key]}`;
        }
      }
      const newStatus = {
        ...formValues,
        firebase_id: auth.currentUser.uid,
        status: combinedStatus,
      };
      const response = await mutate(newStatus); // Call the mutation function with form data

      console.log("Status posted successfully:", response);

      setFormValues({
        parttimerName: "",
        studentName: "",
        date: "",
        sharedApplications: "",
        searchedApplications: "",
        easyApply: "",
        connectMessages: "",
        recruiterMessages: "",
        reason: "",
        description: "",
      });
    } catch (error) {
      console.error("Error posting status:", error);
    }
  };

  function getMaxDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return (
    <div>
      {/* Form Section */}
      <form className="form" onSubmit={handleSubmit}>
        <h2>Status Update Form</h2>
        <div className="row">
          {fieldsToShow.parttimerName && (
            <div className="col-12 col-md-6 col-lg-4">
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="parttimerName"
                  placeholder="Parttimer Name"
                  value={formValues.parttimerName}
                  onChange={handleInputChange}
                  disabled
                />
              </div>
            </div>
          )}
          {fieldsToShow.studentName && (
            <div className="col-12 col-md-6 col-lg-4">
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="studentName"
                  placeholder="Student Name"
                  value={formValues.studentName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}
          {fieldsToShow.date && (
            <div className="col-12 col-md-6 col-lg-4">
              <div className="mb-3">
                <input
                  type="date"
                  className="form-control"
                  id="date"
                  placeholder="Date"
                  value={formValues.date}
                  onChange={handleInputChange}
                  max={getMaxDate()}
                />
              </div>
            </div>
          )}
          {fieldsToShow.studentGroup && (
            <div className="col-12 col-md-6 col-lg-4">
              <div className="mb-3">
                <input
                  type="number"
                  className="form-control"
                  id="studentGroup"
                  placeholder="Student Group (Number)"
                  value={formValues.studentGroup}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}
          {fieldsToShow.sharedApplications && (
            <div className="col-12 col-md-6 col-lg-4">
              <div className="mb-3">
                <input
                  type="number"
                  className="form-control"
                  id="sharedApplications"
                  placeholder="No. of Student Shared Applications"
                  value={formValues.sharedApplications}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}
          {fieldsToShow.searchedApplications && (
            <div className="col-12 col-md-6 col-lg-4">
              <div className="mb-3">
                <input
                  type="number"
                  className="form-control"
                  id="searchedApplications"
                  placeholder="No. of Searched Applications"
                  value={formValues.searchedApplications}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}
          {fieldsToShow.easyApply && (
            <div className="col-12 col-md-6 col-lg-4">
              <div className="mb-3">
                <input
                  type="number"
                  className="form-control"
                  id="easyApply"
                  placeholder="No. of Easy Apply"
                  value={formValues.easyApply}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}
          {fieldsToShow.connectMessages && (
            <div className="col-12 col-md-6 col-lg-4">
              <div className="mb-3">
                <input
                  type="number"
                  className="form-control"
                  id="connectMessages"
                  placeholder="No. of Connect Messages"
                  value={formValues.connectMessages}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}
          {fieldsToShow.recruiterMessages && (
            <div className="col-12 col-md-6 col-lg-4">
              <div className="mb-3">
                <input
                  type="number"
                  className="form-control"
                  id="recruiterMessages"
                  placeholder="No. of Recruiter Messages"
                  value={formValues.recruiterMessages}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}
          {fieldsToShow.reason && (
            <div className="col-12 col-md-6 col-lg-4">
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="reason"
                  placeholder="Reason"
                  value={formValues.reason}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}
          {fieldsToShow.description && (
            <div className="col-12 col-md-6 col-lg-4">
              <div className="mb-3">
                <textarea
                  className="form-control"
                  id="description"
                  placeholder="Daily status message from whatsapp"
                  rows="3"
                  value={formValues.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 d-flex justify-content-center">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>

      {/* Calendar Section */}
      <div className="row">
        <div className="col-12">
          <StatusCalendar data={formattedData} empName={empName} />
        </div>
      </div>
    </div>
  );
};

export default StatusUpdates;
