import React from 'react';
import { Pricing } from '../../templates/Pricing';
import { Videos } from '../../organisms/Videos';
import StudentRegistrationForm from '../../organisms/StudentRegistrationForm';
import { ExtensionDetails } from '../Extension/ExtensionDetails';

export const StudentPortal = () => {
  return (
    <div className="container mt-3">
      <Pricing />
      <ExtensionDetails />
      <Videos />
      <StudentRegistrationForm />
    </div>
  );
};
