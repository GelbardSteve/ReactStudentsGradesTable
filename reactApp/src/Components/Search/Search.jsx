import React, { useState } from 'react';

export const SearchInput = ({ handleSearchDara }) => {
  const customStyles = {
    width: '300px',
    marginLeft: '30px',
    marginBottom: '30px',
  };

  const [inputValue, setInputValue] = useState({
    searchInput: '',
  });

  return (
    <div style={customStyles}>
      <label htmlFor="searchInput">Search Student</label>
      <input
        id="searchInput"
        name="searchInput"
        value={inputValue.searchInput}
        onChange={(e) => handleSearchDara(e, setInputValue)}
        placeholder="Search student by name or number"
        type="text"
        className={'form-control border border-dark'}
      />
    </div>
  );
};
