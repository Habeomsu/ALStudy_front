import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useLogin } from '../contexts/AuthContext';

const Header = () => {
  const { isLoggedIn } = useLogin();
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Link to="/" className="navbar-brand">
            AlgorithmStudy
          </Link>
          <Nav className="ms-auto">
            {isLoggedIn && (
              <Link to="/problem" className="nav-link">
                문제
              </Link>
            )}
            {isLoggedIn && (
              <Link to="/groups" className="nav-link">
                그룹
              </Link>
            )}
            {!isLoggedIn && (
              <Link to="/join" className="nav-link">
                회원가입
              </Link>
            )}
            {!isLoggedIn && (
              <Link to="/login" className="nav-link">
                로그인
              </Link>
            )}
            {isLoggedIn && (
              <Link to="/logout" className="nav-link">
                로그아웃
              </Link>
            )}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
