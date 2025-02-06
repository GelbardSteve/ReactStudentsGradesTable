import React, { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AdminLoginForm } from '../../UsersLoginForm/AdminLoginForm/AdminLoginForm';
import { StudentLoginForm } from '../../UsersLoginForm/StudentLoginForm/StudentLoginForm';
import { Button } from '../Buttons/Button';
import { useLoginAdmin, useLoginStudent } from './Login.hooks';
import { verifyAuthentication } from './LoginPage.helper';

export const LoginPage = () => {
  const dispatch = useDispatch();
  const [studentComponent, setStudentComponent] = useState('admin');
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    trigger,
    setError,
    clearErrors,
  } = useForm();
  const { loginAdmin, isAdminLoading } = useLoginAdmin(setError, navigate, dispatch);
  const { loginStudent, isStudentLoading } = useLoginStudent(setError, navigate, dispatch);

  const customStyles = {
    width: '34%',
    margin: '40px auto 0 auto',
    pointer: {
      cursor: 'pointer',
    },
  };
  
  // Submit handlers
  const onAdminSubmitForm = (data) => loginAdmin(data);
  const onStudentSubmitForm = (data) => loginStudent(data);
  
  // Auto-login effect
  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuthentication');
    const studentAuth = localStorage.getItem('studentAuthentication');
    if (!adminAuth && !studentAuth) return;
  
    const userAuth = adminAuth || studentAuth;
    const url = adminAuth ? 'login' : 'students';
  
    verifyAuthentication(userAuth, url).then((res) => {
      if (res !== 401) navigate(url === 'login' ? '/table' : '/studentTable');
    });
  }, [navigate]);

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
          <Button disabled={!isValid} type="submit" className="btn-block mb-4" isLoading={isAdminLoading || isStudentLoading}>
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
