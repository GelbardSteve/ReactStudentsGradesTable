import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '../Buttons/Button';
import { usePagesCount } from './pagination.hooks';
import { StyledNav, StyledShowPage } from './Pagination.styles';

export const Pagination = ({ pageSize, onPageChange, currentPage, searchQuery }) => {
  const allUsers = useSelector((state) => state.manageData.allUsers);
  const [updatedAllUsers, setUpdatedAllUsers] = useState(allUsers);
  const { pages, hasPageChanged } = usePagesCount(updatedAllUsers, pageSize);
  const [fromPage, setFromPage] = useState(0);
  const [toPage, setToPage] = useState(Math.min(3, pages.length));

  const handleIncreaseShowMorePages = useCallback(() => {
    setFromPage(fromPage + 3)
    setToPage(toPage + 3)
  }, [fromPage, toPage]);

  const handleDecreaseShowMorePages = useCallback(() => {
    if (fromPage <= 0) return;
    
    setFromPage(fromPage - 3)
    setToPage(toPage - 3 >= 3 ? toPage - 3 : 3)
  }, [fromPage, toPage]);

  useEffect(() => {
    if (pages.slice(fromPage, toPage).length === 0) {
      handleDecreaseShowMorePages();
    } 
  }, [fromPage, handleDecreaseShowMorePages, pages, toPage]);

  useEffect(() => {
    setUpdatedAllUsers((pre) => {
      if(pre.length !== allUsers.length && currentPage === pages.length && searchQuery === '') {
        handleIncreaseShowMorePages();
      }
      
      return allUsers; // Make sure to return the new state
    });
  }, [allUsers, currentPage, fromPage, handleIncreaseShowMorePages, hasPageChanged, pages, searchQuery, toPage]);


  return (
    <StyledNav aria-label="Page navigation">
      <Button disabled={fromPage <= 0} onClick={handleDecreaseShowMorePages} className="btn btn-xs page-item mb-3">{`<`}</Button>
      <ul className="pagination">
        {pages.slice(fromPage, toPage).map((page) => (
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
 
        <Button disabled={toPage >= pages.length} onClick={handleIncreaseShowMorePages} className="btn btn-xs page-item mb-3">{`>`}</Button>
        <StyledShowPage>{pages.length - toPage > 0 && `${pages.length - toPage}  more  page${pages.length - toPage > 1 ? 's' : ''}`}
        </StyledShowPage>       
    </StyledNav>
  );
};