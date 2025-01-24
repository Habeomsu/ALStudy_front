import React, { useEffect, useState } from 'react';
import FetchAuthorizedPage from '../../service/FetchAuthorizedPage';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateTestCaseForm = () => {
  const navigate = useNavigate();
  const { problemId, testCaseId } = useParams(); // URL에서 problemId와 testCaseId 가져오기
  const [input, setInput] = useState('');
  const [expectedOutput, setExpectedOutput] = useState('');

  useEffect(() => {
    const fetchTestCaseDetails = async () => {
      const url = `http://localhost:8080/testcase/${problemId}/${testCaseId}`; // 테스트 케이스 세부 정보 API 경로
      const response = await FetchAuthorizedPage(url, navigate, null, 'GET');

      if (response && response.isSuccess) {
        const testCase = response.result;
        setInput(testCase.input); // 기존 입력값 설정
        setExpectedOutput(testCase.expectedOutput); // 기존 출력값 설정
      } else {
        alert('테스트 케이스 정보를 가져오는 데 실패했습니다.');
      }
    };

    fetchTestCaseDetails();
  }, [problemId, testCaseId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 방지

    const testCaseData = {
      input: input.trim(), // 입력값
      expectedOutput: expectedOutput.trim(), // 예상 출력값
    };

    // API 요청을 위한 URL
    const url = `http://localhost:8080/testcase/${problemId}/${testCaseId}`; // 테스트 케이스 업데이트 API 경로

    // FetchAuthorizedPage를 사용하여 데이터 전송
    const response = await FetchAuthorizedPage(
      url,
      navigate,
      null,
      'PUT', // 수정이므로 PUT 요청
      testCaseData
    );

    if (!response) {
      alert('문제가 발생했습니다. 다시 시도해 주세요.');
      return; // 에러가 발생했을 경우, 이후 코드를 실행하지 않도록 종료
    }

    // 응답이 성공적인지 확인
    if (!response.isSuccess) {
      console.error('Error:', response.message); // 에러 메시지 콘솔에 출력
      alert('테스트 케이스 수정 실패: ' + response.message); // 사용자에게 알림
      return; // 에러가 발생했을 경우, 이후 코드를 실행하지 않도록 종료
    }

    alert('테스트 케이스가 수정되었습니다!');
    navigate(`/problems/${problemId}`); // 테스트 케이스 목록 페이지로 이동
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '20px',
        backgroundColor: '#f9f9f9', // 배경색 추가 (선택 사항)
      }}
    >
      <div
        style={{
          maxWidth: '800px', // 최대 너비 설정
          width: '100%',
          padding: '20px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          backgroundColor: '#fff',
        }}
      >
        <h1>테스트 케이스 수정 페이지입니다.</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ flex: '1', marginRight: '10px' }}>
              <label>예시 입력:</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                required
                style={{ width: '100%', height: '200px' }} // 높이 조정
              />
            </div>
            <div style={{ flex: '1', marginLeft: '10px' }}>
              <label>예시 출력:</label>
              <textarea
                value={expectedOutput}
                onChange={(e) => setExpectedOutput(e.target.value)}
                required
                style={{ width: '100%', height: '200px' }} // 높이 조정
              />
            </div>
          </div>
          <button type="submit" style={{ marginTop: '20px', width: '100%' }}>
            테스트 케이스 수정
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateTestCaseForm;
