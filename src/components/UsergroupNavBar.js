import React from 'react';
import { Link, useParams } from 'react-router-dom';

const UsergroupNavBar = () => {
  const { groupId } = useParams();

  // CSS 스타일 정의
  const navStyle = {
    width: '200px',
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    position: 'fixed',
    height: '100%',
    overflowY: 'auto',
  };

  const ulStyle = {
    listStyleType: 'none',
    padding: 0,
  };

  const liStyle = {
    margin: '10px 0',
  };

  const linkStyle = {
    color: '#007BFF',
    textDecoration: 'none',
    display: 'block',
    padding: '10px',
    transition: 'background-color 0.3s',
  };

  const linkHoverStyle = {
    backgroundColor: '#f0f0f0',
    borderRadius: '5px',
  };

  return (
    <nav style={navStyle}>
      <ul style={ulStyle}>
        <li style={liStyle}>
          <Link
            to={`/usergroups/${groupId}`}
            style={linkStyle}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor =
                linkHoverStyle.backgroundColor)
            }
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '')}
          >
            그룹 돌아가기
          </Link>
        </li>
        <li style={liStyle}>
          <Link
            to={`/usergroups/${groupId}/member`}
            style={linkStyle}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor =
                linkHoverStyle.backgroundColor)
            }
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '')}
          >
            그룹원
          </Link>
        </li>
        <li style={liStyle}>
          <Link
            to={`/usergroups/${groupId}/problems`}
            style={linkStyle}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor =
                linkHoverStyle.backgroundColor)
            }
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '')}
          >
            문제
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default UsergroupNavBar;
