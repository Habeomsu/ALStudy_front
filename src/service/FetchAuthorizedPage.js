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
    const response = await fetch(url, {
      method: method,
      credentials: 'include',
      headers: {
        access: window.localStorage.getItem('access'), // local storage 의 access 토큰을 요청 헤더에 추가
      },
      body: body ? JSON.stringify(body) : null, // POST 요청 시 본문 추가
    });

    if (response.ok) {
      return await response.text();
    } else {
      // unauthorized code -> 1. 재발급 요청  2. 재발급 요청 성공 or 실패 핸들링
      const reissueSuccess = await FetchReissue();
      if (reissueSuccess) {
        // 재발급 성공 시, 다시 FetchAuthorizedPage를 호출하여 API 요청을 반복하지 않도록 함
        return await FetchAuthorizedPage(url, navigate, location, method, body);
      } else {
        // useLocation 으로 얻은 path 를 useNavigate 을 사용해 state 에 set
        alert('로그인 해주세요');
        navigate('/login', { state: location.pathname });
      }
    }
  } catch (error) {
    console.log('error: ', error);
  }
  return;
};

export default FetchAuthorizedPage;
