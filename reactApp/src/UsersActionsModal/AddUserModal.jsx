import React, { useState } from 'react';
import axios from 'axios';
import { CustomModal } from '../Components/Modal/Modal';
import { useForm, Controller } from 'react-hook-form';
import { StyledFotter } from './UserActions.styles';
import { Button } from '../Components/Buttons/Button';
import { toast } from 'react-toastify';

export const AddUserModal = ({ onCreate, isModalOpen, closeModal }) => {
  const [isUserExist, setIsUserExist] = useState(false);
  const [userExistError, setUserExistError] = useState();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
    reset,
  } = useForm();

  const baseUrl = 'http://localhost:3000';

  const handleInputChange = async (value) => {
    setIsUserExist(false);
    if (value) {
      await axios.get(`${baseUrl}/students2/search/${value}`).then((res) => {
        if (res.data !== 'NotFound') {
          setIsUserExist(true);
          setUserExistError('User number already exists');
        } else {
          setIsUserExist(false);
        }
      });
    }
  };

  const handleCloseTheModal = () => {
    setIsUserExist(false);
    reset();
    closeModal();
  };

  //Handle form submission
  const handleSubmitCreateNewUser = async (data) => {
    if (isUserExist) {
      return;
    }
    // You can perform actions with the form data here
    const forStudentsTable = { students_name: data.studentName, students_number: data.studentsNumber, studentsGrades: data.studentsGrades };
    const response = await axios.post(`${baseUrl}/students2`, forStudentsTable);

    if (response.status === 200) {
      reset();
      closeModal();
      toast.success(`User ${response.data.students_name} was created`);
      onCreate(response.data);
    }
  };

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
        <form onSubmit={handleSubmit(handleSubmitCreateNewUser)}>
          <div className="form-group">
            <div className="form-outline mb-4">
              <label htmlFor="studentName">Students Name</label>
              <Controller
                name="studentName"
                control={control}
                rules={{ required: 'Name is required' }}
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
              <label htmlFor="studentsNumber">Students Number</label>
              <Controller
                name="studentsNumber"
                control={control}
                rules={{ required: 'Number is required' }}
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
              <label htmlFor="studentsGrades">Students Grades | info</label>
              <Controller
                name="studentsGrades"
                control={control}
                rules={{ required: 'Grades | info is required' }}
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
            <Button disabled={!isValid || isUserExist} type="submit">
              {'Create a user'}
            </Button>
          </StyledFotter>
        </form>
      </CustomModal>
    </div>
  );
};
