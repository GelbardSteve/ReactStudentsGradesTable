import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '../Buttons/Button';
import { usePagesCount } from './pagination.hooks';
import { StyledNav, StyledShowPage } from './Pagination.styles';

export const Pagination = ({ pageSize, onPageChange, currentPage, isPageChange }) => {
  const allUsers = useSelector((state) => state.manageData.allUsers);
  const users = useSelector((state) => state.manageData.users);
  const [updatedAllUsers, setUpdatedAllUsers] = useState(allUsers);
  const pages = usePagesCount(updatedAllUsers, pageSize);
  const [fromPage, setFromPage] = useState(0);
  const [toPage, setToPage] = useState(3);

  const handleIncreaseShowMorePages = useCallback(() => {
    if (toPage >= pages.length) return;
    
    setFromPage(fromPage + 3)
    setToPage(toPage + 3)
  }, [fromPage, pages.length, toPage]);


  const handleDecreaseShowMorePages = useCallback(() => {
    if (fromPage <= 0) return;
    
    setFromPage(fromPage - 3)
    setToPage(toPage - 3 >= 3 ? toPage - 3 : 3)
  }, [fromPage, toPage]);

  useEffect(() => {
    if (pages.slice(fromPage, toPage).length === 0) {
      handleDecreaseShowMorePages();
    }

    if (isPageChange && pages.slice(fromPage, toPage).length === 3) {
      handleIncreaseShowMorePages();
    }
  }, [fromPage, handleDecreaseShowMorePages, handleIncreaseShowMorePages, isPageChange, pages, toPage, users.length]);

  useEffect(() => {
    setUpdatedAllUsers(allUsers);
  }, [allUsers]);

  console.log('pages.slice(fromPage, toPage)', pages.slice(fromPage, toPage));

  return (
    <StyledNav aria-label="Page navigation">
      <Button disabled={fromPage <= 0} onClick={handleDecreaseShowMorePages} className="btn btn-xs page-item mb-3">{`<`}</Button>
      <ul className="pagination">
        {pages.slice(fromPage, toPage).map((page) => (
          <li key={page}>
            <Button
              onClick={() => onPageChange(page)}
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
