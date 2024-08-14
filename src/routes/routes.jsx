import React from 'react';
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
import Consultants from 'src/components/SuperAdmin/ACS/Consultants/Consultants';
import SuperAdmin from 'src/components/SuperAdmin/SuperAdmin';
import { Aps } from 'src/components/pages/inc/Aps';
import { Ati } from 'src/components/pages/inc/Ati';
import { StudentPortal } from 'src/components/pages/ACS/StudentPortal';
import { PartTimerPortal } from 'src/components/pages/ACS/PartTimerPortal';
import Layout from './Layout';
import ErrorPage from 'src/components/pages/ErrorPage';
import AdminPage from 'src/components/pages/Admin/AdminPage';
import RolesAndAccess from 'src/components/SuperAdmin/RoleAccess/RolesAndAccess';
import { Transaction } from 'src/components/SuperAdmin/transactions/Transaction';
import { Colleges } from 'src/components/SuperAdmin/ACS/Colleges/Colleges';
import { Profile } from 'src/components/pages/Auth/Profile';
import { Ats } from 'src/components/pages/inc/Ats';
import { Ans } from 'src/components/pages/inc/Ans';
import { EmployeeDashboard } from 'src/components/pages/Admin/EmployeeDashboard';

const createRoutes = (currentRole, filteredRouteConfig) =>
  createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <Home /> },
        { path: 'about', element: <About /> },
        { path: 'contact', element: <Contact /> },
        { path: '/login', element: <Login /> },
        { path: '/register', element: <Register /> },
        { path: '/resetpassword', element: <ForgotPassword /> },
        {
          path: '/profile',
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
        // {
        //   path: '/employeedashboard',
        //   element: (
        //     <ProtectedRoute>
        //       <EmployeeDashboard />
        //     </ProtectedRoute>
        //   ),
        // },
      ],
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
      children: [{ index: true, element: <Ati /> }],
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
      ],
    },
    {
      path: '/admin',
      element: <Layout />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: `/${currentRole}`,
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: Object.entries(filteredRouteConfig).map(([path, element]) => ({
        path: path === '/' ? '' : path,
        element: element,
      })),
    },
  ]);

const DynamicRoutes = () => {
  let fullRouteMap = {
    '/': <SuperAdmin />,
    'acs/consultants': <Consultants />,
    roleaccess: <RolesAndAccess />,
    transactions: <Transaction />,
    'acs/colleges': <Colleges />,
  };

  const currentRole = localStorage.getItem('roles');
  const current_roles = currentRole ? currentRole.split(',') : [];

  let roles = null;
  if (current_roles.includes('superadmin')) {
    roles = 'superadmin';
  } else if (current_roles.includes('employeedashboard')) {
    roles = 'employeedashboard';
    fullRouteMap = Object.fromEntries(
      Object.entries(fullRouteMap).filter(([path]) =>
        current_roles.includes(path)
      )
    );
    fullRouteMap['/'] = <EmployeeDashboard />;
  }
  return createRoutes(roles, fullRouteMap);
};

export default DynamicRoutes;
