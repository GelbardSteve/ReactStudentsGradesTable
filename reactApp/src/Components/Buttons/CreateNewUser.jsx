import React from 'react';

export const CreateNewUser = ({ openModal }) => {
  const customStyles = {
    marginBottom: '-9.5%',
  };

  return (
    <button style={customStyles} onClick={openModal} type="button" className="btn btn-primary">
      Create new user
    </button>
  );
};
