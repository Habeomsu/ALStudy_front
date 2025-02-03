import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import FetchAuthorizedPage from '../../service/FetchAuthorizedPage';
import UsergroupNavBar from '../../components/UsergroupNavBar';

const GroupProblemForm = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [problemData, setProblemData] = useState([]); // 그룹 문제 데이터
  const [totalElements, setTotalElements] = useState(0);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sort, setSort] = useState('desc');
  const [isLeader, setIsLeader] = useState(false); // 리더 여부 상태
  const [groupData, setGroupData] = useState(null); // 그룹 데이터

  useEffect(() => {
    const fetchGroupDetails = async () => {
      const url = `http://localhost:8080/groups/${groupId}`;
      const response = await FetchAuthorizedPage(url, navigate, location);

      if (response && response.isSuccess) {
        setGroupData(response.result);

        // 로컬 저장소에서 현재 사용자 이름 가져오기
        const currentUserName = window.localStorage.getItem('name');

        // 그룹 리더 이름과 비교하여 리더 여부 설정
        if (currentUserName === response.result.username) {
          setIsLeader(true);
        }
      } else {
        setError(response.message || '그룹 정보를 불러오는 데 실패했습니다.');
      }
    };

    const fetchProblem = async () => {
      const url = `http://localhost:8080/groupproblem/${groupId}?page=${page}&size=${size}&sort=${sort}`; // 문제 API URL
      const response = await FetchAuthorizedPage(url, navigate, location);

      if (response && response.isSuccess) {
        setProblemData(response.result.groupProblemResDtos); // 문제 정보 저장
        setTotalElements(response.result.totalElements); // 전체 요소 수 저장
      } else {
        setError(response.message || '문제 정보를 불러오는 데 실패했습니다.');
      }
    };

    fetchGroupDetails();
    fetchProblem();
  }, [groupId, navigate, location, page, size, sort]);

  const totalPages = Math.ceil(totalElements / size);

  const handleCreateProblem = () => {
    // 문제 생성 페이지로 이동
    navigate(`/usergroups/${groupId}/create-problem`, { state: { groupId } });
  };

  const handleDeleteProblem = async (groupProblemId) => {
    const confirmDelete = window.confirm('정말로 이 문제를 삭제하시겠습니까?');
    if (confirmDelete) {
      const url = `http://localhost:8080/groupproblem/${groupId}/${groupProblemId}`; // 수정된 문제 삭제 API URL
      const response = await FetchAuthorizedPage(
        url,
        navigate,
        location,
        'DELETE'
      );

      if (response && response.isSuccess) {
        alert('문제가 삭제되었습니다.');
        // 문제 목록 갱신
        setProblemData(
          problemData.filter(
            (problem) => problem.groupProblemId !== groupProblemId
          )
        );
        setTotalElements((prev) => prev - 1); // 전체 요소 수 감소
      } else {
        alert('문제 삭제에 실패했습니다.');
      }
    }
  };

  const handleUpdateProblem = (groupProblemId) => {
    // 문제 수정 페이지로 이동
    navigate(`/usergroups/${groupId}/update-problem/${groupProblemId}`);
  };

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

        {/* 문제 데이터가 있을 경우 */}
        {problemData.length > 0 ? (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '80%',
                alignItems: 'center',
              }}
            >
              <h1>그룹 문제 목록</h1>
              {/* 문제 생성 버튼 (리더만 사용 가능) */}
              {isLeader && (
                <button
                  onClick={handleCreateProblem}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  문제 생성
                </button>
              )}
            </div>
            <div
              style={{
                width: '80%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {problemData.map((problem) => (
                <div
                  key={problem.groupProblemId}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '15px',
                    margin: '10px',
                    width: '100%', // 박스 너비를 전체로 설정
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Link
                    to={`/usergroups/${groupId}/problems/${problem.groupProblemId}`}
                    style={{
                      flex: 1,
                      textDecoration: 'underline', // 밑줄 추가
                      color: 'blue', // 클릭 가능한 링크 스타일
                      cursor: 'pointer',
                    }}
                  >
                    문제: {problem.title}
                  </Link>
                  <span style={{ flex: 1 }}>
                    난이도: {problem.difficultyLevel}
                  </span>
                  <span style={{ flex: 1 }}>
                    작성일: {new Date(problem.createdAt).toLocaleString()}
                  </span>
                  <span style={{ flex: 1 }}>
                    마감일: {new Date(problem.deadline).toLocaleString()}
                  </span>
                  <span style={{ flex: 1 }}>
                    감점: {problem.deductionAmount}
                  </span>
                  <span style={{ flex: 1 }}>상태: {problem.status}</span>
                  {isLeader && ( // 리더일 경우에만 업데이트 및 삭제 버튼 표시
                    <>
                      <button
                        onClick={() =>
                          handleUpdateProblem(problem.groupProblemId)
                        }
                        style={{
                          marginLeft: '10px',
                          padding: '5px 10px',
                          backgroundColor: '#2196F3',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        수정
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteProblem(problem.groupProblemId)
                        }
                        style={{
                          marginLeft: '10px',
                          padding: '5px 10px',
                          backgroundColor: '#f44336',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        삭제
                      </button>
                    </>
                  )}
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
