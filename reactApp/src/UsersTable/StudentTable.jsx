import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Table } from '../Components/Table/Table';
import { Button } from '../Components/Buttons/Button';
import { useLogout } from './Table.hooks';

export const StudentTable = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [studentData, setStudentData] = useState([]);
  const handleLogOut = useLogout('student');

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

  return (
    <>
      <div className="d-flex justify-content-between m-4">
        <div></div>
        <Button onClick={handleLogOut} text="Log out" />
      </div>
      <Table state={studentData} permission={false} />
    </>
  );
};
