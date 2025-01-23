import React, { useState } from 'react';
import FetchAuthorizedPage from '../../service/FetchAuthorizedPage';
import { useNavigate } from 'react-router-dom';

const CreateProblemForm = () => {
  const navigate = useNavigate();

  // 상태 변수 설정
  const [title, setTitle] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('');
  const [problemType, setProblemType] = useState('GREEDY');
  const [description, setDescription] = useState('');
  const [inputDescription, setInputDescription] = useState('');
  const [outputDescription, setOutputDescription] = useState('');
  const [exampleInput, setExampleInput] = useState('');
  const [exampleOutput, setExampleOutput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 방지

    const problemData = {
      title,
      difficultyLevel,
      problemType,
      description,
      inputDescription,
      outputDescription,
      exampleInput: exampleInput.trim(), // 사용자가 입력한 데이터를 그대로 사용
      exampleOutput: exampleOutput.trim(), // 사용자가 입력한 데이터를 그대로 사용
    };

    // API 요청을 위한 URL
    const url = 'http://localhost:8080/problems'; // 실제 API 경로로 변경 필요

    // FetchAuthorizedPage를 사용하여 데이터 전송
    const response = await FetchAuthorizedPage(
      url,
      navigate,
      null,
      'POST',
      problemData
    );

    if (!response) {
      alert('문제가 발생했습니다. 다시 시도해 주세요.');
      return; // 에러가 발생했을 경우, 이후 코드를 실행하지 않도록 종료
    }

    console.log(response);

    // 응답이 성공적인지 확인
    if (!response.isSuccess) {
      console.error('Error:', response.message); // 에러 메시지 콘솔에 출력
      alert('문제 생성 실패: ' + response.message); // 사용자에게 알림
      return; // 에러가 발생했을 경우, 이후 코드를 실행하지 않도록 종료
    }

    alert('문제가 생성되었습니다!');
    navigate('/problems'); // 문제 목록 페이지로 이동
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
        <h1>문제 생성 페이지입니다.</h1>
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '10px',
            }}
          >
            <div style={{ flex: '1', marginRight: '10px' }}>
              <label>제목:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{ width: '100%' }} // 너비 100%
              />
            </div>
            <div style={{ flex: '1', marginRight: '10px' }}>
              <label>난이도:</label>
              <input
                type="text"
                value={difficultyLevel}
                onChange={(e) => setDifficultyLevel(e.target.value)}
                required
                style={{ width: '100%' }} // 너비 100%
              />
            </div>
            <div style={{ flex: '1' }}>
              <label>문제 유형:</label>
              <select
                value={problemType}
                onChange={(e) => setProblemType(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="GREEDY">그리디</option>
                <option value="DYNAMIC_PROGRAMMING">동적 프로그래밍</option>
                <option value="IMPLEMENTATION">구현</option>
                <option value="GRAPH">그래프</option>
                <option value="BACKTRACKING">백트래킹</option>
                <option value="DIVIDE_AND_CONQUER">분할 정복</option>
                <option value="BRUTE_FORCE">완전 탐색</option>
              </select>
            </div>
          </div>
          <div>
            <label>설명:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              style={{ width: '100%', height: '100px' }} // 높이 조정
            />
          </div>
          <div>
            <label>입력 설명:</label>
            <textarea
              value={inputDescription}
              onChange={(e) => setInputDescription(e.target.value)}
              required
              style={{ width: '100%', height: '100px' }} // 높이 조정
            />
          </div>
          <div>
            <label>출력 설명:</label>
            <textarea
              value={outputDescription}
              onChange={(e) => setOutputDescription(e.target.value)}
              required
              style={{ width: '100%', height: '100px' }} // 높이 조정
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '10px',
            }}
          >
            <div style={{ flex: '1', marginRight: '10px' }}>
              <label>예제 입력:</label>
              <textarea
                value={exampleInput}
                onChange={(e) => setExampleInput(e.target.value)}
                required
                style={{ width: '100%', height: '100px' }} // 높이 조정
              />
            </div>
            <div style={{ flex: '1' }}>
              <label>예제 출력:</label>
              <textarea
                value={exampleOutput}
                onChange={(e) => setExampleOutput(e.target.value)}
                required
                style={{ width: '100%', height: '100px' }} // 높이 조정
              />
            </div>
          </div>
          <button type="submit" style={{ marginTop: '20px', width: '100%' }}>
            문제 생성
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProblemForm;
