import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateGroupForm = () => {
  const navigate = useNavigate();

  // 상태 변수 설정
  const [groupname, setGroupname] = useState('');
  const [password, setPassword] = useState('');
  const [depositAmount, setDepositAmount] = useState(10000); // 초기값 설정
  const [deadline, setDeadline] = useState('');
  const [studyEndDate, setStudyEndDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // 기본 폼 제출 방지

    const groupData = {
      groupname,
      password,
      depositAmount,
      deadline,
      studyEndDate,
    };

    // 결제 페이지로 그룹 데이터와 함께 이동
    navigate('/payment/group/checkout', { state: groupData });
  };

  const increaseDeposit = () => {
    setDepositAmount((prev) => prev + 1000);
  };

  const decreaseDeposit = () => {
    setDepositAmount((prev) => Math.max(prev - 1000, 0)); // 최소 0원으로 제한
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '20px',
        backgroundColor: '#f9f9f9', // 배경색 추가 (선택 사항)
      }}
    >
      <div
        style={{
          maxWidth: '600px', // 최대 너비 설정
          width: '100%',
          padding: '20px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          backgroundColor: '#fff',
        }}
      >
        <h1>그룹 생성 페이지입니다.</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>그룹 이름:</label>
            <input
              type="text"
              value={groupname}
              onChange={(e) => setGroupname(e.target.value)}
              required
              style={{ width: '100%' }} // 너비 100%
            />
          </div>
          <div>
            <label>비밀번호:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%' }} // 너비 100%
            />
          </div>
          <div>
            <label>예치금:</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button
                type="button"
                onClick={decreaseDeposit}
                style={{ marginRight: '10px' }}
              >
                -1000
              </button>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) =>
                  setDepositAmount(Math.max(0, Number(e.target.value)))
                }
                required
                style={{ width: '100%', textAlign: 'center' }} // 너비 100%, 가운데 정렬
              />
              <button
                type="button"
                onClick={increaseDeposit}
                style={{ marginLeft: '10px' }}
              >
                +1000
              </button>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '10px',
            }}
          >
            <div style={{ flex: '1', marginRight: '10px' }}>
              <label>모집 마감일:</label>
              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
                style={{ width: '100%' }} // 너비 100%
              />
            </div>
            <div style={{ flex: '1', marginLeft: '10px' }}>
              <label>스터디 종료일:</label>
              <input
                type="datetime-local"
                value={studyEndDate}
                onChange={(e) => setStudyEndDate(e.target.value)}
                required
                style={{ width: '100%' }} // 너비 100%
              />
            </div>
          </div>
          <button type="submit" style={{ marginTop: '20px', width: '100%' }}>
            그룹 생성
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupForm;
