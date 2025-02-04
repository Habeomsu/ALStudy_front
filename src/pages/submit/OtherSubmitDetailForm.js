import React, { useEffect, useState } from 'react';
import UsergroupNavBar from '../../components/UsergroupNavBar';
import GroupProblemButton from '../../components/GroupProblemButton';
import { useNavigate, useParams } from 'react-router-dom';
import FetchAuthorizedPage from '../../service/FetchAuthorizedPage';

const OtherSubmitDetailForm = () => {
  const { groupProblemId, otherSubmissionId } = useParams();
  const navigate = useNavigate();
  const [otherSubmissionDetail, setOtherSubmissionDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [code, setCode] = useState('');

  useEffect(() => {
    const fetchOtherSubmissionDetail = async () => {
      const url = `http://localhost:8080/submission/others/${groupProblemId}/${otherSubmissionId}`;
      try {
        const data = await FetchAuthorizedPage(url, navigate, null, 'GET');

        // 성공 내역 체크
        if (!data.isSuccess) {
          alert(data.message); // 오류 메시지 표시
          navigate(-1); // 이전 페이지로 돌아가기
          return; // 함수 종료
        }

        setOtherSubmissionDetail(data.result);

        // 제출 코드 가져오기
        const codeResponse = await fetch(data.result.code);
        if (!codeResponse.ok) {
          throw new Error('코드를 가져오는 데 실패했습니다.');
        }
        const codeText = await codeResponse.text();
        setCode(codeText);
      } catch (err) {
        setError(err.message || '제출 상세 정보를 가져오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchOtherSubmissionDetail();
  }, [groupProblemId, otherSubmissionId, navigate]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (!otherSubmissionDetail) {
    return <div>제출 상세 정보가 없습니다.</div>;
  }

  return (
    <div style={{ display: 'flex' }}>
      <UsergroupNavBar />
      <div
        style={{
          marginLeft: '40px',
          padding: '20px',
          flex: 1,
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
              <td style={cellStyle}>{otherSubmissionDetail.id}</td>
              <td style={cellStyle}>{otherSubmissionDetail.title}</td>
              <td style={cellStyle}>{otherSubmissionDetail.username}</td>
              <td style={cellStyle}>SUCCEEDED</td>
              <td style={cellStyle}>{otherSubmissionDetail.language}</td>
              <td style={cellStyle}>
                {new Date(
                  otherSubmissionDetail.submissionTime
                ).toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
        <h2>제출 코드</h2>
        <pre style={codeStyle}>{code}</pre>
      </div>
    </div>
  );
};

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

export default OtherSubmitDetailForm;
