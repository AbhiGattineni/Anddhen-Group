import React from 'react';
// import InputField from '../../organisms/InputField';
// import { bTechBranches, usStates } from '../../../dataconfig';
// import Toast from '../../organisms/Toast';
// import { Search } from '../../organisms/Search';
// import { ViewColleges } from 'src/components/SuperAdmin/ACS/Colleges/ViewColleges';
import { ViewCollege } from 'src/components/SuperAdmin/ACS/Colleges/CollapsibleTable';

export const EducationConsultant = () => {
  return (
    <div className="container my-3">
      <h2 className="main-heading">Enter details to check eligible colleges list</h2>
      <ViewCollege />
    </div>
  );
};
