import React from 'react';

export const Button = ({ onClick, text, type = 'button', buttonType = 'primary', disabled }) => {
  return (
    <button disabled={disabled} onClick={onClick} type={type} className={`btn btn-${buttonType}`}>
      {text}
    </button>
  );
};
