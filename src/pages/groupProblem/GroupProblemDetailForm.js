import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import FetchAuthorizedPage from '../../service/FetchAuthorizedPage';
import UsergroupNavBar from '../../components/UsergroupNavBar';
import GroupProblemButton from '../../components/GroupProblemButton';

const GroupProblemDetailForm = () => {
  const { groupId, groupProblemId } = useParams(); // URL 파라미터에서 그룹 ID와 문제 ID 가져오기
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  const [groupProblemData, setGroupProblemData] = useState(null);

  useEffect(() => {
    const fetchGroupProblemDetails = async () => {
      const url = `http://localhost:8080/groupproblem/${groupId}/${groupProblemId}`;
      const response = await FetchAuthorizedPage(url, navigate, location);

      if (response && response.isSuccess) {
        setGroupProblemData(response.result); // 문제 상세 정보 가져오기
      } else {
        setError(
          response.message || '그룹 문제 정보를 불러오는 데 실패했습니다.'
        );
      }
    };

    fetchGroupProblemDetails();
  }, [groupId, groupProblemId, navigate, location]);

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
    <div style={{ display: 'flex' }}>
      <UsergroupNavBar />
      <div
        style={{
          marginLeft: '40px', // 사이드바 너비에 맞추어 여백 조정
          textAlign: 'center',
          flex: 1, // 남은 공간을 차지하도록 설정
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
          alignItems: 'center', // 수평 중앙 정렬
        }}
      >
        <GroupProblemButton />
        {error && <div style={{ color: 'red' }}>{error}</div>}

        {groupProblemData ? (
          <div style={{ width: '80%', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h2>{groupProblemData.title}</h2>
              <div>
                <strong>감점:</strong> {groupProblemData.deductionAmount} &nbsp;
                <strong>상태:</strong> {groupProblemData.status}
              </div>
            </div>
            <p>
              <strong>난이도:</strong> {groupProblemData.difficultyLevel}
            </p>
            <p>
              <strong>문제 유형:</strong> {groupProblemData.problemType}
            </p>
            <p>
              <strong>설명:</strong> {formatText(groupProblemData.description)}
            </p>
            <p>
              <strong>입력 설명:</strong>{' '}
              {formatText(groupProblemData.inputDescription)}
            </p>
            <p>
              <strong>출력 설명:</strong>{' '}
              {formatText(groupProblemData.outputDescription)}
            </p>

            <div
              style={{
                marginTop: '20px',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ flex: 1, marginRight: '10px' }}>
                <h3>예제 입력</h3>
                <div
                  style={{
                    border: '1px solid #ccc',
                    padding: '10px',
                    borderRadius: '5px',
                    backgroundColor: '#f9f9f9',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {formatText(groupProblemData.exampleInput)}
                </div>
              </div>
              <div style={{ flex: 1, marginLeft: '10px' }}>
                <h3>예제 출력</h3>
                <div
                  style={{
                    border: '1px solid #ccc',
                    padding: '10px',
                    borderRadius: '5px',
                    backgroundColor: '#f9f9f9',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {formatText(groupProblemData.exampleOutput)}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>로딩 중...</p>
        )}
      </div>
    </div>
  );
};

export default GroupProblemDetailForm;
