import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { CustomModal } from '../Components/Modal/Modal';
import { StyledFotter } from './UserActions.styles';
import { Button } from '../Components/Buttons/Button';

export const EditUserModal = ({ user, isModalOpen, closeModal, handleUpdateTable }) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    trigger,
  } = useForm();

  // Set default values when the component mounts
  useEffect(() => {
    setValue('studentName', user.students_name);
    setValue('studentsNumber', user.students_number);
    setValue('studentsGrades', user.studentsGrades);
  }, [user, setValue]);

  const onSubmit = async (data) => {
    try {
      const forGradesTable = {
        students_name: user.students_name,
        students_id: user.students_id,
        studentsGrades: data.studentsGrades,
        students_number: data.studentsNumber,
      };

      await axios.put('http://localhost:3000/grades', forGradesTable);
      handleUpdateTable(forGradesTable);
      closeModal();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div>
      <CustomModal
        isModalOpen={isModalOpen}
        onRequestClose={closeModal}
        header={
          <>
            <h5 className="modal-title">Edit User</h5>
            <Button onClick={closeModal}>{<span aria-hidden="true">&times;</span>}</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="studentName" className="col-form-label">
              Students Name
            </label>
            <Controller
              name="studentName"
              control={control}
              defaultValue={user.students_name}
              render={({ field }) => <input readOnly id="studentName" type="text" className="form-control" {...field} />}
            />
          </div>
          <div className="form-group">
            <label htmlFor="studentsNumber" className="col-form-label">
              Students Number
            </label>
            <Controller
              name="studentsNumber"
              control={control}
              defaultValue={user.students_number}
              render={({ field }) => <input readOnly id="studentsNumber" type="number" className="form-control" {...field} />}
            />
          </div>
          <div className="form-group">
            <label htmlFor="studentsGrades" className="col-form-label">
              Students Grades | info
            </label>
            <Controller
              name="studentsGrades"
              control={control}
              defaultValue={user.studentsGrades}
              rules={{ required: 'Grades | info is required' }}
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
          <StyledFotter className="modal-footer">
            <Button disabled={!isValid} type="submit">
              {'Update student'}
            </Button>
          </StyledFotter>
        </form>
      </CustomModal>
    </div>
  );
};
