import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

import { defineConfig, devices } from '@playwright/test';
import { authFile } from './src/utils/authState';
import { UserOptions } from './src/types/interfaces/interfaces';
import testRunData from './testRunData/testRunData.json';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<UserOptions>({
  testDir: './specs',
  testMatch: '**/*.spec.ts',
  globalTeardown: './global-teardown.ts',
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 4,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['allure-playwright', { resultsDir: 'allure-results' }],
  ],

  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
    testIdAttribute: 'data-test-specifier',
    headless: true,
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [
    // Logs in once per user and saves each user's auth.json
    { name: 'setup', testMatch: /auth\.setup\.ts/ },

    // Login tests must start logged out: no saved session
    { name: 'auth', testDir: './specs/auth', use: { ...devices['Desktop Chrome'], user: testRunData[0].user } },

    // One project per user, from testRunData.json; all run in parallel
    ...testRunData.map(({ project, specs, user }) => ({
      name: project,
      testDir: path.resolve(__dirname, specs),
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], storageState: authFile(project), user },
    })),
  ],
});
