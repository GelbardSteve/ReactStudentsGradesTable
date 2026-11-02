import fs from 'node:fs';
import path from 'node:path';
import type { BrowserContext } from '@playwright/test';

type StorageState = Awaited<ReturnType<BrowserContext['storageState']>>;

// Each user logs in once (specs/auth.setup.ts) and its session is saved here as Playwright storageState
export const authFile = (project: string) => path.resolve(__dirname, `../../.auth/${project}.auth.json`);

// The API token is the adminToken the app keeps in localStorage, read from the user's auth.json
export const getAuthToken = (project: string): string => {
  const state: StorageState = JSON.parse(fs.readFileSync(authFile(project), 'utf-8'));
  const token = state.origins
    .flatMap((origin) => origin.localStorage)
    .find((item) => item.name === 'adminToken')?.value;
  if (!token) throw new Error(`No adminToken in ${authFile(project)}`);
  return token;
};
