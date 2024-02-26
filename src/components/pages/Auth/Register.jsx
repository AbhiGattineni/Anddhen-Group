import React, { useState } from 'react'
import Toast from '../../organisms/Toast';
import InputField from '../../organisms/InputField';
import { Link } from 'react-router-dom';
import useUnifiedAuth from "src/hooks/useUnifiedAuth";
import useErrorHandling from "src/hooks/useErrorHandling";

export const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmpassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [focus, setFocus] = useState(false);
    const [error, setError] = useState(null); // Use for raw error handling

    // Use the same unified auth and error handling hooks
    const { onGoogleSignIn, onFacebookSignIn, onEmailPasswordUserCreation } = useUnifiedAuth();
    const { errorCode, title, message } = useErrorHandling(error);

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

    const handleSignUp = async (signUpMethod, ...args) => {
        const result = await signUpMethod(...args);
        if (result && !result.success) {
            setError(result.error); // Use setError for dynamic error handling
        } else {
            setError(null);
        }
    };

    // Wrapper functions for sign-up methods
    const handleEmailPasswordSignUp = (email, password) => handleSignUp(() => onEmailPasswordUserCreation(email, password));

    const handleGoogleSignIn = () => handleSignUp(onGoogleSignIn);
    const handleFacebookSignIn = () => handleSignUp(onFacebookSignIn);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid()) return;
        handleEmailPasswordSignUp(formData.email, formData.password);
    };
    return (
        <div className='bg-light min-vh-100 d-flex justify-content-center align-items-center'>
            <div className="bg-white rounded shadow p-4" style={{ maxWidth: "800px", width: "100%" }}>
                <div className="row g-0">
                    <div className="col-md-6 d-none d-md-flex justify-content-center align-items-center">
                        <img src="/loginImage.png" alt="Sign Up" className="img-fluid rounded-start" />
                    </div>
                    <div className="col-md-6">
                        <div className="p-4">
                            <div className="d-flex align-items-center mb-3">
                                <div>Sign up with </div>
                                <div className="ms-3 d-flex gap-3">
                                    <i className="bi bi-google fs-4 cursor-pointer" style={{ color: "#4285F4" }} onClick={handleGoogleSignIn}></i>
                                    <i className="bi bi-facebook fs-4 cursor-pointer" style={{ color: "#3b5998" }} onClick={handleFacebookSignIn}></i>
                                    <i className="bi bi-twitter fs-4 cursor-pointer" style={{ color: "#1DA1F2", pointerEvents: "none", cursor: "default" }}></i>
                                    <i className="bi bi-linkedin fs-4 cursor-pointer" style={{ color: "#0A66C2", pointerEvents: "none", cursor: "default" }}></i>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center my-3">
                                <hr className="flex-fill" />
                                <span className="px-3 bg-white">or</span>
                                <hr className="flex-fill" />
                            </div>
                            {error && <p className="text-danger">{errorCode}-{message}</p>}
                            <form onSubmit={handleSubmit}>
                                <InputField
                                    name="name"
                                    label="Name"
                                    placeholder="Full Name"
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleChange("name", e.target.value)}
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
                                        Submit
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
            {error && <Toast show={true} message={`Error: ${errorCode}-${title}`} onClose={() => setError(null)} />}

        </div>
    )
}
