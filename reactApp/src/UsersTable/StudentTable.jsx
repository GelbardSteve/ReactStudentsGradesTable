import React from 'react';
import { Table } from '../Components/Table/Table';
import { useSelector } from 'react-redux';

export const StudentTable = () => {
  const { userData } = useSelector((state) => state.role.student);

  return <Table state={userData} permission={false} />;
};
