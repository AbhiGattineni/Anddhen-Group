import React, { useState } from 'react'
import Toast from '../../organisms/Toast';
import InputField from '../../organisms/InputField';
import { Link } from 'react-router-dom';

export const Register = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmpassword:""
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
            setToast({ show: true, message: "Account created" });
            setTimeout(() => setToast({ show: false, message: "" }), 3000);
        } catch (error) {
            setToast({ show: true, message: "Something went wrong!" });
            setTimeout(() => setToast({ show: false, message: "" }), 3000);
            console.error("Error:", error);
        }
    };
    return (
        <div className='bg-light'>
            <div className="container d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <div className="bg-white w-100 rounded shadow">
                    <div className="row p-3">
                        <div className="col w-50 d-none d-md-block d-lg-block">
                            image
                        </div>
                        <div className="col w-50">
                            <div className="d-flex align-items-center mb-3">
                                <div>Sign up with </div>
                                <div className="ms-3 d-flex gap-3">
                                    <i className="fs-3 cursor-pointer bi bi-google" style={{ color: "#4285F4" }}></i>
                                    <i className="fs-3 cursor-pointer bi bi-facebook" style={{ color: "#3b5998" }}></i>
                                    <i className="fs-3 cursor-pointer bi bi-twitter" style={{ color: "#1DA1F2" }}></i>
                                    <i className="fs-3 cursor-pointer bi bi-linkedin" style={{ color: "#0A66C2" }}></i>
                                </div>
                            </div>
                            <div className="row justify-content-center align-items-center">
                                <div className="col">
                                    <hr />
                                </div>
                                <div className='col col-auto mb-1 fw-bold'>or</div>
                                <div className="col">
                                    <hr />
                                </div>
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
                                        <i onClick={() => setShowPassword1(!showPassword1)} className={`bi ${showPassword1 ? "bi-eye-slash-fill" : "bi-eye-fill"} position-absolute end-0 translate-middle-y me-3 mt-3 pb-2 cursor-pointer`} style={{top:"35px"}}></i>
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
                                        <i onClick={() => setShowPassword2(!showPassword2)} className={`bi ${showPassword2 ? "bi-eye-slash-fill" : "bi-eye-fill"} position-absolute end-0 translate-middle-y me-3 mt-3 pb-2 cursor-pointer`} style={{top:"35px"}}></i>
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
                            <div className="d-flex align-items-center gap-2">
                                <div>Already have an account? </div>
                                <Link to="/login" className="text-primary fw-bold text-decoration-none">login</Link>
                            </div>
                        </div>
                    </div>
                    <div className="row bg-dark m-1 p-2 align-items-center">
                        <div className='col text-white text-center text-md-start'>Copyright &copy; 2023. All rights reserved.</div>
                        <div className="socials col-12 col-md-auto p-0">
                            <a href="/">
                                <i className="bi bi-facebook"></i>
                            </a>
                            <a href="/">
                                <i className="bi bi-linkedin"></i>
                            </a>
                            <a href="/">
                                <i className="bi bi-github"></i>
                            </a>
                            <a href="/">
                                <i className="bi bi-twitter"></i>
                            </a>
                            <a href="/">
                                <i className="bi bi-instagram"></i>
                            </a>
                            <a href="/">
                                <i className="bi bi-youtube"></i>
                            </a>
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
