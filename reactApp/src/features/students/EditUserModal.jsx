import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { CustomModal } from '../../components/Modal/Modal';
import { EMAIL_RULES } from '../auth/validation';
import { ModalForm } from './StudentModal.styles';
import { useStudents } from './useStudents';

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
    setValue('studentName', user.name);
    setValue('studentsNumber', user.student_number);
    setValue('studentEmail', user.email);
    setValue('studentsGrades', user.grades);
  }, [setValue, user.name, user.student_number, user.email, user.grades]);

  const handleSubmitUpdate = (data) => {
    const updatedData = {
      id: user.id,
      data: {
        name: data.studentName,
        email: data.studentEmail,
        grades: data.studentsGrades,
      },
    };

    // Close only on success so the user keeps their input if the request fails
    updateStudent(updatedData, { onSuccess: onClose });
  };

  return (
    <div>
      <CustomModal
        isModalOpen={true}
        handleCloseTheModal={onClose}
        header="Edit Student"
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
                defaultValue={user.name}
                rules={{ required: 'Student name is required' }}
                render={({ field }) => (
                  <>
                    <input
                      {...field}
                      id="studentName"
                      type="text"
                      className={errors.studentName ? 'error' : ''}
                      onBlur={() => trigger('studentName')}
                    />
                    {errors.studentName && <div className="error-message">{errors.studentName.message}</div>}
                  </>
                )}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="studentsNumber">
                Student Number
              </label>
              <Controller
                name="studentsNumber"
                control={control}
                defaultValue={user.student_number}
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
              <label htmlFor="studentEmail">
                Student Email
              </label>
              <Controller
                name="studentEmail"
                control={control}
                defaultValue={user.email}
                rules={EMAIL_RULES}
                render={({ field }) => (
                  <>
                    <input
                      {...field}
                      id="studentEmail"
                      type="email"
                      className={errors.studentEmail ? 'error' : ''}
                      onBlur={() => trigger('studentEmail')}
                    />
                    {errors.studentEmail && <div className="error-message">{errors.studentEmail.message}</div>}
                  </>
                )}
              />
            </div>

            <div className="form-group">
              <label htmlFor="studentsGrades">
                Student Info
              </label>
              <Controller
                name="studentsGrades"
                control={control}
                defaultValue={user.grades}
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
                {isUpdating ? 'Updating...' : 'Update Student'}
              </button>
            </div>
          </form>
        </ModalForm>
      </CustomModal>
    </div>
  );
};