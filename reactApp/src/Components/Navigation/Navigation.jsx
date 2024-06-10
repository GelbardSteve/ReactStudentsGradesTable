import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminTable } from '../../UsersTable/AdminTable';
import { StudentTable } from '../../UsersTable/StudentTable';
import { LoginPage } from '../Login/LoginPage';
import { PageLayout } from '../PageLayout/PageLayout';
import { FavoritesPage } from '../../Components/Favorites/FavoritesPage';
import { useUserRole } from '../../Components/UserProvider/UserProvide';
import { EmptyPage } from '../EmptyPage/Empty';

export const Home = () => {
  const { userRole } = useUserRole();

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
