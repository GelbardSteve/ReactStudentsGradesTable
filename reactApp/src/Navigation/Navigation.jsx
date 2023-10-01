import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ParentComponent } from '../parentFile/parent';
import { StudentTable } from '../Components/StudentTable';
import { LoginPage } from '../Components/LoginPage'

export const Home = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/table" element={<ParentComponent />} />
        <Route path="/studentTable" element={<StudentTable />} />
      </Routes>
    </Router>
  );
};