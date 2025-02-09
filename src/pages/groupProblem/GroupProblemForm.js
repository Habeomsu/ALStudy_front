import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import FetchAuthorizedPage from '../../service/FetchAuthorizedPage';
import UsergroupNavBar from '../../components/UsergroupNavBar';

const GroupProblemForm = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [problemData, setProblemData] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sort, setSort] = useState('desc');
  const [isLeader, setIsLeader] = useState(false);
  const [groupData, setGroupData] = useState(null);
  const [isFetching, setIsFetching] = useState(false); // 요청 상태 관리

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true); // 요청 시작
      try {
        await fetchGroupDetails();
        await fetchProblem();
      } catch (err) {
        setError(err.message);
        // 여기에서 토큰 재발급 로직 추가 가능
      } finally {
        setIsFetching(false); // 요청 종료
      }
    };

    fetchData();
  }, [groupId, navigate, location, page, size, sort]);

  const fetchGroupDetails = async () => {
    const url = `http://localhost:8080/groups/${groupId}`;
    const response = await FetchAuthorizedPage(url, navigate, location);
    if (response && response.isSuccess) {
      setGroupData(response.result);
      const currentUserName = window.localStorage.getItem('name');
      if (currentUserName === response.result.username) {
        setIsLeader(true);
      }
    } else {
      throw new Error(
        response.message || '그룹 정보를 불러오는 데 실패했습니다.'
      );
    }
  };

  const fetchProblem = async () => {
    const url = `http://localhost:8080/groupproblem/${groupId}?page=${page}&size=${size}&sort=${sort}`;
    const response = await FetchAuthorizedPage(url, navigate, location);
    if (response && response.isSuccess) {
      setProblemData(response.result.groupProblemResDtos);
      setTotalElements(response.result.totalElements);
    } else {
      throw new Error(
        response.message || '문제 정보를 불러오는 데 실패했습니다.'
      );
    }
  };

  const totalPages = Math.ceil(totalElements / size);

  const handleCreateProblem = () => {
    navigate(`/usergroups/${groupId}/create-problem`, { state: { groupId } });
  };

  const handleDeleteProblem = async (groupProblemId) => {
    const confirmDelete = window.confirm('정말로 이 문제를 삭제하시겠습니까?');
    if (confirmDelete) {
      const url = `http://localhost:8080/groupproblem/${groupId}/${groupProblemId}`;
      const response = await FetchAuthorizedPage(
        url,
        navigate,
        location,
        'DELETE'
      );
      if (response && response.isSuccess) {
        alert('문제가 삭제되었습니다.');
        setProblemData(
          problemData.filter(
            (problem) => problem.groupProblemId !== groupProblemId
          )
        );
        setTotalElements((prev) => prev - 1);
      } else {
        alert('문제 삭제에 실패했습니다.');
      }
    }
  };

  const handleUpdateProblem = (groupProblemId) => {
    navigate(`/usergroups/${groupId}/update-problem/${groupProblemId}`);
  };

  return (
    <div style={{ display: 'flex' }}>
      <UsergroupNavBar />
      <div
        style={{
          marginLeft: '40px',
          textAlign: 'center',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
          alignItems: 'center',
        }}
      >
        {isFetching && <div>로딩 중...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '80%',
            alignItems: 'center',
          }}
        >
          <h1>그룹 문제 목록</h1>
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

        {problemData.length > 0 ? (
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
                  width: '100%',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Link
                  to={`/usergroups/${groupId}/problems/${problem.groupProblemId}`}
                  style={{
                    flex: 1,
                    textDecoration: 'underline',
                    color: 'blue',
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
                <span style={{ flex: 1 }}>감점: {problem.deductionAmount}</span>
                <span style={{ flex: 1 }}>상태: {problem.status}</span>
                {isLeader && (
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
        ) : (
          <div>문제 정보가 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default GroupProblemForm;
