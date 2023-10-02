import React from 'react';

export const CreateNewUser = ({ openModal }) => {
  return (
    <button onClick={openModal} type="button" className="btn btn-primary">
      Create new user
    </button>
  );
};
