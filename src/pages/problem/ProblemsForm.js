import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import fetchProblems from '../../service/problem/GetProblems';
import {
  ProblemDetail,
  ProblemInfo,
  ProblemItem,
  ProblemList,
} from '../../style/problem';

const ProblemsForm = () => {
  const [problems, setProblems] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sort, setSort] = useState('desc');
  const [type, setType] = useState(null);
  const [totalElements, setTotalElements] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

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
          type // type이 null일 경우 아예 경로에서 제외됨
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
  }, [navigate, location, page, size, sort, type]); // 의존성 배열에 page, size, sort, type 추가

  const totalPages = Math.ceil(totalElements / size);

  return (
    <div>
      <h1>문제 목록</h1>
      <div>
        <label>페이지 크기:</label>
        <select value={size} onChange={(e) => setSize(Number(e.target.value))}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>

        <label>정렬:</label>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="asc">오름차순</option>
          <option value="desc">내림차순</option>
        </select>

        <label>문제 유형:</label>
        <select
          value={type === null ? 'ALL' : type}
          onChange={(e) => {
            const selectedType =
              e.target.value === 'ALL' ? null : e.target.value;
            setType(selectedType); // "모두" 선택 시 null로 설정
            setPage(0); // 페이지를 초기화하여 무한 요청 방지
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

      <ProblemList>
        {problems.length > 0 ? (
          problems.map((problem) => (
            <ProblemItem key={problem.id}>
              <ProblemInfo>
                <ProblemDetail>
                  <strong>제목:</strong> {problem.title}
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
      <div>
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
        >
          이전
        </button>
        <span>페이지: {page + 1}</span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
          disabled={page >= totalPages - 1}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default ProblemsForm;
