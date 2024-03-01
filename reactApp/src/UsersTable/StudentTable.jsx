import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Table } from '../Components/Table/Table';
import { Button } from '../Components/Buttons/Button';

export const StudentTable = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [studentData, setStudentData] = useState([]);

  useEffect(() => {
    const userAuthentication = localStorage.getItem('studentAuthentication');
    axios.post('http://localhost:3000/students/authentication', { authentication: userAuthentication }).then((res) => {
      if (res.data !== 401) {
        setStudentData(res.data);
      } else {
        navigate('/');
      }
    });
  }, [location.state, navigate]);

  const handleLogOut = useCallback(() => {
    const userAuthentication = localStorage.getItem('studentAuthentication');
    axios.post('http://localhost:3000/remove/authentication', { table: 'students2', authentication: userAuthentication }).then((res) => {
      if (res.data === 200) {
        localStorage.removeItem('studentAuthentication');
        navigate('/');
      }
    });
  }, [navigate]);

  return (
    <>
      <div className="d-flex justify-content-between m-4">
        <div></div>
        <Button onClick={handleLogOut} text="Log out" />
      </div>
      <Table tableData={studentData} permission={false} />
    </>
  );
};
