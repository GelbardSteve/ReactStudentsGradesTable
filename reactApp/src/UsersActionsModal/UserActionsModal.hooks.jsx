import { useMutation } from '@tanstack/react-query';
import axios from "axios";
import { toast } from "react-toastify";


const baseUrl = 'https://node-4-pdlj.onrender.com';

//Create user
const createUser = async (data) => {
    const forStudentsTable = {
        students_name: data.studentName,
        students_number: data.studentsNumber,
        studentsGrades: data.studentsGrades
      };

      const response = await axios.post(`${baseUrl}/students2`, forStudentsTable);
      return response.data;
}

export const useCreateUser = (onSuccess) => {
     return useMutation(async (data) => {
       return createUser(data);
     }, {
        onSuccess: (data) => {
            if (onSuccess) onSuccess(data); // Call onSuccess from a different file
          },
          onError: () => {
            toast.error("Failed to create user.");
          }
     });
}

//Update user
const updateUser = async (user, data) => {
  const forGradesTable = {
    students_name: user.students_name,
    students_id: user.students_id,
    studentsGrades: data.studentsGrades,
    students_number: data.studentsNumber,
  };

  await axios.put(`${baseUrl}/grades`, forGradesTable);
  return user.students_name;
}

export const useUpdateUser = (onSuccess) => {
    return useMutation(async ({ user, data }) => {
      return updateUser(user, data);
    }, {
      onSuccess: (data) => {
        if(onSuccess) return onSuccess(data);
      },
      onError: (error) => {
        console.error('Error submitting form:', error);
      }
    })
  };


//Delete user
  const deleteUser = async (student) => {
    await axios.delete(`${baseUrl}/students2/${student.students_id}`);
    return student;
  };

  export const useDeleteUser = (onSuccess, setFilteredData) => {
    return useMutation(async (data) => {
      return deleteUser(data);
    }, {
      onSuccess: (data) => {
        onSuccess?.(data);
        setFilteredData((previous) => previous.filter(previu => previu.students_id !== data?.student?.students_id));

      },
      onError: (error) => {
        console.error('Error delete user:', error);
      }
    })
  }