import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useCallback } from 'react';
import { AddUserModal } from '../JustTry/AddUserModal';
import { Pagination } from '../pagination/pagination';
import { orderBy } from 'lodash';
import { Table } from '../Components/Table';
import { useNavigate } from 'react-router-dom';

export const ParentComponent = () => {
  const navigate = useNavigate();
  const getTotalPageFromLocalStorage = localStorage.getItem('totalPages');
  const [currentPage, setCurrentPage] = useState(parseInt(localStorage.getItem('inputValue')) || 1);
  const [pageSize] = useState(3);
  const [studentsCount, setStudentsCount] = useState(getTotalPageFromLocalStorage);
  const [state, setState] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null); // Initialize as null
  const [sortedColumn, setSortedColumn] = useState('asc'); // Initialize as 'asc'
  const [originalData, setOriginalData] = useState([]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openEditModal = (studentId) => {
    setSelectedStudentId(studentId);
  };

  const closeEditModal = () => {
    setSelectedStudentId(null);
  };

  const getSortedData = useCallback(async () => {
    await axios
      .get(`http://localhost:3000/students2?currentPag=${currentPage}&pageSize=${pageSize}`)
      .then((response) => {
        setState(response.data.items);
        setOriginalData(response.data.items);
        setStudentsCount(response.data.totalPages > 3 ? response.data.totalPages : 3);
        return response;
      })
      .then((response) => {
        localStorage.setItem('totalPages', response.data.totalPages > 3 ? response.data.totalPages : 3);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setState(false);
      });
  }, [currentPage, pageSize]);

  useEffect(() => {
    const userAuthentication = localStorage.getItem('adminAuthentication');
    axios.post('http://localhost:3000/login/authentication', { authentication: userAuthentication }).then((res) => {
      if (res.data !== 401) {
        getSortedData();
      } else {
        navigate('/');
      }
    });
  }, [getSortedData, navigate]);

  const handleColumnHeaderClick = (column) => {
    const sortedData = [...state];
    const sortedState = orderBy(sortedData, [column], [sortedColumn]);
    const howToSort = sortedColumn === 'asc' ? 'desc' : 'asc';

    setState(sortedState);
    setSortedColumn(howToSort);
  };

  const handlePageChange = useCallback(
    async (page) => {
      setCurrentPage(page);
      localStorage.setItem('inputValue', page);
    },
    [setCurrentPage]
  );

  const handleDelete = useCallback(() => {
    if (state.length === 1) {
      const newPage = currentPage - 1 === 0 ? 1 : currentPage - 1;
      handlePageChange(newPage);
    }
    getSortedData();
  }, [getSortedData, state, currentPage, handlePageChange]);

  const handleCreate = useCallback(async () => {
    getSortedData();
  }, [getSortedData]);

  const handleLogOut = useCallback(() => {
    const userAuthentication = localStorage.getItem('adminAuthentication');
    axios.post('http://localhost:3000/remove/authentication', { authentication: userAuthentication }).then((res) => {
    if (res.data === 200) {
        localStorage.removeItem('adminAuthentication');
        navigate('/');
      }
    });
  }, [navigate]);

  return (
    <>
      <AddUserModal isModalOpen={isModalOpen} closeModal={closeModal} onCreate={handleCreate} />
      <div className="m-4">
        <div className="d-flex justify-content-between">
          <div></div>
          <button type="button" className="btn btn-info mb-4" onClick={handleLogOut}>
            Log-out
          </button>
        </div>
        <Table
          tableData={state}
          handleColumnHeaderClick={handleColumnHeaderClick}
          selectedStudentId={selectedStudentId}
          closeEditModal={closeEditModal}
          handleCreate={handleCreate}
          openEditModal={openEditModal}
          handleDelete={handleDelete}
          setState={setState}
          originalData={originalData}
          openModal={openModal}
        />
        <Pagination itemsCount={studentsCount} pageSize={pageSize} currentPage={currentPage} onPageChange={handlePageChange} />
      </div>
    </>
  );
};
