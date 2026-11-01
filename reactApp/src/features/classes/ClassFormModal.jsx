import { Controller, useForm } from 'react-hook-form';
import { CustomModal } from '../../components/Modal/Modal';
import { ModalForm } from '../students/StudentModal.styles';
import { useClasses } from './useClasses';

// Create a class, or rename one when `classItem` is given
export const ClassFormModal = ({ classItem, onClose }) => {
  const { createClass, renameClass, isSaving } = useClasses();
  const isEdit = Boolean(classItem);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: 'onChange', defaultValues: { name: classItem?.name ?? '' } });

  const onSubmit = ({ name }) => {
    // Close only on success so the admin keeps their input if the request fails
    if (isEdit) {
      renameClass({ id: classItem.id, name }, { onSuccess: onClose });
    } else {
      createClass(name, { onSuccess: onClose });
    }
  };

  return (
    <CustomModal isModalOpen={true} handleCloseTheModal={onClose} header={isEdit ? 'Rename Class' : 'Create New Class'}>
      <ModalForm>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="className">Class Name</label>
            <Controller
              name="name"
              control={control}
              rules={{
                required: 'Class name is required',
                maxLength: { value: 100, message: 'Name cannot exceed 100 characters' },
                validate: (value) => value.trim().length > 0 || 'Class name is required',
              }}
              render={({ field }) => (
                <>
                  <input
                    {...field}
                    id="className"
                    type="text"
                    placeholder="e.g. Math 101"
                    className={errors.name ? 'error' : ''}
                    data-test-specifier="classNameInput"
                  />
                  {errors.name && <div className="error-message">{errors.name.message}</div>}
                </>
              )}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-success"
              disabled={!isValid || isSaving}
              data-test-specifier="saveClassButton"
            >
              {isSaving ? 'Saving...' : isEdit ? 'Rename Class' : 'Create Class'}
            </button>
          </div>
        </form>
      </ModalForm>
    </CustomModal>
  );
};
