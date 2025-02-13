import React, { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import UsergroupNavBar from '../../components/UsergroupNavBar';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import FetchAuthorizedPage from '../../service/FetchAuthorizedPage';

const UserGroupDetailWithMembersForm = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [groupData, setGroupData] = useState(null);
  const [todayProblems, setTodayProblems] = useState([]);
  const [error, setError] = useState(null);
  const [chatMessages, setChatMessages] = useState([]); // 채팅 메시지 상태
  const [newMessage, setNewMessage] = useState(''); // 새 메시지 상태
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchGroupDetails();
        await fetchTodayProblems();
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [groupId, navigate, location]);

  useEffect(() => {
    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      connectHeaders: {
        access: localStorage.getItem('access') || '',
      },
      debug: (str) => {
        console.log(str);
      },
      onConnect: () => {
        console.log('Connected to WebSocket');
        client.subscribe(`/sub/channel/${groupId}`, (message) => {
          try {
            const msg = JSON.parse(message.body); // JSON 형식으로 파싱
            setChatMessages((prev) => [...prev, msg]);
          } catch (error) {
            console.error('Error parsing message:', error);
            console.log('Received message:', message.body); // 수신된 메시지 출력
          }
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Error details:', frame.body);
      },
    });

    setStompClient(client); // STOMP 클라이언트 상태 업데이트
    client.activate();

    return () => {
      client.deactivate();
    };
  }, [groupId]);

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

  const sendMessage = () => {
    if (newMessage.trim() && stompClient) {
      const message = {
        type: 'CHAT',
        sender: localStorage.getItem('name'), // 실제 사용자 이름으로 변경
        channelId: groupId,
        data: newMessage,
      };

      stompClient.publish({
        destination: `/pub/hello`, // 메시지를 전송할 엔드포인트
        body: JSON.stringify(message), // JSON 형식으로 변환하여 전송
      });

      setNewMessage(''); // 메시지 입력 필드 초기화
    }
  };

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

          {/* 채팅 부분 */}
          <div
            style={{
              flex: 1,
              padding: '20px',
              textAlign: 'center',
            }}
          >
            <h2>채팅</h2>
            <div
              style={{
                border: '1px solid #ccc',
                borderRadius: '5px',
                padding: '10px',
                height: '300px',
                overflowY: 'scroll',
                marginBottom: '20px',
              }}
            >
              {chatMessages.map((msg, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                  <strong>{msg.sender}:</strong> {msg.data}
                </div>
              ))}
            </div>

            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="메시지를 입력하세요..."
              style={{
                width: '80%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            />
            <button
              onClick={sendMessage}
              style={{ padding: '10px', marginLeft: '10px' }}
            >
              전송
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGroupDetailWithMembersForm;
