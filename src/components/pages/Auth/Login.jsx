import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { handleFormSubmit } from "./AuthFunctions";
import LoginForm from "./LoginForm";
import { signInWithGoogle } from "../../../services/Authentication/firebase";
import usePostUserData from "../../../hooks/usePostUserData";

export const Login = () => {
  const navigate = useNavigate();

  const { postUserData } = usePostUserData();

  const onGoogleSignIn = () => {
    signInWithGoogle()
      .then(async (data) => {
        await postUserData(data.user);
        proceedToNextStep();

      })
      .catch((error) => {
        console.error("Error during sign in with Google: ", error);
      });
  };

  const proceedToNextStep = () => {
    const preLoginPath = sessionStorage.getItem("preLoginPath") || "/";
    navigate(preLoginPath);
    sessionStorage.removeItem("preLoginPath");
  };

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="card shadow-lg rounded p-4 mx-auto" style={{ maxWidth: '600px' }}>
          <div className="text-center mb-4">
            <h2>Sign In</h2>
          </div>
          <div className="d-flex align-items-center mb-3">
            <div>Sign in with</div>
            <div className="ms-3 d-flex gap-3">
              <i className="bi bi-google fs-4 cursor-pointer" onClick={onGoogleSignIn} style={{ transition: 'transform 0.2s', color: "#4285F4" }}></i>
              <i className="bi bi-facebook fs-4 cursor-pointer" style={{ transition: 'transform 0.2s', color: "#3b5998" }}></i>
              <i className="bi bi-twitter fs-4 cursor-pointer" style={{ transition: 'transform 0.2s', color: "#1DA1F2" }}></i>
              <i className="bi bi-linkedin fs-4 cursor-pointer" style={{ transition: 'transform 0.2s', color: "#0A66C2" }}></i>
              {/* Add other social icons here */}
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-center my-4">
            <div style={{ flexGrow: 1, height: "1px", backgroundColor: "#d3d3d3" }}></div>
            <span className="px-2" style={{ backgroundColor: "#fff", position: "relative", zIndex: 1 }}>or</span>
            <div style={{ flexGrow: 1, height: "1px", backgroundColor: "#d3d3d3" }}></div>
          </div>

          <LoginForm onSubmit={handleFormSubmit} />
          <div className="d-flex justify-content-center mt-3">
            <span>Don't have an account? </span>
            <Link to="/register" className="text-primary fw-bold text-decoration-none ms-1">
              Register
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};
