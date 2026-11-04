import { Button } from '../../components/Button/Button';
import { CustomModal } from '../../components/Modal/Modal';
import { GradesEmpty, GradesFooter, GradesList } from './GradesModal.styles';
import { useStudents } from './useStudents';

// Grades are free text like "Algebra: 92, Geometry: 88". Split it into rows sorted by subject;
// a piece without "subject: grade" is kept as a row with only a subject.
const parseGrades = (grades = '') =>
  grades
    .split(/[,\n]/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [subject, ...rest] = part.split(':');
      return { subject: subject.trim(), grade: rest.join(':').trim() };
    })
    .sort((a, b) => a.subject.localeCompare(b.subject));

// Shows one student's grades; sending them by email happens only from here
export const GradesModal = ({ student, onClose }) => {
  const { sendGrades, sendingGradesId } = useStudents();
  const rows = parseGrades(student.grades ?? '');
  const isSending = sendingGradesId === student.id;

  return (
    <CustomModal isModalOpen handleCloseTheModal={onClose} header={`${student.name}'s grades`}>
      {rows.length ? (
        <GradesList>
          <thead>
            <tr>
              <th scope="col">Subject</th>
              <th scope="col">Grade</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ subject, grade }, index) => (
              <tr key={`${subject}-${index}`}>
                <td>{subject}</td>
                <td>{grade || '—'}</td>
              </tr>
            ))}
          </tbody>
        </GradesList>
      ) : (
        <GradesEmpty>No grades yet</GradesEmpty>
      )}

      <GradesFooter>
        <div>
          <span>Send to {student.email}</span>
          <small>
            {student.last_emailed_at
              ? `Last sent ${new Date(student.last_emailed_at).toLocaleString()}`
              : 'Not sent yet'}
          </small>
        </div>
        <Button
          buttonType="primary"
          onClick={() => sendGrades(student, { onSuccess: onClose })}
          disabled={isSending || !rows.length}
          dataTestSpecifier="sendGradesButton"
        >
          {isSending ? 'Sending...' : 'Send Grades'}
        </Button>
      </GradesFooter>
    </CustomModal>
  );
};
