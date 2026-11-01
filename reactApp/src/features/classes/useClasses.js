import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { apiClient, getErrorMessage } from '../../api/client';

export const CLASSES_KEY = ['classes'];

export const useClasses = () => {
  const queryClient = useQueryClient();

  const { data: classes = [], isLoading, error } = useQuery({
    queryKey: CLASSES_KEY,
    queryFn: async () => (await apiClient.get('/classes')).data,
  });

  const refresh = () => queryClient.invalidateQueries(CLASSES_KEY);

  const createClassMutation = useMutation({
    mutationFn: async (name) => (await apiClient.post('/classes', { name })).data,
    onSuccess: () => {
      refresh();
      toast.success('Class created');
    },
    onError: (err) => toast.error(getErrorMessage(err, 'Failed to create class')),
  });

  const renameClassMutation = useMutation({
    mutationFn: async ({ id, name }) => (await apiClient.put(`/classes/${id}`, { name })).data,
    onSuccess: () => {
      refresh();
      toast.success('Class renamed');
    },
    onError: (err) => toast.error(getErrorMessage(err, 'Failed to rename class')),
  });

  const deleteClassMutation = useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/classes/${id}`);
      return id;
    },
    onSuccess: (id) => {
      refresh();
      queryClient.removeQueries(['students', 'class', id]);
      // Favorites may have included students of the deleted class
      queryClient.invalidateQueries(['students', 'favorites']);
      toast.success('Class deleted');
    },
    onError: (err) => toast.error(getErrorMessage(err, 'Failed to delete class')),
  });

  return {
    classes,
    isLoading,
    error,
    createClass: createClassMutation.mutate,
    renameClass: renameClassMutation.mutate,
    deleteClass: deleteClassMutation.mutate,
    isSaving: createClassMutation.isLoading || renameClassMutation.isLoading,
  };
};

// A single class, used for the header of the class's students page
export const useClass = (classId) =>
  useQuery({
    queryKey: [...CLASSES_KEY, classId],
    queryFn: async () => (await apiClient.get(`/classes/${classId}`)).data,
    enabled: Boolean(classId),
  });
