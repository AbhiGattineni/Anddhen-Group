import React, { useState } from "react";
import InputField from "../../organisms/InputField";
import { Link } from "react-router-dom";

const LoginForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [focus, setFocus] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid()) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
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
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
          onFocus={() => setFocus(true)}
          setError={(error) => handleFieldError("password", error)}
        />
        {focus && formData.password.length ? (
          <i
            onClick={() => setShowPassword(!showPassword)}
            className={`bi ${
              showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"
            } position-absolute end-0 translate-middle-y me-3 mt-3 pb-2 cursor-pointer`}
            style={{ top: "35px" }}
          ></i>
        ) : null}
      </div>
      <div className="row">
        <div className="col"></div>
        <Link
          to="/resetpassword"
          className="col col-auto cursor-pointer m-0 text-decoration-none text-black"
        >
          Forget Password?
        </Link>
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
  );
};

export default LoginForm;
