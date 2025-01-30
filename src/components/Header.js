import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useLogin } from '../contexts/AuthContext';
import LogoutForm from '../pages/auth/LogoutForm';

const Header = () => {
  const { isLoggedIn, role, loginUser } = useLogin();

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Link to="/" className="navbar-brand">
          AlgorithmStudy
        </Link>
        <Nav className="me-auto">
          {isLoggedIn && (
            <>
              <Nav.Link as={Link} to="/problems">
                문제
              </Nav.Link>
              {role === 'ROLE_USER' && (
                <>
                  <Nav.Link as={Link} to="/groups">
                    그룹
                  </Nav.Link>
                  <Nav.Link as={Link} to="/usergroups">
                    내 그룹
                  </Nav.Link>
                </>
              )}
              {role === 'ROLE_ADMIN' && (
                <Nav.Link as={Link} to="/create-problem">
                  문제 생성
                </Nav.Link>
              )}
            </>
          )}
        </Nav>
        <Nav className="ms-auto">
          {isLoggedIn && (
            <span className="navbar-text me-2">
              {loginUser || '사용자'}
              {role === 'ROLE_ADMIN' ? ' (관리자)' : ''}님
            </span>
          )}
          {isLoggedIn ? (
            <LogoutForm /> // 로그아웃 버튼
          ) : (
            <>
              <Nav.Link as={Link} to="/join">
                회원가입
              </Nav.Link>
              <Nav.Link as={Link} to="/login">
                로그인
              </Nav.Link>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
