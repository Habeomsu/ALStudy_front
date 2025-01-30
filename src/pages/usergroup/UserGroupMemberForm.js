import React, { useEffect, useState } from 'react';
import UsergroupNavBar from '../../components/UsergroupNavBar';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import FetchAuthorizedPage from '../../service/FetchAuthorizedPage';

const UserGroupMemberForm = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [membersData, setMembersData] = useState([]); // 멤버 데이터 상태
  const [totalElements, setTotalElements] = useState(0);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sort, setSort] = useState('desc');

  useEffect(() => {
    const fetchMembers = async () => {
      const url = `http://localhost:8080/usergroups/${groupId}/users?page=${page}&size=${size}&sort=${sort}`; // 멤버 API URL
      const response = await FetchAuthorizedPage(url, navigate, location);

      if (response && response.isSuccess) {
        setMembersData(response.result.usernameDtos); // 멤버 정보 저장
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
        {membersData.length > 0 ? (
          <>
            <h1>그룹 멤버 목록</h1>
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
                    <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                      {member.username}
                    </td>
                    <td style={{ border: '1px solid #ccc', padding: '10px' }}>
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
  );
};

export default UserGroupMemberForm;
