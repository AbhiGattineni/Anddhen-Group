import React, { useState } from 'react';
import AddConsultantForm from './AddConsultantForm';
import ViewConsultants from './ViewConsultants';
import 'bootstrap/dist/css/bootstrap.min.css'; // Make sure to import Bootstrap CSS

const Consultants = () => {
  const [activeView, setActiveView] = useState('add');

  const getNavLinkClass = (path) => {
    return activeView === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <div className="container">
      <nav className="navbar navbar-expand-lg navbar-dark bg-secondary rounded mb-4 px-3">
        <a className="navbar-brand" href="#">
          <i className="bi bi-people-fill"></i> Consultant Management
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
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
          </ul>
        </div>
      </nav>

      {activeView === 'add' && <AddConsultantForm />}
      {activeView === 'view' && <ViewConsultants />}
    </div>
  );
};

export default Consultants;
