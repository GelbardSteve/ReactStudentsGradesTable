import React, { useEffect } from 'react';
import Modal from 'react-modal';
import { StyledModal } from './Modal.styles';

export const CustomModal = ({ isModalOpen, handleCloseTheModal, header, children }) => {
  useEffect(() => {
    Modal.setAppElement('#root'); // Assuming your root element has an id of 'root'
  }, []);

  return (
    <div data-test="modal-create-user">
      <StyledModal 
        isOpen={isModalOpen} 
        onRequestClose={handleCloseTheModal} 
        contentLabel="Modal"
        className="modal-content" 
        overlayClassName="modal-overlay"
      >
        <div className="modal-header">
          <h2>{header}</h2>
          <button 
            className="close-button" 
            onClick={handleCloseTheModal}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </StyledModal>
    </div>
  );
};
