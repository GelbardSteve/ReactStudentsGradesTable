import React from 'react';

export const Button = ({ onClick, type = 'button', buttonType = 'outline-info', disabled, className, children }) => {
  return (
    <button disabled={disabled} onClick={onClick} type={type} className={`btn btn-${buttonType} ${className}`}>
      {children}
    </button>
  );
};
