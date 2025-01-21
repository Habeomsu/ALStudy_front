import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const JoinForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:8080/join', {
        username,
        password,
      });

      if (!response.data.isSuccess) {
        alert(response.data.message);
        return; // 추가 처리 없이 종료
      }
      alert('회원가입 성공');
      navigate('/');
    } catch (error) {
      alert(error);
    }
  };
  return (
    <div>
      <h2>회원가입</h2>
      <input
        type="text"
        placeholder="이름"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>회원가입</button>
    </div>
  );
};

export default JoinForm;
