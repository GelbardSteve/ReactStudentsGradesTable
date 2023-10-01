import React from 'react';
import { range } from 'lodash';

export const Pagination = ({ itemsCount, pageSize, onPageChange, currentPage }) => {
  const itemLength = itemsCount;
  const pagesCount = Math.ceil(itemLength / pageSize);
  const pages = range(1, pagesCount + 1);

  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination"> 
        {pages.map(page => {
        return (
          <li key={page} className={ page === currentPage ? 'page-item active' : 'page-item'}>
            <button onClick={() => onPageChange(page)} className="page-link">
              {page}
            </button>
          </li>
        )})}
      </ul>
    </nav>
  );
};
