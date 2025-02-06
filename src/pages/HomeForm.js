import React from 'react';
import { useLogin } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const HomeForm = () => {
  const { isLoggedIn, loginUser, role } = useLogin();
  return (
    <div style={styles.container}>
      {/* 사용자 역할에 따라 메시지 표시 */}
      {role === 'ROLE_ADMIN' && (
        <h2 style={styles.subtitle}>관리자로 접속 중입니다.</h2>
      )}
      <h1 style={styles.title}>알쓰에 오신걸 환영합니다.</h1>

      <h2>알쓰의 장점</h2>
      <ol style={styles.list}>
        <li>다른 그룹원의 알고리즘 코드를 확인 가능하다.</li>
        <li>문제를 함께 풀며 협력할 수 있는 환경을 제공한다.</li>
        <li>사용자가 그룹을 이루어 다양한 문제를 해결할 수 있도록 지원한다.</li>
        <li>예치금 관리 기술로 예치금을 공정하게 관리 가능하다.</li>
        <li>파이썬 외에 추가 언어 지원 예정.</li>
        <li>추후 그룹 채팅방으로 소통 강화 예정. </li>
      </ol>
      <h3 style={styles.info}>
        지금은 그룹 채팅방이 없지만 추후에 그룹 채팅방이 추가될 예정입니다.
      </h3>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    padding: '20px',
    textAlign: 'center',
  },
  title: {
    fontSize: '2.5rem',
    color: '#343a40',
    marginBottom: '100px',
  },
  subtitle: {
    fontSize: '1.5rem',
    color: '#6c757d',
    marginBottom: '15px',
  },
  list: {
    paddingLeft: '20px',
    textAlign: 'left',
  },
  info: {
    fontSize: '1.2rem',
    color: '#495057',
  },
};

export default HomeForm;
