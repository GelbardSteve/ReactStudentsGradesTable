import { test as base } from '@playwright/test';
import { ApiClient } from '../api/ApiClient';
import { analyzeFailure } from '../report/failureAnalysis';
import { LoginPage } from '../src/pages/login/LoginPage';
import { Fixtures } from '../src/types/interfaces/interfaces';
import testRunData from '../testRunData/testRunData.json';

export const test = base.extend<Fixtures>({
  // eslint-disable-next-line no-empty-pattern -- Playwright fixtures require object destructuring
  adminUser: async ({}, use) => {
    const [user] = testRunData;
    if (!user) throw new Error('testRunData.json has no users');
    await use(user);
  },
  api: async ({ request }, use) => {
    await use(new ApiClient(request));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  // Runs for every test: on failure, adds a Gemini explanation to the Allure test description
  failureAnalysis: [
    async ({ page }, use, testInfo) => {
      await use();
      if (testInfo.status !== testInfo.expectedStatus) await analyzeFailure(page, testInfo);
    },
    { auto: true },
  ],
});

export { expect } from '@playwright/test';
