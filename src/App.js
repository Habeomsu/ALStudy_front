import Header from './components/Header';
import AuthProvider, { useLogin } from './contexts/AuthContext';
import MyRoutes from './routes/MyRoute';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Header />
        <MyRoutes />
      </AuthProvider>
    </div>
  );
}

export default App;
