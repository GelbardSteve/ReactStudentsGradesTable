import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://node-4-pdlj.onrender.com';

// Students data management with React Query
export const useStudents = () => {
  const queryClient = useQueryClient();

  // Get all students
  const { data: allStudents = [], isLoading, error } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      console.log('Fetching students from API...'); // Debug log
      try {
        const response = await axios.get(`${API_BASE_URL}/students2`);
        console.log('API Response:', response.data); // Debug log
        const students = response.data?.items || [];
        console.log('Processed students:', students); // Debug log
        return students;
      } catch (error) {
        console.error('Error fetching students:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  // Create student mutation
  const createStudentMutation = useMutation({
    mutationFn: async (newStudent) => {
      console.log('Creating student:', newStudent); // Debug log
      
      // Transform the data to match the server's expected format
      const serverData = {
        students_name: newStudent.studentName,
        students_number: newStudent.studentsNumber,
        studentsGrades: newStudent.studentsGrades
      };
      
      console.log('Sending to server:', serverData); // Debug log
      const response = await axios.post(`${API_BASE_URL}/students2`, serverData);
      console.log('Server response:', response.data); // Debug log
      return response.data;
    },
    onSuccess: (newStudent) => {
      console.log('Student created successfully:', newStudent); // Debug log
      // Invalidate and refetch the students query to get the latest data
      queryClient.invalidateQueries(['students']);
      toast.success('Student created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create student');
      console.error('Create student error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
    },
  });

  // Update student grades mutation (server only supports updating grades)
  const updateStudentMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      // The server only supports updating grades, not student names or numbers
      const response = await axios.put(`${API_BASE_URL}/grades`, {
        students_id: id,
        studentsGrades: data.studentsGrades
      });
      return response.data;
    },
    onSuccess: (updatedData, variables) => {
      // Update the cache with the new grades data
      queryClient.setQueryData(['students'], (oldData) =>
        (oldData || []).map(student =>
          student.students_id === variables.id 
            ? { ...student, studentsGrades: variables.data.studentsGrades }
            : student
        )
      );
      toast.success('Student grades updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update student grades');
      console.error('Update student error:', error);
    },
  });

  // Delete student mutation
  const deleteStudentMutation = useMutation({
    mutationFn: async (studentId) => {
      console.log('Deleting student with ID:', studentId); // Debug log
      const response = await axios.delete(`${API_BASE_URL}/students2/${studentId}`);
      console.log('Delete response:', response.data); // Debug log
      return studentId;
    },
    onSuccess: (deletedId) => {
      console.log('Student deleted successfully, updating cache for ID:', deletedId); // Debug log
      queryClient.setQueryData(['students'], (oldData) =>
        (oldData || []).filter(student => student.students_id !== deletedId)
      );
      toast.success('Student deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete student');
      console.error('Delete student error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
    },
  });

  // Update favorites mutation
  const updateFavoritesMutation = useMutation({
    mutationFn: async ({ students_number, favorites }) => {
      const response = await axios.post(`${API_BASE_URL}/favorites`, {
        id: students_number,
        favorites,
      });
      return response.data;
    },
    onSuccess: (updatedData, variables) => {
      // Update the cache with the new favorites data
      queryClient.setQueryData(['students'], (oldData) =>
        (oldData || []).map(student =>
          student.students_number === variables.students_number 
            ? { ...student, favorites: variables.favorites }
            : student
        )
      );

      // Create undo function
      const undoFavorite = () => {
        updateFavoritesMutation.mutate({
          students_number: variables.students_number,
          favorites: !variables.favorites
        });
      };

      // Find the user for the toast message
      const user = queryClient.getQueryData(['students'])?.find(
        student => student.students_number === variables.students_number
      );

      if (user) {
        const undoAction = (
          <button
            style={{
              background: 'transparent',
              border: '2px solid #667eea',
              color: '#667eea',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              marginLeft: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              transition: 'all 0.3s ease',
              fontFamily: 'inherit'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#667eea';
              e.target.style.color = 'white';
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#667eea';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
            onClick={undoFavorite}
          >
            Undo
          </button>
        );

        toast.success(
          <span>
            User {user.students_name} was {variables.favorites ? 'added to' : 'removed from'} favorites 
            {!variables.favorites && undoAction}
          </span>,
          {
            autoClose: 3000,
            closeButton: true,
          }
        );
      }
    },
    onError: (error) => {
      toast.error('Failed to update favorites');
      console.error('Update favorites error:', error);
    },
  });

  // Search students
  const searchStudents = async (searchTerm) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/students2/search/${searchTerm}`);
      return response.data === 'NotFound' ? [] : response.data;
    } catch (error) {
      console.error('Search students error:', error);
      return [];
    }
  };

  return {
    allStudents,
    isLoading,
    error,
    createStudent: createStudentMutation.mutate,
    updateStudent: updateStudentMutation.mutate,
    deleteStudent: deleteStudentMutation.mutate,
    updateFavorites: updateFavoritesMutation.mutate,
    toggleFavorite: (student) => {
      updateFavoritesMutation.mutate({
        students_number: student.students_number,
        favorites: !student.favorites
      });
    },
    searchStudents,
    isCreating: createStudentMutation.isLoading,
    isUpdating: updateStudentMutation.isLoading,
    isDeleting: deleteStudentMutation.isLoading,
    isUpdatingFavorites: updateFavoritesMutation.isLoading,
  };
}; 