import React, { useEffect, useState } from 'react';
import UsergroupNavBar from '../../components/UsergroupNavBar';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import FetchAuthorizedPage from '../../service/FetchAuthorizedPage';

const UserGroupDetailWithMembersForm = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [groupData, setGroupData] = useState(null);
  const [membersData, setMembersData] = useState([]);
  const [todayProblems, setTodayProblems] = useState([]);
  const [error, setError] = useState(null);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sort, setSort] = useState('desc');
  const [isFetching, setIsFetching] = useState(false); // 요청 상태 관리

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true); // 요청 시작
      try {
        await fetchGroupDetails();
        await fetchMembers();
        await fetchTodayProblems();
      } catch (err) {
        setError(err.message);
        // 여기서 토큰 재발급 로직 추가 가능
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
    } else {
      throw new Error(
        response.message || '그룹 정보를 불러오는 데 실패했습니다.'
      );
    }
  };

  const fetchMembers = async () => {
    const url = `http://localhost:8080/usergroups/${groupId}/users?page=${page}&size=${size}&sort=${sort}`;
    const response = await FetchAuthorizedPage(url, navigate, location);
    if (response && response.isSuccess) {
      setMembersData(response.result.usernameDtos);
      setTotalElements(response.result.totalElements);
    } else {
      throw new Error(
        response.message || '멤버 정보를 불러오는 데 실패했습니다.'
      );
    }
  };

  const fetchTodayProblems = async () => {
    const url = `http://localhost:8080/groupproblem/${groupId}/todayProblem`;
    const response = await FetchAuthorizedPage(url, navigate, location);
    if (response && response.isSuccess) {
      setTodayProblems(response.result.groupProblemResDtos);
    } else {
      throw new Error(
        response.message || '오늘의 문제를 불러오는 데 실패했습니다.'
      );
    }
  };

  const totalPages = Math.ceil(totalElements / size);

  return (
    <div style={{ display: 'flex' }}>
      <UsergroupNavBar />

      <div
        style={{
          display: 'flex',
          flex: 1,
          marginLeft: '50px',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{ padding: '20px', textAlign: 'center' }}>
          {error && <div style={{ color: 'red' }}>{error}</div>}

          {groupData ? (
            <>
              <h1>{groupData.groupname}</h1>
              <p>관리자: {groupData.username}</p>
              <p>
                스터디 기간: {new Date(groupData.deadline).toLocaleString()} ~{' '}
                {new Date(groupData.stutyEndDate).toLocaleString()}
              </p>
            </>
          ) : (
            <div>그룹 정보를 로딩 중입니다...</div>
          )}
        </div>

        <div style={{ marginTop: '40px', display: 'flex', width: '100%' }}>
          <div
            style={{
              flex: 1,
              padding: '20px',
              borderRight: '1px solid #ccc',
              textAlign: 'center',
            }}
          >
            <h2>오늘의 문제</h2>
            {todayProblems.length > 0 ? (
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {todayProblems.map((problem) => (
                  <li
                    key={problem.groupProblemId}
                    style={{
                      marginBottom: '15px',
                      padding: '10px',
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                    }}
                  >
                    <Link
                      to={`/usergroups/${groupId}/problems/${problem.groupProblemId}`}
                      style={{ fontWeight: 'bold' }}
                    >
                      문제: {problem.title}
                    </Link>
                    <span>
                      {' '}
                      마감일: {new Date(problem.deadline).toLocaleString()}
                    </span>
                    <span> 차감액: {problem.deductionAmount}</span>
                    <span> 상태: {problem.status}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div>오늘의 문제가 없습니다.</div>
            )}
          </div>

          <div
            style={{
              flex: 1,
              padding: '20px',
              textAlign: 'center',
            }}
          >
            {membersData.length > 0 ? (
              <>
                <h2>그룹 멤버 목록</h2>
                <table
                  style={{
                    marginTop: '20px',
                    borderCollapse: 'collapse',
                    width: '80%',
                    margin: '0 auto',
                  }}
                >
                  <thead>
                    <tr>
                      <th style={{ border: '1px solid #ccc', padding: '10px' }}>
                        회원 이름
                      </th>
                      <th style={{ border: '1px solid #ccc', padding: '10px' }}>
                        예치금
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {membersData.map((member, index) => (
                      <tr key={index}>
                        <td
                          style={{ border: '1px solid #ccc', padding: '10px' }}
                        >
                          {member.username}
                        </td>
                        <td
                          style={{ border: '1px solid #ccc', padding: '10px' }}
                        >
                          {member.depositAmount.toLocaleString()} 원
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

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
              <div>멤버 정보가 없습니다.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGroupDetailWithMembersForm;
