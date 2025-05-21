import React from 'react';
import { MainLayout } from 'src/App';
import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';
import Home from 'src/components/pages/Home';
import About from 'src/components/pages/About';
import Contact from 'src/components/pages/Contact';
import { Acs } from 'src/components/pages/inc/Acs';
import { Ams } from 'src/components/pages/inc/Ams';
import { Ass } from 'src/components/pages/inc/Ass';
import { JobApplicationRegistration } from 'src/components/pages/ACS/JobApplicationRegistration';
import { EducationConsultant } from 'src/components/pages/ACS/EducationConsultant';
import { Login } from 'src/components/pages/Auth/Login';
import { Register } from 'src/components/pages/Auth/Register';
import { ForgotPassword } from 'src/components/pages/Auth/ForgotPassword';
import SuperAdmin from 'src/components/SuperAdmin/SuperAdmin';
import { Aps } from 'src/components/pages/inc/Aps';
import { Ati } from 'src/components/pages/inc/Ati';
import { StudentPortal } from 'src/components/pages/ACS/StudentPortal';
import { AddColleges } from 'src/components/pages/ACS/AddColleges';
import { EditColleges } from 'src/components/pages/ACS/EditColleges';
import { PartTimerPortal } from 'src/components/pages/ACS/PartTimerPortal';
import Layout from './Layout';
import ErrorPage from 'src/components/pages/ErrorPage';
import { EmployeeDashboard } from 'src/components/pages/Admin/EmployeeDashboard';
import NotAuthorizedPage from 'src/components/pages/NotAuthorizedPage'; // Ensure this is imported correctly
import { getSharedRoutes } from './getSharedRoutes';
import { Profile } from 'src/components/pages/Auth/Profile';
import Ats from 'src/components/pages/inc/Ats';
import Ans from 'src/components/pages/inc/Ans';
import ResumeHome from 'src/components/pages/resume/ResumeHome';
import FinanceDataUpload from 'src/components/pages/inc/FinanceDataUpload';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout logout={false} />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'resetpassword', element: <ForgotPassword /> },
      { path: 'not-authorized', element: <NotAuthorizedPage /> },
    ],
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: '/ass',
    element: <Layout />,
    children: [{ index: true, element: <Ass /> }],
  },
  {
    path: '/ams',
    element: <Layout />,
    children: [{ index: true, element: <Ams /> }],
  },
  {
    path: '/aps',
    element: <Layout />,
    children: [{ index: true, element: <Aps /> }],
  },
  {
    path: '/ati',
    element: <Layout />,
    children: [
      { index: true, element: <Ati /> },
      { path: 'finance-data', element: <FinanceDataUpload /> },
    ],
  },
  {
    path: '/ats',
    element: <Layout />,
    children: [{ index: true, element: <Ats /> }],
  },
  {
    path: '/ans',
    element: <Layout />,
    children: [{ index: true, element: <Ans /> }],
  },
  {
    path: '/acs',
    element: <Layout />,
    children: [
      { index: true, element: <Acs /> },
      { path: 'jobapplication', element: <JobApplicationRegistration /> },
      {
        path: 'jobapplication/studentportal',
        element: (
          <ProtectedRoute>
            <StudentPortal />
          </ProtectedRoute>
        ),
      },
      {
        path: 'educationconsulting',
        element: (
          <ProtectedRoute>
            <EducationConsultant />
          </ProtectedRoute>
        ),
      },
      {
        path: 'jobapplication/parttimerportal',
        element: (
          <ProtectedRoute>
            <PartTimerPortal />
          </ProtectedRoute>
        ),
      },
      {
        path: 'resume-building',
        element: <ResumeHome />,
      },
    ],
  },
  {
    path: '/employeedashboard',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <EmployeeDashboard />
          </ProtectedRoute>
        ),
      },
      ...getSharedRoutes().map(route => ({
        ...route,
        element: <ProtectedRoute>{route.element}</ProtectedRoute>,
      })),
    ],
  },
  {
    path: '/superadmin',
    element: (
      <ProtectedRoute requiredRoles={['superadmin']}>
        <Layout />
      </ProtectedRoute>
    ),
    children: [{ index: true, element: <SuperAdmin /> }, ...getSharedRoutes()],
  },
  {
    path: '/acs/educationconsulting/addcolleges',
    element: (
      <MainLayout>
        <AddColleges />
      </MainLayout>
    ),
  },
  {
    path: '/acs/educationconsulting/editcolleges',
    element: (
      <MainLayout>
        <EditColleges />
      </MainLayout>
    ),
  },
  {
    path: '/updatesandstatus',
    element: <MainLayout>{/* Add your Update and Status component here */}</MainLayout>,
  },
  {
    path: '/test',
    element: <MainLayout>{/* Add your Test component here */}</MainLayout>,
  },
  {
    path: '/admin_portal',
    element: <MainLayout>{/* Add your AdminPortal component here */}</MainLayout>,
  },
  {
    path: '/quiz',
    element: <MainLayout>{/* Add your Quiz component here */}</MainLayout>,
  },
]);

export default router;
