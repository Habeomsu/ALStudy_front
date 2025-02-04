import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import UsergroupNavBar from '../../components/UsergroupNavBar';
import GroupProblemButton from '../../components/GroupProblemButton';
import FetchMultipartAuthorizedPage from '../../service/FetchMultipartAuthorizedPage';

const SubmitForm = () => {
  const { groupId, groupProblemId } = useParams(); // URL에서 groupId와 groupProblemId 가져오기
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState(''); // 제출할 코드 상태
  const [language, setLanguage] = useState('python'); // 선택할 언어 상태
  const [error, setError] = useState(null); // 오류 메시지 상태

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!code) {
      alert('코드를 입력해 주세요.');
      return;
    }

    // 코드 텍스트를 Blob으로 변환하여 파일로 만들기
    const blob = new Blob([code], { type: 'text/plain' });
    const formData = new FormData();
    formData.append('file', blob, 'submission_code.txt'); // 파일 이름을 지정
    formData.append('language', language); // 언어 추가

    const url = `http://localhost:8080/submission/${groupProblemId}`; // 코드 제출 API 경로
    const response = await FetchMultipartAuthorizedPage(
      url,
      navigate,
      location,
      'POST',
      formData
    );

    if (response && response.isSuccess) {
      alert('코드가 성공적으로 제출되었습니다.');
      navigate(`/usergroups/${groupId}/my-submit/${groupProblemId}`); // 문제 목록 페이지로 이동
    } else {
      alert(response.message || '코드 제출에 실패했습니다.');
    }
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
        <GroupProblemButton groupId={groupId} groupProblemId={groupProblemId} />
        {error && <div style={{ color: 'red' }}>{error}</div>}

        <h2>코드 제출</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="language">언어 선택:</label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{ marginTop: '10px', width: '100px' }} // 너비를 줄임
            >
              <option value="java">Java</option>
              <option value="python">Python</option>
              <option value="c">C</option>
              <option value="cpp">C++</option>
              <option value="javascript">JavaScript</option>
              {/* 필요에 따라 다른 언어 추가 */}
            </select>
          </div>
          <div>
            <label htmlFor="code">코드 입력:</label>
            <textarea
              id="code"
              rows="30" // 높이를 더욱 크게 설정
              style={{
                width: '100%',
                height: '600px', // 코드 입력 칸의 높이를 더 크게 설정
                maxWidth: '900px',
                minWidth: '500px',
                marginTop: '10px',
              }} // 너비 및 높이 조정
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            제출하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitForm;
