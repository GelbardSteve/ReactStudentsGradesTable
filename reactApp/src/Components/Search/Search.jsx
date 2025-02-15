import React from 'react';
import { StyledWrapper } from './Search.styles';

export const SearchInput = ({ value, handleSearchDara, isDisabled }) => {
  return (
    <StyledWrapper>
      <label htmlFor="searchInput">Search Student</label>
      <input
        id="searchInput"
        name="searchInput"
        value={value} // Bind to the value prop passed from the parent
        onChange={handleSearchDara} // Use the passed handler
        placeholder="Search student by name or number"
        type="text"
        className={'form-control border border-dark'}
        disabled={isDisabled} // Disable the input if needed
      />
    </StyledWrapper>
  );
};
