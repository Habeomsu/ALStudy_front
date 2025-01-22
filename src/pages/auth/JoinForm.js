import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const JoinForm = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const fetchJoin = async (credentials) => {
    try {
      const response = await fetch('http://localhost:8080/join', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      if (response.ok) {
        alert('회원가입 성공');
        navigate('/login', { replace: true });
      } else {
        const errorData = await response.json();
        console.log(errorData); // 서버에서 반환한 오류 메시지
        alert(`회원가입 실패: ${errorData.message || '알 수 없는 오류 발생'}`); // 오류 메시지 출력
      }
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  const joinHandler = async (e) => {
    e.preventDefault();
    const credentials = { username, password };
    fetchJoin(credentials);
  };

  return (
    <div className="join">
      <h1>회원가입</h1>
      <form onSubmit={joinHandler}>
        <p>
          <span className="label">Username</span>
          <input
            className="input-class"
            type="text"
            name="아이디"
            value={username}
            placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </p>
        <p>
          <span className="label">Password</span>
          <input
            className="input-class"
            type="비밀번호"
            autoComplete="off"
            name="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </p>
        <input type="submit" value="회원가입" className="form-btn" />
      </form>
    </div>
  );
};

export default JoinForm;
