import { deleteCreatedClasses } from "./admin";

export const cleanUp = async () => {
    await deleteCreatedClasses();
}
