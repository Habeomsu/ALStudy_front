import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import fetchProblems from '../../service/problem/GetProblems';
import {
  ProblemDetail,
  ProblemInfo,
  ProblemItem,
  ProblemList,
} from '../../style/problem';
import { useLogin } from '../../contexts/AuthContext';

const ProblemsForm = () => {
  const [problems, setProblems] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sort, setSort] = useState('desc');
  const [type, setType] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태 추가
  const [totalElements, setTotalElements] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const { role } = useLogin();

  useEffect(() => {
    const getProblems = async () => {
      // API 요청 전에 유효한 상태인지 확인
      if (page >= 0 && size > 0) {
        const problemsData = await fetchProblems(
          navigate,
          location,
          page,
          size,
          sort,
          type, // type이 null일 경우 아예 경로에서 제외됨
          searchTerm // 검색어 추가
        );

        if (problemsData && Array.isArray(problemsData.result.problemResDtos)) {
          setProblems(problemsData.result.problemResDtos);
          setTotalElements(problemsData.result.totalElements);
        } else {
          setProblems([]);
          setTotalElements(0);
        }
      }
    };

    getProblems();
  }, [navigate, location, page, size, sort, type, searchTerm]); // 의존성 배열에 searchTerm 추가

  const totalPages = Math.ceil(totalElements / size);

  const handleSearch = () => {
    setPage(0); // 검색 시 첫 페이지로 이동
    // API 요청을 위한 추가적인 로직이 필요할 수 있음
    const getProblems = async () => {
      const problemsData = await fetchProblems(
        navigate,
        location,
        0, // 페이지를 0으로 초기화
        size,
        sort,
        type,
        searchTerm // 검색어 전달
      );

      if (problemsData && Array.isArray(problemsData.result.problemResDtos)) {
        setProblems(problemsData.result.problemResDtos);
        setTotalElements(problemsData.result.totalElements);
      } else {
        setProblems([]);
        setTotalElements(0);
      }
    };

    getProblems();
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
      <div
        style={{
          maxWidth: '1200px',
          width: '100%',
          padding: '20px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          backgroundColor: '#fff',
        }}
      >
        <h1>문제 목록</h1>

        {role === 'ROLE_ADMIN' && (
          <div style={{ marginBottom: '15px', textAlign: 'right' }}>
            <Link to="/create-problem">
              <button
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                문제 생성
              </button>
            </Link>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '20px',
          }}
        >
          <div style={{ marginRight: '20px' }}>
            <label>페이지 크기:</label>
            <select
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>

          <div style={{ marginRight: '20px' }}>
            <label>정렬:</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="asc">오름차순</option>
              <option value="desc">내림차순</option>
            </select>
          </div>

          <div style={{ marginRight: '20px' }}>
            <label>문제 유형:</label>
            <select
              value={type === null ? 'ALL' : type}
              onChange={(e) => {
                const selectedType =
                  e.target.value === 'ALL' ? null : e.target.value;
                setType(selectedType);
                setPage(0);
              }}
            >
              <option value="ALL">모두</option>
              <option value="GREEDY">그리디</option>
              <option value="DYNAMIC_PROGRAMMING">동적 프로그래밍</option>
              <option value="IMPLEMENTATION">구현</option>
              <option value="GRAPH">그래프</option>
              <option value="BACKTRACKING">백트래킹</option>
              <option value="DIVIDE_AND_CONQUER">분할 정복</option>
              <option value="BRUTE_FORCE">완전 탐색</option>
            </select>
          </div>

          <div style={{ marginRight: '20px' }}>
            <label>검색:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // 검색어 상태 업데이트
              placeholder="문제 제목 검색"
              style={{ marginLeft: '10px' }}
            />
            <button onClick={handleSearch} style={{ marginLeft: '10px' }}>
              검색
            </button>
          </div>
        </div>

        <ProblemList>
          {problems.length > 0 ? (
            problems.map((problem) => (
              <ProblemItem key={problem.id}>
                <ProblemInfo>
                  <ProblemDetail>
                    <strong>제목:</strong>{' '}
                    <Link to={`/problems/${problem.id}`}>{problem.title}</Link>
                  </ProblemDetail>
                  <ProblemDetail>
                    <strong>난이도:</strong> {problem.difficultyLevel}
                  </ProblemDetail>
                  <ProblemDetail>
                    <strong>문제 유형:</strong> {problem.problemType}
                  </ProblemDetail>
                </ProblemInfo>
              </ProblemItem>
            ))
          ) : (
            <li>문제가 없습니다.</li>
          )}
        </ProblemList>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '20px',
          }}
        >
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page === 0}
          >
            이전
          </button>
          <span style={{ margin: '0 10px' }}>페이지: {page + 1}</span>
          <button
            onClick={() =>
              setPage((prev) => Math.min(prev + 1, totalPages - 1))
            }
            disabled={page >= totalPages - 1}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProblemsForm;
