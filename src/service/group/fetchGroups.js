import React from 'react';

const fetchGroups = async (navigate, page = 0, size = 10, sort = 'desc') => {
    try {
      const response = await axios.get(`http://localhost:8080/api/groups`, {
        params: { page, size, sort },
        withCredentials: true, // 쿠키 포함
      });
      return response.data; // 서버에서 반환하는 데이터
    } catch (error) {
      console.error('Error fetching groups:', error);
      navigate('/login'); // 오류 발생 시 로그인 페이지로 리디렉션 (예시)
      return null;
    }
  };

export default fetchGroups;