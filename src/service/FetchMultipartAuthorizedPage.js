import FetchReissue from './FetchReissue';

// 권한이 있는 페이지 접근 시 access 토큰을 검증
const FetchMultipartAuthorizedPage = async (
  url,
  navigate,
  location,
  method = 'GET',
  body = null
) => {
  try {
    const token = window.localStorage.getItem('access');
    const response = await fetch(url, {
      method: method,
      credentials: 'include',
      headers: {
        access: token, // Bearer 토큰 형식으로 설정
        // 'Content-Type': 'application/json', // 이 줄은 삭제
      },
      body: body ? body : null, // POST 요청 시 FormData를 그대로 추가
    });

    // 응답 처리
    const data = await response.json(); // 응답 데이터를 미리 가져옴

    if (response.ok) {
      return data; // 성공 시 응답 데이터 반환
    } else if (response.status === 401) {
      console.log('첫응답 오류:', data);

      if (data.code === 'JWT400_1') {
        const reissueSuccess = await FetchReissue();
        console.log('reissueSuccess:', reissueSuccess);

        if (reissueSuccess) {
          const newToken = window.localStorage.getItem('access'); // 새로 발급된 토큰 가져오기

          // 새로운 토큰으로 원래 요청 다시 시도
          const retryResponse = await fetch(url, {
            method: method,
            credentials: 'include',
            headers: {
              access: newToken, // 새 토큰 사용
              // 'Content-Type': 'application/json', // 이 줄은 삭제
            },
            body: body ? body : null, // POST 요청 시 FormData를 그대로 추가
          });

          const retryData = await retryResponse.json(); // 재요청의 응답 데이터 가져오기

          if (retryResponse.ok) {
            return retryData; // 새 요청 결과 반환
          } else {
            console.log('재요청 실패:', retryData); // 오류 데이터 전체 출력
            return retryData; // 오류 데이터 반환
          }
        } else {
          alert('세션이 만료되었습니다. 다시 로그인 해주세요.');
          navigate('/login', { state: location.pathname });
        }
      } else {
        return data; // 인증 오류의 경우에도 응답 데이터 반환
      }
    } else {
      console.error('Error occurred:', response.status);
      return data; // 오류가 발생하더라도 응답 데이터 반환
    }
  } catch (error) {
    console.log('error: ', error);
    return {
      isSuccess: false,
      code: 'ERROR',
      message: '서버와의 연결에 문제가 발생했습니다.',
      result: null,
    };
  }
};

export default FetchMultipartAuthorizedPage;
