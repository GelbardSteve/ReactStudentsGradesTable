import React from 'react';
import { Route, HashRouter as Router, Routes } from 'react-router-dom';
import { FavoritesPage } from '../../Components/Favorites/FavoritesPage';
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
        <Route
          path="/studentTable"
          element={
              <PageLayout>
                <StudentTable />
              </PageLayout>
          }
        />
        <Route
          path="/favorites"
          element={
            <PageLayout>
              <FavoritesPage />
            </PageLayout>
          }
        />
      </Routes>
    </Router>
  );
};
