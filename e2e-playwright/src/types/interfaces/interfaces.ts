import type { ApiClient } from '../../../api/ApiClient';
import type { LoginPage } from '../../pages/login/LoginPage';
import type { AllureStatus } from '../enums/enums';

export interface User {
  email: string;
  password: string;
}

export interface Fixtures {
  adminUser: User;
  api: ApiClient;
  loginPage: LoginPage;
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
}
