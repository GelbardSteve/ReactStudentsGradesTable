
export const Button = ({ onClick, type = 'button', buttonType = 'outline-info', disabled, className, children, isLoading }) => {  
  return (
    <button disabled={disabled} onClick={onClick} type={type} className={`btn btn-${buttonType} ${className}`}>
      {isLoading ? 'Loading...' : children}
    </button>
  );
};
