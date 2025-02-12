import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Home } from './Components/Navigation/Navigation';
import { useGetAllUsers } from './UsersTable/Table.hooks';

function App() {
  useGetAllUsers();
  return (
    <>
      <Home />
      <ToastContainer position="bottom-center" autoClose={1800} />
    </>
  );
}

export default App;
