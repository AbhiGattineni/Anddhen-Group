import React from 'react';
import { Transaction } from 'src/components/SuperAdmin/transactions/Transaction';
import { Colleges } from 'src/components/SuperAdmin/ACS/Colleges/Colleges';
import Consultants from 'src/components/SuperAdmin/ACS/Consultants/Consultants';
import RolesAndAccess from 'src/components/SuperAdmin/RoleAccess/RolesAndAccess';
import { Status } from 'src/components/SuperAdmin/Status';

export function getSharedRoutes() {
  return [
    { path: 'transactions', element: <Transaction /> },
    { path: 'colleges', element: <Colleges /> },
    { path: 'consultants', element: <Consultants /> },
    { path: 'roleaccess', element: <RolesAndAccess /> },
    { path: 'status', element: <Status /> },
    // Add other shared routes here
  ];
}
