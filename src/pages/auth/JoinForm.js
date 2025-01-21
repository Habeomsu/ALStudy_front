import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const JoinForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleRegister = async () => {
    if (!username) {
      alert('사용자 이름을 입력해 주세요.');
      return;
    }

    if (!password) {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/join', {
        username,
        password,
      });

      console.log(response);
      if (!response.data.isSuccess) {
        alert(response.data.message);
        return; // 추가 처리 없이 종료
      }
      alert('회원가입 성공');
      navigate('/');
    } catch (error) {
      // 오류 처리
      if (error.response) {
        alert(error.response.data.message || '서버 오류가 발생했습니다.');
        console.log(error.response.data);
      } else {
        alert('네트워크 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false); // 로딩 종료
    }
  };
  return (
    <Container>
      <Title>회원가입</Title>
      <Input
        type="text"
        placeholder="이름"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />
      <Input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={handleRegister}>회원가입</Button>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 20px;
`;

const Title = styled.h2`
  margin-bottom: 20px; /* 제목과 입력 필드 간격 */
`;

const Input = styled.input`
  margin: 10px 0; /* 위아래 여백 추가 */
  padding: 10px;
  width: 300px;
  border: 1px solid #ced4da;
  border-radius: 4px;
`;

const Button = styled.button`
  margin-top: 10px; /* 버튼 위 여백 추가 */
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

export default JoinForm;
