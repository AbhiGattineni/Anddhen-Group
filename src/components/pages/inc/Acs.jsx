import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import resgistration1 from "../../images/resgistration1.png";
import resgistration2 from "../../images/registration2.png";
import { Link } from "react-router-dom";
import { acsCards } from "../../../dataconfig";

export const Acs = () => {
  return (
    <div className="container mt-3">
      <h1 className="main-heading">Anddhen Consulting Services</h1>
      <p>
        Welcome to Anddhen Consulting Services, the emerging leader in next-gen
        business solutions. As a startup, we understand the nuances and agility
        required in today's fast-paced world. Our fresh, innovative approach
        ensures that we're not just meeting your expectations, but exceeding
        them. Whether you're a fellow startup seeking guidance, or an
        established enterprise aiming for revitalization, Anddhen is poised to
        propel your business into the future. Let's embark on this journey
        together and redefine success.
      </p>
      <div className="row justify-content-md-center">
        {acsCards.map((data, index) => (
          <div key={index} className="col-lg-4 col-md-6 mb-4">
            <div className="card card-cascade shadow">
              <div className="view view-cascade overlay shadow">
                <LazyLoadImage
                  effect="blur"
                  height="250px"
                  width="100%"
                  className="card-img-top object-fit-fill"
                  src={data.image}
                  alt="Card image cap"
                />
              </div>
              <div className="card-body card-body-cascade text-center">
                <Link to={data.path} className="text-decoration-none">
                  <h4 className="card-title text-black">{data.heading}</h4>
                </Link>
                <p className="card-text">{data.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="row gap-3 mx-2 mx-md-0 my-3">
        <Link
          to="/acs/educationconsulting/addcolleges"
          className="col col-12 col-md text-center text-decoration-none shadow-sm border p-3"
        >
          <div>
            <p className="fw-bold text-black">Add a college</p>
            <code className="m-0">educationconsulting/addcolleges</code>
          </div>
        </Link>
        <Link
          to="/acs/educationconsulting/editcolleges"
          className="col col-12 col-md text-center text-decoration-none shadow-sm border p-3"
        >
          <div>
            <p className="fw-bold text-black">Edit a college</p>
            <code className="m-0">educationconsulting/editcolleges</code>
          </div>
        </Link>
      </div>
      <h4>Contact Us</h4>
      <div className="underline"></div>
      <div>
        <p>
          <i className="bi bi-envelope me-3"></i>anddhenconsulting@gmail.com
        </p>
        <p style={{ marginBottom: 0 }}>
          <i className="bi bi-telephone-fill me-3"></i>+91 9110736115
        </p>
        <a href="https://wa.me/919110736115" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <i className="bi bi-whatsapp" style={{ fontSize: '18px', color: 'green', marginRight: "8px" }}></i>
          <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>+91 9110736115</span>
        </a>
      </div>

    </div>
  );
};
