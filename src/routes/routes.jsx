import { MainLayout } from "src/App";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import Home from "src/components/pages/Home";
import About from "src/components/pages/About";
import Contact from "src/components/pages/Contact";
import { Acs } from "src/components/pages/inc/Acs";
import { Ams } from "src/components/pages/inc/Ams";
import { Ass } from "src/components/pages/inc/Ass";
import { JobApplicationRegistration } from "src/components/pages/ACS/JobApplicationRegistration";
import { EducationConsultant } from "src/components/pages/ACS/EducationConsultant";
import { Login } from "src/components/pages/Auth/Login";
import { Register } from "src/components/pages/Auth/Register";
import { ForgotPassword } from "src/components/pages/Auth/ForgotPassword";
import Consultants from "src/components/SuperAdmin/ACS/Consultants/Consultants";
import RoleAccess from "src/components/SuperAdmin/RoleAccess/RoleAccess";
import SuperAdmin from "src/components/SuperAdmin/SuperAdmin";
import { Aps } from "src/components/pages/inc/Aps";
import { Ati } from "src/components/pages/inc/Ati";
import { StudentPortal } from "src/components/pages/ACS/StudentPortal";
import { AddColleges } from "src/components/pages/ACS/AddColleges";
import { EditColleges } from "src/components/pages/ACS/EditColleges";
import { PartTimerPortal } from "src/components/pages/ACS/PartTimerPortal";
import Layout from "./Layout";
import ErrorPage from "src/components/pages/ErrorPage";
import { AcsAdmin } from "src/components/pages/Admin/AcsAdmin";
import AdminPage from "src/components/pages/Admin/AdminPage";
import RolesAndAccess from "src/components/SuperAdmin/RoleAccess/RolesAndAccess";
import { Transaction } from "src/components/SuperAdmin/transactions/Transaction";
import { EmployeeDashboard } from "src/components/pages/Admin/EmployeeDashboard";
import { Colleges } from "src/components/SuperAdmin/ACS/Colleges/Colleges";
import { Profile } from "src/components/pages/Auth/Profile";
import { Ats } from "src/components/pages/inc/Ats";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/resetpassword", element: <ForgotPassword /> },
      { path: "/profile", element: <Profile /> },
      {
        path: "/employeedashboard",
        element: (
          <ProtectedRoute>
            <EmployeeDashboard />
          </ProtectedRoute>
        ),
      },
    ],
  },

  {
    path: "/ass",
    element: <Layout />,
    children: [{ index: true, element: <Ass /> }],
  },

  {
    path: "/ams",
    element: <Layout />,
    children: [{ index: true, element: <Ams /> }],
  },

  {
    path: "/aps",
    element: <Layout />,
    children: [{ index: true, element: <Aps /> }],
  },

  {
    path: "/ati",
    element: <Layout />,
    children: [{ index: true, element: <Ati /> }],
  },
  {
    path: "/ats",
    element: <Layout />,
    children: [{ index: true, element: <Ats/> }],
  },
  {
    path: "/acs",
    element: <Layout />,
    children: [
      { index: true, element: <Acs /> },
      { path: "jobapplication", element: <JobApplicationRegistration /> },
      {
        path: "jobapplication/studentportal",
        element: (
          <ProtectedRoute>
            <StudentPortal />
          </ProtectedRoute>
        ),
      },
      {
        path: "educationconsulting",
        element: (
          <ProtectedRoute>
            <EducationConsultant />
          </ProtectedRoute>
        ),
      },
      {
        path: "jobapplication/parttimerportal",
        element: (
          <ProtectedRoute>
            <PartTimerPortal />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/admin",
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
    path: "/superadmin",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <SuperAdmin /> },
      { path: "acs_consultants", element: <Consultants /> },
      { path: "roleaccess", element: <RolesAndAccess /> },
      { path: "transactions", element: <Transaction /> },
      { path: "acs/colleges", element: <Colleges /> },
    ],
  },

  // {
  //   path: "/acs/educationconsulting/addcolleges",
  //   element: (
  //     <MainLayout>
  //       <AddColleges />
  //     </MainLayout>
  //   ),
  // },

  // {
  //   path: "/acs/educationconsulting/editcolleges",
  //   element: (
  //     <MainLayout>
  //       <EditColleges />
  //     </MainLayout>
  //   ),
  // },

  {
    /* {
           path:"/updatesandstatus"
          ,element:
            <MainLayout>
              <UpdatesAndStatus />
            </MainLayout>
           },
       

        {
           path:"/updatesandstatus/managers/updates"
          ,element:
            <MainLayout>
              <AcsManagerUpdates />
            </MainLayout>
           },
       
        {
           path:"/updatesandstatus/parttimers/updates"
          ,element:
            <MainLayout>
              <AcsParttimerStatusUpdates />
            </MainLayout>
           },
       
        {
           path:"/updatesandstatus/interns/updates"
          ,element:
            <MainLayout>
              <AssInternUpdates />
            </MainLayout>
           },
        */
  },
  {
    /* {
           path:"/test"
          ,element:
            <MainLayout>
              <Exam />
            </MainLayout>
           },
        */
  },
  {
    /* {
           path:"/admin_portal"
          ,element:
            <MainLayout>
              <AdminPortal />
            </MainLayout>
           },
        */
  },
  // {
  //   path: "/admin",
  //   element: (
  //     <ProtectedRoute>
  //       <MainLayout logout={true}>
  //         <AcsAdmin />
  //       </MainLayout>
  //     </ProtectedRoute>
  //   ),
  // },
  {
    /* {  path:"/quiz" ,element:<Quiz /> }, /> */
  },
]);

export default router;
