import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminTable } from '../../UsersTable/AdminTable';
import { StudentTable } from '../../UsersTable/StudentTable';
import { LoginPage } from '../Login/LoginPage';
import { PageLayout } from '../PageLayout/PageLayout';
import { FavoritesPage } from '../../Components/Favorites/FavoritesPage';
import { EmptyPage } from '../EmptyPage/Empty';
import { useRoles } from '../RoleProvider/RoleProvider';

export const Home = () => {
  const { roles } = useRoles();

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
            roles === 'admin' ? (
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
