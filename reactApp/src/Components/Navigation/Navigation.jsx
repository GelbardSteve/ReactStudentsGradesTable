import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminTable } from '../../UsersTable/AdminTable';
import { StudentTable } from '../../UsersTable/StudentTable';
import { LoginPage } from '../Login/LoginPage';
import { PageLayout } from '../PageLayout/PageLayout';
import { FavoritesPage } from '../../Components/Favorites/FavoritesPage';
import { EmptyPage } from '../EmptyPage/Empty';
import { useSelector } from 'react-redux';

export const Home = () => {
  const userRole = useSelector((state) => state.role.roles);
  const userAuthentication = localStorage.getItem('adminAuthentication');
  const students = useSelector((state) => state.students.student);
  console.log(students);
  const authentication = students.authentication ?? null;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/table"
          element={
            userAuthentication ? (
              <PageLayout>
                <AdminTable />
              </PageLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/studentTable"
          element={
            authentication ? (
              <PageLayout>
                <StudentTable />
              </PageLayout>
            ) : (
              <Navigate to="/" replace />
            )
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
