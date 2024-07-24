import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <section className="section footer bg-dark text-white">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h6>Company Information</h6>
            <hr />
            <p className="text-white">
            Anddhen is a conglomerate specializing in consulting, trading, travel, marketing, philanthropy, and software services. We provide top-notch consultancy and implementation expertise to enhance the value of your business.
            </p>
            <div className="socials">
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
          <div className="col-md-4">
            <h6>Quick Links</h6>
            <hr />
            <div>
              <Link to="/">Home</Link>
            </div>
            <div>
              <Link to="/about">About</Link>
            </div>
            <div>
              <Link to="/contact">Contact</Link>
            </div>
            <div>
              <Link to="/blog">blog</Link>
            </div>
          </div>
          <div className="col-md-4">
            <h6>Contact Information</h6>
            <hr />
            <div>
              <p className="text-white mb-1">
                <i className="bi bi-geo-alt-fill me-3"></i>Jaggaiahpet, Andhra Pradesh, India
              </p>
            </div>
            <div>
              <p className="text-white mb-1">
                <i className="bi bi-telephone-fill me-3"></i>+91 8801043608
              </p>
            </div>
            <div>
              <p className="text-white mb-1">
                <i className="bi bi-envelope me-3"></i>anddhenconsulting@gmail.com
              </p>
            </div>
            {/* <div>
              <a
                className="fw-bolder text-decoration-underline badge bg-warning"
                href="https://abhishekgattineni.com/"
              >
                Developed by Abhishek Gattineni
              </a>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Footer;
