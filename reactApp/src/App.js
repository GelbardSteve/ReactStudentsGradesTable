import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PageLayout } from './components/PageLayout/PageLayout';
import { ClassesTable } from './features/classes/ClassesTable';
import { LoginPage } from './features/auth/LoginPage';
import { RequireAuth } from './features/auth/RequireAuth';
import { VerifyEmailPage } from './features/auth/VerifyEmailPage';
import { ClassStudentsTable } from './features/students/ClassStudentsTable';
import { FavoritesPage } from './features/students/FavoritesPage';

const protectedPage = (page) => (
  <RequireAuth>
    <PageLayout>{page}</PageLayout>
  </RequireAuth>
);

function App() {
  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/verify" element={<VerifyEmailPage />} />
          <Route path="/classes" element={protectedPage(<ClassesTable />)} />
          <Route path="/classes/:classId" element={protectedPage(<ClassStudentsTable />)} />
          <Route path="/favorites" element={protectedPage(<FavoritesPage />)} />
          {/* Old bookmark of the single students table */}
          <Route path="/table" element={<Navigate to="/classes" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
      <ToastContainer position="bottom-center" autoClose={1800} />
    </>
  );
}

export default App;
