import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import FetchAuthorizedPage from '../../service/FetchAuthorizedPage';

const CreateGroupProblemForm = () => {
  const { groupId } = useParams(); // URL에서 groupId 가져오기
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]); // 문제 목록 상태
  const [selectedProblemId, setSelectedProblemId] = useState(null); // 선택된 문제 ID
  const [deadline, setDeadline] = useState(''); // 마감일 상태
  const [deductionAmount, setDeductionAmount] = useState(0); // 감점 금액 상태
  const [error, setError] = useState(null); // 오류 메시지 상태
  const location = useLocation();

  useEffect(() => {
    const fetchProblems = async () => {
      const url = `http://localhost:8080/problems`; // 문제 목록을 가져오는 API 경로
      const response = await FetchAuthorizedPage(url, navigate);

      if (response && response.isSuccess) {
        setProblems(response.result.problemResDtos); // 문제 목록 저장
      } else {
        setError(response.message || '문제 목록을 불러오는 데 실패했습니다.');
      }
    };

    fetchProblems();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProblemId || !deadline) {
      alert('모든 필드를 채워주세요.');
      return;
    }

    const groupProblemDto = {
      problem_id: selectedProblemId,
      deadline: deadline,
      deductionAmount: deductionAmount,
    };

    const url = `http://localhost:8080/groupproblem/${groupId}`; // 문제 생성 API 경로
    const response = await FetchAuthorizedPage(
      url,
      navigate,
      location,
      'POST',
      groupProblemDto
    );

    if (response && response.isSuccess) {
      alert('문제가 성공적으로 생성되었습니다.');
      navigate(`/usergroups/${groupId}/problems`); // 문제 목록 페이지로 이동
    } else {
      alert(response.message || '문제 생성에 실패했습니다.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>그룹 문제 생성</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="problemSelect">문제 선택:</label>
          <select
            id="problemSelect"
            value={selectedProblemId || ''}
            onChange={(e) => setSelectedProblemId(e.target.value)}
            required
          >
            <option value="" disabled>
              문제를 선택하세요
            </option>
            {problems.map((problem) => (
              <option key={problem.id} value={problem.id}>
                {problem.title}
              </option>
            ))}
          </select>
        </div>

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
          문제 생성
        </button>
      </form>
    </div>
  );
};

export default CreateGroupProblemForm;
