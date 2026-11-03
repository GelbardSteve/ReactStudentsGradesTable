import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ToolCallStatus, useHumanInTheLoop, useRenderTool } from '@copilotkit/react-core/v2';
import { z } from 'zod';
import { apiClient, getErrorMessage } from '../../api/client';
import { Button } from '../../components/Button/Button';
import { CLASSES_KEY } from '../classes/useClasses';
import { StyledConfirmCard, StyledToolStatus } from './Assistant.styles';

const STUDENTS_KEY = ['students'];

// Server tools that change data, with the text shown in the chat while they run
const WRITE_TOOLS = {
  createClass: 'Creating class',
  renameClass: 'Renaming class',
  createStudent: 'Adding student',
  updateStudent: 'Updating student',
  setFavorite: 'Updating favorites',
};

const parseResult = (result) => {
  try {
    return typeof result === 'string' ? JSON.parse(result) : result ?? {};
  } catch {
    return {};
  }
};

// Refreshes the tables once the server tool finished, so the page behind the chat shows the change
const WriteToolStatus = ({ label, status, result }) => {
  const queryClient = useQueryClient();
  const done = status === ToolCallStatus.Complete;
  const error = done ? parseResult(result).error : null;

  useEffect(() => {
    if (done && !error) {
      queryClient.invalidateQueries(CLASSES_KEY);
      queryClient.invalidateQueries(STUDENTS_KEY);
    }
  }, [done, error, queryClient]);

  if (!done) return <StyledToolStatus>{label}…</StyledToolStatus>;
  return <StyledToolStatus>{error ? `${label} failed: ${error}` : `${label}: done`}</StyledToolStatus>;
};

// Deletes only ever happen here, after the admin clicks Delete. The server has no delete tool for the model.
const ConfirmDelete = ({ what, name, path, status, respond, result }) => {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  if (status === ToolCallStatus.Complete) {
    const { deleted, error } = parseResult(result);
    return <StyledToolStatus>{deleted ? `Deleted ${what} "${name}"` : error || 'Deletion cancelled'}</StyledToolStatus>;
  }
  if (status !== ToolCallStatus.Executing || !respond) {
    return <StyledToolStatus>Preparing confirmation…</StyledToolStatus>;
  }

  const confirm = async () => {
    setIsDeleting(true);
    try {
      await apiClient.delete(path);
      queryClient.invalidateQueries(CLASSES_KEY);
      queryClient.invalidateQueries(STUDENTS_KEY);
      respond({ deleted: true });
    } catch (err) {
      respond({ deleted: false, error: getErrorMessage(err, `Failed to delete the ${what}`) });
    }
  };

  return (
    <StyledConfirmCard data-test-specifier={`assistant-confirm-delete-${what}`}>
      <p>
        Delete {what} <strong>{name}</strong>?
        {what === 'class' && ' All of its students will be deleted too.'}
      </p>
      <div>
        <Button buttonType="danger" onClick={confirm} isLoading={isDeleting} disabled={isDeleting}>
          Delete
        </Button>
        <Button buttonType="secondary" onClick={() => respond({ deleted: false })} disabled={isDeleting}>
          Cancel
        </Button>
      </div>
    </StyledConfirmCard>
  );
};

// Registers the browser-side tools and the renderers for the server's write tools
export const AssistantTools = () => {
  useHumanInTheLoop(
    {
      name: 'confirmDeleteClass',
      description: 'Ask the admin to confirm deleting a class (and all its students). Deletes it only if they confirm.',
      parameters: z.object({ classId: z.number().int().positive(), className: z.string() }),
      render: ({ args, status, respond, result }) => (
        <ConfirmDelete
          what="class"
          name={args?.className}
          path={`/classes/${args?.classId}`}
          status={status}
          respond={respond}
          result={result}
        />
      ),
    },
    []
  );

  useHumanInTheLoop(
    {
      name: 'confirmDeleteStudent',
      description: 'Ask the admin to confirm deleting a student. Deletes them only if they confirm.',
      parameters: z.object({ studentId: z.number().int().positive(), studentName: z.string() }),
      render: ({ args, status, respond, result }) => (
        <ConfirmDelete
          what="student"
          name={args?.studentName}
          path={`/students/${args?.studentId}`}
          status={status}
          respond={respond}
          result={result}
        />
      ),
    },
    []
  );

  return Object.entries(WRITE_TOOLS).map(([name, label]) => <WriteToolRenderer key={name} name={name} label={label} />);
};

// One hook call per tool, so the list above can stay a plain object
const WriteToolRenderer = ({ name, label }) => {
  useRenderTool(
    {
      name,
      parameters: z.object({}).passthrough(),
      render: ({ status, result }) => <WriteToolStatus label={label} status={status} result={result} />,
    },
    [name, label]
  );
  return null;
};
