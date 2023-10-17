import React from "react";
import { Pricing } from "./Pricing";
import { Videos } from "../organisms/Videos";
import { Link } from "react-router-dom";
import { Registration } from "./inc/Registration";
import { LazyLoadImage } from "react-lazy-load-image-component";
import resgistration1 from "../images/resgistration1.png";
import resgistration2 from "../images/registration2.png";

export const JobApplicationRegistration = () => {
  return (
    // <div className="container mt-3">
    //   <Pricing />
    //   <Videos />
    //   <div className="col-md-12 mb-4 text-center">
    //     <h3 className="main-heading">Practice Test</h3>
    //     <div className="underline mx-auto"></div>
    //   </div>
    //   <div className="row">
    //     <div className="col-md-6 col-lg-6 col-12">
    //       <h3>Job Application Video Checklist: Test Your Understanding</h3>
    //       <p>
    //         This quiz aims to test how well you've grasped the key concepts
    //         presented in those videos. Successfully completing the quiz
    //         demonstrates your commitment and readiness for the job application
    //         process. Ensure you've watched all the videos thoroughly before
    //         attempting. Good luck!
    //       </p>
    //     </div>
    //   </div>
    //   <Link to={"/test"} className="btn btn-warning shadow">
    //     Take Test
    //   </Link>
    //   <Registration />
    // </div>
    <div className="container my-5">
      <div className="row">
        <div className="col-md-6">
          <Link to={"studentportal"} className="text-decoration-none">
            <div className="card">
              <LazyLoadImage
                effect="blur"
                className="card-img-top object-fit-fill"
                src={resgistration1}
                alt="Card image cap"
                height="250px"
              />
              <div className="card-body">
                <div className="d-flex justify-content-center">
                  <p>Student Portal</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Second Card */}
        <div className="col-md-6">
          <Link to={"parttimerportal"} className="text-decoration-none">
            <div className="card">
              <LazyLoadImage
                effect="blur"
                className="card-img-top object-fit-fill"
                src={resgistration2}
                alt="Card image cap"
                height="250px"
              />
              <div className="card-body">
                <div className="d-flex justify-content-center">
                  <p>Part Timer Portal</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
