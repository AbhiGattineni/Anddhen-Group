import React from 'react';
import { Transaction } from 'src/components/SuperAdmin/transactions/Transaction';
import { Colleges } from 'src/components/SuperAdmin/ACS/Colleges/Colleges';
import Consultants from 'src/components/SuperAdmin/ACS/Consultants/Consultants';
import RolesAndAccess from 'src/components/SuperAdmin/RoleAccess/RolesAndAccess';
import { Status } from 'src/components/SuperAdmin/Status';
import { Shooping } from 'src/components/SuperAdmin/ACS/ShoopingProducts/Shooping';
import OurTeam from 'src/components/SuperAdmin/OurTeam/ourTeam';
import { PartTimerPortal } from 'src/components/pages/ACS/PartTimerPortal';
import DeviceAllocation from 'src/components/organisms/Modal/DeviceAllocation';
export function getSharedRoutes() {
  return [
    { path: 'transactions', element: <Transaction /> },
    { path: 'colleges', element: <Colleges /> },
    { path: 'consultants', element: <Consultants /> },
    { path: 'roleaccess', element: <RolesAndAccess /> },
    { path: 'status', element: <Status /> },
    { path: 'shopping', element: <Shooping /> },
    { path: 'ourTeam', element: <OurTeam /> },
    { path: 'jobapplication/parttimerportal', element: <PartTimerPortal /> },
    { path: 'devicetrackingtable', element: <DeviceAllocation /> },
    // Add other shared routes here
  ];
}
