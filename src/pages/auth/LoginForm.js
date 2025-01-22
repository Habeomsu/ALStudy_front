import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLogin } from '../../contexts/AuthContext';

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsLoggedIn, setLoginUser } = useLogin();

  const prevUrl = location.state || '/';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const fetchLogin = async (credentials) => {
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        alert('Login successful');

        const data = await response.json();
        const { result } = data;

        window.localStorage.setItem('access', response.headers.get('access'));
        window.localStorage.setItem('name', result);

        setIsLoggedIn(true);
        setLoginUser(result);

        // 로그인 완료 후, 이전 요청이 존재하면 이전 요청으로 이동
        navigate(prevUrl, { replace: true });
      } else {
        alert('Login failed');
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    const credentials = { username, password };
    fetchLogin(credentials);
  };

  return (
    <div className="login">
      <h1>로그인</h1>
      <form method="post" onSubmit={loginHandler}>
        <p>
          <span className="label">아이디</span>
          <input
            className="input-class"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
          />
        </p>
        <p>
          <span className="label">비밀번호</span>
          <input
            className="input-class"
            type="password"
            autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
          />
        </p>
        <input type="submit" value="로그인" className="form-btn" />
      </form>
    </div>
  );
};

export default LoginForm;
