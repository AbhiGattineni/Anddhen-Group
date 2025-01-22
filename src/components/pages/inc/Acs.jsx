import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Link } from 'react-router-dom';
import { acsCards } from '../../../dataconfig';
import 'react-lazy-load-image-component/src/effects/blur.css';
import CollegeWhatsappLinks from 'src/components/organisms/CollegeWhatsappLinks';
import { Helmet } from 'react-helmet-async/lib';

export const Acs = () => {
  return (
    <>
      <Helmet>
        <title>Anddhen Consulting Services | Anddhen Group</title>
        <meta
          name="description"
          content="WhatsApp groups links according to the US university 2024-25"
        />
        <link rel="cononical" href="/acs" />
      </Helmet>
      <div className="container mt-3">
        <h1 className="main-heading">Anddhen Consulting Services</h1>
        <p>
          Welcome to Anddhen Consulting Services, the emerging leader in
          next-gen business solutions. As a startup, we understand the nuances
          and agility required in today&apos;s fast-paced world. Our fresh,
          innovative approach ensures that we&apos;re not just meeting your
          expectations, but exceeding them. Whether you&apos;re a fellow startup
          seeking guidance, or an established enterprise aiming for
          revitalization, Anddhen is poised to propel your business into the
          future. Let&apos;s embark on journey together and redefine success.
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
        <h4 className="text-center pt-4">
          WhatsApp groups links according to the US university 2024-25
        </h4>
        <div className="row justify-content-md-center px-0">
          <CollegeWhatsappLinks />
        </div>
      </div>
      <div className="bg-c-light py-1">
        <div className="container">
          <h4 className="row justify-content-md-left ps-3 ps-md-0">
            Contact Us
          </h4>
          <div className="ps-2 ps-md-0">
            <div className="underline"></div>
          </div>
          <div className="d-flex flex-column flex-md-row justify-content-between">
            <p
              style={{ marginBottom: 5 }}
              className="fw-bold d-flex align-items-center"
            >
              <i className="bi bi-envelope-fill text-primary bg-white rounded-circle p-2 me-3 d-inline-flex justify-content-center align-items-center"></i>
              <a
                href="mailto:anddhenconsulting@gmail.com"
                className="text-decoration-none text-dark fw-bold"
              >
                anddhenconsulting@gmail.com
              </a>
            </p>
            <p
              style={{ marginBottom: 5 }}
              className="fw-bold d-flex align-items-center"
            >
              <i className="bi bi-telephone-fill text-primary bg-white rounded-circle p-2 me-3 d-inline-flex justify-content-center align-items-center"></i>
              +91 9110736115
            </p>
            <a
              href="https://wa.me/919110736115"
              target="_blank"
              rel="noopener noreferrer"
              className="d-flex align-items-center text-decoration-none fw-bold "
              style={{ marginBottom: 5 }}
            >
              <i
                className="bi bi-whatsapp bg-white rounded-circle p-2 me-3 d-inline-flex justify-content-center align-items-center"
                style={{
                  fontSize: '14px',
                  color: 'green',
                  marginRight: '4px',
                }}
              ></i>
              <span
                style={{
                  fontSize: '14px',
                }}
              >
                +91 9110736115
              </span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
