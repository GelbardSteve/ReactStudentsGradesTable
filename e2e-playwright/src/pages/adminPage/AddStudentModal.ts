import { Page } from "@playwright/test";

export class AddStudentModal {
    constructor(private page: Page) {}

    async open() {
        await this.page.getByTestId('addStudentButton').click();
    }

    async fill({ name, number, email, grades }: { name: string; number: number; email: string; grades: string }) {
        await this.page.getByLabel('Student Name').fill(name);
        await this.page.getByLabel('Student Number').fill(String(number));
        await this.page.getByLabel('Student Email').fill(email);
        await this.page.getByLabel('Student Info').fill(grades);
    }

    async submit() {
        await this.page.getByRole('button', { name: 'Create Student' }).click();
    }
}
