import React from "react";
import { Videos } from "../organisms/Videos";
import { Link } from "react-router-dom";
import { PartTimerRegistrationForm } from "../organisms/PartTimerRegistrationForm";

export const PartTimerPortal = () => {
  return (
    <div className="container mt-3">
      <Videos />
      <div className="col-md-12 mb-4 text-center">
        <h3 className="main-heading my-3">Practice Test</h3>
        <div className="underline mx-auto"></div>
      </div>
      <div className="row">
        <div className="col-12">
          <h3>Job Application Video Checklist: Test Your Understanding</h3>
          <p>
            This quiz aims to test how well you've grasped the key concepts
            presented in those videos. Successfully completing the quiz
            demonstrates your commitment and readiness for the job application
            process. Ensure you've watched all the videos thoroughly before
            attempting. Good luck!
          </p>
        </div>
      </div>
      <div className="d-flex justify-content-center align-items-center mb-3">
        {/* <Link
          to={"/test"}
          className="btn btn-warning shadow justify-content-center"
        >
          Take Test
        </Link> */}
      </div>
      <PartTimerRegistrationForm />
    </div>
  );
};
