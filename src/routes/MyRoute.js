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
import CreateGroupProblemForm from '../pages/groupProblem/CreateGroupProblemForm';
import GroupProblemDetailForm from '../pages/groupProblem/GroupProblemDetailForm';
import UpdateGroupProblemForm from '../pages/groupProblem/UpdateGroupProblemForm';
import SubmitForm from '../pages/submit/SubmitForm';
import MySubmitForm from '../pages/submit/MySubmitForm';
import MySubmitDetailForm from '../pages/submit/MySubmitDetailForm';
import OtherSubmitForm from '../pages/submit/OtherSubmitForm';
import OtherSubmitDetailForm from '../pages/submit/OtherSubmitDetailForm';
import { CheckoutForm } from '../pages/payment/CheckOutForm';
import { SuccessForm } from '../pages/payment/SuccessForm';
import { FailForm } from '../pages/payment/FailForm';

import { GroupSuccessForm } from '../pages/payment/GroupSuccessForm';
import { GroupFailForm } from '../pages/payment/GroupFailForm';
import { GroupCheckoutForm } from '../pages/payment/GroupCheckOutForm';
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
          <Route
            path="/usergroups/:groupId/create-problem"
            element={<CreateGroupProblemForm />}
          />
          <Route
            path="/usergroups/:groupId/problems/:groupProblemId"
            element={<GroupProblemDetailForm />}
          />
          <Route
            path="/usergroups/:groupId/update-problem/:groupProblemId"
            element={<UpdateGroupProblemForm />}
          />
          {/* 그룹 문제 제출 관련 라우트 */}
          <Route
            path="/usergroups/:groupId/submit/:groupProblemId"
            element={<SubmitForm />}
          />
          <Route
            path="/usergroups/:groupId/my-submit/:groupProblemId"
            element={<MySubmitForm />}
          />
          <Route
            path="/usergroups/:groupId/my-submit/:groupProblemId/:submissionId"
            element={<MySubmitDetailForm />}
          />
          <Route
            path="/usergroups/:groupId/other-submit/:groupProblemId"
            element={<OtherSubmitForm />}
          />
          <Route
            path="/usergroups/:groupId/other-submit/:groupProblemId/:otherSubmissionId"
            element={<OtherSubmitDetailForm />}
          />
          {/* 결제 관련 라우트 */}
          <Route
            path="/payment/checkout/:userGroupId"
            element={<CheckoutForm />}
          />
          <Route path="/payment/success" element={<SuccessForm />} />
          <Route path="/payment/fail" element={<FailForm />} />

          {/* 그룹 결제 관련 라우트 */}
          <Route
            path="/payment/group/checkout"
            element={<GroupCheckoutForm />}
          />
          <Route path="/payment/group/success" element={<GroupSuccessForm />} />
          <Route path="/payment/group/fail" element={<GroupFailForm />} />
        </>
      )}
    </Routes>
  );
};

export default MyRoutes;
