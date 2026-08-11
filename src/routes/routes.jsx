import React from 'react';
import { MainLayout } from 'src/App';
import { createBrowserRouter, Navigate, useParams } from 'react-router-dom';
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
import VideoEditor from 'src/components/pages/inc/VideoEditor';
import TermsAndConditions from 'src/components/pages/Policies/TermsAndConditions';
import PrivacyPolicy from 'src/components/pages/Policies/PrivacyPolicy';
import RefundPolicy from 'src/components/pages/Policies/RefundPolicy';
import ReturnPolicy from 'src/components/pages/Policies/ReturnPolicy';
import ShippingPolicy from 'src/components/pages/Policies/ShippingPolicy';
import QuizPlay from 'src/components/pages/Quiz/QuizPlay';
import SubmitQuestion from 'src/components/pages/Quiz/SubmitQuestion';
import AmbulanceTracking from 'src/components/SuperAdmin/Ambulance/AmbulanceTracking';
import TripSaathiDashboard from 'src/components/SuperAdmin/TripSaathi/TripSaathiDashboard';

/** Carries a deep /superadmin/<rest> link over to /employeedashboard/<rest>. */
const SuperAdminRedirect = () => {
  const { '*': rest } = useParams();
  return <Navigate to={`/employeedashboard${rest ? `/${rest}` : ''}`} replace />;
};

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
      // Terms & Conditions - accessible at /t-and-c
      // Note: For PhonePe approval, if exact URL www.anddhengroup.com/t&c is required,
      // set up server-side URL rewriting (nginx/Apache) to redirect t&c to t-and-c
      { path: 't-and-c', element: <TermsAndConditions /> },
      { path: 'privacypolicy', element: <PrivacyPolicy /> },
      { path: 'refundpolicy', element: <RefundPolicy /> },
      { path: 'returnpolicy', element: <ReturnPolicy /> },
      { path: 'shippingpolicy', element: <ShippingPolicy /> },
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
    children: [
      { index: true, element: <Ass /> },
      // TEMP: public ambulance dashboard until prod admin login is restored —
      // remove once /superadmin works in production.
      { path: 'ambulance', element: <AmbulanceTracking /> },
      { path: 'tripsaathi', element: <TripSaathiDashboard /> },
    ],
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
          <ProtectedRoute minRole="employee">
            <EmployeeDashboard />
          </ProtectedRoute>
        ),
      },
      // Each shared page sits behind the card of the same key, so an employee
      // can only reach what a super admin granted them on Roles & Access.
      ...getSharedRoutes().map(route => ({
        ...route,
        element: (
          <ProtectedRoute minRole="employee" card={route.path}>
            {route.element}
          </ProtectedRoute>
        ),
      })),
    ],
  },
  // /superadmin is retired: admins, super admins and employees all use
  // /employeedashboard, which shows every card to admin-and-above and only the
  // granted ones to employees. Kept as a redirect so old links and bookmarks
  // (including deep ones like /superadmin/transactions) still land correctly.
  { path: '/superadmin', element: <Navigate to="/employeedashboard" replace /> },
  { path: '/superadmin/*', element: <SuperAdminRedirect /> },
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
    // Public quiz surface: scan-to-play + community question submission.
    path: '/quiz',
    element: <Layout />,
    children: [
      { index: true, element: <SubmitQuestion /> },
      { path: 'submit', element: <SubmitQuestion /> },
      { path: ':quizId', element: <QuizPlay /> },
    ],
  },
  {
    path: '/video-editor',
    element: (
      <ProtectedRoute>
        <VideoEditor />
      </ProtectedRoute>
    ),
  },
]);

export default router;
