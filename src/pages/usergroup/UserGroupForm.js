import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import FetchAuthorizedPage from '../../service/FetchAuthorizedPage';

const UserGroupForm = () => {
  const [usergroups, setUserGroups] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sort, setSort] = useState('asc');
  const [totalElements, setTotalElements] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const getGroups = async () => {
    const url = `http://localhost:8080/usergroups?page=${page}&size=${size}&sort=${sort}`; // API URL
    const groupsData = await FetchAuthorizedPage(url, navigate, location);

    if (groupsData && groupsData.isSuccess) {
      setUserGroups(groupsData.result.userGroupsResDtos); // 그룹 데이터가 있는 배열로 업데이트
      setTotalElements(groupsData.result.totalElements); // 전체 요소 수 업데이트
    } else {
      setUserGroups([]);
      setTotalElements(0);
    }
  };

  useEffect(() => {
    getGroups();
  }, [navigate, location, page, size, sort]); // 의존성 배열에 필요한 값 추가

  const totalPages = Math.ceil(totalElements / size);

  // 그룹 탈퇴 함수
  const resignGroup = async (groupId) => {
    const confirmResign = window.confirm(
      '정말로 이 그룹에서 탈퇴하시겠습니까?'
    );
    if (confirmResign) {
      const url = `http://localhost:8080/usergroups/${groupId}`; // 탈퇴 API URL
      const response = await FetchAuthorizedPage(
        url,
        navigate,
        location,
        'DELETE'
      );

      if (response && response.isSuccess) {
        alert('그룹에서 탈퇴되었습니다.');
        // 그룹 목록 업데이트
        setUserGroups(usergroups.filter((group) => group.groupId !== groupId));
        setTotalElements((prev) => prev - 1); // 전체 요소 수 감소
      } else {
        alert(`그룹 탈퇴에 실패했습니다: ${response.message}`); // 오류 메시지
      }
    }
  };

  // 환급하기 함수
  const handleRefund = async (userGroupId) => {
    const confirmRefund = window.confirm('환급 요청을 하시겠습니까?');
    if (confirmRefund) {
      const url = `http://localhost:8080/payment/refund/${userGroupId}`; // 환급 API URL
      const response = await FetchAuthorizedPage(
        url,
        navigate,
        location,
        'GET'
      );

      if (response && response.isSuccess) {
        alert('환급 요청이 완료되었습니다.');
        // 그룹 목록 업데이트 (예: 환급 후 사용자 그룹 리스트를 새로고침)
        getGroups(); // 그룹 목록 다시 가져오기
      } else {
        // 에러 메시지 가져오기
        const errorMessage = response?.message || '환급 요청에 실패했습니다.';
        alert(`환급 요청에 실패했습니다: ${errorMessage}`); // 오류 메시지
      }
    }
  };

  const handleCharge = (userGroupId, groupDepositAmount) => {
    // 충전하기 버튼 클릭 시 결제 페이지로 이동
    navigate(
      `/payment/checkout/${userGroupId}?depositAmount=${groupDepositAmount}`
    );
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
        <h1>그룹 목록</h1>

        <div style={{ marginBottom: '20px', textAlign: 'right' }}>
          <label>페이지 크기:</label>
          <select
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>

          <label style={{ marginLeft: '20px' }}>정렬:</label>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="asc">오름차순</option>
            <option value="desc">내림차순</option>
          </select>
        </div>

        <ul>
          {usergroups.length > 0 ? (
            usergroups.map((group) => (
              <li key={group.groupId} style={{ marginBottom: '15px' }}>
                <div
                  style={{
                    padding: '15px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    backgroundColor: '#f9f9f9',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <Link
                      to={`/usergroups/${group.groupId}`}
                      style={{ fontWeight: 'bold' }}
                    >
                      {group.groupName}
                    </Link>
                    <span> 그룹 예치금: {group.groupDepositAmount} /</span>
                    <span> 남은 예치금: {group.userDepositAmount}</span>
                    <div>
                      <span>
                        스터디 마감일:{' '}
                        {new Date(group.studyEndTime).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button
                      onClick={() =>
                        handleCharge(group.id, group.groupDepositAmount)
                      }
                      style={{
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginLeft: '15px',
                      }}
                    >
                      충전하기
                    </button>

                    <button
                      onClick={() => handleRefund(group.id)} // 환급 버튼 추가
                      style={{
                        backgroundColor: '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginLeft: '15px',
                      }}
                    >
                      환급하기
                    </button>
                    <button
                      onClick={() => resignGroup(group.groupId)}
                      style={{
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginLeft: '15px',
                      }}
                    >
                      탈퇴
                    </button>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li>그룹이 없습니다.</li>
          )}
        </ul>

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
      </div>
    </div>
  );
};

export default UserGroupForm;
