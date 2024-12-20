import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Page404 from './components/404Page';
import Home from './components/Home';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Other routes */}
        <Route path="*" element={<Page404 />} />
      </Routes>
    </Router>
  );
};

export default App;
