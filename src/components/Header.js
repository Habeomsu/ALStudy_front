import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Link to="/" className="navbar-brand">
            AlgorithmStudy
          </Link>
          <Nav className="ms-auto">
            <Link to="/problemForm" className="nav-link">
              문제
            </Link>
            <Link to="/groupsForm" className="nav-link">
              그룹
            </Link>
            <Link to="/loginForm" className="nav-link">
              로그인
            </Link>
            <Link to="/joinForm" className="nav-link">
              회원가입
            </Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
