import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FetchAuthorizedPage from '../../service/FetchAuthorizedPage'; // 기존 Fetch 함수 사용
import UsergroupNavBar from '../../components/UsergroupNavBar';
import GroupProblemButton from '../../components/GroupProblemButton';

const MySubmitDetailForm = () => {
  const { groupProblemId, submissionId } = useParams(); // URL 파라미터에서 문제 ID와 제출 ID 가져오기
  const navigate = useNavigate();
  const [submissionDetail, setSubmissionDetail] = useState(null); // 제출 상세 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 오류 메시지 상태
  const [code, setCode] = useState(''); // 제출 코드 상태

  useEffect(() => {
    const fetchSubmissionDetail = async () => {
      const url = `http://localhost:8080/submission/${groupProblemId}/${submissionId}`; // API URL
      try {
        const data = await FetchAuthorizedPage(url, navigate, null, 'GET'); // FetchAuthorizedPage 사용
        setSubmissionDetail(data.result); // 제출 상세 정보 설정

        // 제출 코드 가져오기
        const codeResponse = await fetch(data.result.code); // S3 링크로부터 코드 가져오기
        if (!codeResponse.ok) {
          throw new Error(
            '코드를 가져오는 데 실패했습니다. 상태 코드: ' + codeResponse.status
          );
        }
        const codeText = await codeResponse.text(); // 코드 텍스트로 변환
        setCode(codeText); // 제출 코드 설정
      } catch (err) {
        setError(err.message || '제출 상세 정보를 가져오는 데 실패했습니다.');
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };

    fetchSubmissionDetail();
  }, [groupProblemId, submissionId, navigate]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (!submissionDetail) {
    return <div>제출 상세 정보가 없습니다.</div>;
  }

  return (
    <div style={{ display: 'flex' }}>
      <UsergroupNavBar />
      <div
        style={{
          marginLeft: '40px', // 사이드바 너비에 맞추어 여백 조정
          padding: '20px',
          flex: 1, // 남은 공간을 차지하도록 설정
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <GroupProblemButton />
        <h1>제출 상세보기</h1>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={headerStyle}>제출 ID</th>
              <th style={headerStyle}>제목</th>
              <th style={headerStyle}>사용자</th>
              <th style={headerStyle}>상태</th>
              <th style={headerStyle}>언어</th>
              <th style={headerStyle}>제출 시간</th>
            </tr>
          </thead>
          <tbody>
            <tr style={rowStyle}>
              <td style={cellStyle}>{submissionDetail.id}</td>
              <td style={cellStyle}>{submissionDetail.title}</td>
              <td style={cellStyle}>{submissionDetail.username}</td>
              <td style={cellStyle}>{submissionDetail.status}</td>
              <td style={cellStyle}>{submissionDetail.language}</td>
              <td style={cellStyle}>
                {new Date(submissionDetail.submissionTime).toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
        <h2>제출 코드</h2>
        <pre style={codeStyle}>{code}</pre> {/* 제출 코드를 표시 */}
      </div>
    </div>
  );
};

// 스타일 객체
const headerStyle = {
  borderBottom: '2px solid #ddd',
  padding: '10px',
  textAlign: 'left',
  backgroundColor: '#f2f2f2',
};

const rowStyle = {
  borderBottom: '1px solid #ddd',
};

const cellStyle = {
  padding: '10px',
};

const codeStyle = {
  backgroundColor: '#f4f4f4',
  padding: '10px',
  borderRadius: '5px',
  overflowX: 'auto',
};

export default MySubmitDetailForm;
