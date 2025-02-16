import React from 'react';
import { useSelector } from 'react-redux';
import { Route, HashRouter as Router, Routes } from 'react-router-dom';
import { FavoritesPage } from '../../Components/Favorites/FavoritesPage';
import { AdminTable } from '../../UsersTable/AdminTable';
import { StudentTable } from '../../UsersTable/StudentTable';
import { EmptyPage } from '../EmptyPage/Empty';
import { LoginPage } from '../Login/LoginPage';
import { PageLayout } from '../PageLayout/PageLayout';

export const Home = () => {
  const userRole = useSelector((state) => state.role.roles);

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
            userRole === 'admin' ? (
              <PageLayout>
                <FavoritesPage />
              </PageLayout>
            ) : (
              <EmptyPage text="Access denied" />
            )
          }
        />
      </Routes>
    </Router>
  );
};
