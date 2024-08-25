import React from 'react';
import { adminPlates } from '../../dataconfig';
import AssignCards from '../pages/Admin/AssignCards';

const SuperAdmin = () => {
  return (
    <div>
      <AssignCards adminPlates={adminPlates} />
    </div>
  );
};

export default SuperAdmin;
