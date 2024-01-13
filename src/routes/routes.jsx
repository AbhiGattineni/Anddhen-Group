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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
    ],
  },
  // {
  //   path: "/",
  //   element: (
  //     <MainLayout>
  //       <Home />
  //     </MainLayout>
  //   ),
  // },
  // {
  //   path: "/about",
  //   element: (
  //     <MainLayout>
  //       <About />
  //     </MainLayout>
  //   ),
  // },

  // {
  //   path: "/contact",
  //   element: (
  //     <MainLayout>
  //       <Contact />
  //     </MainLayout>
  //   ),
  // },

  {
    path: "/ass",
    element: (
      <MainLayout>
        <Ass />
      </MainLayout>
    ),
  },

  {
    path: "/ams",
    element: (
      <MainLayout>
        <Ams />
      </MainLayout>
    ),
  },

  {
    path: "/acs",
    element: (
      <MainLayout>
        <Acs />
      </MainLayout>
    ),
  },

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
    path: "/acs/jobapplication",
    element: (
      <MainLayout>
        <JobApplicationRegistration />
      </MainLayout>
    ),
  },

  {
    path: "/acs/educationconsulting",
    element: (
      <ProtectedRoute>
        <MainLayout logout={true}>
          <EducationConsultant />
        </MainLayout>
      </ProtectedRoute>
    ),
  },

  {
    path: "/acs/jobapplication/studentportal",
    element: (
      <MainLayout>
        <StudentPortal />
      </MainLayout>
    ),
  },

  {
    path: "/acs/educationconsulting/addcolleges",
    element: (
      <MainLayout>
        <AddColleges />
      </MainLayout>
    ),
  },

  {
    path: "/acs/educationconsulting/editcolleges",
    element: (
      <MainLayout>
        <EditColleges />
      </MainLayout>
    ),
  },

  {
    path: "/acs/jobapplication/parttimerportal",
    element: (
      <ProtectedRoute>
        <MainLayout logout={true}>
          <PartTimerPortal />
        </MainLayout>
      </ProtectedRoute>
    ),
  },

  {
    path: "/aps",
    element: (
      <MainLayout>
        <Aps />
      </MainLayout>
    ),
  },

  {
    path: "/ati",
    element: (
      <MainLayout>
        <Ati />
      </MainLayout>
    ),
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
    path: "/superadmin",
    element: (
      <ProtectedRoute>
        <MainLayout logout={true}>
          <SuperAdmin />
        </MainLayout>
      </ProtectedRoute>
    ),
  },

  {
    path: "/superadmin/acs_consultants",
    element: (
      <ProtectedRoute>
        <MainLayout logout={true}>
          <Consultants />
        </MainLayout>
      </ProtectedRoute>
    ),
  },

  {
    path: "/superadmin/roleaccess",
    element: (
      <ProtectedRoute>
        <MainLayout logout={true}>
          <RoleAccess />
        </MainLayout>
      </ProtectedRoute>
    ),
  },

  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/resetpassword", element: <ForgotPassword /> },
  {
    /* {  path:"/quiz" ,element:<Quiz /> }, /> */
  },
]);

export default router;
