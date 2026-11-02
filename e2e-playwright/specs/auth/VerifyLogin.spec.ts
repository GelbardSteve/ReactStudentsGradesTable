import * as allure from 'allure-js-commons';
import { expect, test } from '../../fixtures';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await allure.epic('Auth');
    await allure.feature('Login');
    await loginPage.open();
  });

  test('admin can log in with valid credentials', async ({ page, loginPage, user }) => {
    await allure.severity(allure.Severity.BLOCKER);
    await loginPage.login(user);

    await expect(page).toHaveURL(/#\/classes$/);
    expect(await page.evaluate(() => localStorage.getItem('adminToken'))).toBeTruthy();
  });

  test('wrong password shows an error', async ({ page, loginPage, user }) => {
    await allure.severity(allure.Severity.CRITICAL);
    await loginPage.login({ email: user.email, password: `${user.password}-wrong` });

    await loginPage.expectError('Invalid email or password');
    await expect(page).toHaveURL(/#\/$/);
  });

  test('Sign In is disabled when fields are empty', async ({ loginPage }) => {
    await allure.severity(allure.Severity.NORMAL);
    await loginPage.expectSubmitDisabled();
  });
});
