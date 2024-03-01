import React from 'react';

export const Button = ({ onClick, text, type = 'button', buttonType = 'outline-info', disabled, className }) => {
  return (
    <button disabled={disabled} onClick={onClick} type={type} className={`btn btn-${buttonType} ${className}`}>
      {text}
    </button>
  );
};
