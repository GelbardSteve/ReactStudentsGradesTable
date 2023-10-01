import React from 'react';
import { useCallback } from 'react';
import axios from 'axios';

export const DeleteButton = ({ data, onDelete }) => {
  const handleClick = useCallback(() => {
    axios
    .delete(`http://localhost:3000/students2/${data.students_id}`)
    .then(() => {
        onDelete(data.students_id)
    })
  }, [data, onDelete]);

  return (
    <button onClick={handleClick} type="button" className="btn btn-danger">
      Delete
    </button>
  );
};
