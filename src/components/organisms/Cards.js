import React from "react";
import "./Card.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { details } from "../../dataconfig";

const Cards = () => {
  return (
    <section className="section">
      <div className="container ">
        <div className="row ">
          <div className="col-md-12 mb-4 text-center">
            <h3 className="main-heading mt-4">Our Team</h3>
            <div className="underline mx-auto"></div>
          </div>
          <div className="border rounded row">
            {details.map((detail) => (
              <div className="col-lg-3 col-md-4 col-sm-6 mb-5">
                <div className="card shadow mt-2 p-1 border border-1">
                  <div className="image">
                    <img src={detail.Photo} alt="" />
                  </div>
                  <div className="card-body text-center p-1">
                    <h5>{detail.Name}</h5>
                    <p>
                      {detail.Start_date} - {detail.End_date}
                    </p>
                    <p>{detail.Role}</p>
                    <div className="socials">
                      <a href={detail.Facebook}>
                        <i id="f" className="bi bi-facebook"></i>
                      </a>
                      <a href={detail.LinkedIn}>
                        <i id="l" className="bi bi-linkedin"></i>
                      </a>
                      <a href={detail.GitHub}>
                        <i id="t" className="bi bi-github"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default Cards;
