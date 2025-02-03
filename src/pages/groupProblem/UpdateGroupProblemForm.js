import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import FetchAuthorizedPage from '../../service/FetchAuthorizedPage';

const UpdateGroupProblemForm = () => {
  const { groupId, groupProblemId } = useParams(); // URL에서 groupId와 problemId 가져오기
  const navigate = useNavigate();
  const [problemData, setProblemData] = useState(null); // 문제 데이터 상태
  const [deadline, setDeadline] = useState(''); // 마감일 상태
  const [deductionAmount, setDeductionAmount] = useState(0); // 감점 금액 상태
  const [error, setError] = useState(null); // 오류 메시지 상태
  const location = useLocation();

  useEffect(() => {
    const fetchProblem = async () => {
      const url = `http://localhost:8080/groupproblem/${groupId}/${groupProblemId}`; // 특정 문제를 가져오는 API 경로
      const response = await FetchAuthorizedPage(url, navigate);

      if (response && response.isSuccess) {
        setProblemData(response.result); // 문제 데이터 저장
        setDeadline(response.result.deadline); // 마감일 설정
        setDeductionAmount(response.result.deductionAmount); // 감점 금액 설정
      } else {
        setError(response.message || '문제 정보를 불러오는 데 실패했습니다.');
      }
    };

    fetchProblem();
  }, [groupId, groupProblemId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!deadline) {
      alert('모든 필드를 채워주세요.');
      return;
    }

    const groupProblemDto = {
      deadline: deadline,
      deductionAmount: deductionAmount,
    };

    const url = `http://localhost:8080/groupproblem/${groupId}/${groupProblemId}`; // 문제 수정 API 경로
    const response = await FetchAuthorizedPage(
      url,
      navigate,
      location,
      'PUT',
      groupProblemDto
    );

    if (response && response.isSuccess) {
      alert('문제가 성공적으로 수정되었습니다.');
      navigate(`/usergroups/${groupId}/problems`); // 문제 목록 페이지로 이동
    } else {
      alert(response.message || '문제 수정에 실패했습니다.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>그룹 문제 수정</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {problemData ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="deadline">마감일:</label>
            <input
              type="datetime-local"
              id="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="deductionAmount">감점 금액:</label>
            <input
              type="number"
              id="deductionAmount"
              value={deductionAmount}
              onChange={(e) => setDeductionAmount(e.target.value)}
              min="0"
            />
          </div>

          <button type="submit" style={{ marginTop: '10px' }}>
            문제 수정
          </button>
        </form>
      ) : (
        <div>문제 정보를 불러오는 중...</div>
      )}
    </div>
  );
};

export default UpdateGroupProblemForm;
