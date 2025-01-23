import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useLogin } from '../contexts/AuthContext';
import LogoutForm from '../pages/auth/LogoutForm';

const Header = () => {
  const { isLoggedIn, role } = useLogin();
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Link to="/" className="navbar-brand">
            AlgorithmStudy
          </Link>
          <Nav className="ms-auto">
            {isLoggedIn && (
              <>
                <Link to="/problem" className="nav-link">
                  문제
                </Link>
                {role === 'ROLE_USER' && (
                  <>
                    <Link to="/groups" className="nav-link">
                      그룹
                    </Link>
                    <Link to="/usergroups" className="nav-link">
                      내 그룹
                    </Link>
                  </>
                )}
                {role === 'ROLE_ADMIN' && (
                  <Link to="/create-problem" className="nav-link">
                    문제 생성
                  </Link>
                )}
                <LogoutForm /> {/* 로그아웃 버튼 */}
              </>
            )}
            {!isLoggedIn && (
              <>
                <Link to="/join" className="nav-link">
                  회원가입
                </Link>
                <Link to="/login" className="nav-link">
                  로그인
                </Link>
              </>
            )}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
