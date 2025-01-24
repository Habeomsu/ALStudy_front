import { Route, Routes } from 'react-router-dom';
import { useLogin } from '../contexts/AuthContext';
import JoinForm from '../pages/auth/JoinForm';
import LoginForm from '../pages/auth/LoginForm';
import HomeForm from '../pages/HomeForm';

import ProblemsForm from '../pages/problem/ProblemsForm';
import ProblemsDetailForm from '../pages/problem/ProblemsDetailForm';
import CreateProblemForm from '../pages/problem/CreateProblemForm';
import UpdateProblemForm from '../pages/problem/UpdateProblemForm';
import CreateTestCaseForm from '../pages/testcase/CreateTestCaseForm';
const MyRoutes = () => {
  const { isLoggedIn, role } = useLogin();
  // 로그인 여부에 따라서 조건부 라우팅
  return (
    <Routes>
      <Route path="/" element={<HomeForm />} />
      {!isLoggedIn && <Route path="/login" element={<LoginForm />} />}
      {!isLoggedIn && <Route path="/join" element={<JoinForm />} />}
      {isLoggedIn && <Route path="/problems" element={<ProblemsForm />} />}
      {isLoggedIn && (
        <Route path="/problems/:problemId" element={<ProblemsDetailForm />} />
      )}
      {isLoggedIn && (
        <Route
          path="/update-problem/:problemId"
          element={<UpdateProblemForm />}
        />
      )}
      {isLoggedIn && (
        <Route path="/create-problem" element={<CreateProblemForm />} />
      )}
      {isLoggedIn && (
        <Route
          path="/create-testcase/:problemId"
          element={<CreateTestCaseForm />}
        />
      )}
    </Routes>
  );
};

export default MyRoutes;
