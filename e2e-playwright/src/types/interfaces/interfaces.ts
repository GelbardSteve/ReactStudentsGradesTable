import type { ApiClient } from '../../../api/ApiClient';
import type { LoginPage } from '../../pages/login/LoginPage';

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
