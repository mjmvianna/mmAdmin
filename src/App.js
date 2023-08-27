import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AuthProvider from './contexts/auth';

import RoutesApp from './routes';
import Header    from './components/Header';

//import HomePaginaProvider from './contexts/homePagina';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <AuthProvider>
          <ToastContainer autoClose={1000}/>
          <Header/>
          <RoutesApp/>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
