import { useLogin } from '../contexts/AuthContext';
import FetchReissue from './FetchReissue';

// 권한이 있는 페이지 접근 시 access 토큰을 검증
const FetchAuthorizedPage = async (
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
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Bearer 토큰 형식으로 설정
      },
      body: body ? JSON.stringify(body) : null,
    });

    // 응답 데이터 처리
    const data = await response.json();

    if (response.ok) {
      return {
        ...data,
        isSuccess: true, // 응답 성공 여부 추가
      };
    } else if (response.status === 401) {
      // 401 Unauthorized인 경우 리프레시 토큰 요청
      const reissueSuccess = await FetchReissue();
      if (reissueSuccess) {
        // 재발급이 성공하면 새로운 토큰으로 원래 요청 다시 시도
        const newToken = window.localStorage.getItem('access'); // 새로 발급된 토큰 가져오기
        const retryResponse = await fetch(url, {
          method: method,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${newToken}`, // 새 토큰 사용
          },
          body: body ? JSON.stringify(body) : null,
        });

        const retryData = await retryResponse.json();
        return {
          ...retryData,
          isSuccess: retryResponse.ok, // 재요청 성공 여부 추가
        };
      } else {
        // 리프레시 토큰 요청에 실패한 경우
        return {
          isSuccess: false,
          code: 'ERROR',
          message: '리프레시 토큰 요청에 실패했습니다.',
          result: null,
        };
      }
    } else {
      return {
        isSuccess: false,
        code: data.code || 'ERROR',
        message: data.message || '서버에서 오류가 발생했습니다.',
        result: null,
      };
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

export default FetchAuthorizedPage;
