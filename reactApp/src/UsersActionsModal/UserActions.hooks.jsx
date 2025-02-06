import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';

const baseUrl = 'https://node-4-pdlj.onrender.com';

  const createUser = async (data) => {
    const forStudentsTable = {
      students_name: data.studentName,
      students_number: data.studentsNumber,
      studentsGrades: data.studentsGrades,
    };
  
    const response = await axios.post(`${baseUrl}/students2`, forStudentsTable);
    return response.data;
  };
  
  export const useCreateNewUser = (onCreate) => {
    return useMutation(createUser, {
      onSuccess: (data) => {
        onCreate(data);
      },
      onError: (error) => {
        toast.error('Error creating user');
      },
    });
  };