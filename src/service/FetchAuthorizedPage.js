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

    // 응답 데이터를 그대로 반환
    const data = await response.json();

    // 성공 여부에 따라 반환
    return {
      ...data,
      isSuccess: response.ok, // 응답 성공 여부 추가
    };
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
