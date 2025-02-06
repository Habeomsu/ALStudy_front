import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../../contexts/AuthContext';

const LogoutForm = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn, setLoginUser, setRole } = useLogin();

  const fetchLogout = async () => {
    try {
      const response = await fetch('http://localhost:8080/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        alert('로그아웃 성공! 안녕히 가세요.');
        window.localStorage.removeItem('access');
        window.localStorage.removeItem('name');
        window.localStorage.removeItem('role');
        window.localStorage.removeItem('customerId');

        setIsLoggedIn(false);
        setLoginUser(null);
        setRole(null);
        navigate('/', { replace: true }); // 홈으로 리디렉션
      } else {
        alert('로그아웃 실패');
      }
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  const handleLogoutClick = () => {
    // 로그아웃 확인 메시지
    const confirmed = window.confirm('정말 로그아웃하시겠습니까?');
    if (confirmed) {
      fetchLogout(); // 확인 후 로그아웃 요청
    }
  };

  return (
    <button
      onClick={handleLogoutClick}
      className="nav-link"
      style={{
        background: 'none',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
      }}
    >
      로그아웃
    </button>
  );
};

export default LogoutForm;
