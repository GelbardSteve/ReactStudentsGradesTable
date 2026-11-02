import type { ApiClient } from '../../../api/ApiClient';
import type { LoginPage } from '../../pages/login/LoginPage';
import type { ClassesPage } from '../../pages/table/ClassesPage';
import type { AllureStatus } from '../enums/enums';

export interface User {
  email: string;
  password: string;
}

// One entry of testRunData.json: a user and the project (specs folder) it owns
export interface TestRunProject {
  project: string;
  specs: string;
  user: User;
}

// Set per Playwright project in playwright.config.ts
export interface UserOptions {
  user: User;
}

export interface LoginResponse {
  token: string;
  email: string;
}

export interface ClassItem {
  id: number;
  name: string;
}

// Creates classes for a test and deletes them all when the test ends
export interface ClassFactory {
  create(api?: ApiClient): Promise<ClassItem>;
}

export interface Fixtures {
  api: ApiClient;
  apiFor: (project: string) => ApiClient;
  classFactory: ClassFactory;
  testClass: ClassItem;
  loginPage: LoginPage;
  classesPage: ClassesPage;
  failureAnalysis: void;
}

export interface GeminiResponse {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
  error?: { message?: string };
}

// allure-report/widgets/summary.json
export interface AllureReportSummary {
  statistic: Record<AllureStatus, number> & { total: number };
  time: { duration: number };
}

// allure-report/data/test-cases/*.json
export interface AllureTestCase {
  fullName: string;
  status: AllureStatus;
  retry: boolean;
  flaky: boolean;
  time: { duration: number };
  statusMessage?: string;
  descriptionHtml?: string;
  labels: { name: string; value: string }[];
}
