import { matchPath, useLocation } from 'react-router-dom';
import { CopilotKit, CopilotPopup, useAgentContext } from '@copilotkit/react-core/v2';
import '@copilotkit/react-core/v2/styles.css';
import { apiClient } from '../../api/client';
import { getToken } from '../auth/session';
import { AssistantTools } from './AssistantTools';

const RUNTIME_URL = `${apiClient.defaults.baseURL}/api/copilotkit`;

// Tells the agent which class page is open, so "add a student here" works
const CurrentPageContext = () => {
  const { pathname } = useLocation();
  const classId = matchPath('/classes/:classId', pathname)?.params.classId;

  useAgentContext({
    description: 'The page the admin is looking at',
    value: classId ? { page: 'class students', classId: Number(classId) } : { page: pathname },
  });
  return null;
};

// The AI chat popup. It sits next to the page rather than wrapping it: pages don't use CopilotKit,
// so this can load lazily. What the agent can read or change is decided by the server's tools, not here.
const Assistant = () => (
  <CopilotKit runtimeUrl={RUNTIME_URL} headers={{ Authorization: `Bearer ${getToken()}` }}>
    <CurrentPageContext />
    <AssistantTools />
    <CopilotPopup
      labels={{
        modalHeaderTitle: 'Class Assistant',
        welcomeMessageText: 'Ask about your classes and students, or ask me to add, update, delete or favorite them.',
        chatInputPlaceholder: 'e.g. Who are my favorite students?',
      }}
    />
  </CopilotKit>
);

// Default export for React.lazy
export default Assistant;
