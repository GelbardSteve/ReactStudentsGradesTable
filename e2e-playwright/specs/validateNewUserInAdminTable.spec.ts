import { expect, test } from '@playwright/test';
import { randomInt, randomUUID } from "node:crypto";
import { testDescribe } from "../fixtures/testDescribe";
import { createNewUser } from "../src/api/newUser";
import { UI_BASE_URL } from '../src/utils/constants';
import { AdminTable } from '../src/pages/adminPage/AdminTable';


testDescribe('Create New Student and login to student table', async ({ page }) => { 
    const adminTable = new AdminTable(page);

    const students_number = randomInt(100, 1_000_000);
    const students_name = `e2e-user-${randomUUID().slice(0, 8)}`;
    const studentsGrades = 'new student grades';

    const { status } = await createNewUser({
        students_name,
        students_number,
        studentsGrades,
    });

    await test.step('Verify creating user status code 200', () => {
        expect(status).toBe(200);
    });

    await test.step(`Go to ${`${UI_BASE_URL}`}`, async () => {
        await page.goto(`${UI_BASE_URL}`)
    });

    await test.step(`Search new created user: ${students_name}`, async () => {
        await adminTable.search.input.fill(students_name)
    })

    await test.step('Verify new user is shown in the table', async () => {
        const row = page.getByRole('row').filter({ hasText: students_name });
        await expect(row).toHaveCount(1);
        await expect(row).toContainText(String(students_number));
        await expect(row).toContainText(studentsGrades);
    });
});
