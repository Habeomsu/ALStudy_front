import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import FetchAuthorizedPage from '../../service/FetchAuthorizedPage';

const GroupsForm = () => {
  const [groups, setGroups] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sort, setSort] = useState('asc');
  const [totalElements, setTotalElements] = useState(0);
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태 추가
  const navigate = useNavigate();
  const location = useLocation();

  // 그룹을 가져오는 함수
  const getGroups = async () => {
    const url = `http://localhost:8080/groups?page=${page}&size=${size}&sort=${sort}&search=${encodeURIComponent(
      searchTerm
    )}`; // API URL에 검색어 추가
    const groupsData = await FetchAuthorizedPage(url, navigate, location);

    if (groupsData && groupsData.isSuccess) {
      setGroups(groupsData.result.groupResDtos); // 그룹 데이터가 있는 배열로 업데이트
      setTotalElements(groupsData.result.totalElements); // 전체 요소 수 업데이트
    } else {
      setGroups([]);
      setTotalElements(0);
    }
  };

  useEffect(() => {
    getGroups(); // 컴포넌트가 마운트될 때 그룹 가져오기
  }, [navigate, location, page, size, sort, searchTerm]); // 의존성 배열에 searchTerm 추가

  const totalPages = Math.ceil(totalElements / size);

  // 실제 삭제 요청을 수행하는 함수
  const deleteGroup = async (groupId, password) => {
    const url = `http://localhost:8080/groups/${groupId}?password=${encodeURIComponent(
      password
    )}`; // 비밀번호를 쿼리 파라미터로 추가
    return await FetchAuthorizedPage(url, navigate, location, 'DELETE'); // 응답 반환
  };

  // 그룹 삭제 함수
  const handleDeleteGroup = async (groupId) => {
    const deleteConfirm = window.prompt('비밀번호를 입력하세요:'); // 비밀번호 입력 요청
    if (deleteConfirm) {
      const response = await deleteGroup(groupId, deleteConfirm); // 비밀번호와 함께 삭제 요청
      if (response) {
        if (response.isSuccess) {
          alert('그룹이 삭제되었습니다.');
          setGroups(groups.filter((group) => group.id !== groupId)); // 삭제된 그룹을 목록에서 제거
          setTotalElements((prev) => prev - 1); // 전체 요소 수 감소
        } else {
          alert(
            `그룹 삭제에 실패했습니다. ${
              response.message || '알 수 없는 오류가 발생했습니다.'
            }`
          );
        }
      } else {
        alert('서버와의 연결에 문제가 발생했습니다.');
      }
    }
  };

  // 검색 함수
  const handleSearch = () => {
    setPage(0); // 검색 시 첫 페이지로 이동
    getGroups(); // 검색어로 그룹 가져오기
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

        <div style={{ marginBottom: '15px', textAlign: 'right' }}>
          <Link to="/create-group">
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
              그룹 생성
            </button>
          </Link>
        </div>

        <div style={{ marginBottom: '20px', textAlign: 'right' }}>
          <label>검색:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="그룹 이름 검색"
            style={{ marginLeft: '10px', marginRight: '10px' }}
          />
          <button onClick={handleSearch} style={{ padding: '5px 10px' }}>
            검색
          </button>

          <label style={{ marginLeft: '20px' }}>페이지 크기:</label>
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
          {groups.length > 0 ? (
            groups.map((group) => (
              <li key={group.id} style={{ marginBottom: '15px' }}>
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
                      to={`/groups/${group.id}`}
                      style={{ fontWeight: 'bold' }}
                    >
                      {group.groupname}
                    </Link>
                    <span> (관리자: {group.username})</span>
                    <span> (예치금: {group.depositAmount})</span>
                    <div>
                      <span>
                        모집 기간: {new Date(group.deadline).toLocaleString()}
                      </span>
                      <span>
                        {' '}
                        | 스터디 종료 기간:{' '}
                        {new Date(group.studyEndDate).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteGroup(group.id)}
                    style={{
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      marginLeft: '15px',
                    }}
                  >
                    삭제
                  </button>
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

export default GroupsForm;
