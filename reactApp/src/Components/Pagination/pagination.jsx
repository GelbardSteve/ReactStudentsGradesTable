import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetAllUsers } from '../../UsersTable/Table.hooks';
import { Button } from '../Buttons/Button';
import { usePagesCount } from './pagination.hooks';

export const Pagination = ({ pageSize, onPageChange, currentPage }) => {
  const { refreshUsers } = useGetAllUsers();
  const allUsers = useSelector((state) => state.manageData.allUsers);

  const pages = usePagesCount(allUsers, pageSize)

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
