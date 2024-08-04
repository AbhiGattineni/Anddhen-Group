import React, { useEffect, useState } from "react";
import Select from 'react-select';
import useAuthStore from "src/services/store/globalStore";
import InputField from "src/components/organisms/InputField";
import Toast from "src/components/organisms/Toast";
import ConfirmationDialog from './ConfirmationDialog';
import debounce from 'lodash/debounce';
import '../../../../index.css';

export const AddLinks = () => {
    const collegesList = useAuthStore((state) => state.collegesList);
    const [selectedcollege, setSelectedcollege] = useState(null);
    const [listColleges, setListColleges] = useState([]);
    const [fieldErrors, setFieldErrors] = useState({});
    const [inputDisabled, setInputDisabled] = useState(false);
    const [disableButton, setDisableButton] = useState(true);
    const [toast, setToast] = useState({ show: false, message: "", color: undefined });
    const [listLink, setListLink] = useState([]);
    const [selectedListLink, setSelectedListLink] = useState([]);
    const [editIndex, setEditIndex] = useState(-1);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(-1);
    const [formData, setFormData] = useState({ label: "", link: "", college: "", college_name: "" });

    useEffect(() => {
        setListColleges(collegesList.map((college) => ({ value: college.id, label: college.college_name })));
        const debouncedFetch = debounce(getList, 500);
        debouncedFetch();
        return () => debouncedFetch.cancel();
    }, [collegesList]);

    useEffect(() => {
        setSelectedListLink([]);
        setSelectedcollege(null);
    }, [listLink]);

    function getList() {
        fetch('http://127.0.0.1:8000/college_details/')
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch');
                return res.json();
            })
            .then((json) => {
                setListLink(json);
                setSelectedListLink([]);
                resetForm();
            })
            .catch((error) => {
                console.error('Error fetching college details:', error);
            });
    }

    const handleConfirmation = (index) => {
        setShowConfirmation(true);
        setDeleteIndex(index);
    };

    const handleDelete = (index) => {
        const collegeIdToDelete = selectedListLink[index].id;
        fetch('http://127.0.0.1:8000/college_details/${collegeIdToDelete}/delete/', { method: 'DELETE' })
            .then(response => {
                if (!response.ok) throw new Error('Failed to delete');
                setToast({ show: true, message: "College Link deleted successfully!", color: "#82DD55" });
                setTimeout(() => { setToast({ show: false, message: "", color: undefined }); getList(); }, 3000);
            })
            .catch(error => {
                setToast({ show: true, message: "Failed to delete College Link. Please try again.", color: "#FF6347" });
                setTimeout(() => setToast({ show: false, message: "", color: undefined }), 3000);
            })
            .finally(() => setShowConfirmation(false));
    };

    const handleCancelDelete = () => {
        setShowConfirmation(false);
        setDeleteIndex(-1);
    };

    const handleChange = (field, value) => {
        setFormData(prevFormData => ({ ...prevFormData, [field]: value }));
        if (field === 'label' || field === 'link') {
            setDisableButton(!(formData.label && formData.link && value));
        }
    };

    const handleFieldError = (fieldName, error) => {
        setFieldErrors(prevErrors => ({ ...prevErrors, [fieldName]: error }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const requestData = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) };
        fetch("http://127.0.0.1:8000/college_details/create/", requestData)
            .then(res => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json();
            })
            .then(data => {
                setToast({ show: true, message: "College Links added successfully!", color: "#82DD55" });
                setTimeout(() => { setToast({ show: false, message: "", color: undefined }); getList(); }, 3000);
            })
            .catch(error => {
                setToast({ show: true, message: "Failed to add College Links. Please try again.", color: "#FF6347" });
                setTimeout(() => setToast({ show: false, message: "", color: undefined }), 3000);
            })
            .finally(() => resetForm());
    };

    const resetForm = () => {
        setFormData({ college: "", label: "", link: "", college_name: "" });
        setSelectedcollege(null);
        setDisableButton(true);
        setEditIndex(-1);
    };

    const handleSelectChange = (e) => {
        setSelectedcollege(e);
        setFormData({ college: e.value, college_name: e.label });
        const filteredLinks = listLink.filter(item => item.college === e.value);
        setSelectedListLink(filteredLinks);
    };

    const handleEditClick = (index) => {
        setEditIndex(index);
        setFormData({ label: selectedListLink[index].label, link: selectedListLink[index].link, college: selectedListLink[index].college, college_name: selectedListLink[index].college_name });
    };

    const handleSaveEdit = () => {
        const updatedLinks = [...selectedListLink];
        updatedLinks[editIndex] = { ...updatedLinks[editIndex], label: formData.label, link: formData.link };
        setSelectedListLink(updatedLinks);
        const collegeIdToUpdate = selectedListLink[editIndex].id;
        if (collegeIdToUpdate) {
            const requestData = { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) };
            fetch('http://127.0.0.1:8000/college_details/${collegeIdToUpdate}/update/', requestData)
                .then(res => {
                    if (!res.ok) throw new Error('Network response was not ok');
                    setToast({ show: true, message: "College Links updated successfully!", color: "#82DD55" });
                    setTimeout(() => { setToast({ show: false, message: "", color: undefined }); getList(); }, 3000);
                })
                .catch(error => {
                    setToast({ show: true, message: "Failed to update College Links. Please try again.", color: "#FF6347" });
                    setTimeout(() => setToast({ show: false, message: "", color: undefined }), 3000);
                })
                .finally(() => setEditIndex(-1));
        } else {
            // If no collegeIdToUpdate, handle as adding a new row
            const newLink = { label: formData.label, link: formData.link, college: selectedcollege.value, college_name: selectedcollege.label };
            fetch("http://127.0.0.1:8000/college_details/create/", { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newLink) })
                .then(res => {
                    if (!res.ok) throw new Error('Network response was not ok');
                    setToast({ show: true, message: "College Links added successfully!", color: "#82DD55" });
                    setTimeout(() => { setToast({ show: false, message: "", color: undefined }); getList(); }, 3000);
                })
                .catch(error => {
                    setToast({ show: true, message: "Failed to add College Links. Please try again.", color: "#FF6347" });
                    setTimeout(() => setToast({ show: false, message: "", color: undefined }), 3000);
                })
                .finally(() => resetForm());
        }
    };

    const handleAddRow = (e) => {
        e.preventDefault(); // Prevent form submission
        const newLink = { label: "", link: "", college: selectedcollege.value, college_name: selectedcollege.label };
        setSelectedListLink([...selectedListLink, newLink]);
        setEditIndex(-1); // Ensure edit mode is exited
    };

    const handleCancelEdit = () =>{
        setDisableButton(true);
        setEditIndex(-1);  // Reset editIndex to exit edit mode
    }


    return (
        <div className="container py-3 border">
            <Select
                value={selectedcollege}
                onChange={handleSelectChange}
                options={listColleges}
                isMulti={false}
                placeholder={"Search colleges ..."}
            />
            <form onSubmit={handleSubmit}>
                <div className="my-3">
                    <h5>College Links Details</h5>
                    <div className="underline"></div>
                    {selectedListLink.length > 0 ? (
                        selectedListLink.map((item, index) => (
                            <div className="d-flex justify-content align-items-center" key={index}>
                                {editIndex === index ? (
                                    <>
                                        <InputField
                                            disabled={inputDisabled}
                                            name={`college_label_${index}`}
                                            label={`Label`}
                                            type="text"
                                            className="col p-1"
                                            value={formData.label}
                                            onChange={(e) => handleChange("label", e.target.value)}
                                            setError={(error) => handleFieldError(`college_label_${index}`, error)}
                                        />
                                        <InputField
                                            disabled={inputDisabled}
                                            name={`link_${index}`}
                                            label={`College Link`}
                                            type="text"
                                            className="col p-1"
                                            value={formData.link}
                                            onChange={(e) => handleChange("link", e.target.value)}
                                            setError={(error) => handleFieldError(`link_${index}`, error)}
                                        />
                                        <i className="icon_color bi bi-check pt-4 icon-400" onClick={() => handleSaveEdit(item.id)}></i>
                                        <i class="bi bi-x icon_color pt-4 icon-400" onClick={() => handleCancelEdit()}></i>
                                        {/* <button className="" >X</button> */}
                                    </>
                                ) : (
                                    <>
                                        <InputField
                                            disabled
                                            name={`college_label_${index}`}
                                            label={`Label`}
                                            type="text"
                                            className="col p-1 wd-50"
                                            value={item.label}
                                        />
                                        <InputField
                                            disabled
                                            name={`link_${index}`}
                                            label={`College Link`}
                                            type="text"
                                            className="col p-1 w-50"
                                            value={item.link}
                                        />
                                        <i className="icon_color_edit bi bi-pencil ml-2 pt-4" onClick={() => handleEditClick(index)} style={{ cursor: 'pointer' }}></i>
                                        <i className="icon_color bi bi-trash ml-2 pt-4" onClick={() => handleConfirmation(index)} style={{ cursor: 'pointer' }}></i>
                                    </>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="d-flex">
                            <InputField
                                disabled={inputDisabled}
                                name="college_label"
                                label="Label"
                                type="text"
                                className="col p-1"
                                value={formData.label}
                                onChange={(e) => handleChange("label", e.target.value)}
                                setError={(error) => handleFieldError("college_label", error)}
                            />
                            <InputField
                                disabled={inputDisabled}
                                name="link"
                                label="College Link"
                                type="text"
                                className="col p-1"
                                value={formData.link}
                                onChange={(e) => handleChange("link", e.target.value)}
                                setError={(error) => handleFieldError("link", error)}
                            />
                        </div>
                    )}
                </div>
                {selectedListLink.length === 0 ? (
                    <div className="form-group py-3 w-100 d-flex justify-content-center gap-3">
                        <button type="submit" className="btn btn-warning shadow px-5" disabled={disableButton}>
                            Add Link
                        </button>
                    </div>
                ) : (
                    <div className="form-group py-3 w-100 d-flex justify-content-center gap-3">
                        <button onClick={handleAddRow} className="btn btn-warning shadow my-3">Add New Row</button>
                    </div>
                )}
            </form>
            <Toast show={toast.show} message={toast.message} color={toast.color} onClose={() => setToast({ show: false, message: "", color: undefined })} />
            <ConfirmationDialog
                show={showConfirmation}
                message="Are you sure you want to delete this college link?"
                onConfirm={() => handleDelete(deleteIndex)}
                onCancel={handleCancelDelete}
            />
        </div>
    );
};