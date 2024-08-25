import React from 'react';
import { Pricing } from '../../templates/Pricing';
import { Videos } from '../../organisms/Videos';
import StudentRegistrationForm from '../../organisms/StudentRegistrationForm';

export const StudentPortal = () => {
  return (
    <div className="container mt-3">
      <Pricing />
      <Videos />
      <StudentRegistrationForm />
    </div>
  );
};
