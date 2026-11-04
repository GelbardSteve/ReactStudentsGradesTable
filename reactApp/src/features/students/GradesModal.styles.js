import styled from 'styled-components';

export const GradesList = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;

  th,
  td {
    padding: 10px 4px;
    text-align: left;
    border-bottom: 1px solid #eef0f2;
    font-size: 14px;
  }

  th {
    color: #6c757d;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  td:last-child,
  th:last-child {
    text-align: right;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  }
`;

export const GradesEmpty = styled.p`
  color: #6c757d;
  text-align: center;
  margin: 1rem 0 1.5rem;
`;

export const GradesFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;

  /* "Send to <email>" with the last-sent date under it */
  > div {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;

    span {
      color: #2c3e50;
      font-weight: 500;
      overflow-wrap: anywhere;
    }
  }

  small {
    color: #6c757d;
  }
`;
