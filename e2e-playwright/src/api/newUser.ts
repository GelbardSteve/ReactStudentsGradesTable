import { z } from 'zod';
import { API_BASE_URL } from '../utils/constants';

interface CreateUserRequest {
    students_name: string;
    students_number: number;
    studentsGrades: string;
}

const CreateUserResponseSchema = z.object({
    students_id: z.number(),
    students_name: z.string(),
    students_number: z.number(),
    studentsGrades: z.string(),
    authentication: z.string().nullable().optional(),
    favorites: z.number().optional(),
});

type CreateUserResponse = z.infer<typeof CreateUserResponseSchema>;

export const deletedUsersIds: number[] = [];

const baseUrl = `${API_BASE_URL}/students2`

export const createNewUser = async (
    createUserRequest: CreateUserRequest   
): Promise<{ status: number; body: CreateUserResponse }> => {

    const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            students_name: createUserRequest.students_name,
            students_number: createUserRequest.students_number,
            studentsGrades: createUserRequest.studentsGrades,
        }),
    });
    const body = CreateUserResponseSchema.parse(await response.json());

    deletedUsersIds.push(createUserRequest.students_number);

    return { status: response.status, body };
};

export const deleteUser = async () => {
    for (const deletedUsersId of deletedUsersIds) {
        await fetch(baseUrl+'/'+deletedUsersId,  { method: 'DELETE' })
    }
    deletedUsersIds.length = 0;
}