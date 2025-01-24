import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import fetchProblemDetail from '../../service/problem/GetProblemDetail';
import FetchAuthorizedPage from '../../service/FetchAuthorizedPage';
import { useLogin } from '../../contexts/AuthContext';

const ProblemsDetailForm = () => {
  const { problemId } = useParams(); // URL 파라미터에서 문제 ID 가져오기
  const [problemDetail, setProblemDetail] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [showTestCases, setShowTestCases] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useLogin();
  useEffect(() => {
    const loadProblemDetail = async () => {
      try {
        const data = await fetchProblemDetail(problemId, navigate, location);
        if (data.isSuccess) {
          setProblemDetail(data.result); // result에서 문제 상세 정보 가져오기
        } else {
          alert(data.message || '문제 정보를 가져오는 데 실패했습니다.');
        }
      } catch (error) {
        alert(error.message);
      }
    };

    loadProblemDetail();
  }, [problemId, navigate, location]);

  // 테스트 케이스 가져오기
  const fetchTestCases = async () => {
    const url = `http://localhost:8080/testcase/${problemId}`; // 테스트 케이스 API 경로
    const response = await FetchAuthorizedPage(url, navigate, location);
    if (response && response.isSuccess) {
      setTestCases(response.result); // 테스트 케이스 결과 저장
    } else {
      alert('테스트 케이스를 가져오는 데 실패했습니다.');
    }
  };

  const handleToggleTestCases = async () => {
    if (!showTestCases) {
      await fetchTestCases(); // 테스트 케이스를 가져옵니다.
    }
    setShowTestCases((prev) => !prev); // 토글 상태 변경
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('정말로 이 문제를 삭제하시겠습니까?');
    if (confirmDelete) {
      const url = `http://localhost:8080/problems/${problemId}`; // 실제 API 경로로 변경 필요
      const response = await FetchAuthorizedPage(
        url,
        navigate,
        location,
        'DELETE'
      );

      if (response && response.isSuccess) {
        alert('문제가 삭제되었습니다.');
        navigate('/problems'); // 문제 목록 페이지로 이동
      } else {
        alert('문제 삭제에 실패했습니다: ' + (response.message || ''));
      }
    }
  };

  const handleDeleteTestCase = async (testCaseId) => {
    const confirmDelete = window.confirm(
      '정말로 이 테스트 케이스를 삭제하시겠습니까?'
    );
    if (confirmDelete) {
      const url = `http://localhost:8080/testcase/${problemId}/${testCaseId}`; // 테스트 케이스 삭제 API 경로
      const response = await FetchAuthorizedPage(
        url,
        navigate,
        location,
        'DELETE'
      );

      if (response && response.isSuccess) {
        alert('테스트 케이스가 삭제되었습니다.');
        // 테스트 케이스 재로딩
        fetchTestCases();
      } else {
        alert('테스트 케이스 삭제에 실패했습니다: ' + (response.message || ''));
      }
    }
  };

  const formatText = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      {problemDetail ? (
        <div style={{ maxWidth: '1200px', width: '100%' }}>
          <h2>{problemDetail.title}</h2>
          <p>
            <strong>난이도:</strong> {problemDetail.difficultyLevel}
          </p>
          <p>
            <strong>문제 유형:</strong> {problemDetail.problemType}
          </p>
          <p>
            <strong>설명:</strong> {formatText(problemDetail.description)}
          </p>
          <p>
            <strong>입력 설명:</strong>{' '}
            {formatText(problemDetail.inputDescription)}
          </p>
          <p>
            <strong>출력 설명:</strong>{' '}
            {formatText(problemDetail.outputDescription)}
          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '20px',
            }}
          >
            <div style={{ flex: 1, marginRight: '10px' }}>
              <h3>예시 입력</h3>
              <div
                style={{
                  border: '1px solid #ccc',
                  padding: '10px',
                  borderRadius: '5px',
                  backgroundColor: '#f9f9f9',
                  whiteSpace: 'pre-wrap', // 줄바꿈 유지
                }}
              >
                {formatText(problemDetail.exampleInput)}
              </div>
            </div>

            <div style={{ flex: 1, marginLeft: '10px' }}>
              <h3>예시 출력</h3>
              <div
                style={{
                  border: '1px solid #ccc',
                  padding: '10px',
                  borderRadius: '5px',
                  backgroundColor: '#f9f9f9',
                  whiteSpace: 'pre-wrap', // 줄바꿈 유지
                }}
              >
                {formatText(problemDetail.exampleOutput)}
              </div>
            </div>
          </div>

          {role === 'ROLE_ADMIN' && ( // ROLE_ADMIN일 경우에만 수정 및 삭제 버튼 표시
            <div
              style={{
                marginTop: '20px',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <Link to={`/update-problem/${problemId}`}>
                <button
                  style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginRight: '10px',
                  }}
                >
                  수정하기
                </button>
              </Link>
              <button
                onClick={handleDelete}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  backgroundColor: '#F44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                삭제하기
              </button>
            </div>
          )}

          {role === 'ROLE_ADMIN' && ( // ROLE_ADMIN일 경우에만 테스트 케이스 표시
            <div>
              <button
                onClick={handleToggleTestCases}
                style={{ marginTop: '20px' }}
              >
                {showTestCases ? '테스트 케이스 숨기기' : '테스트 케이스 보기'}
              </button>
              {showTestCases && (
                <div
                  style={{
                    marginTop: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {testCases.length > 0 ? (
                    testCases.map((testCase) => (
                      <div
                        key={testCase.id} // 각 테스트 케이스의 고유 ID를 키로 사용
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '10px',
                        }}
                      >
                        <div
                          style={{
                            border: '1px solid #ccc',
                            padding: '10px',
                            borderRadius: '5px',
                            backgroundColor: '#f9f9f9',
                            whiteSpace: 'pre-wrap',
                            flex: 1,
                            marginRight: '10px',
                          }}
                        >
                          <strong>입력:</strong> {testCase.input} <br />
                        </div>
                        <div
                          style={{
                            border: '1px solid #ccc',
                            padding: '10px',
                            borderRadius: '5px',
                            backgroundColor: '#f9f9f9',
                            whiteSpace: 'pre-wrap',
                            flex: 1,
                          }}
                        >
                          <strong>출력:</strong> {testCase.expectedOutput}{' '}
                          <br />
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            marginLeft: '10px',
                          }}
                        >
                          <Link
                            to={`/update-testcase/${problemId}/${testCase.id}`}
                          >
                            <button
                              style={{
                                padding: '5px 10px',
                                fontSize: '14px',
                                backgroundColor: '#2196F3',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                marginBottom: '5px',
                              }}
                            >
                              수정
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDeleteTestCase(testCase.id)} // 삭제 함수 호출
                            style={{
                              padding: '5px 10px',
                              fontSize: '14px',
                              backgroundColor: '#F44336',
                              color: 'white',
                              border: 'none',
                              borderRadius: '5px',
                              cursor: 'pointer',
                            }}
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>테스트 케이스가 없습니다.</p>
                  )}
                  <div
                    style={{
                      marginTop: '10px',
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <Link to={`/create-testcase/${problemId}`}>
                      <button
                        style={{
                          padding: '10px 20px',
                          fontSize: '16px',
                          backgroundColor: '#4CAF50',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          marginRight: '10px',
                        }}
                      >
                        생성
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <p>로딩 중...</p>
      )}
    </div>
  );
};

export default ProblemsDetailForm;
