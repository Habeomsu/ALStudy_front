import { Route, Routes } from 'react-router-dom';
import { useLogin } from '../contexts/AuthContext';
import JoinForm from '../pages/auth/JoinForm';
import LoginForm from '../pages/auth/LoginForm';
import HomeForm from '../pages/HomeForm';
const MyRoutes = () => {
  const { isLoggedIn } = useLogin();
  // 로그인 여부에 따라서 조건부 라우팅
  return (
    <Routes>
      <Route path="/" element={<HomeForm />} />
      {!isLoggedIn && <Route path="/login" element={<LoginForm />} />}
      {!isLoggedIn && <Route path="/join" element={<JoinForm />} />}
    </Routes>
  );
};

export default MyRoutes;
