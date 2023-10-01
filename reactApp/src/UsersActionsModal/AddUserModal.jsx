import React, { useState } from 'react';
import axios from 'axios';
import { CustomModal } from '../Components/Modal/Modal';

export const AddUserModal = ({ isModalOpen, closeModal, onCreate }) => {
  const [isUserExist, setIsUserExist] = useState(false);

  const [formData, setFormData] = useState({
    studentName: '',
    studentsNumber: '',
    studentsGrades: '',
  });

  const handleInputChange = async (e) => {
    const { name, value } = e.target;

    if (name === 'studentsNumber' && value) {
      await axios.get(`http://localhost:3000/students2/search/${value}`).then((res) => {
        if (res.data !== 'NotFound') {
          setIsUserExist(true);
        } else {
          setIsUserExist(false);
        }
      });
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const resetForm = () => {
    setFormData({
      studentName: '',
      studentsNumber: '',
      studentsGrades: '',
    });
  };

  const handleCloseTheModal = () => {
    setIsUserExist(false);
    resetForm();
    closeModal();
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isUserExist) {
      return;
    }
    // You can perform actions with the form data here
    const forStudentsTable = { students_name: formData.studentName, students_number: formData.studentsNumber };
    const forGradesTable = { studentsGrades: formData.studentsGrades, students_number: formData.studentsNumber };
    axios.post('http://localhost:3000/students2', forStudentsTable).then(() => onCreate(forStudentsTable));
    axios
      .post('http://localhost:3000/grades', forGradesTable)
      .then(() => onCreate())
      .then(() => {
        resetForm();
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
            <button type="button" className="close" onClick={handleCloseTheModal}>
              <span aria-hidden="true">&times;</span>
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="studentName" className="col-form-label">
              Students Name
            </label>
            <input id="studentName" name="studentName" value={formData.studentName} onChange={handleInputChange} required type="text" className="form-control" />
          </div>
          <div className="form-group">
            <label htmlFor="studentsNumber" className="col-form-label">
              Students Number
            </label>
            <input
              id="studentsNumber"
              name="studentsNumber"
              value={formData.studentsNumber}
              onChange={handleInputChange}
              required
              type="number"
              className={`form-control ${isUserExist ? 'is-invalid' : ''}`}
            />
            {isUserExist && <div className="">User already exists.</div>}
          </div>
          <div className="form-group">
            <label htmlFor="studentsGrades" className="col-form-label">
              Students Grades
            </label>
            <textarea id="studentsGrades" name="studentsGrades" value={formData.studentsGrades} onChange={handleInputChange} required className="form-control"></textarea>
          </div>

          <div className="modal-footer">
            <button disabled={isUserExist} type="submit" className="btn btn-primary">
              Send message
            </button>
          </div>
        </form>
      </CustomModal>
    </div>
  );
};
