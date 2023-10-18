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
import { Exam } from "./components/pages/Exam";
import { Quiz } from "./components/pages/inc/Quiz";
import { JobApplicationRegistration } from "./components/pages/JobApplicationRegistration";
import { PartTimerPortal } from "./components/pages/PartTimerPortal";
import { StudentPortal } from "./components/pages/StudentPortal";
import { UpdatesAndStatus } from "./components/pages/UpdatesAndStatus/UpdatesAndStatus";
import AcsManagerUpdates from "./components/pages/UpdatesAndStatus/AcsManagerUpdates";
import AcsParttimerStatusUpdates from "./components/pages/UpdatesAndStatus/AcsParttimerStatusUpdates";

function MainLayout({ children }) {
  return (
    <div>
      <Navbar />
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
              <AcsParttimerStatusUpdates />
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
            <MainLayout>
              <PartTimerPortal />
            </MainLayout>
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

        <Route path="/quiz" element={<Quiz />} />
      </Routes>
    </Router>
  );
}

export default App;
