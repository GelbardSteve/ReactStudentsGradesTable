import { Home } from './Components/Navigation/Navigation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Home />
      <ToastContainer position="bottom-center" autoClose={1800} />
    </>
  );
}

export default App;
