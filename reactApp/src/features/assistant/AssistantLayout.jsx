import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

// CopilotKit is large; load it only when a page with the chat is first opened
const Assistant = lazy(() => import('./Assistant'));

// Layout route for pages that get the AI chat. Pages opt in by being nested under it in App.js.
// The chat stays mounted while moving between these pages, so the conversation is kept.
export const AssistantLayout = () => (
  <>
    <Outlet />
    <Suspense fallback={null}>
      <Assistant />
    </Suspense>
  </>
);
