import FetchAuthorizedPage from '../FetchAuthorizedPage';

const fetchProblemDetail = async (id, navigate, location) => {
  const url = `http://localhost:8080/problems/${id}`; // 문제 상세 정보 API URL
  const data = await FetchAuthorizedPage(url, navigate, location, 'GET');

  if (data) {
    return data; // JSON 형식으로 파싱하여 반환
  } else {
    throw new Error('문제 정보를 가져오는 데 실패했습니다.');
  }
};

export default fetchProblemDetail;
