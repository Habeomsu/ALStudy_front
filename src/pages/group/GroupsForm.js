import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import FetchAuthorizedPage from '../../service/FetchAuthorizedPage';

const GroupsForm = () => {
  const [groups, setGroups] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sort, setSort] = useState('asc');
  const [totalElements, setTotalElements] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getGroups = async () => {
      const url = `http://localhost:8080/groups?page=${page}&size=${size}&sort=${sort}`; // API URL
      const groupsData = await FetchAuthorizedPage(url, navigate, location);

      if (groupsData && groupsData.isSuccess) {
        setGroups(groupsData.result.groupResDtos); // 그룹 데이터가 있는 배열로 업데이트
        setTotalElements(groupsData.result.totalElements); // 전체 요소 수 업데이트
      } else {
        setGroups([]);
        setTotalElements(0);
      }
    };

    getGroups();
  }, [navigate, location, page, size, sort]); // 의존성 배열에 필요한 값 추가

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
          // response가 null이 아닐 경우에만 message에 접근
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
                padding: '10px 20px', // 패딩 조정
                fontSize: '16px', // 폰트 크기 조정
                backgroundColor: '#4CAF50', // 버튼 색상
                color: 'white', // 텍스트 색상
                border: 'none', // 기본 테두리 제거
                borderRadius: '5px', // 둥근 모서리
                cursor: 'pointer', // 마우스 커서 변경
              }}
            >
              그룹 생성
            </button>
          </Link>
        </div>

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
          {groups.length > 0 ? (
            groups.map((group) => (
              <li key={group.id} style={{ marginBottom: '15px' }}>
                <div
                  style={{
                    padding: '15px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    backgroundColor: '#f9f9f9',
                    display: 'flex', // 플렉스 박스 사용
                    justifyContent: 'space-between', // 양쪽 끝으로 정렬
                    alignItems: 'center', // 수직 정렬
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
                        {new Date(group.stutyEndDate).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteGroup(group.id)}
                    style={{
                      backgroundColor: '#f44336', // 삭제 버튼 색상
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      marginLeft: '15px', // 버튼 사이 마진
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
