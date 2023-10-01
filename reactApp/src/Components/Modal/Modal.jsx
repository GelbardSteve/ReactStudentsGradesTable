import React, { useEffect } from 'react';
import Modal from 'react-modal';

const customStyles = {
  content: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
    boxShadow: '8px 8px 8px 8px rgba(0.2, 0.2, 0.2, 0.2)',
    zIndex: '9999',
    width: '80%',
  },
};

export const CustomModal = ({ isModalOpen, handleCloseTheModal, header, children }) => {
  useEffect(() => {
    Modal.setAppElement('#root'); // Assuming your root element has an id of 'root'
  }, []);

  return (
    <Modal style={customStyles} isOpen={isModalOpen} onRequestClose={handleCloseTheModal} contentLabel="Example Modal" className="modal-content" overlayClassName="modal-overlay">
      <div className="modal-header">{header}</div>
      <div className="modal-body">{children}</div>
    </Modal>
  );
};
