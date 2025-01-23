import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import fetchProblemDetail from '../../service/problem/GetProblemDetail';

const ProblemsDetailForm = () => {
  const { problemId } = useParams(); // URL 파라미터에서 문제 ID 가져오기
  const [problemDetail, setProblemDetail] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

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
        </div>
      ) : (
        <p>로딩 중...</p>
      )}
    </div>
  );
};

export default ProblemsDetailForm;
