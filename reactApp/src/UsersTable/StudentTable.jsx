import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Table } from '../Components/Table/Table';

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

  return <Table state={studentData} permission={false} />;
};
