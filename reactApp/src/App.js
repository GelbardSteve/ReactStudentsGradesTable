import { HashRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PageLayout } from './components/PageLayout/PageLayout';
import { ClassesTable } from './features/classes/ClassesTable';
import { AssistantLayout } from './features/assistant/AssistantLayout';
import { LoginPage } from './features/auth/LoginPage';
import { RequireAuth } from './features/auth/RequireAuth';
import { VerifyEmailPage } from './features/auth/VerifyEmailPage';
import { ClassStudentsTable } from './features/students/ClassStudentsTable';
import { FavoritesPage } from './features/students/FavoritesPage';

// Every logged-in page shares this layout
const ProtectedLayout = () => (
  <RequireAuth>
    <PageLayout>
      <Outlet />
    </PageLayout>
  </RequireAuth>
);

function App() {
  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/verify" element={<VerifyEmailPage />} />
          <Route element={<ProtectedLayout />}>
            {/* Pages with the AI chat. New pages get no chat unless they are added here. */}
            <Route element={<AssistantLayout />}>
              <Route path="/classes" element={<ClassesTable />} />
              <Route path="/classes/:classId" element={<ClassStudentsTable />} />
              <Route path="/favorites" element={<FavoritesPage />} />
            </Route>
          </Route>
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
