import fs from 'node:fs';
import path from 'node:path';
import type { Page, TestInfo } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { GeminiResponse } from '../src/types/interfaces/interfaces';

/*
 * When a test fails, we collect everything needed to understand why
 * (what the test intended, what actually happened, what the page showed),
 * ask Gemini (free tier) to explain it, and put both in the Allure test description.
 * Note: on the free tier Google may use the sent content to improve its products - never send secrets.
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? 'gemini-3.5-flash-lite';

// What the AI needs to know about this project to read the test code correctly
const PROJECT_CONTEXT = `
- App: admin dashboard for classes and students (React, HashRouter). Login page is "/#/", after login the app goes to "/#/classes".
- Each admin user sees and changes only their own classes and students.
- Tests run per Playwright project; each project belongs to one user and starts already logged in as that user (except the "auth" project).
- Fixture "user": the VALID credentials of the current project's user.
- Fixture "api": API client logged in as the current user; "apiFor(project)": API client logged in as another project's user.
- Fixtures "testClass" / "classFactory.create()": classes created for this test only (unique "e2e-..." names), deleted after the test.
- Fixture "loginPage": login() fills email + password and clicks Sign In; expectError() checks the alert text.
  An error alert is shown only when login fails ("Invalid email or password").
- Fixture "classesPage": the "My Classes" table; expectClassVisible / expectClassNotListed check rows by class name.
`;

const INSTRUCTIONS = `You are a senior QA automation engineer analyzing a failed Playwright E2E test.
Think it through using these questions before answering:
1. Based on the test title, what scenario should happen?
2. Read the test code line by line: what values does it actually pass? Do they match the scenario in the title?
3. Look at the URL and page at the moment of failure: which state did the app actually reach?
4. Is the cause a bug in the test code, a bug in the app, or an environment problem?
Then answer in exactly this format, short and specific (quote the exact code line when relevant):
What failed: <one sentence>
Root cause: <one or two sentences>
Fix: <one sentence>`;

export const analyzeFailure = async (page: Page, testInfo: TestInfo) => {
  const context = await collectFailureContext(page, testInfo);

  // The AI call must not fail the test on timeout
  testInfo.setTimeout(testInfo.timeout + 30_000);
  const analysis = await askAi(context);

  await allure.descriptionHtml(
    `<h3>AI failure analysis</h3>
     <pre>${escapeHtml(analysis ?? 'AI analysis is not available (missing GEMINI_API_KEY or request failed). Paste the context below into any AI agent.')}</pre>
     <details><summary>Failure context (what the AI received)</summary><pre>${escapeHtml(context)}</pre></details>`,
  );
};

const collectFailureContext = async (page: Page, testInfo: TestInfo): Promise<string> => {
  const error = stripColors(testInfo.errors.map((e) => e.message ?? '').join('\n\n'));
  const pageSnapshot = await page.locator('body').ariaSnapshot({ timeout: 5_000 }).catch(() => 'unavailable');

  return `## Project context
${PROJECT_CONTEXT}
## Test
${testInfo.titlePath.slice(1).join(' > ')}
(${path.relative(process.cwd(), testInfo.file)}:${testInfo.line})

## Test code
\`\`\`ts
${readTestCode(testInfo.file, testInfo.line)}
\`\`\`

## Error
${error}

## Page at the moment of failure
URL: ${page.url()}
\`\`\`yaml
${pageSnapshot.slice(0, 3_000)}
\`\`\`
`;
};

// The test(...) block that failed: from its first line until the closing line at the same indentation
const readTestCode = (file: string, line: number): string => {
  const lines = fs.readFileSync(file, 'utf-8').split('\n').slice(line - 1);
  const indent = lines[0].match(/^\s*/)?.[0] ?? '';
  const end = lines.findIndex((l, i) => i > 0 && l.startsWith(`${indent}}`));
  return lines.slice(0, end + 1).join('\n');
};

const askAi = async (context: string): Promise<string | undefined> => {
  if (!GEMINI_API_KEY) return undefined;
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: 'POST',
        signal: AbortSignal.timeout(25_000),
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_API_KEY },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: INSTRUCTIONS }] },
          contents: [{ parts: [{ text: context }] }],
          generationConfig: { thinkingConfig: { thinkingLevel: 'low' } },
        }),
      },
    );
    const data = (await response.json()) as GeminiResponse;
    if (!response.ok) return `AI request failed: ${data.error?.message ?? response.status}`;
    return data.candidates?.[0]?.content?.parts?.map((part) => part.text).join('').trim();
  } catch (error) {
    return `AI request failed: ${(error as Error).message}`;
  }
};

// eslint-disable-next-line no-control-regex -- removes terminal colors from Playwright errors
const stripColors = (text: string) => text.replace(/\u001b\[[0-9;]*m/g, '');

const escapeHtml = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
