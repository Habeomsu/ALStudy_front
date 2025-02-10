import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function GroupFailForm() {
  const [searchParams] = useSearchParams();
  const [errorData, setErrorData] = useState(null);
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수 가져오기

  useEffect(() => {
    // URL 파라미터에서 error code와 message를 가져옵니다.
    const code = searchParams.get('code');
    const message = searchParams.get('message');

    // 에러 데이터를 설정합니다.
    if (code && message) {
      setErrorData({ code, message });
    } else {
      // 다른 방법으로 에러를 처리할 수 있습니다.
      setErrorData({
        code: 'UNKNOWN_ERROR',
        message: '알 수 없는 오류가 발생했습니다.',
      });
    }
  }, [searchParams]);

  return (
    <div id="info" className="box_section" style={{ width: '600px' }}>
      <img
        width="100px"
        src="https://static.toss.im/lotties/error-spot-no-loop-space-apng.png"
        alt="에러 이미지"
      />
      <h2>결제를 실패했어요</h2>

      <div className="p-grid typography--p" style={{ marginTop: '50px' }}>
        <div className="p-grid-col text--left">
          <b>에러메시지</b>
        </div>
        <div className="p-grid-col text--right" id="message">
          {errorData ? errorData.message : '로딩 중...'}
        </div>
      </div>
      <div className="p-grid typography--p" style={{ marginTop: '10px' }}>
        <div className="p-grid-col text--left">
          <b>에러코드</b>
        </div>
        <div className="p-grid-col text--right" id="code">
          {errorData ? errorData.code : '로딩 중...'}
        </div>
      </div>
      <button
        style={{
          marginTop: '30px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          padding: '10px 20px',
          cursor: 'pointer',
        }}
        onClick={() => {
          navigate(`/groups`); // navigate 함수를 사용하여 유저 그룹 페이지로 이동
        }}
      >
        이전 페이지로 돌아가기
      </button>
    </div>
  );
}
