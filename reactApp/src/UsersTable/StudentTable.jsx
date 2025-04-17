import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useVerifyAuthenticationFromLoginPage } from '../Components/Login/Login.hooks';
import { Table } from '../Components/Table/Table';

export const StudentTable = () => {
  const { userData } = useSelector((state) => state.students.student);
  const verifyAuthentication = useVerifyAuthenticationFromLoginPage(false);
  const userRole = useSelector((state) => state.role.roles);
  const hasPermission = userRole === 'admin';

  // Auto-login effect
  useEffect(() => {
    verifyAuthentication()
  }, [verifyAuthentication]);

  return <Table tableData={userData} hasPermission={hasPermission} />;
};
