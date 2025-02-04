import React, { useEffect, useState } from 'react';
import UsergroupNavBar from '../../components/UsergroupNavBar';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import FetchAuthorizedPage from '../../service/FetchAuthorizedPage';

const UserGroupMemberForm = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [membersData, setMembersData] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sort, setSort] = useState('desc');

  useEffect(() => {
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

    fetchMembers();
  }, [groupId, navigate, location, page, size, sort]);

  const totalPages = Math.ceil(totalElements / size);

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
        {error && <div style={{ color: 'red' }}>{error}</div>}

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
                alignItems: 'center', // 수직 중앙 정렬
              }}
            >
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                disabled={page === 0}
                style={{ marginRight: '10px' }}
              >
                이전
              </button>
              <span style={{ margin: '0 10px' }}>
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
