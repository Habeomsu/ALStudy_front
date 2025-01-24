import axios from 'axios';
import { Cookies } from 'react-cookie';

const FetchReissue = async () => {
  try {
    const response = await axios.post(
      'http://localhost:8080/reissue',
      {},
      {
        withCredentials: true, // 쿠키 포함
      }
    );

    // 성공적으로 리프레시 토큰을 재발급 받은 경우
    if (response.status === 200) {
      console.log('리프레시 토큰 재발급 성공:', response.data); // 성공 로그
      localStorage.setItem(
        'access',
        response.headers['access'] || response.headers['Access']
      ); // 대소문자 모두 확인
      return true;
    } else {
      // 토큰 재발급 실패
      console.error(
        '리프레시 토큰 재발급 실패: HTTP 상태 코드',
        response.status
      );
      handleTokenReissueFailure();
    }
  } catch (error) {
    console.error('리프레시 토큰 재발급 중 오류 발생:', error); // 에러 로그
    handleTokenReissueFailure(); // 실패 시 처리
  }
  return false;
};

const handleTokenReissueFailure = () => {
  localStorage.removeItem('access');
  const cookies = new Cookies();
  cookies.set('refresh', null, { maxAge: 0 }); // 리프레시 토큰 삭제
  alert('세션이 만료되었습니다. 다시 로그인 해주세요.'); // 사용자 알림
};

export default FetchReissue;
