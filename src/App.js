import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import HomeForm from './pages/HomeForm';
import JoinForm from './pages/auth/JoinForm';

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<HomeForm />}></Route>
        <Route path="/join" element={<JoinForm />}></Route>
      </Routes>
    </div>
  );
}

export default App;
