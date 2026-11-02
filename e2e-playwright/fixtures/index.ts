import { test as base } from '@playwright/test';
import { ApiClient } from '../api/ApiClient';
import { analyzeFailure } from '../report/failureAnalysis';
import { LoginPage } from '../src/pages/login/LoginPage';
import { ClassesPage } from '../src/pages/table/ClassesPage';
import { ClassItem, Fixtures, UserOptions } from '../src/types/interfaces/interfaces';
import testRunData from '../testRunData/testRunData.json';
import { getAuthToken } from './authState';

// Unique per test and run, so parallel tests never share data
const uniqueName = (prefix: string) => `e2e-${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const test = base.extend<UserOptions & Fixtures>({
  // The user of the current Playwright project, set in playwright.config.ts
  user: [testRunData[0].user, { option: true }],

  // API client logged in as the current project's user (token from its auth.json)
  api: async ({ request }, use, testInfo) => {
    const api = new ApiClient(request);
    if (testInfo.project.use.storageState) api.setToken(getAuthToken(testInfo.project.name));
    await use(api);
  },
  // API client logged in as another project's user, e.g. to create data the current user must not see
  apiFor: async ({ request }, use) => {
    await use((project) => {
      const api = new ApiClient(request);
      api.setToken(getAuthToken(project));
      return api;
    });
  },

  // Every test creates its own classes; all of them are deleted when the test ends
  classFactory: async ({ api }, use) => {
    const created: { api: ApiClient; item: ClassItem }[] = [];
    await use({
      create: async (owner = api) => {
        const item = await owner.post<ClassItem>('/classes', { name: uniqueName('class') });
        created.push({ api: owner, item });
        return item;
      },
    });
    for (const { api: owner, item } of created) await owner.delete(`/classes/${item.id}`);
  },
  testClass: async ({ classFactory }, use) => {
    await use(await classFactory.create());
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  classesPage: async ({ page }, use) => {
    await use(new ClassesPage(page));
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
