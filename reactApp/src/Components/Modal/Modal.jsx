import React, { useEffect } from 'react';
import { StyledModal, StyleHeader } from './Modal.styles';
import Modal from 'react-modal';

export const CustomModal = ({ isModalOpen, handleCloseTheModal, header, children }) => {
  useEffect(() => {
    Modal.setAppElement('#root'); // Assuming your root element has an id of 'root'
  }, []);

  return (
    <div data-test="modal-create-user">
      <StyledModal isOpen={isModalOpen} onRequestClose={handleCloseTheModal} contentLabel="Example Modal" className="modal-content" overlayClassName="modal-overlay">
        <StyleHeader className="modal-header">{header}</StyleHeader>
        <div className="modal-body">{children}</div>
      </StyledModal>
    </div>
  );
};
