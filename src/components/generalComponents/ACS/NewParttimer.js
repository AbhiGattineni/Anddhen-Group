import React, { useState } from 'react';
import { PartTimerRegistrationForm } from '../../organisms/PartTimerRegistrationForm';

const NewParttimer = () => {
  const [showForm] = useState(false);

  return (
    <div>
      <div className="justify-content-center ">
        {showForm ? <PartTimerRegistrationForm /> : 'This is the new parttimer page.'}
      </div>
    </div>
  );
};

export default NewParttimer;
