import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { handleFormSubmit } from "./AuthFunctions";
import LoginForm from "./LoginForm";
import { auth, signInWithGoogle } from "../../../services/Authentication/firebase";
import MissingDataForm from "./MissingdataForm";
import usePostUserData from "../../../hooks/usePostUserData";
import useAuthStore from "../../../services/store/globalStore";

export const Login = () => {
  const navigate = useNavigate();
  const [googleUserData, setGoogleUserData] = useState(null);
  const [showMissingDataForm, setShowMissingDataForm] = useState(false);
  const [missingData, setMissingData] = useState({});

  const { postUserData, response, error, isLoading } = usePostUserData();

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
    <div className="bg-light">
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: "90vh", padding: "10px" }}
      >
        <div className="bg-white rounded shadow">
          <div className="row p-3">
            <div className="col w-50">
              <div className="d-flex align-items-center mb-3">
                <div>Sign in with </div>
                <div className="ms-3 d-flex gap-3">
                  <i
                    className="fs-3 cursor-pointer bi bi-google"
                    style={{ color: "#4285F4" }}
                    onClick={onGoogleSignIn}
                  ></i>
                  <i
                    className="fs-3 cursor-pointer bi bi-facebook"
                    style={{ color: "#3b5998" }}
                  ></i>
                  <i
                    className="fs-3 cursor-pointer bi bi-twitter"
                    style={{ color: "#1DA1F2" }}
                  ></i>
                  <i
                    className="fs-3 cursor-pointer bi bi-linkedin"
                    style={{ color: "#0A66C2" }}
                  ></i>
                </div>
              </div>
              <div className="row justify-content-center align-items-center">
                <div className="col">
                  <hr />
                </div>
                <div className="col col-auto mb-1 fw-bold">or</div>
                <div className="col">
                  <hr />
                </div>
              </div>
              <LoginForm onSubmit={handleFormSubmit} />
              <div className="d-flex align-items-center gap-2">
                <div>Don't have an account? </div>
                <Link
                  to="/register"
                  className="text-primary fw-bold text-decoration-none"
                >
                  register
                </Link>
              </div>
            </div>
          </div>
          <div className="row bg-dark m-1 p-2 align-items-center">
            <div className="col text-white text-center text-md-start">
              Copyright &copy; 2023. All rights reserved.
            </div>
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
    </div>
  );
};
