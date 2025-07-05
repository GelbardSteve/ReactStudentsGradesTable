import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { CustomModal } from '../Components/Modal/Modal';
import { useStudents } from '../hooks/useStudents';
import { ModalForm } from './UserActions.styles';

export const AddUserModal = ({ onClose, onSuccess }) => {
  const [isUserExist, setIsUserExist] = useState(false);
  const [userExistError, setUserExistError] = useState();
  const { allStudents, createStudent, isCreating } = useStudents();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
    reset,
  } = useForm();

  const handleInputChange = (value) => {
    if (!value) return;
  
    const userExists = allStudents?.some(user => user.students_number === parseInt(value));

    setIsUserExist(userExists);
    setUserExistError(userExists ? 'User number already exists' : '');
  };

  const handleCloseTheModal = () => {
    setIsUserExist(false);
    reset({
      studentName: '',
      studentsNumber: '',
      studentsGrades: '',
    });
    onClose();
  };

  const handleSubmitCreateNewUser = async (data) => {
    if (isUserExist) {
      return;
    }

    // Transform data to match the expected format
    const userData = {
      studentName: data.studentName,
      studentsNumber: parseInt(data.studentsNumber), // Ensure it's a number
      studentsGrades: data.studentsGrades
    };

    console.log('Form data being sent:', userData); // Debug log

    try {
      await createStudent(userData);
      
      // Reset form and close modal after successful creation
      reset({
        studentName: '',
        studentsNumber: '',
        studentsGrades: '',
      });
      onClose();
    } catch (error) {
      // Error is already handled by the mutation
      console.error('Error in form submission:', error);
    }
  }

  return (
    <div>
      <CustomModal
        isModalOpen={true}
        handleCloseTheModal={handleCloseTheModal}
        header="Create New Student"
      >
        <ModalForm>
          <form onSubmit={handleSubmit((user) => handleSubmitCreateNewUser(user))}>
            <div className="form-group">
              <label htmlFor="studentName">Student Name</label>
              <Controller
                name="studentName"
                control={control}
                rules={{ required: 'Student name is required' }}
                defaultValue=""
                render={({ field }) => (
                  <>
                    <input
                      {...field}
                      id="studentName"
                      name="studentName"
                      required
                      type="text"
                      placeholder="Enter student name"
                      className={errors.studentName ? 'error' : ''}
                      onBlur={() => trigger('studentName')}
                    />
                    {errors.studentName && <div className="error-message">{errors.studentName.message}</div>}
                  </>
                )}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="studentsNumber">Student Number</label>
              <Controller
                name="studentsNumber"
                control={control}
                rules={{
                  required: 'Student Number is required',
                  maxLength: {
                    value: 9,
                    message: 'Number cannot exceed 9 digits',
                  },
                }}
                defaultValue=""
                render={({ field }) => (
                  <>
                    <input
                      {...field}
                      id="studentsNumber"
                      name="studentsNumber"
                      required
                      type="number"
                      placeholder="Enter student number"
                      className={errors.studentsNumber || isUserExist ? 'error' : ''}
                      onChange={(e) => {
                        const { value } = e.target;
                        field.onChange(value);
                        handleInputChange(value);
                      }}
                      onBlur={() => trigger('studentsNumber')}
                    />
                    {(errors.studentsNumber || isUserExist) && (
                      <div className="error-message">
                        {isUserExist ? userExistError : errors.studentsNumber.message}
                      </div>
                    )}
                  </>
                )}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="studentsGrades">Student Info</label>
              <Controller
                name="studentsGrades"
                control={control}
                rules={{ required: 'Student Info is required' }}
                defaultValue=""
                render={({ field }) => (
                  <>
                    <textarea
                      {...field}
                      id="studentsGrades"
                      name="studentsGrades"
                      required
                      placeholder="Enter student information"
                      className={errors.studentsGrades ? 'error' : ''}
                      onBlur={() => trigger('studentsGrades')}
                    />
                    {errors.studentsGrades && <div className="error-message">{errors.studentsGrades.message}</div>}
                  </>
                )}
              />
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={handleCloseTheModal}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-success" 
                disabled={!isValid || isUserExist || isCreating}
              >
                {isCreating ? 'Creating...' : 'Create Student'}
              </button>
            </div>
          </form>
        </ModalForm>
      </CustomModal>
    </div>
  );
};