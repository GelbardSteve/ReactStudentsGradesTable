import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class ClassesPage extends BasePage {
  protected readonly path = '/#/classes';

  readonly heading: Locator;
  readonly rows: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'My Classes' });
    this.rows = page.getByTestId('classRow');
  }

  async open() {
    await this.goto();
    await expect(this.heading).toBeVisible();
  }

  row(className: string): Locator {
    return this.rows.filter({ hasText: className });
  }

  async expectClassVisible(className: string) {
    await expect(this.row(className)).toBeVisible();
  }

  async expectClassNotListed(className: string) {
    await expect(this.row(className)).toHaveCount(0);
  }
}
