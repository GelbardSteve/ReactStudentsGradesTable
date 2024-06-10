import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AdminLoginForm } from '../../UsersLoginForm/AdminLoginForm/AdminLoginForm';
import { StudentLoginForm } from '../../UsersLoginForm/StudentLoginForm/StudentLoginForm';
import { useState } from 'react';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { Button } from '../Buttons/Button';

export const LoginPage = () => {
  const [studentComponent, setStudentComponent] = useState('admin');
  const [userTablePath, setUserTablePath] = useState('');

  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    trigger,
    setError,
    clearErrors,
  } = useForm();

  const customStyles = {
    width: '34%',
    margin: '40px auto 0 auto',
    pointer: {
      cursor: 'pointer',
    },
  };

  useEffect(() => {
    const adminAuthentication = localStorage.getItem('adminAuthentication');
    const studentAuthentication = localStorage.getItem('studentAuthentication');

    if (!adminAuthentication && !studentAuthentication) return;

    const userAuthentication = adminAuthentication ? adminAuthentication : studentAuthentication;
    const url = adminAuthentication ? 'login' : 'students';

    axios.post(`http://localhost:3000/${url}/authentication`, { authentication: userAuthentication }).then((res) => {
      if (res.data !== 401 && url === 'login') {
        navigate('/table');
      } else if (res.data !== 401 && url === 'students') {
        navigate('/studentTable');
      }
    });
  }, [navigate, userTablePath, setUserTablePath]);

  const onAdminSubmitForm = async (data) => {
    await axios.post('http://localhost:3000/login', data).then((res) => {
      if (res.data === 401) {
        setError('loginError', {
          type: 'manual',
          message: 'Invalid username or password',
        });
      } else {
        localStorage.setItem('adminAuthentication', res.data.authentication);
        navigate('/table');
      }
    });
  };

  const onStudentSubmitForm = async (data) => {
    await axios.post(`http://localhost:3000/students2/${data.studentNumber}`, data).then((res) => {
      if (res.data === 'NotFound') {
        setError('loginError', {
          type: 'manual',
          message: 'Invalid student number',
        });
      } else {
        localStorage.setItem('studentAuthentication', res.data.authentication);
        navigate('/studentTable', { state: { studentData: res.data.userData } });
      }
    });
  };

  const handleChangeComponent = useCallback(
    (componentState) => {
      setStudentComponent(componentState);
    },
    [setStudentComponent]
  );

  return (
    <>
      <div style={customStyles}>
        <ul className="list-group list-group-flush">
          <li style={customStyles.pointer} onClick={() => handleChangeComponent('admin')} className={`list-group-item ${studentComponent === 'admin' && 'active'}`}>
            Login as an Admin
          </li>
          <li style={customStyles.pointer} onClick={() => handleChangeComponent('student')} className={`list-group-item ${studentComponent === 'student' && 'active'}`}>
            Login as a Student
          </li>
        </ul>
      </div>
      <div className=" d-flex justify-content-center align-items-center h-100">
        <form
          className="w-25"
          onSubmit={handleSubmit(studentComponent === 'admin' ? onAdminSubmitForm : onStudentSubmitForm)}
          onChange={() => {
            if (isDirty) clearErrors('loginError');
          }}
        >
          {studentComponent === 'admin' ? (
            <AdminLoginForm Controller={Controller} control={control} errors={errors} trigger={trigger} />
          ) : (
            <StudentLoginForm Controller={Controller} control={control} errors={errors} trigger={trigger} />
          )}
          {errors.loginError && <p className="d-flex justify-content-center mt-3 text-danger">{errors.loginError.message}</p>}

          <Button disabled={!isValid} type="submit" className="btn-block mb-4">
            {'Sign In'}
          </Button>
        </form>
        <div>
          <img src={'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp'} className="img-fluid" alt="Login Illustration" />
        </div>
      </div>
    </>
  );
};
