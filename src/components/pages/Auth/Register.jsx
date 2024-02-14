import React, { useState } from 'react'
import Toast from '../../organisms/Toast';
import InputField from '../../organisms/InputField';
import { Link } from 'react-router-dom';

export const Register = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmpassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [focus, setFocus] = useState(false);
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

        try {
            setFormData({
                email: "",
                password: "",
                confirmpassword: ""
            })
            setToast({ show: true, message: "Account created" });
            setTimeout(() => setToast({ show: false, message: "" }), 3000);
        } catch (error) {
            setToast({ show: true, message: "Something went wrong!" });
            setTimeout(() => setToast({ show: false, message: "" }), 3000);
            console.error("Error:", error);
        }
    };
    return (
        <div className='bg-light min-vh-100 d-flex justify-content-center align-items-center'>
            <div className="bg-white rounded shadow p-4" style={{ maxWidth: "800px", width: "100%" }}>
                <div className="row g-0">
                    <div className="col-md-6 d-none d-md-flex justify-content-center align-items-center">
                        <img src="/loginImage.png" alt="Sign Up" className="img-fluid rounded-start" /> {/* Placeholder for your image */}
                    </div>
                    <div className="col-md-6">
                        <div className="p-4">
                            <div className="d-flex align-items-center mb-3">
                                <div>Sign up with </div>
                                <div className="ms-3 d-flex gap-3">
                                    <i className="bi bi-google fs-4 cursor-pointer" style={{ color: "#4285F4" }}></i>
                                    <i className="bi bi-facebook fs-4 cursor-pointer" style={{ color: "#3b5998" }}></i>
                                    <i className="bi bi-twitter fs-4 cursor-pointer" style={{ color: "#1DA1F2" }}></i>
                                    <i className="bi bi-linkedin fs-4 cursor-pointer" style={{ color: "#0A66C2" }}></i>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center my-3">
                                <hr className="flex-fill" />
                                <span className="px-3 bg-white">or</span>
                                <hr className="flex-fill" />
                            </div>
                            <form onSubmit={handleSubmit}>
                                <InputField
                                    name="name"
                                    label="Name"
                                    placeholder="Full Name"
                                    type="text"
                                    value={formData.partTimerName}
                                    onChange={(e) => handleChange("partTimerName", e.target.value)}
                                    setError={(error) => handleFieldError("name", error)}
                                />
                                <InputField
                                    name="email"
                                    label="Email Address"
                                    placeholder="Enter valid email address"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                    setError={(error) => handleFieldError("email", error)}
                                />
                                <div className="position-relative">
                                    <InputField
                                        name="password"
                                        label="Password"
                                        placeholder="Enter password"
                                        type={showPassword1 ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(e) => handleChange("password", e.target.value)}
                                        onFocus={() => setFocus(true)}
                                        setError={(error) => handleFieldError("password", error)}
                                    />
                                    {focus && formData.password.length ?
                                        <i onClick={() => setShowPassword1(!showPassword1)} className={`bi ${showPassword1 ? "bi-eye-slash-fill" : "bi-eye-fill"} position-absolute end-0 translate-middle-y me-3 mt-3 pb-2 cursor-pointer`} style={{ top: "35px" }}></i>
                                        : null}
                                </div>
                                <div className="position-relative">
                                    <InputField
                                        name="confirmpassword"
                                        label="Confirm Password"
                                        placeholder="Enter password"
                                        type={showPassword2 ? "text" : "password"}
                                        value={formData.confirmpassword}
                                        onChange={(e) => handleChange("confirmpassword", e.target.value)}
                                        onFocus={() => setFocus(true)}
                                        setError={(error) => handleFieldError("confirmpassword", error)}
                                        data={formData.password}
                                    />
                                    {focus && formData.confirmpassword.length ?
                                        <i onClick={() => setShowPassword2(!showPassword2)} className={`bi ${showPassword2 ? "bi-eye-slash-fill" : "bi-eye-fill"} position-absolute end-0 translate-middle-y me-3 mt-3 pb-2 cursor-pointer`} style={{ top: "35px" }}></i>
                                        : null}
                                </div>
                                <div className={`form-group mb-2`}>
                                    <button
                                        type="submit"
                                        className="btn btn-warning shadow w-100 mt-2"
                                        disabled={!isFormValid()}
                                    >
                                        {loading ? "Loading..." : "Submit"}
                                    </button>
                                </div>
                            </form>
                            <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
                                <div>Already have an account?</div>
                                <Link to="/login" className="text-primary fw-bold text-decoration-none">Login</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Toast
                show={toast.show}
                message={toast.message}
                onClose={() => setToast({ show: false, message: "" })}
            />
        </div>
    )
}
