import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { CustomModal } from '../../components/Modal/Modal';
import { EMAIL_RULES } from '../auth/validation';
import { ModalForm } from './StudentModal.styles';
import { useStudents } from './useStudents';

// Adds a student to one class; student numbers only need to be unique within that class
export const AddUserModal = ({ classId, existingStudents, onClose }) => {
  const [isUserExist, setIsUserExist] = useState(false);
  const [userExistError, setUserExistError] = useState();
  const { createStudent, isCreating } = useStudents();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
    reset,
  } = useForm();

  const handleInputChange = (value) => {
    if (!value) return;
  
    const userExists = existingStudents?.some((user) => user.student_number === parseInt(value, 10));

    setIsUserExist(userExists);
    setUserExistError(userExists ? 'Student number already exists in this class' : '');
  };

  const handleCloseTheModal = () => {
    setIsUserExist(false);
    reset({
      studentName: '',
      studentsNumber: '',
      studentEmail: '',
      studentsGrades: '',
    });
    onClose();
  };

  const handleSubmitCreateNewUser = (data) => {
    if (isUserExist) {
      return;
    }

    const student = {
      name: data.studentName,
      student_number: parseInt(data.studentsNumber, 10),
      email: data.studentEmail,
      grades: data.studentsGrades,
    };

    // Close only on success so the user keeps their input if the request fails
    createStudent({ classId, student }, { onSuccess: handleCloseTheModal });
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
              <label htmlFor="studentEmail">Student Email</label>
              <Controller
                name="studentEmail"
                control={control}
                rules={EMAIL_RULES}
                defaultValue=""
                render={({ field }) => (
                  <>
                    <input
                      {...field}
                      id="studentEmail"
                      name="studentEmail"
                      required
                      type="email"
                      placeholder="student@example.com"
                      className={errors.studentEmail ? 'error' : ''}
                      onBlur={() => trigger('studentEmail')}
                    />
                    {errors.studentEmail && <div className="error-message">{errors.studentEmail.message}</div>}
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