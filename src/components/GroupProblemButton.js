import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const GroupProblemButton = () => {
  const navigate = useNavigate();
  const { groupId, groupProblemId } = useParams(); // URL 파라미터에서 groupId와 groupProblemId 가져오기

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '20px',
      }}
    >
      <button
        onClick={() =>
          handleNavigate(`/usergroups/${groupId}/problems/${groupProblemId}`)
        }
        style={buttonStyle}
      >
        문제
      </button>
      <button
        onClick={() =>
          handleNavigate(`/usergroups/${groupId}/submit/${groupProblemId}`)
        }
        style={buttonStyle}
      >
        제출
      </button>
      <button
        onClick={() =>
          handleNavigate(`/usergroups/${groupId}/my-submit/${groupProblemId}`)
        }
        style={buttonStyle}
      >
        내 제출
      </button>
      <button
        onClick={() =>
          handleNavigate(
            `/usergroups/${groupId}/other-submit/${groupProblemId}`
          )
        }
        style={buttonStyle}
      >
        그룹원 제출
      </button>
    </div>
  );
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  margin: '0 5px',
};

export default GroupProblemButton;
