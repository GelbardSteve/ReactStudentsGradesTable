import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { apiClient, getErrorMessage } from '../../api/client';
import { CLASSES_KEY } from '../classes/useClasses';

// All student queries share the ['students'] prefix, so one invalidation refreshes every class and favorites
const STUDENTS_KEY = ['students'];
export const classStudentsKey = (classId) => [...STUDENTS_KEY, 'class', classId];
const FAVORITES_KEY = [...STUDENTS_KEY, 'favorites'];

const undoButtonStyle = {
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
  fontFamily: 'inherit',
};

// Students of one class (pass a classId), plus the mutations every student view needs.
// Without a classId the list query is skipped, e.g. for FavoriteButton or the edit modal.
export const useStudents = (classId) => {
  const queryClient = useQueryClient();

  const { data: allStudents = [], isLoading, error } = useQuery({
    queryKey: classStudentsKey(classId),
    queryFn: async () => (await apiClient.get(`/classes/${classId}/students`)).data,
    enabled: Boolean(classId),
  });

  const refreshStudents = () => queryClient.invalidateQueries(STUDENTS_KEY);

  const createStudentMutation = useMutation({
    mutationFn: async ({ classId: targetClassId, student }) =>
      (await apiClient.post(`/classes/${targetClassId}/students`, student)).data,
    onSuccess: () => {
      refreshStudents();
      // The classes table shows a student count
      queryClient.invalidateQueries(CLASSES_KEY);
      toast.success('Student created successfully');
    },
    onError: (err) => toast.error(getErrorMessage(err, 'Failed to create student')),
  });

  const updateStudentMutation = useMutation({
    mutationFn: async ({ id, data }) => (await apiClient.put(`/students/${id}`, data)).data,
    onSuccess: () => {
      refreshStudents();
      toast.success('Student updated successfully');
    },
    onError: (err) => toast.error(getErrorMessage(err, 'Failed to update student')),
  });

  const deleteStudentMutation = useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/students/${id}`);
      return id;
    },
    onSuccess: () => {
      refreshStudents();
      queryClient.invalidateQueries(CLASSES_KEY);
      toast.success('Student deleted successfully');
    },
    onError: (err) => toast.error(getErrorMessage(err, 'Failed to delete student')),
  });

  const sendGradesMutation = useMutation({
    mutationFn: async (student) => (await apiClient.post(`/students/${student.id}/send-grades`)).data,
    onSuccess: (data, student) => {
      refreshStudents();
      toast.success(`Grades sent to ${student.email}`);
    },
    onError: (err) => toast.error(getErrorMessage(err, 'Failed to send grades')),
  });

  const updateFavoritesMutation = useMutation({
    mutationFn: async ({ student, favorites }) =>
      (await apiClient.post(`/students/${student.id}/favorite`, { favorites })).data,
    onSuccess: (data, { student, favorites }) => {
      refreshStudents();

      const undoAction = (
        <button
          style={undoButtonStyle}
          onClick={() => updateFavoritesMutation.mutate({ student, favorites: !favorites })}
        >
          Undo
        </button>
      );

      toast.success(
        <span>
          {student.name} was {favorites ? 'added to' : 'removed from'} favorites
          {!favorites && undoAction}
        </span>,
        { autoClose: 3000, closeButton: true }
      );
    },
    onError: (err) => toast.error(getErrorMessage(err, 'Failed to update favorites')),
  });

  return {
    allStudents,
    isLoading,
    error,
    createStudent: createStudentMutation.mutate,
    updateStudent: updateStudentMutation.mutate,
    deleteStudent: deleteStudentMutation.mutate,
    sendGrades: sendGradesMutation.mutate,
    toggleFavorite: (student) => updateFavoritesMutation.mutate({ student, favorites: !student.favorites }),
    isCreating: createStudentMutation.isLoading,
    isUpdating: updateStudentMutation.isLoading,
    isDeleting: deleteStudentMutation.isLoading,
    // The id of the student whose email is being sent, so only that row's button shows a spinner
    sendingGradesId: sendGradesMutation.isLoading ? sendGradesMutation.variables?.id : null,
    isUpdatingFavorites: updateFavoritesMutation.isLoading,
  };
};

// Favorite students across all of the admin's classes, with the class name
export const useFavoriteStudents = () => {
  const { data: favorites = [], isLoading, error } = useQuery({
    queryKey: FAVORITES_KEY,
    queryFn: async () => (await apiClient.get('/students/favorites')).data,
  });
  return { favorites, isLoading, error };
};
