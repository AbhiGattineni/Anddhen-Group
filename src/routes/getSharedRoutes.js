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
import HappinessIndexAdmin from 'src/components/pages/Admin/HappinessIndexAdmin ';
import ExtensionView from 'src/components/pages/Extension/ExtensionView';
import OnboardingTask from 'src/components/pages/OnboardingTask';
import Stocks from 'src/components/SuperAdmin/Stocks/Stocks';
import QuizAdmin from 'src/components/SuperAdmin/Quiz/QuizAdmin';
import AmbulanceTracking from 'src/components/SuperAdmin/Ambulance/AmbulanceTracking';
import TripSaathiDashboard from 'src/components/SuperAdmin/TripSaathi/TripSaathiDashboard';
export function getSharedRoutes() {
  return [
    { path: 'transactions', element: <Transaction /> },
    { path: 'stocks', element: <Stocks /> },
    { path: 'quiz', element: <QuizAdmin /> },
    { path: 'ambulance', element: <AmbulanceTracking /> },
    { path: 'planningsaathi', element: <TripSaathiDashboard /> },
    { path: 'colleges', element: <Colleges /> },
    { path: 'consultants', element: <Consultants /> },
    { path: 'roleaccess', element: <RolesAndAccess /> },
    { path: 'status', element: <Status /> },
    { path: 'shopping', element: <Shooping /> },
    { path: 'ourTeam', element: <OurTeam /> },
    { path: 'jobapplication/parttimerportal', element: <PartTimerPortal /> },
    { path: 'devicetrackingtable', element: <DeviceAllocation /> },
    { path: 'HappinessIndexAdmin', element: <HappinessIndexAdmin /> },
    { path: 'extension', element: <ExtensionView /> },
    { path: 'onboardingtask', element: <OnboardingTask /> },
  ];
}
