import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import resgistration1 from "../../images/resgistration1.png";
import resgistration2 from "../../images/registration2.png";
import { Link } from "react-router-dom";

export const Acs = () => {
  return (
    <>
      <div className="container mt-3">
        <h1 className="main-heading">Anddhen Consulting Services</h1>
        <p>
          Welcome to Anddhen Consulting Services, the emerging leader in
          next-gen business solutions. As a startup, we understand the nuances
          and agility required in today's fast-paced world. Our fresh,
          innovative approach ensures that we're not just meeting your
          expectations, but exceeding them. Whether you're a fellow startup
          seeking guidance, or an established enterprise aiming for
          revitalization, Anddhen is poised to propel your business into the
          future. Let's embark on this journey together and redefine success.
        </p>
        <div className="row justify-content-md-center">
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="card card-cascade shadow">
              <div className="view view-cascade overlay shadow">
                <LazyLoadImage
                  effect="blur"
                  height="250px"
                  width="100%"
                  className="card-img-top object-fit-fill"
                  src={resgistration1}
                  alt="Card image cap"
                />
              </div>
              <div className="card-body card-body-cascade text-center">
                <h4 className="card-title text-black">
                  Higher education consulting
                </h4>
                <p className="card-text">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Voluptatibus, ex, recusandae. Facere modi sunt, quod
                  quibusdam.
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="card card-cascade shadow">
              <div className="view view-cascade overlay shadow">
                <LazyLoadImage
                  effect="blur"
                  className="card-img-top object-fit-fill"
                  src={resgistration2}
                  alt="Card image cap"
                  height="250px"
                />
              </div>
              <div className="card-body card-body-cascade text-center">
                <Link to={"jobapplication"} className="text-decoration-none">
                  <h4 className="card-title text-black">Job applications</h4>
                </Link>
                <p className="card-text">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Voluptatibus, ex, recusandae. Facere modi sunt, quod
                  quibusdam.
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="card card-cascade shadow">
              <div className="view view-cascade overlay shadow">
                <LazyLoadImage
                  effect="blur"
                  className="card-img-top object-fit-fill"
                  src={resgistration2}
                  alt="Card image cap"
                  height="250px"
                />
              </div>
              <div className="card-body card-body-cascade text-center">
                <Link to={"jobapplication"} className="text-decoration-none">
                  <h4 className="card-title text-black">Courses</h4>
                </Link>
                <p className="card-text">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Voluptatibus, ex, recusandae. Facere modi sunt, quod
                  quibusdam.
                </p>
              </div>
            </div>
          </div>
        </div>
        <h4>Contact Us</h4>
        <div className="underline"></div>
        <div className="">
          <p>
            <i className="bi bi-envelope me-3"></i>email@domain.com
          </p>
          <p>
            <i className="bi bi-telephone-fill me-3"></i>+91 8801043608
          </p>
        </div>
      </div>
    </>
  );
};
