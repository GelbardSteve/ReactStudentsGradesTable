import { APIRequestContext, APIResponse, expect } from '@playwright/test';

export const API_URL = process.env.API_URL ?? 'http://localhost:4000';

export class ApiClient {
  private token?: string;

  constructor(private readonly request: APIRequestContext) {}

  setToken(token: string) {
    this.token = token;
  }

  async post<T>(path: string, data?: unknown): Promise<T> {
    const response = await this.request.post(`${API_URL}${path}`, { data, headers: this.headers() });
    return this.parse<T>(response);
  }

  async get<T>(path: string): Promise<T> {
    const response = await this.request.get(`${API_URL}${path}`, { headers: this.headers() });
    return this.parse<T>(response);
  }

  async delete<T>(path: string): Promise<T> {
    const response = await this.request.delete(`${API_URL}${path}`, { headers: this.headers() });
    return this.parse<T>(response);
  }

  private headers(): Record<string, string> {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  private async parse<T>(response: APIResponse): Promise<T> {
    expect(response, `${response.url()} -> ${response.status()}`).toBeOK();
    return response.json() as Promise<T>;
  }
}
