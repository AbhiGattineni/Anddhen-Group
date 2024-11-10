import React, { useState } from 'react';
import AddConsultantForm from './AddConsultantForm';
import ViewConsultants from './ViewConsultants';
import 'bootstrap/dist/css/bootstrap.min.css'; // Make sure to import Bootstrap CSS
import Employer from './Employer';
import Recruiter from './Recruiter';

const Consultants = () => {
  const [activeView, setActiveView] = useState('add');

  const getNavLinkClass = (path) => {
    return activeView === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <div className="">
      <nav className="navbar navbar-expand-lg navbar-dark bg-secondary mb-4 px-5">
        <a className="navbar-brand" href="#">
          <i className="bi bi-people-fill"></i> Consultant Management
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a
                className={getNavLinkClass('add')}
                href="#"
                onClick={() => setActiveView('add')}
              >
                <i className="bi bi-plus-circle-fill"></i> Add Consultant
              </a>
            </li>
            <li className="nav-item">
              <a
                className={getNavLinkClass('view')}
                href="#"
                onClick={() => setActiveView('view')}
              >
                <i className="bi bi-card-list"></i> View Consultants
              </a>
            </li>
            <li className="nav-item">
              <a
                className={getNavLinkClass('employer')}
                href="#"
                onClick={() => setActiveView('employer')}
              >
                <i className="bi bi-building-add"></i> Employer
              </a>
            </li>
            <li className="nav-item">
              <a
                className={getNavLinkClass('recruiter')}
                href="#"
                onClick={() => setActiveView('recruiter')}
              >
                <i className="bi bi-people-fill"></i> Recruiter
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <div className="container">
        {activeView === 'add' && <AddConsultantForm />}
        {activeView === 'view' && <ViewConsultants />}
        {activeView === 'employer' && <Employer />}
        {activeView === 'recruiter' && <Recruiter />}
      </div>
    </div>
  );
};

export default Consultants;
