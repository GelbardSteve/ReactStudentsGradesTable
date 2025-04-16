import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Button } from '../Components/Buttons/Button';
import { CustomModal } from '../Components/Modal/Modal';
import { StyledFotter } from './UserActions.styles';
import { useCreateUser } from './UserActionsModal.hooks';

export const AddUserModal = ({ onCreate, isModalOpen, closeModal }) => {
  const [isUserExist, setIsUserExist] = useState(false);
  const [userExistError, setUserExistError] = useState();
  const allUsers = useSelector((state) => state.manageData.allUsers);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
    reset,
  } = useForm();


  const handleInputChange = (value) => {
    if (!value) return;
  
    const userExists = allUsers?.some(user => user.students_number === parseInt(value));

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
    closeModal();
  };

  const onSuccess = (user) => {
    reset({
  studentName: '',
  studentsNumber: '',
  studentsGrades: '',
});
    closeModal();
    onCreate(user);
  }

  const { mutate: onCreateUser, isLoading: isCreateUserLoading } = useCreateUser(onSuccess)

  const handleSubmitCreateNewUser = (data) => {
    if (isUserExist) {
      return;
    }

    onCreateUser(data)
  }

  return (
    <div>
      <CustomModal
        isModalOpen={isModalOpen}
        handleCloseTheModal={handleCloseTheModal}
        header={
          <>
            <h5 className="modal-title">Create User</h5>
            <Button onClick={handleCloseTheModal}>{<span aria-hidden="true">&times;</span>}</Button>
          </>
        }
      >
        <form key={isModalOpen ? 'open' : 'closed'} onSubmit={handleSubmit((user) => handleSubmitCreateNewUser(user))}>
          <div className="form-group">
            <div className="form-outline mb-4">
              <label htmlFor="studentName">Task Name</label>
              <Controller
                name="studentName"
                control={control}
                rules={{ required: 'Task name is required' }}
                defaultValue=""
                render={({ field }) => (
                  <>
                    <input
                      {...field}
                      id="studentName"
                      name="studentName"
                      required
                      type="text"
                      className={`form-control ${errors.studentName ? 'is-invalid' : ''}`}
                      onBlur={() => trigger('studentName')}
                    />
                    {errors.studentName && <p className="invalid-feedback">{errors.studentName.message}</p>}
                  </>
                )}
              />
            </div>
            <div className="form-outline mb-4">
              <label htmlFor="studentsNumber">Task Number</label>
              <Controller
                name="studentsNumber"
                control={control}
                rules={{
                  required: 'Task Number is required',
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
                      className={`form-control ${errors.studentsNumber || isUserExist ? 'is-invalid' : ''}`}
                      onChange={(e) => {
                        const { value } = e.target;
                        field.onChange(value);
                        handleInputChange(value);
                      }}
                      onBlur={() => trigger('studentsNumber')}
                    />
                    {(errors.studentsNumber || isUserExist) && <p className="invalid-feedback">{isUserExist ? userExistError : errors.studentsNumber.message}</p>}
                  </>
                )}
              />
            </div>
            <div className="form-outline mb-4">
              <label htmlFor="studentsGrades">Task Info</label>
              <Controller
                name="studentsGrades"
                control={control}
                rules={{ required: 'Task Info is required' }}
                defaultValue=""
                render={({ field }) => (
                  <>
                    <textarea
                      {...field}
                      id="studentsGrades"
                      name="studentsGrades"
                      required
                      className={`form-control ${errors.studentsGrades ? 'is-invalid' : ''}`}
                      onBlur={() => trigger('studentsGrades')}
                    />
                    {errors.studentsGrades && <p className="invalid-feedback">{errors.studentsGrades.message}</p>}
                  </>
                )}
              />
            </div>
          </div>

          <StyledFotter className="modal-footer">
            <Button disabled={!isValid || isUserExist} type="submit" isLoading={isCreateUserLoading}>
              {'Create a Task'}
            </Button>
          </StyledFotter>
        </form>
      </CustomModal>
    </div>
  );
};