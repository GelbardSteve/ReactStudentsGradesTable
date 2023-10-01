import React, { useState } from 'react';
import axios from 'axios';
import { CustomModal } from '../Components/Modal/Modal';

export const EditUserModal = ({ user, isModalOpen, closeModal, onCreate }) => {
  const [formData, setFormData] = useState({
    studentName: user.students_name,
    studentsNumber: user.students_number,
    studentsGrades: user.studentsGrades,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // You can perform actions with the form data here
    const forGradesTable = { students_id: user.students_id, studentsGrades: formData.studentsGrades, students_number: formData.studentsNumber };
    axios
      .put('http://localhost:3000/grades', forGradesTable)
      .then(onCreate)
      .then(() => {
        closeModal();
      });
  };

  return (
    <div>
      <CustomModal
        isModalOpen={isModalOpen}
        onRequestClose={closeModal}
        header={
          <>
            <h5 className="modal-title">New message</h5>
            <button type="button" className="close" onClick={closeModal}>
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
            <input readonly id="studentName" name="studentName" defaultValue={formData.studentName} type="text" className="form-control" />
          </div>
          <div className="form-group">
            <label htmlFor="studentsNumber" className="col-form-label">
              Students Number
            </label>
            <input readonly id="studentsNumber" name="studentsNumber" defaultValue={formData.studentsNumber} type="number" className="form-control" />
          </div>
          <div className="form-group">
            <label htmlFor="studentsGrades" className="col-form-label">
              Students Grades
            </label>
            <textarea id="studentsGrades" name="studentsGrades" defaultValue={formData.studentsGrades} onChange={handleInputChange} required className="form-control" />
          </div>

          <div className="modal-footer">
            <button type="submit" className="btn btn-primary">
              Send message
            </button>
          </div>
        </form>
      </CustomModal>
    </div>
  );
};
