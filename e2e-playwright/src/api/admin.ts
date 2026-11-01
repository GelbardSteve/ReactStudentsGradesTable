import { z } from 'zod';
import { getMetadata } from '../utils/utils';
import { API_BASE_URL } from '../utils/constants';

const LoginResponseSchema = z.object({ token: z.string(), email: z.string() });

const ClassSchema = z.object({ id: z.number(), name: z.string() });

const StudentSchema = z.object({
    id: z.number(),
    class_id: z.number(),
    name: z.string(),
    student_number: z.number(),
    email: z.string(),
    grades: z.string().nullable(),
    favorites: z.number(),
    class_name: z.string(),
});

export type Student = z.infer<typeof StudentSchema>;

interface CreateStudentRequest {
    name: string;
    student_number: number;
    email: string;
    grades: string;
}

// Classes created by the current test; deleting a class also deletes its students
export const createdClassIds: number[] = [];

let tokenPromise: Promise<string> | undefined;

// One API session per worker, logged in as the seeded admin from testRunData.json
const getToken = () => {
    tokenPromise ??= (async () => {
        const { email, password } = getMetadata();
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) throw new Error(`API login failed: ${response.status}`);
        return LoginResponseSchema.parse(await response.json()).token;
    })();
    return tokenPromise;
};

const api = async (method: string, path: string, body?: unknown) => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await getToken()}` },
        body: body === undefined ? undefined : JSON.stringify(body),
    });
    return { status: response.status, json: await response.json() };
};

export const createClass = async (name: string) => {
    const { status, json } = await api('POST', '/classes', { name });
    const body = ClassSchema.parse(json);
    createdClassIds.push(body.id);
    return { status, body };
};

export const createStudent = async (classId: number, student: CreateStudentRequest) => {
    const { status, json } = await api('POST', `/classes/${classId}/students`, student);
    return { status, body: StudentSchema.parse(json) };
};

export const getClassStudents = async (classId: number) => {
    const { json } = await api('GET', `/classes/${classId}/students`);
    return z.array(StudentSchema.omit({ class_name: true })).parse(json);
};

export const deleteCreatedClasses = async () => {
    for (const id of createdClassIds) {
        await api('DELETE', `/classes/${id}`);
    }
    createdClassIds.length = 0;
};
