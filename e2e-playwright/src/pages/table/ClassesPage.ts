import { expect, Locator, Page, test } from '@playwright/test';
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
    await test.step('Open classes page', async () => {
      await this.goto();
      await expect(this.heading).toBeVisible();
    });
  }

  row(className: string): Locator {
    return this.rows.filter({ hasText: className });
  }

  async expectClassVisible(className: string) {
    await test.step(`Verify class "${className}" is listed`, async () => {
      await expect(this.row(className)).toBeVisible();
    });
  }

  async expectClassNotListed(className: string) {
    await test.step(`Verify class "${className}" is not listed`, async () => {
      await expect(this.row(className)).toHaveCount(0);
    });
  }
}
