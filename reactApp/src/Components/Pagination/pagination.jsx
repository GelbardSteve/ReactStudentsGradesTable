import { range } from 'lodash';
import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetAllUsers } from '../../UsersTable/Table.hooks';
import { Button } from '../Buttons/Button';

export const Pagination = ({ pageSize, onPageChange, currentPage }) => {
  const { refreshUsers } = useGetAllUsers();
  const allUsers = useSelector((state) => state.manageData.allUsers);

  const pagesCount = useCallback(() => {
    return Math.ceil((allUsers?.length || 0) / pageSize);
  }, [allUsers, pageSize]);

  const pages = range(1, pagesCount() + 1);

  useEffect(() => {
      refreshUsers();
  }, [allUsers, refreshUsers]);

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
