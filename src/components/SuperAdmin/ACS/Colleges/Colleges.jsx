import React from 'react';
import { AddColleges } from './AddColleges';
// import { ViewColleges } from './ViewColleges';
import { AddLinks } from './AddLinks';
import { ViewCollege } from './CollapsibleTable';

export const Colleges = () => {
  return (
    <div className="container my-3">
      <h2 className="main-heading my-4">ACS Colleges</h2>
      <ul className="nav nav-tabs" id="myTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active"
            id="home-tab"
            data-bs-toggle="tab"
            data-bs-target="#home"
            type="button"
            role="tab"
            aria-controls="home"
            aria-selected="true"
          >
            Add Colleges
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="link-tab"
            data-bs-toggle="tab"
            data-bs-target="#link"
            type="button"
            role="tab"
            aria-controls="link"
            aria-selected="false"
          >
            Add Links
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="profile-tab"
            data-bs-toggle="tab"
            data-bs-target="#profile"
            type="button"
            role="tab"
            aria-controls="profile"
            aria-selected="false"
          >
            View Colleges
          </button>
        </li>
      </ul>
      <div className="tab-content" id="myTabContent">
        <div
          className="tab-pane fade show active"
          id="home"
          role="tabpanel"
          aria-labelledby="home-tab"
        >
          <AddColleges />
        </div>
        <div
          className="tab-pane fade"
          id="link"
          role="tabpanel"
          aria-labelledby="link-tab"
        >
          <AddLinks />
        </div>
        <div
          className="tab-pane fade"
          id="profile"
          role="tabpanel"
          aria-labelledby="profile-tab"
        >
          <ViewCollege />
        </div>
      </div>
    </div>
  );
};
