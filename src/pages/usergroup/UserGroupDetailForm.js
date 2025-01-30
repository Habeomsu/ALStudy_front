import React, { useEffect, useState } from 'react';
import UsergroupNavBar from '../../components/UsergroupNavBar';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import FetchAuthorizedPage from '../../service/FetchAuthorizedPage';

const UserGroupDetailWithMembersForm = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [groupData, setGroupData] = useState(null);
  const [membersData, setMembersData] = useState([]);
  const [error, setError] = useState(null);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sort, setSort] = useState('desc');

  useEffect(() => {
    const fetchGroupDetails = async () => {
      const url = `http://localhost:8080/groups/${groupId}`;
      const response = await FetchAuthorizedPage(url, navigate, location);

      if (response && response.isSuccess) {
        setGroupData(response.result);
      } else {
        setError(response.message || '그룹 정보를 불러오는 데 실패했습니다.');
      }
    };

    const fetchMembers = async () => {
      const url = `http://localhost:8080/usergroups/${groupId}/users?page=${page}&size=${size}&sort=${sort}`;
      const response = await FetchAuthorizedPage(url, navigate, location);

      if (response && response.isSuccess) {
        setMembersData(response.result.usernameDtos);
        setTotalElements(response.result.totalElements);
      } else {
        setError(response.message || '멤버 정보를 불러오는 데 실패했습니다.');
      }
    };

    fetchGroupDetails();
    fetchMembers();
  }, [groupId, navigate, location, page, size, sort]);

  const totalPages = Math.ceil(totalElements / size);

  return (
    <div style={{ display: 'flex' }}>
      <UsergroupNavBar />

      <div
        style={{
          display: 'flex',
          flex: 1,
          marginLeft: '220px', // 사이드바 너비에 맞추어 여백 조정
          flexDirection: 'column', // 세로 방향으로 쌓이도록 설정
        }}
      >
        {/* 그룹 정보 영역 */}
        <div style={{ padding: '20px', textAlign: 'center' }}>
          {error && <div style={{ color: 'red' }}>{error}</div>}

          {groupData ? (
            <>
              <h1>{groupData.groupName}</h1>
              <p>관리자: {groupData.username}</p>
              <p>
                스터디 기간: {new Date(groupData.deadline).toLocaleString()} ~{' '}
                {new Date(groupData.studyEndDate).toLocaleString()}
              </p>
            </>
          ) : (
            <div>그룹 정보를 로딩 중입니다...</div>
          )}
        </div>

        {/* 그룹 정보와 데이터 공간 사이의 간격 추가 */}
        <div style={{ marginTop: '40px', display: 'flex', flex: 1 }}>
          {/* 왼쪽 데이터 공간 */}
          <div
            style={{
              width: '50%', // 왼쪽 공간의 너비
              padding: '20px',
              borderRight: '1px solid #ccc', // 구분선
              textAlign: 'center',
            }}
          >
            <h2>왼쪽 데이터 영역</h2>
            {/* 여기에 다른 데이터를 추가할 수 있습니다 */}
            <p>이곳에 다른 데이터를 입력하세요.</p>
          </div>

          {/* 오른쪽 멤버 목록 공간 */}
          <div
            style={{
              width: '50%', // 오른쪽 공간의 너비
              padding: '20px',
              textAlign: 'center',
            }}
          >
            {/* 멤버 목록 */}
            {membersData.length > 0 ? (
              <>
                <h2>그룹 멤버 목록</h2>
                <table
                  style={{
                    marginTop: '20px',
                    borderCollapse: 'collapse',
                    width: '80%',
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
              <div>멤버 정보가 없습니다.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGroupDetailWithMembersForm;
