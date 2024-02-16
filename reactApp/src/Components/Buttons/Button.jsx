import React from 'react';

export const Button = ({ onClick, text, buttonType = 'primary' }) => {
  return (
    <button onClick={onClick} type="button" className={`btn btn-${buttonType}`}>
      {text}
    </button>
  );
};
