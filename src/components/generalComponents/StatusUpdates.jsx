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
        name: "",
        date: "",
        studentGroup: "",
        sharedApplications: "",
        searchedApplications: "",
        easyApply: "",
        connectMessages: "",
        recruiterMessages: "",
        role: "",
        status: "",
    });
    const { data, isLoading, isError } = useCalendarData(auth.currentUser.uid);
    const { mutate } = usePostStatus();

    const [fieldsToShow, setFieldsToShow] = useState({
        name: true,
        date: true,
        studentGroup: false,
        sharedApplications: false,
        searchedApplications: false,
        easyApply: false,
        connectMessages: false,
        recruiterMessages: false,
        role: true,
        status: true,
        department: true,
    });

    useEffect(() => {
        // Get the department from the URL (you can replace this with your actual logic)
        const currentDepartment = window.location.pathname.includes("/parttimerportal") ? "ACS" : "";
        setDepartment(currentDepartment);
        updateFieldsToShow(currentDepartment);


        if (auth.currentUser.displayName) {
            setFormValues({
                ...formValues,
                name: auth.currentUser.displayName,
            });
        }
    }, []);

    const updateFieldsToShow = (currentDepartment) => {
        if (currentDepartment === "ACS") {
            // Show ACS-related fields
            setFieldsToShow({
                name: true,
                date: true,
                studentGroup: true,
                sharedApplications: true,
                searchedApplications: true,
                easyApply: true,
                connectMessages: true,
                recruiterMessages: true,
                role: true,
                status: true,
                department: true,
            });
        } else {
            // Show default fields
            setFieldsToShow({
                name: true,
                date: true,
                studentGroup: false,
                sharedApplications: false,
                searchedApplications: false,
                easyApply: false,
                connectMessages: false,
                recruiterMessages: false,
                role: true,
                status: true,
                department: true,
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
                if (key !== "status" && formValues[key]) {
                    combinedStatus += ` ${formValues[key]}`;
                }
            }
            const newStatus = {
                ...formValues,
                firebase_id: auth.currentUser.uid,
                status: combinedStatus,
            };
            const response = await mutate(newStatus); // Call the mutation function with form data

            console.log('Status posted successfully:', response);

            setFormValues({
                name: "",
                date: "",
                studentGroup: "",
                sharedApplications: "",
                searchedApplications: "",
                easyApply: "",
                connectMessages: "",
                recruiterMessages: "",
                role: "",
                status: "",
            });
        } catch (error) {
            console.error('Error posting status:', error);
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
                    {fieldsToShow.name && (
                        <div className="col-12 col-md-6 col-lg-4">
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    placeholder="Name"
                                    value={formValues.name}
                                    onChange={handleInputChange}
                                    disabled
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
                    {fieldsToShow.role && (
                        <div className="col-12 col-md-6 col-lg-4">
                            <div className="mb-3">
                                <select
                                    className="form-select"
                                    id="role"
                                    value={formValues.role}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Role</option>
                                    <option value="Part Timer">Part Timer</option>
                                    <option value="Intern">Intern</option>
                                    <option value="Student Assistant">Student Assistant</option>
                                    <option value="Manager">Manager</option>
                                </select>
                            </div>
                        </div>
                    )}
                    {fieldsToShow.department && (
                        <div className="col-12 col-md-6 col-lg-4">
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="department"
                                    placeholder="Department"
                                    disabled={department === "ACS"}
                                    value={department === "ACS" ? "ACS" : formValues.department}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    )}
                    {fieldsToShow.status && (
                        <div className="col-12 col-md-6 col-lg-4">
                            <div className="mb-3">
                                <textarea
                                    className="form-control"
                                    id="status"
                                    placeholder="Status"
                                    rows="3"
                                    value={formValues.status}
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
