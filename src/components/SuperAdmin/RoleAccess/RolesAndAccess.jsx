import React from 'react';
import RoleAccess from './RoleAccess';
import AssignCardAccess from './AssignCardAccess';
import RoleManager from './RoleManager';

const RolesAndAccess = () => {
  return (
    <div className="container">
      <h2 className="my-4">Roles Management</h2>
      <ul className="nav nav-tabs" id="myTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active"
            id="userroles-tab"
            data-bs-toggle="tab"
            data-bs-target="#userroles"
            type="button"
            role="tab"
            aria-controls="userroles"
            aria-selected="true"
          >
            User Roles
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="cardaccess-tab"
            data-bs-toggle="tab"
            data-bs-target="#cardaccess"
            type="button"
            role="tab"
            aria-controls="cardaccess"
            aria-selected="false"
          >
            Card Access
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="home-tab"
            data-bs-toggle="tab"
            data-bs-target="#home"
            type="button"
            role="tab"
            aria-controls="home"
            aria-selected="false"
          >
            Add Role
          </button>
        </li>
        {/* <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="contact-tab"
            data-bs-toggle="tab"
            data-bs-target="#contact"
            type="button"
            role="tab"
            aria-controls="contact"
            aria-selected="false"
          >
            Tab 3
          </button>
        </li> */}
      </ul>
      <div className="tab-content" id="myTabContent">
        <div
          className="tab-pane fade show active"
          id="userroles"
          role="tabpanel"
          aria-labelledby="userroles-tab"
        >
          <RoleManager />
        </div>
        <div
          className="tab-pane fade"
          id="cardaccess"
          role="tabpanel"
          aria-labelledby="cardaccess-tab"
        >
          <AssignCardAccess />
        </div>
        <div className="tab-pane fade" id="home" role="tabpanel" aria-labelledby="home-tab">
          <RoleAccess />
        </div>
        {/* <div
          className="tab-pane fade"
          id="contact"
          role="tabpanel"
          aria-labelledby="contact-tab"
        >
          <p>Content for Tab 3</p>
        </div> */}
      </div>
    </div>
  );
};

export default RolesAndAccess;
