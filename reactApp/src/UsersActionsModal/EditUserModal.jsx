import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '../Components/Buttons/Button';
import { CustomModal } from '../Components/Modal/Modal';
import { StyledFotter } from './UserActions.styles';
import { useUpdateUser } from './UserActionsModal.hooks';

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

  const onSuccess = (userName) => {
      handleUpdateTable(userName);
      closeModal();
  }

  const {mutate: onUpdateUser, isLoading: isUpdateUserLoading } = useUpdateUser(onSuccess);

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
        <form onSubmit={handleSubmit((data) => onUpdateUser({ user, data }))}>
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
            <Button disabled={!isValid} type="submit" isLoading={isUpdateUserLoading}>
              {'Update student'}
            </Button>
          </StyledFotter>
        </form>
      </CustomModal>
    </div>
  );
};
