import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

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
    <div className="m-4">
      <div className="d-flex justify-content-between">
        <div></div>
        <button type="button" className="btn btn-info mb-4" onClick={handleLogOut}>
          Log-out
        </button>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">{'Student name'}</th>
            <th scope="col">{'Student number'}</th>
            <th scope="col">{'Student grades'}</th>
          </tr>
        </thead>
        <tbody>
          {studentData.map((user) => {
            console.log(user)
            return (
              <React.Fragment key={user.students_id}>
                <tr>
                  <td>{user.students_name}</td>
                  <td>{user.students_number}</td>
                  <td>{user.studentsGrades}</td>
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
