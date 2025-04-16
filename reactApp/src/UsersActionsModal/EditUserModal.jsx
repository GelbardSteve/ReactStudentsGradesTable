import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../Components/Buttons/Button';
import { CustomModal } from '../Components/Modal/Modal';
import { addAllUsers } from '../Components/store/actions/manageData';
import { StyledFotter } from './UserActions.styles';
import { useUpdateUser } from './UserActionsModal.hooks';

export const EditUserModal = ({ user, isModalOpen, closeModal, handleUpdateTable, setTableState }) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    trigger,
  } = useForm();
  const dispatch = useDispatch();
  const allUsers = useSelector((state) => state.manageData.allUsers);

  // Set default values when the component mounts
  useEffect(() => {
    setValue('studentName', user.students_name);
    setValue('studentsNumber', user.students_number);
    setValue('studentsGrades', user.studentsGrades);
  }, [setValue, user.studentsGrades, user.students_name, user.students_number]);

  const onSuccess = (updatedStudent) => {
    dispatch(addAllUsers(allUsers.map(user =>
      user.students_id === updatedStudent.students_id ? updatedStudent : user
    )));
    handleUpdateTable(updatedStudent);
    closeModal();
  };


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
              Task Name
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
              Task Number
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
              Task info
            </label>
            <Controller
              name="studentsGrades"
              control={control}
              defaultValue={user.studentsGrades}
              rules={{ required: 'Task info is required' }}
              render={({ field }) => (
                <>
                  <textarea
                    {...field}
                    id="studentsGrades"
                    name="studentsGrades"
                    required
                    onChange={(e) => field.onChange(e.target.value)} // Ensure value updates
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
              {'Update Task'}
            </Button>
          </StyledFotter>
        </form>
      </CustomModal>
    </div>
  );
};