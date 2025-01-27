import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import FetchAuthorizedPage from '../../service/FetchAuthorizedPage';

const GroupDetailForm = () => {
  const { groupId } = useParams(); // URL에서 groupId 가져오기
  const navigate = useNavigate();
  const location = useLocation(); // 현재 위치 가져오기
  const [groupData, setGroupData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      const url = `http://localhost:8080/groups/${groupId}`; // 그룹 상세 API URL
      const response = await FetchAuthorizedPage(url, navigate, location); // location 전달

      if (response && response.isSuccess) {
        setGroupData(response.result); // 그룹 정보 저장
      } else {
        setError(response.message || '그룹 정보를 불러오는 데 실패했습니다.');
      }
    };

    fetchGroupDetails();
  }, [groupId, navigate, location]);

  const handleJoinGroup = async () => {
    const password = window.prompt('비밀번호를 입력하세요:'); // 비밀번호 입력 요청
    if (password) {
      const url = `http://localhost:8080/usergroups/${groupId}`; // 그룹 ID 경로
      const body = { password }; // 본문에 비밀번호 포함

      const response = await FetchAuthorizedPage(
        url,
        navigate,
        location,
        'POST',
        body
      ); // body 전달

      if (response.isSuccess) {
        alert('그룹에 가입되었습니다.');
        navigate('/usergroups'); // 내 그룹 페이지로 이동
      } else {
        alert(`가입 실패: ${response.message}`);
      }
    }
  };

  if (error) {
    return <div>{error}</div>; // 에러 메시지 표시
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      {groupData ? (
        <>
          <h1>{groupData.groupname}</h1> {/* 그룹 이름 */}
          <p>관리자: {groupData.username}</p> {/* 그룹 관리자 */}
          <p>
            스터디 기간: {new Date(groupData.deadline).toLocaleString()} ~{' '}
            {new Date(groupData.stutyEndDate).toLocaleString()}{' '}
            {/* 스터디 기간 */}
          </p>
          <button
            onClick={handleJoinGroup}
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
            그룹 가입하기
          </button>
        </>
      ) : (
        <div>그룹 정보를 로딩 중입니다...</div> // 로딩 상태 표시
      )}
    </div>
  );
};

export default GroupDetailForm;
