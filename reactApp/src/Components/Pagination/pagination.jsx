import React from 'react';
import { Button } from '../Buttons/Button';
import { usePagesCount } from './pagination.hooks';
import { StyledNav } from './Pagination.styles';

export const Pagination = ({ numberOfRows, onPageChange, currentPage }) => {
  const { pages } = usePagesCount(numberOfRows);

  return (
    <StyledNav aria-label="Page navigation">
      <ul className="pagination">
        {pages.map((page) => (
          <li key={page}>
            <Button
              onClick={() => {
                onPageChange(page)
              }}
              className={`mr-1 ${page === currentPage ? 'page-item active' : 'page-item'}`}
            >
              {page}
            </Button>
          </li>
        ))}
      </ul>    
    </StyledNav>
  );
};