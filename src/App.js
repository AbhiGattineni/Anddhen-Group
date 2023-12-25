import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";
import Home from "./components/pages/Home";
import About from "./components/pages/About";
import Contact from "./components/pages/Contact";
import Navbar from "./components/organisms/Navbar";
import Footer from "./components/organisms/Footer";
import { Ass } from "./components/pages/inc/Ass";
import { Ams } from "./components/pages/inc/Ams";
import { Acs } from "./components/pages/inc/Acs";
import { Aps } from "./components/pages/inc/Aps";
import { Ati } from "./components/pages/inc/Ati";
import { Exam } from "./components/pages/ACS/Exam";
import { Quiz } from "./components/pages/inc/Quiz";
import { JobApplicationRegistration } from "./components/pages/ACS/JobApplicationRegistration";
import { PartTimerPortal } from "./components/pages/ACS/PartTimerPortal";
import { StudentPortal } from "./components/pages/ACS/StudentPortal";
import { UpdatesAndStatus } from "./components/pages/UpdatesAndStatus/UpdatesAndStatus";
import AcsManagerUpdates from "./components/pages/UpdatesAndStatus/AcsManagerUpdates";
import AcsParttimerStatusUpdates from "./components/pages/UpdatesAndStatus/AcsParttimerStatusUpdates";
import AssInternUpdates from "./components/pages/UpdatesAndStatus/AssInternUpdates";
import { AdminPortal } from "./components/pages/Admin/AdminPortal";
import { AcsAdmin } from "./components/pages/Admin/AcsAdmin";
import { Login } from "./components/pages/Auth/Login";
import { Register } from "./components/pages/Auth/Register";
import { ProtectedRoute } from "./routes/ProtectedRoute/ProtectedRoute";
import { ForgotPassword } from "./components/pages/Auth/ForgotPassword";
import { EducationConsultant } from "./components/pages/ACS/EducationConsultant";
import SuperAdmin from "./components/SuperAdmin/SuperAdmin.jsx";
import Consultants from "./components/SuperAdmin/ACS/Consultants.jsx";
import RoleAccess from "./components/SuperAdmin/RoleAccess/RoleAccess.jsx";

function MainLayout({ children, logout }) {
  return (
    <div>
      <Navbar logout={logout ? true : false} />
      {children}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/about"
          element={
            <MainLayout>
              <About />
            </MainLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <MainLayout>
              <Contact />
            </MainLayout>
          }
        />
        <Route
          path="/ass"
          element={
            <MainLayout>
              <Ass />
            </MainLayout>
          }
        />
        <Route
          path="/ams"
          element={
            <MainLayout>
              <Ams />
            </MainLayout>
          }
        />
        <Route
          path="/acs"
          element={
            <MainLayout>
              <Acs />
            </MainLayout>
          }
        />
        <Route
          path="/updatesandstatus"
          element={
            <MainLayout>
              <UpdatesAndStatus />
            </MainLayout>
          }
        />

        <Route
          path="/updatesandstatus/managers/updates"
          element={
            <MainLayout>
              <AcsManagerUpdates />
            </MainLayout>
          }
        />
        <Route
          path="/updatesandstatus/parttimers/updates"
          element={
            <MainLayout>
              <AcsParttimerStatusUpdates />
            </MainLayout>
          }
        />
        <Route
          path="/updatesandstatus/interns/updates"
          element={
            <MainLayout>
              <AssInternUpdates />
            </MainLayout>
          }
        />
        <Route
          path="/acs/jobapplication"
          element={
            <MainLayout>
              <JobApplicationRegistration />
            </MainLayout>
          }
        />
        <Route
          path="/acs/educationconsulting"
          element={
            <ProtectedRoute>
              <MainLayout logout={true}>
                <EducationConsultant />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/acs/jobapplication/studentportal"
          element={
            <MainLayout>
              <StudentPortal />
            </MainLayout>
          }
        />
        <Route
          path="/acs/jobapplication/parttimerportal"
          element={
            <ProtectedRoute>
              <MainLayout logout={true}>
                <PartTimerPortal />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/aps"
          element={
            <MainLayout>
              <Aps />
            </MainLayout>
          }
        />
        <Route
          path="/ati"
          element={
            <MainLayout>
              <Ati />
            </MainLayout>
          }
        />
        <Route
          path="/test"
          element={
            <MainLayout>
              <Exam />
            </MainLayout>
          }
        />
        <Route
          path="/admin_portal"
          element={
            <MainLayout>
              <AdminPortal />
            </MainLayout>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <MainLayout logout={true}>
                <AcsAdmin />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/superadmin"
          element={
            <ProtectedRoute>
              <MainLayout logout={true}>
                <SuperAdmin />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/superadmin/acs_consultants"
          element={
            <ProtectedRoute>
              <MainLayout logout={true}>
                <Consultants />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/superadmin/roleaccess"
          element={
            <ProtectedRoute>
              <MainLayout logout={true}>
                <RoleAccess />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/resetpassword" element={<ForgotPassword />} />
        <Route path="/quiz" element={<Quiz />} />
      </Routes>
    </Router>
  );
}

export default App;
