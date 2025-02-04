import React from 'react';
import Slider from '../organisms/Slider';
import Vmc from './inc/Vmc';
import Company from '../organisms/Company';
import Subsidiaries from '../organisms/Subsidiaries';
import { Link } from 'react-router-dom/dist';

function Home() {
  return (
    <div>
      <Slider />
      {/* our company */}
      <Company />
      {/* Our Mission, Vision & Values */}
      <Vmc />
      {/* Subsidiaries */}
      <Subsidiaries />
      <div className="container text-center my-5">
        <div className="row justify-content-center">
          <div className="col-md-8 p-4 border rounded shadow bg-light">
            <div className="col-md-12 mb-4 text-center">
              <h3 className="main-heading">
                Join WhatsApp Groups for US Universities (2024-25)
              </h3>
              <div className="underline mx-auto"></div>
            </div>
            <p>
              Connect with fellow students, get important updates, and discuss
              admissions for the 2024-25 intake. Our WhatsApp groups help
              students stay informed and make better decisions.
            </p>
            <Link
              to="/acs"
              className="btn btn-success btn-lg d-flex align-items-center justify-content-center gap-2 mx-auto"
            >
              <i className="bi bi-whatsapp fs-4"></i> View Groups
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
