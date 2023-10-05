import React, { useState } from 'react';
import axios from 'axios';
import { CustomModal } from '../Components/Modal/Modal';
import { useForm, Controller } from 'react-hook-form';

export const AddUserModal = ({ isModalOpen, closeModal, onCreate }) => {
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
    const forStudentsTable = { students_name: data.studentName, students_number: data.studentsNumber };
    const forGradesTable = { studentsGrades: data.studentsGrades, students_number: data.studentsNumber };
    axios.post(`${baseUrl}/students2`, forStudentsTable).then(() => onCreate(forStudentsTable));
    axios
      .post(`${baseUrl}/grades`, forGradesTable)
      .then(() => onCreate())
      .then(() => {
        reset();
        closeModal();
      });
  };

  return (
    <div>
      <CustomModal
        isModalOpen={isModalOpen}
        handleCloseTheModal={handleCloseTheModal}
        header={
          <>
            <h5 className="modal-title">New message</h5>
            <button
              type="button"
              className="close"
              onClick={handleCloseTheModal}
            >
              <span aria-hidden="true">&times;</span>
            </button>
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
                    {(errors.studentsNumber || isUserExist) && (
                      <p className="invalid-feedback">{isUserExist ? userExistError : errors.studentsNumber.message}</p>
                    )}
                  </>
                )}
              />
            </div>
            <div className="form-outline mb-4">
              <label htmlFor="studentsGrades">Students Grades</label>
              <Controller
                name="studentsGrades"
                control={control}
                rules={{ required: 'Grades is required' }}
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

          <div className="modal-footer">
            <button
              disabled={!isValid || isUserExist}
              type="submit"
              className="btn btn-primary btn-block p-3 w-25 mt-4 ml-auto mr-auto"
            >
              Create a user
            </button>
          </div>
        </form>
      </CustomModal>
    </div>
  );
};