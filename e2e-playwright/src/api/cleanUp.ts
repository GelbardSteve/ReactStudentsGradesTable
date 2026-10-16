import { deleteUser } from "./newUser";

export const cleanUp = async () => {
    await deleteUser();
}