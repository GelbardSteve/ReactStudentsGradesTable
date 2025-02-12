import { range } from 'lodash';
import React from 'react';
import { Button } from '../Buttons/Button';

export const Pagination = ({ itemsCount, pageSize, onPageChange, currentPage }) => {
  const itemLength = itemsCount;
  const pagesCount = Math.ceil(itemLength / pageSize);
  const pages = range(1, pagesCount + 1);

  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination">
        {pages.map((page) => {
          return (
            <li key={page}>
              <Button onClick={() => onPageChange(page)} className={`mr-1 ${page === currentPage ? 'page-item active' : 'page-item'}`}>
                {page}
              </Button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
