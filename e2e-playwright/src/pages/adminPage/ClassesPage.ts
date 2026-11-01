import { Page } from "@playwright/test";
import { UI_BASE_URL } from "../../utils/constants";

export class ClassesPage {
    constructor(private page: Page) {}

    async goto() {
        await this.page.goto(`${UI_BASE_URL}/#/classes`);
    }

    classRow(name: string) {
        return this.page.getByTestId('classRow').filter({ hasText: name });
    }

    // Columns: name, students, created, rename, delete
    studentCountCell(name: string) {
        return this.classRow(name).locator('td').nth(1);
    }

    async openClass(name: string) {
        await this.classRow(name).click();
    }
}
