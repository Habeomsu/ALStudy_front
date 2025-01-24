import { useState } from 'react';
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
    const response = await fetch(url, {
      method: method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        access: window.localStorage.getItem('access'),
      },
      body: body ? JSON.stringify(body) : null,
    });

    if (response.ok) {
      return await response.json();
    } else if (response.status === 401) {
      const data = await response.json();
      console.log(data);
      if (data.code === 'JWT400_1') {
        // 리프레시 토큰을 사용하여 액세스 토큰 재발급 시도
        const reissueSuccess = await FetchReissue();
        if (reissueSuccess) {
          return await FetchAuthorizedPage(
            url,
            navigate,
            location,
            method,
            body
          );
        } else {
          alert('세션이 만료되었습니다. 다시 로그인 해주세요.');
          window.localStorage.removeItem('access');

          navigate('/login', { state: location.pathname });
        }
      } else {
        alert(data.message || '인증 오류가 발생했습니다.');
      }
    } else {
      console.error('Error occurred:', response.status);
      alert('문제가 발생했습니다. 다시 시도해 주세요.');
    }
  } catch (error) {
    console.log('error: ', error);
  }
  return null;
};
export default FetchAuthorizedPage;
