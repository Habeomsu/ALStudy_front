import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import FetchAuthorizedPage from '../../service/FetchAuthorizedPage';
import UsergroupNavBar from '../../components/UsergroupNavBar';

const GroupProblemForm = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [problemData, setProblemData] = useState([]); // 그룹 데이터
  const [totalElements, setTotalElements] = useState(0);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sort, setSort] = useState('desc');

  useEffect(() => {
    const fetchMembers = async () => {
      const url = `http://localhost:8080/groupproblem/${groupId}?page=${page}&size=${size}&sort=${sort}`; // 멤버 API URL
      const response = await FetchAuthorizedPage(url, navigate, location);

      if (response && response.isSuccess) {
        setProblemData(response.result.groupProblemResDtos); // 멤버 정보 저장
        setTotalElements(response.result.totalElements); // 전체 요소 수 저장
      } else {
        setError(response.message || '멤버 정보를 불러오는 데 실패했습니다.');
      }
    };

    fetchMembers();
  }, [groupId, navigate, location, page, size, sort]);

  const totalPages = Math.ceil(totalElements / size);

  return (
    <div style={{ display: 'flex' }}>
      <UsergroupNavBar />

      <div
        style={{
          marginLeft: '220px', // 사이드바 너비에 맞추어 여백 조정
          padding: '20px',
          textAlign: 'center',
          flex: 1, // 남은 공간을 차지하도록 설정
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center', // 수직 중앙 정렬
          alignItems: 'center', // 수평 중앙 정렬
        }}
      >
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {/* 오류 메시지 표시 */}
        {problemData.length > 0 ? (
          <>
            <h1>그룹 문제 목록</h1>
            <div
              style={{
                width: '80%',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {problemData.map((problem) => (
                <div
                  key={problem.groupProblemId}
                  style={{
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '15px',
                    margin: '10px',
                    width: '200px', // 박스 너비
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <h3>{problem.title}</h3>
                  <p>난이도: {problem.difficultyLevel}</p>
                  <p>상태: {problem.status}</p>
                  <p>작성일: {new Date(problem.createdAt).toLocaleString()}</p>
                  <p>마감일: {new Date(problem.deadline).toLocaleString()}</p>
                  <p>감점: {problem.deductionAmount}</p>
                </div>
              ))}
            </div>

            {/* 페이지네이션 추가 */}
            <div
              style={{
                marginTop: '20px',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                disabled={page === 0}
                style={{ marginRight: '10px' }}
              >
                이전
              </button>
              <span>
                페이지 {page + 1} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages - 1))
                }
                disabled={page >= totalPages - 1}
                style={{ marginLeft: '10px' }}
              >
                다음
              </button>
            </div>
          </>
        ) : (
          <div>문제 정보가 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default GroupProblemForm;
