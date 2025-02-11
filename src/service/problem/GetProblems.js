import FetchAuthorizedPage from '../FetchAuthorizedPage';

const fetchProblems = async (
  navigate,
  location,
  page = 0,
  size = 10,
  sort = 'desc',
  problemType,
  search // 검색어 추가
) => {
  const url =
    `http://localhost:8080/problems?page=${page}&size=${size}&sort=${sort}` +
    (problemType && problemType !== 'ALL'
      ? `&problemType=${problemType}`
      : '') +
    (search ? `&search=${encodeURIComponent(search)}` : ''); // 검색어 추가

  try {
    const problemsData = await FetchAuthorizedPage(
      url,
      navigate,
      location,
      'GET'
    );
    if (problemsData) {
      return problemsData; // 문제 목록 반환 (JSON 형태)
    }
  } catch (error) {
    console.error('문제 가져오기 오류:', error);
  }
  return null; // 문제가 없거나 오류가 발생한 경우 null 반환
};

export default fetchProblems;
