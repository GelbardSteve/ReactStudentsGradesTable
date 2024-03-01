import styled from 'styled-components';
import Modal from 'react-modal';

export const StyledModal = styled(Modal)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 8px 8px 8px 8px rgba(0.2, 0.2, 0.2, 0.2);
  z-index: 9999;
  width: 80%;
`;

export const StyleHeader = styled.div`
  display: flex;
  align-items: center;
`;
