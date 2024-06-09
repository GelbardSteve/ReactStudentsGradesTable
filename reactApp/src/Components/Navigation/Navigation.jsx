import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminTable } from '../../UsersTable/AdminTable';
import { StudentTable } from '../../UsersTable/StudentTable';
import { LoginPage } from '../Login/LoginPage';
import { PageLayout } from '../PageLayout/PageLayout';

export const Home = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/table"
          element={
            <PageLayout>
              <AdminTable />
            </PageLayout>
          }
        />
        <Route path="/studentTable" element={<StudentTable />} />
      </Routes>
    </Router>
  );
};
