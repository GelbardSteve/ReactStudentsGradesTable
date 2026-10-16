// specs/global.setup.ts
import { expect, test as setup } from "@playwright/test";
import path from "path";
import { LoginPageClass } from "../src/pages/login/LoginPage";
import { getMetadata } from "../src/utils/utils";

// Where the two files will be written
const authFile = path.join(__dirname, "../auth.json");

setup("login and save state + user data", async ({ page }) => {
  const loginPage = new LoginPageClass(page);
  const userInfo = getMetadata();
  await loginPage.login(userInfo);

  // Fail fast if login didn't store an auth token (e.g. the API is unreachable)
  const tokenKey = userInfo.isAdmin ? "adminAuthentication" : "studentAuthentication";
  await expect
    .poll(() => page.evaluate((key) => localStorage.getItem(key), tokenKey), {
      message: `Login failed: '${tokenKey}' was not saved in localStorage`,
    })
    .toBeTruthy();

  await page.context().storageState({ path: authFile });
});
