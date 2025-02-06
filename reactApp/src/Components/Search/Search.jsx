import React from 'react';

export const SearchInput = ({ value, handleSearchDara }) => {
  const customStyles = {
    width: '300px',
    marginLeft: '30px',
    marginBottom: '30px',
  };

  return (
    <div style={customStyles}>
      <label htmlFor="searchInput">Search Student</label>
      <input
        id="searchInput"
        name="searchInput"
        value={value} // Bind to the value prop passed from the parent
        onChange={handleSearchDara} // Use the passed handler
        placeholder="Search student by name or number"
        type="text"
        className={'form-control border border-dark'}
      />
    </div>
  );
};
