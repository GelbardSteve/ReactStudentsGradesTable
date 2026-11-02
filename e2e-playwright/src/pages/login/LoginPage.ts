import { expect, Locator, Page } from '@playwright/test';
import { User } from '../../types/interfaces/interfaces';
import { BasePage } from '../BasePage';

export class LoginPage extends BasePage {
  // HashRouter: the login page is the root route
  protected readonly path = '/#/';

  readonly loginTab: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    super(page);
    this.loginTab = page.getByTestId('login-to-admin-button');
    this.emailInput = page.getByTestId('usernameInput');
    this.passwordInput = page.getByTestId('passwordInput');
    this.submitButton = page.getByTestId('submitButton');
    this.errorAlert = page.getByRole('alert');
  }

  async open() {
    await this.goto();
    await expect(this.loginTab).toBeVisible();
  }

  async fillCredentials({ email, password }: Pick<User, 'email' | 'password'>) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async login(user: Pick<User, 'email' | 'password'>) {
    await this.fillCredentials(user);
    await this.submitButton.click();
  }

  async expectError(message: string) {
    await expect(this.errorAlert).toHaveText(message);
  }

  async expectSubmitDisabled() {
    await expect(this.submitButton).toBeDisabled();
  }
}
