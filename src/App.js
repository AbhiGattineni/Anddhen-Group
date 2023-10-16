import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Contact from './components/pages/Contact';
import Navbar from './components/inc/Navbar';
import Footer from './components/inc/Footer';
import { Ass } from './components/pages/inc/Ass';
import { Ams } from './components/pages/inc/Ams';
import { Acs } from './components/pages/inc/Acs';
import { Aps } from './components/pages/inc/Aps';
import { Ati } from './components/pages/inc/Ati';
import { Exam } from './components/pages/Exam';
import { Quiz } from './components/pages/inc/Quiz';
import { CollegeRegistration } from './components/pages/CollegeRegistration';
import { ProtectedRoute } from './components/ProtectedRoute';

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
        <Route path="/" element={
          <MainLayout>
            <Home />
          </MainLayout>
        } />
        <Route path="/about" element={
          <MainLayout>
            <About />
          </MainLayout>
        } />
        <Route path="/contact" element={
          <MainLayout>
            <Contact />
          </MainLayout>
        } />
        <Route path="/ass" element={
          <MainLayout>
            <Ass />
          </MainLayout>
        } />
        <Route path="/ams" element={
          <MainLayout>
            <Ams />
          </MainLayout>
        } />
        <Route path="/acs" element={
          <MainLayout>
            <Acs />
          </MainLayout>
        } />
        <Route path="/aps" element={
          <MainLayout>
            <Aps />
          </MainLayout>
        } />
        <Route path="/ati" element={
          <MainLayout>
            <Ati />
          </MainLayout>
        } />
        <Route path='/test' element={
          <MainLayout>
            <Exam />
          </MainLayout>
        } />
        <Route path='/acs/jobapplications' element={
          <MainLayout>
            <CollegeRegistration />
          </MainLayout>
        } />
        <Route path="/quiz" element={<ProtectedRoute />}>
          <Route index element={<Quiz />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
