import React, { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AdminLoginForm } from '../../UsersLoginForm/AdminLoginForm/AdminLoginForm';
import { StudentLoginForm } from '../../UsersLoginForm/StudentLoginForm/StudentLoginForm';
import { Button } from '../Buttons/Button';
import { useLoginAdmin, useLoginStudent, useVerifyAuthenticationFromLoginPage } from './Login.hooks';
import { StyledForm, StyledFormWrapper, StyledLi, StyledWrapper } from './Login.styles';

export const LoginPage = () => {
  const dispatch = useDispatch();
  const [selectedComponent, setSelectedComponent] = useState('admin');
  const navigate = useNavigate();
  const verifyAuthentication = useVerifyAuthenticationFromLoginPage(true);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    trigger,
    setError,
    clearErrors,
    reset,
  } = useForm();

  const { loginAdmin, isAdminLoading, error: adminError } = useLoginAdmin(setError, navigate, dispatch);
  const { loginStudent, isStudentLoading, error: studentError } = useLoginStudent(setError, navigate, dispatch);

  // Get the correct error & loading state based on the selected form
  const error = selectedComponent === 'admin' ? adminError : studentError;
  const isLoading = selectedComponent === 'admin' ? isAdminLoading : isStudentLoading;

  // Handle login submission dynamically
  const onSubmit = (data) => {
    if (selectedComponent === 'admin') {
      loginAdmin(data);
    } else {
      loginStudent(data);
    }
  };

  // Auto-login effect
  useEffect(() => {
    verifyAuthentication()
  }, [verifyAuthentication]);

  const handleChangeComponent = useCallback((component) => {
    setSelectedComponent(component);
    if (isDirty) clearErrors('loginError');
    reset();
  }, [clearErrors, isDirty, reset]);

  return (
    <>
      <StyledWrapper>
        <ul className="list-group list-group-flush">
          <StyledLi 
            onClick={() => handleChangeComponent('admin')} 
            className={`list-group-item ${selectedComponent === 'admin' ? 'active' : ''}`}
          >
            Login as an Admin
          </StyledLi>
          <StyledLi 
            onClick={() => handleChangeComponent('student')} 
            className={`list-group-item ${selectedComponent === 'student' ? 'active' : ''}`}
          >
            Login as a Student
          </StyledLi>
        </ul>
      </StyledWrapper>

      <StyledFormWrapper>
        <StyledForm 
          onSubmit={handleSubmit(onSubmit)}
          onChange={() => {
            if (isDirty) clearErrors('loginError');
          }}
        >
          {selectedComponent === 'admin' ? (
            <AdminLoginForm Controller={Controller} control={control} errors={errors} trigger={trigger} />
          ) : (
            <StudentLoginForm Controller={Controller} control={control} errors={errors} trigger={trigger} />
          )}

          {errors.loginError && (
            <p className="d-flex justify-content-center mt-3 text-danger">
              {errors.loginError.message}
            </p>
          )}

          <Button 
            disabled={!isValid} 
            type="submit" 
            className="btn-block mb-4" 
            isLoading={isLoading}
          >
            Sign In
          </Button>

          {error && (
            <p className='p-1 alert-danger'>
              {error.message === 'Network Error' 
                ? `There is a ${error.message.toLowerCase()}, please try again later.` 
                : error.message}
            </p>
          )}
        </StyledForm>

        <img 
          width={600} 
          src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" 
          className="img-fluid" 
          alt="Login Illustration" 
        />
      </StyledFormWrapper>
    </>
  );
};
