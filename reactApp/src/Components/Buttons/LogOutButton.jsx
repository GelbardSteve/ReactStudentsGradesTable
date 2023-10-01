import React from 'react';

export const LogOutButton = ({ handleLogOut }) => {
  return (
    <div className="d-flex justify-content-between">
      <div></div>
      <button type="button" className="btn btn-info m-4" onClick={handleLogOut}>
        Log-out
      </button>
    </div>
  );
};
