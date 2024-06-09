import styled from 'styled-components';

export const StyleHeader = styled.header`
  display: flex;
  justify-content: space-between;
  margin-bottom: 100px;
  padding: 4px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #cfd8dc;
  color: #fff;
  padding: 10px;
  z-index: 1000;
`;

export const StyledFooter = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #cfd8dc;
  color: #fff;
  padding: 15px;
  z-index: 1000;
`;

export const StyledMain = styled.main`
  margin: 5em 0;
`;
