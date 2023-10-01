import React from 'react';

export const EditButton = ({ user, openEditModal}) => {
  return (
    <button onClick={() => openEditModal(user.students_id)} type="button" className="btn btn-primary">
      Edit
    </button>
  );
};
