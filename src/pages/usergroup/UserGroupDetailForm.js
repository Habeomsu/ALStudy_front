import React, { useEffect, useState } from 'react';
import UsergroupNavBar from '../../components/UsergroupNavBar';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import FetchAuthorizedPage from '../../service/FetchAuthorizedPage';

const UserGroupDetailForm = () => {
  const { groupId } = useParams();
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
        {error && <div style={{ color: 'red' }}>{error}</div>}{' '}
        {/* 오류 메시지 표시 */}
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
    </div>
  );
};

export default UserGroupDetailForm;
