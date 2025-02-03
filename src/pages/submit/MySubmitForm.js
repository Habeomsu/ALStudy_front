import React, { useEffect, useState } from 'react';
import UsergroupNavBar from '../../components/UsergroupNavBar';
import GroupProblemButton from '../../components/GroupProblemButton';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import FetchAuthorizedPage from '../../service/FetchAuthorizedPage'; // 기존 Fetch 함수 사용

const MySubmitForm = () => {
  const { groupId, groupProblemId } = useParams(); // URL 파라미터에서 그룹 ID와 문제 ID 가져오기
  const navigate = useNavigate();
  const location = useLocation();
  const [submissions, setSubmissions] = useState([]); // 제출 목록 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 오류 메시지 상태

  useEffect(() => {
    const fetchSubmissions = async () => {
      const url = `http://localhost:8080/submission/${groupProblemId}`; // API URL
      try {
        const data = await FetchAuthorizedPage(url, navigate, location, 'GET'); // FetchAuthorizedPage 사용

        // API 응답 확인 및 submissions 설정
        if (data.result && Array.isArray(data.result.submissionResDtos)) {
          setSubmissions(data.result.submissionResDtos); // 제출 목록 설정
        } else {
          console.error(
            'Expected an array but got:',
            data.result?.submissionResDtos
          );
          setSubmissions([]); // 빈 배열로 초기화
        }
      } catch (err) {
        setError('제출 목록을 가져오는데 실패했습니다.');
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };

    fetchSubmissions();
  }, [groupProblemId, navigate, location]);

  return (
    <div style={{ display: 'flex' }}>
      <UsergroupNavBar />
      <div
        style={{
          marginLeft: '220px', // 사이드바 너비에 맞추어 여백 조정
          padding: '20px',
          flex: 1, // 남은 공간을 차지하도록 설정
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <GroupProblemButton groupId={groupId} groupProblemId={groupProblemId} />
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {loading ? (
          <div>로딩 중...</div>
        ) : (
          <>
            <h2>내 제출 목록</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={headerStyle}>제출 ID</th>
                  <th style={headerStyle}>사용자</th>
                  <th style={headerStyle}>문제</th>
                  <th style={headerStyle}>상태</th>
                  <th style={headerStyle}>제출 시간</th>
                  <th style={headerStyle}>언어</th>
                </tr>
              </thead>
              <tbody>
                {submissions.length > 0 ? (
                  submissions.map((submission) => (
                    <tr key={submission.id} style={rowStyle}>
                      <td style={cellStyle}>
                        <Link
                          to={`/usergroups/${groupId}/my-submit/${groupProblemId}/${submission.id}`}
                        >
                          {submission.id}
                        </Link>{' '}
                        {/* 제출 ID를 링크로 만들기 */}
                      </td>
                      <td style={cellStyle}>{submission.username}</td>
                      <td style={cellStyle}>{submission.title}</td>
                      <td style={cellStyle}>{submission.status}</td>
                      <td style={cellStyle}>
                        {new Date(submission.submissionTime).toLocaleString()}
                      </td>
                      <td style={cellStyle}>{submission.language}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={cellStyle}>
                      제출 목록이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

// 스타일 객체
const headerStyle = {
  borderBottom: '2px solid #ddd',
  padding: '10px',
  textAlign: 'left',
  backgroundColor: '#f2f2f2',
};

const rowStyle = {
  borderBottom: '1px solid #ddd',
};

const cellStyle = {
  padding: '10px',
};

export default MySubmitForm;
