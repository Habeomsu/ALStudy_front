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

    if (response.status === 200) {
      // 토큰 재발급 성공
      localStorage.setItem(
        'access',
        response.headers['access'] || response.headers['Access']
      ); // 대소문자 모두 확인
      return true;
    } else {
      // 토큰 재발급 실패
      localStorage.removeItem('access');
      const cookies = new Cookies();
      cookies.set('refresh', null, { maxAge: 0 }); // 리프레시 토큰 삭제
    }
  } catch (error) {
    console.log('error: ', error);
  }
  return false;
};

export default FetchReissue;
