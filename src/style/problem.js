// src/components/StyledComponents.js
import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
`;

export const Title = styled.h1`
  margin-bottom: 20px;
`;

export const SelectContainer = styled.div`
  margin-bottom: 20px;
`;

export const ProblemList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

export const ProblemItem = styled.li`
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ProblemInfo = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const ProblemDetail = styled.div`
  flex: 1; /* 각 항목이 동일한 너비를 가짐 */
  margin: 0 10px; /* 항목 간격 조정 */
  text-align: left; /* 텍스트 정렬 */
`;

export const Pagination = styled.div`
  margin-top: 20px;
`;
