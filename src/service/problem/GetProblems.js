import FetchAuthorizedPage from '../FetchAuthorizedPage';

const fetchProblems = async (
  navigate,
  location,
  page = 0,
  size = 10,
  sort = 'desc',
  problemType
) => {
  const url =
    `http://localhost:8080/problems?page=${page}&size=${size}&sort=${sort}` +
    (problemType && problemType !== 'ALL' ? `&problemType=${problemType}` : '');

  try {
    const problemsData = await FetchAuthorizedPage(
      url,
      navigate,
      location,
      'GET'
    );
    if (problemsData) {
      const problems = JSON.parse(problemsData);
      return problems; // 문제 목록 반환
    }
  } catch (error) {
    console.error('문제 가져오기 오류:', error);
  }
  return null; // 문제가 없거나 오류가 발생한 경우 null 반환
};

export default fetchProblems;