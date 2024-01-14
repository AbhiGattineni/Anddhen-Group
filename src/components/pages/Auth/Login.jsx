import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { handleFormSubmit } from "./AuthFunctions";
import LoginForm from "./LoginForm";
import { signInWithGoogle } from "../../../services/Authentication/firebase";
import MissingDataForm from "./MissingdataForm";
import usePostUserData from "../../../hooks/usePostUserData";

export const Login = () => {
  const navigate = useNavigate();
  const [googleUserData, setGoogleUserData] = useState(null);
  const [showMissingDataForm, setShowMissingDataForm] = useState(false);
  const [missingData, setMissingData] = useState({});

  const { postUserData, response, error, isLoading } = usePostUserData();

  const onGoogleSignIn = () => {
    signInWithGoogle()
      .then((result) => {
        if (result._tokenResponse?.isNewUser) {
          const user = result.user;
          const userData = {
            user_id: user.uid,
            full_name: user.displayName,
            first_name: "",
            last_name: "",
            phone_country_code: "",
            phone_number: user.phoneNumber,
            email_id: user.email,
            enrolled_services: [],
          };
          if (user.displayName) {
            const names = user.displayName.split(" ");
            userData.first_name = names[0];
            if (names.length > 1) {
              userData.last_name = names[names.length - 1];
            }
          }
          userData.enrolled_services.push(
            sessionStorage.getItem("preLoginPath")
          );
          checkForMissingData(userData);
        } else {
          proceedToNextStep();
        }
      })
      .catch((error) => {
        console.error("Error during sign in with Google: ", error);
      });
  };
  const checkForMissingData = (userData) => {
    const requiredFields = [
      "first_name",
      "last_name",
      "phone_country_code",
      "user_id",
      "email_id",
      "phone_number",
      "full_name",
    ];
    let missing = {};
    requiredFields.forEach((field) => {
      if (!userData[field]) {
        missing[field] = true;
      }
    });
    setGoogleUserData(userData);
    if (Object.keys(missing).length > 0) {
      setMissingData(missing);
      setShowMissingDataForm(true);
    } else {
      postUserData(userData).then(() => {
        proceedToNextStep();
      });
    }
  };

  const proceedToNextStep = () => {
    const preLoginPath = sessionStorage.getItem("preLoginPath") || "/";
    navigate(preLoginPath);
    sessionStorage.removeItem("preLoginPath");
  };

  const onFormCompleted = async (completedData) => {
    const updatedUserData = { ...googleUserData, ...completedData };

    await postUserData(updatedUserData);

    if (response) {
      console.log("Response from API:", response);
      proceedToNextStep();
    }

    if (error) {
      console.error("API call error:", error);
    }
  };

  return (
    <div className="bg-light">
      {showMissingDataForm ? (
        <MissingDataForm
          missingData={missingData}
          onCompleted={onFormCompleted}
        />
      ) : (
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
      )}
    </div>
  );
};
