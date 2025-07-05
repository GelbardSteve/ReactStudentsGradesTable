import React, { useState } from 'react';
import {
    SearchContainer,
    SearchIcon,
    SearchLabel,
    SearchResults,
    StyledInput,
    StyledWrapper
} from './Search.styles';

export const SearchInput = ({ value, handleSearchDara, isDisabled, totalResults, filteredResults }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <StyledWrapper>
      <SearchLabel htmlFor="searchInput">
        Search Students
      </SearchLabel>
      
      <SearchContainer>
        <SearchIcon>🔍</SearchIcon>
        
        <StyledInput
          id="searchInput"
          name="searchInput"
          value={value}
          onChange={handleSearchDara}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Search by name or student number..."
          type="search"
          disabled={isDisabled}
          autoComplete="off"
        />
      </SearchContainer>
      
      {totalResults !== undefined && filteredResults !== undefined && (
        <SearchResults>
          {value ? (
            `Showing ${filteredResults} of ${totalResults} students`
          ) : (
            `Total: ${totalResults} students`
          )}
        </SearchResults>
      )}
    </StyledWrapper>
  );
};