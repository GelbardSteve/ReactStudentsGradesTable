import { expect, test } from '@playwright/test';
import { randomInt, randomUUID } from "node:crypto";
import { testDescribe } from "../fixtures/testDescribe";
import { createClass, createStudent } from "../src/api/admin";
import { AdminTable } from '../src/pages/adminPage/AdminTable';
import { ClassesPage } from '../src/pages/adminPage/ClassesPage';

testDescribe('Student created via API is listed only in its class', async ({ page }) => {
    const adminTable = new AdminTable(page);
    const classesPage = new ClassesPage(page);
    const suffix = randomUUID().slice(0, 8);
    const [classA, classB] = [`e2e-class-a-${suffix}`, `e2e-class-b-${suffix}`];
    const student = {
        name: `e2e-user-${suffix}`,
        student_number: randomInt(100, 1_000_000),
        email: `e2e-${suffix}@example.com`,
        grades: 'new student grades',
    };

    const { body: classItemA } = await createClass(classA);
    await createClass(classB);
    const { status, body } = await createStudent(classItemA.id, student);

    await test.step('Verify creating student response', () => {
        expect(status).toBe(201);
        expect(body).toMatchObject({ ...student, class_name: classA });
    });

    await test.step('Verify the classes table shows the student count', async () => {
        await classesPage.goto();
        await expect(classesPage.studentCountCell(classA)).toHaveText('1');
        await expect(classesPage.studentCountCell(classB)).toHaveText('0');
    });

    await test.step(`Search the student in ${classA}`, async () => {
        await classesPage.openClass(classA);
        await adminTable.search.input.fill(student.name);
        const row = page.getByRole('row').filter({ hasText: student.name });
        await expect(row).toHaveCount(1);
        await expect(row).toContainText(String(student.student_number));
        await expect(row).toContainText(student.grades);
    });

    await test.step(`Verify the student is not in ${classB}`, async () => {
        await classesPage.goto();
        await classesPage.openClass(classB);
        await expect(page.getByRole('row').filter({ hasText: student.name })).toHaveCount(0);
    });
});
