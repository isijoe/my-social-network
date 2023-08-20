import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthProvider from './authProvider';
import Routes from './routes';

function App() {

  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
};

export default App;
