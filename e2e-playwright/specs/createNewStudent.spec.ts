import { expect, test } from "@playwright/test";
import { randomInt, randomUUID } from "node:crypto";
import { testDescribe } from "../fixtures/testDescribe";
import { createClass, getClassStudents } from "../src/api/admin";
import { AddStudentModal } from "../src/pages/adminPage/AddStudentModal";
import { ClassesPage } from "../src/pages/adminPage/ClassesPage";

testDescribe('Create new student in a class from the UI', async ({ page }) => {
    const classesPage = new ClassesPage(page);
    const addStudentModal = new AddStudentModal(page);
    const className = `e2e-class-${randomUUID().slice(0, 8)}`;
    const student = {
        name: `e2e-user-${randomUUID().slice(0, 8)}`,
        number: randomInt(100, 1_000_000),
        email: `e2e-${randomUUID().slice(0, 8)}@example.com`,
        grades: 'new student grades',
    };

    const { status, body: classItem } = await createClass(className);

    await test.step('Verify creating class status code 201', () => {
        expect(status).toBe(201);
    });

    await test.step(`Open class ${className}`, async () => {
        await classesPage.goto();
        await classesPage.openClass(className);
        await expect(page.getByRole('heading', { name: `${className} · Students` })).toBeVisible();
    });

    await test.step('Add a student through the modal', async () => {
        await addStudentModal.open();
        await addStudentModal.fill(student);
        await addStudentModal.submit();
    });

    await test.step('Verify new student is shown in the class table', async () => {
        const row = page.getByRole('row').filter({ hasText: student.name });
        await expect(row).toHaveCount(1);
        await expect(row).toContainText(String(student.number));
        await expect(row).toContainText(student.email);
        await expect(row).toContainText(student.grades);
    });

    await test.step('Verify the student was saved to this class only', async () => {
        const students = await getClassStudents(classItem.id);
        expect(students).toHaveLength(1);
        expect(students[0]).toMatchObject({ name: student.name, student_number: student.number, email: student.email });
    });
});
