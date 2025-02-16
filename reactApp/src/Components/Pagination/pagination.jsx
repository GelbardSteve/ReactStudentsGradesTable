import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '../Buttons/Button';
import { usePagesCount } from './pagination.hooks';

export const Pagination = ({ pageSize, onPageChange, currentPage }) => {
  const allUsers = useSelector((state) => state.manageData.allUsers);
  const [updatedAllUsers, setUpdatedAllUsers] = useState(allUsers);
  const pages = usePagesCount(updatedAllUsers, pageSize);

  useEffect(() => {
    setUpdatedAllUsers(allUsers);
  }, [allUsers]);

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination">
        {pages.map((page) => (
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
    </nav>
  );
};
