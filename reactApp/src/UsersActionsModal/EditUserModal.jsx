import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { CustomModal } from '../Components/Modal/Modal';
import { useStudents } from '../hooks/useStudents';
import { ModalForm } from './UserActions.styles';

export const EditUserModal = ({ user, onClose }) => {
  const { updateStudent, isUpdating } = useStudents();
  
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
  }, [setValue, user.studentsGrades, user.students_name, user.students_number]);

  const handleSubmitUpdate = async (data) => {
    const updatedData = {
      id: user.students_id,
      data: {
        studentsGrades: data.studentsGrades
      }
    };
    
    try {
      await updateStudent(updatedData);
      
      // Close modal after successful update
      onClose();
    } catch (error) {
      // Error is already handled by the mutation
      console.error('Error in form submission:', error);
    }
  };

  return (
    <div>
      <CustomModal
        isModalOpen={true}
        handleCloseTheModal={onClose}
        header="Edit Student Grades"
      >
        <ModalForm>
          <form onSubmit={handleSubmit(handleSubmitUpdate)}>
            <div className="form-group">
              <label htmlFor="studentName">
                Student Name
              </label>
              <Controller
                name="studentName"
                control={control}
                defaultValue={user.students_name}
                render={({ field }) => (
                  <input 
                    readOnly 
                    id="studentName" 
                    type="text" 
                    {...field} 
                  />
                )}
              />
              <small style={{ color: '#6c757d', fontSize: '12px', marginTop: '4px' }}>
                Student name cannot be modified
              </small>
            </div>
            
            <div className="form-group">
              <label htmlFor="studentsNumber">
                Student Number
              </label>
              <Controller
                name="studentsNumber"
                control={control}
                defaultValue={user.students_number}
                render={({ field }) => (
                  <input 
                    readOnly 
                    id="studentsNumber" 
                    type="number" 
                    {...field} 
                  />
                )}
              />
              <small style={{ color: '#6c757d', fontSize: '12px', marginTop: '4px' }}>
                Student number cannot be modified
              </small>
            </div>
            
            <div className="form-group">
              <label htmlFor="studentsGrades">
                Student Info
              </label>
              <Controller
                name="studentsGrades"
                control={control}
                defaultValue={user.studentsGrades}
                rules={{ required: 'Student info is required' }}
                render={({ field }) => (
                  <>
                    <textarea
                      {...field}
                      id="studentsGrades"
                      name="studentsGrades"
                      required
                      placeholder="Enter student information"
                      onChange={(e) => field.onChange(e.target.value)}
                      className={errors.studentsGrades ? 'error' : ''}
                      onBlur={() => trigger('studentsGrades')}
                    />
                    {errors.studentsGrades && <div className="error-message">{errors.studentsGrades.message}</div>}
                  </>
                )}
              />
              <small style={{ color: '#6c757d', fontSize: '12px', marginTop: '4px' }}>
                Only student info can be modified
              </small>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={onClose}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-primary" 
                disabled={!isValid || isUpdating}
              >
                {isUpdating ? 'Updating...' : 'Update Student Info'}
              </button>
            </div>
          </form>
        </ModalForm>
      </CustomModal>
    </div>
  );
};