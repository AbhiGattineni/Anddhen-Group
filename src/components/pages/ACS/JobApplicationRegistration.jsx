import React from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import resgistration1 from '../../images/resgistration1.png';
import resgistration2 from '../../images/registration2.png';

export const JobApplicationRegistration = () => {
  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-6">
          <Link to={'studentportal'} className="text-decoration-none">
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
          <Link to={'parttimerportal'} className="text-decoration-none">
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
