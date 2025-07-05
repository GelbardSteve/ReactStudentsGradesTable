import { useCallback, useState } from 'react';

// Custom hook for managing modal states (create & edit)
export const useModal = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const openCreate = useCallback(() => setIsCreateOpen(true), []);
  const closeCreate = useCallback(() => setIsCreateOpen(false), []);

  const openEdit = useCallback((user) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  }, []);
  const closeEdit = useCallback(() => setIsEditOpen(false), []);

  return { isCreateOpen, isEditOpen, selectedUser, openCreate, closeCreate, openEdit, closeEdit };
};
