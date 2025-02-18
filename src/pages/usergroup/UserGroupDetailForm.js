import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import UsergroupNavBar from '../../components/UsergroupNavBar';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import FetchAuthorizedPage from '../../service/FetchAuthorizedPage';
import FetchReissue from '../../service/FetchReissue';
import { Cookies } from 'react-cookie';

const UserGroupDetailWithMembersForm = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [groupData, setGroupData] = useState(null);
  const [todayProblems, setTodayProblems] = useState([]);
  const [error, setError] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [stompClient, setStompClient] = useState(null);

  const [loading, setLoading] = useState(false); // 로딩 상태
  const [page, setPage] = useState(0); // 현재 페이지 상태
  const chatContainerRef = useRef(null);
  const [hasMore, setHasMore] = useState(true);
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchGroupDetails();
        await fetchTodayProblems();
        await fetchPreviousMessages();
        connectWebSocket();
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
    return () => {
      if (stompClient) {
        stompClient.deactivate(); // 컴포넌트 언마운트 시 WebSocket 연결 종료
      }
    };
  }, [groupId, navigate, location]);

  const connectWebSocket = async () => {
    if (stompClient) {
      // 기존 연결이 있으면 끊기
      stompClient.deactivate();
      console.log('Disconnected from previous WebSocket connection');
    }
    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      connectHeaders: {
        access: localStorage.getItem('access') || '',
      },
      heartbeatIncoming: 30000,
      heartbeatOutgoing: 30000,

      onConnect: () => {
        console.log('Connected to WebSocket');

        client.subscribe(`/topic/${groupId}`, (message) => {
          try {
            const msg = JSON.parse(message.body);
            // 현재 시간을 createdAt에 추가
            const timestamp = new Date(); // 현재 시간

            setChatMessages((prev) => [
              ...prev,
              { ...msg, createdAt: timestamp },
            ]); // 메시지에 시간 추가
            scrollToBottom();
          } catch (error) {
            console.error('Error parsing message:', error);
            console.log('Received message:', message.body);
          }
        });
      },

      onStompError: async (frame) => {
        console.error('WebSocket Error:', frame.headers['message']);
        console.error('Error details:', frame.body);
        console.log('frame:', frame);

        setChatMessages((prev) => [
          ...prev,
          { sender: 'System', data: '토큰 만료 !! 새로고침해주세요' },
        ]);
      },
    });

    setStompClient(client);
    client.activate();
  };

  const fetchGroupDetails = async () => {
    const url = `http://localhost:8080/groups/${groupId}`;
    const response = await FetchAuthorizedPage(url, navigate, location);
    if (response && response.isSuccess) {
      setGroupData(response.result);
      console.log('fetchGroupDetails is success');
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
      console.log('setTodayProblems is success');
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
        sender: localStorage.getItem('name'),
        channelId: groupId,
        data: newMessage,
      };

      stompClient.publish({
        destination: `/pub/hello`,
        body: JSON.stringify(message),
      });

      setNewMessage('');
    }
  };

  const fetchPreviousMessages = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const chatContainer = chatContainerRef.current;
    const previousScrollHeight = chatContainer ? chatContainer.scrollHeight : 0;

    const url = `http://localhost:8080/message/${groupId}?page=${page}&size=20`;
    const response = await FetchAuthorizedPage(url, navigate, location);

    if (response && response.isSuccess) {
      const newMessages = response.result.messageResDtos.reverse();
      console.log('fetchPreviousMessages is success');

      if (newMessages.length > 0) {
        setChatMessages((prev) => [...newMessages, ...prev]);
      }

      if (response.result.last) {
        setHasMore(false);
      }

      // 🔹 추가 메시지를 불러온 후, 이전 스크롤 위치 유지
      setTimeout(() => {
        if (chatContainer) {
          chatContainer.scrollTop =
            chatContainer.scrollHeight - previousScrollHeight;
        }
      }, 100);
    } else {
      console.error(
        response.message || '이전 메시지를 불러오는 데 실패했습니다.'
      );
    }

    setLoading(false);
  };

  // 처음 채팅방에 들어올 때만 실행
  useEffect(() => {
    if (chatMessages.length > 0 && page === 0) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [chatMessages, page]);

  useEffect(() => {
    if (page > 0 && hasMore) {
      fetchPreviousMessages();
    }
  }, [page]);

  const onScroll = () => {
    if (!hasMore) return;
    const chatContainer = chatContainerRef.current;
    if (chatContainer.scrollTop === 0) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener('scroll', onScroll);
    }
    return () => {
      if (chatContainer) {
        chatContainer.removeEventListener('scroll', onScroll);
      }
    };
  }, []);

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
              ref={chatContainerRef}
              style={{
                border: '1px solid #ccc',
                borderRadius: '5px',
                padding: '10px',
                height: '300px',
                overflowY: 'scroll',
                marginBottom: '20px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* 기존 메시지를 순서대로 표시 */}
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: '10px',
                    alignSelf:
                      msg.sender === localStorage.getItem('name')
                        ? 'flex-end'
                        : 'flex-start', // 발신자에 따라 위치 조정
                    backgroundColor:
                      msg.sender === localStorage.getItem('name')
                        ? '#d1e7dd'
                        : '#f8d7da', // 색상 변경
                    padding: '10px',
                    borderRadius: '5px',
                    maxWidth: '70%', // 메시지의 최대 너비 설정
                  }}
                >
                  <strong>{msg.sender}:</strong> {msg.data}
                  <span style={{ fontSize: 'small', color: 'gray' }}>
                    ({new Date(msg.createdAt).toLocaleTimeString()}){' '}
                  </span>
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
