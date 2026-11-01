
export const Button = ({ onClick, type = 'button', buttonType = 'outline-info', disabled, className, children, isLoading, dataTestSpecifier, title }) => {  
  return (
    <button disabled={disabled} onClick={onClick} type={type} className={`btn btn-${buttonType} ${className}`} data-test-specifier={dataTestSpecifier} title={title}>
      {isLoading ? 'Loading...' : children}
    </button>
  );
};
