import fs from 'node:fs';
import path from 'node:path';
import { test as setup } from '@playwright/test';
import { ApiClient } from '../api/ApiClient';
import { authFile } from '../fixtures/authState';
import { LoginResponse } from '../src/types/interfaces/interfaces';
import testRunData from '../testRunData/testRunData.json';

// Logs in once per user and saves the session as that user's auth.json.
// The app keeps its session in localStorage (adminToken, adminEmail), so that is what we store.
for (const { project, user } of testRunData) {
  setup(`login as ${project} user`, async ({ request, baseURL }) => {
    const { token, email } = await new ApiClient(request).post<LoginResponse>('/auth/login', user);

    const file = authFile(project);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(
      file,
      JSON.stringify({
        cookies: [],
        origins: [
          {
            origin: new URL(baseURL!).origin,
            localStorage: [
              { name: 'adminToken', value: token },
              { name: 'adminEmail', value: email },
            ],
          },
        ],
      }),
    );
  });
}
