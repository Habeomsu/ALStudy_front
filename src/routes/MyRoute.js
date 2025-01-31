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
import UpdateTestCaseForm from '../pages/testcase/UpdateTestCaseForm';
import GroupsForm from '../pages/group/GroupsForm';
import CreateGroupForm from '../pages/group/CreateGroupForm';
import GroupDetailForm from '../pages/group/GroupDetailForm';
import UserGroupForm from '../pages/usergroup/UserGroupForm';
import UserGroupDetailForm from '../pages/usergroup/UserGroupDetailForm';
import UserGroupMemberForm from '../pages/usergroup/UserGroupMemberForm';
import GroupProblemForm from '../pages/groupProblem/GroupProblemForm';
const MyRoutes = () => {
  const { isLoggedIn, role } = useLogin();
  // 로그인 여부에 따라서 조건부 라우팅
  return (
    <Routes>
      <Route path="/" element={<HomeForm />} />
      {!isLoggedIn && <Route path="/login" element={<LoginForm />} />}
      {!isLoggedIn && <Route path="/join" element={<JoinForm />} />}
      {isLoggedIn && (
        <>
          {/* 문제 관련 라우트 */}
          <Route path="/problems" element={<ProblemsForm />} />
          <Route path="/problems/:problemId" element={<ProblemsDetailForm />} />
          <Route
            path="/update-problem/:problemId"
            element={<UpdateProblemForm />}
          />
          <Route path="/create-problem" element={<CreateProblemForm />} />

          {/* 테스트케이스 관련 라우트 */}
          <Route
            path="/create-testcase/:problemId"
            element={<CreateTestCaseForm />}
          />
          <Route
            path="/update-testcase/:problemId/:testCaseId"
            element={<UpdateTestCaseForm />}
          />

          {/* 그룹 관련 라우트 */}
          <Route path="/groups" element={<GroupsForm />} />
          <Route path="/create-group" element={<CreateGroupForm />} />
          <Route path="/groups/:groupId" element={<GroupDetailForm />} />

          {/* 유저 그룹 관련 라우트 */}
          <Route path="/usergroups" element={<UserGroupForm />} />
          <Route
            path="/usergroups/:groupId"
            element={<UserGroupDetailForm />}
          />
          <Route
            path="/usergroups/:groupId/member"
            element={<UserGroupMemberForm />}
          />

          {/* 그룹 문제 관련 라우트 */}
          <Route
            path="/usergroups/:groupId/problems"
            element={<GroupProblemForm />}
          />
        </>
      )}
    </Routes>
  );
};

export default MyRoutes;
