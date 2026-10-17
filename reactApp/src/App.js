import { HashRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PageLayout } from './components/PageLayout/PageLayout';
import { LoginPage } from './features/auth/LoginPage';
import { RequireRole } from './features/auth/RequireRole';
import { AdminTable } from './features/students/AdminTable';
import { FavoritesPage } from './features/students/FavoritesPage';
import { StudentTable } from './features/students/StudentTable';

const protectedPage = (role, page) => (
  <RequireRole role={role}>
    <PageLayout>{page}</PageLayout>
  </RequireRole>
);

function App() {
  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/table" element={protectedPage('admin', <AdminTable />)} />
          <Route path="/studentTable" element={protectedPage('student', <StudentTable />)} />
          <Route path="/favorites" element={protectedPage('admin', <FavoritesPage />)} />
        </Routes>
      </HashRouter>
      <ToastContainer position="bottom-center" autoClose={1800} />
    </>
  );
}

export default App;
