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
  const [page, setPage] = useState(0); // 현재 페이지
  const [size, setSize] = useState(10); // 페이지 크기
  const [totalElements, setTotalElements] = useState(0); // 전체 요소 수

  useEffect(() => {
    const fetchSubmissions = async () => {
      const url = `http://localhost:8080/submission/${groupProblemId}?page=${page}&size=${size}`; // API URL에 페이지와 크기 추가
      try {
        const data = await FetchAuthorizedPage(url, navigate, location, 'GET'); // FetchAuthorizedPage 사용

        // API 응답 확인 및 submissions 설정
        if (data.result && Array.isArray(data.result.submissionResDtos)) {
          setSubmissions(data.result.submissionResDtos); // 제출 목록 설정
          setTotalElements(data.result.totalElements); // 전체 요소 수 설정
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
  }, [groupProblemId, navigate, location, page, size]); // 페이지와 크기 추가

  const totalPages = Math.ceil(totalElements / size); // 총 페이지 수 계산

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
            {/* 페이지 네비게이션 추가 */}
            <div style={{ marginTop: '20px' }}>
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                disabled={page === 0}
              >
                이전
              </button>
              <span style={{ margin: '0 10px' }}>
                페이지: {page + 1} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages - 1))
                }
                disabled={page >= totalPages - 1}
              >
                다음
              </button>
            </div>
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
