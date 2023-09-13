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

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/ass" element={<Ass />} />
          <Route path="/ams" element={<Ams />} />
          <Route path="/acs" element={<Acs />} />
          <Route path="/aps" element={<Aps />} />
          <Route path="/ati" element={<Ati />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
