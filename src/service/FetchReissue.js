import { Cookies } from 'react-cookie';

const FetchReissue = async () => {
  try {
    const response = await fetch('http://localhost:8080/reissue', {
      method: 'POST',
      credentials: 'include', // 쿠키 포함
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('이전 토큰:', localStorage.getItem('access'));

    if (response.ok) {
      const jsonData = await response.json(); // 비동기 처리
      console.log('response.status:', response.status);
      console.log('response.json()', jsonData);
      const accessToken = response.headers.get('access'); // fetch에서는 get 메서드 사용

      // 토큰 재발급 성공
      if (accessToken) {
        window.localStorage.setItem('access', accessToken); // "Bearer " 제거
        console.log('access 토큰:', accessToken);
        console.log('토큰 발급 성공');
        return true;
      } else {
        console.log('accessToken이 없습니다.'); // 추가된 로그
      }
    } else {
      // 토큰 재발급 실패
      console.log('토큰 재발급 실패:', response.status);
      localStorage.removeItem('access');
      const cookies = new Cookies();
      cookies.set('refresh', null, { maxAge: 0 }); // 리프레시 토큰 삭제
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }

  return false;
};

export default FetchReissue;
