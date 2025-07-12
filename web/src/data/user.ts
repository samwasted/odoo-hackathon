import {db} from '@/lib/db';

export const getUserByEmail = async (email: string) => {
    try {
        const user = await db.user.findUnique({
            where: {
                email: email
            }
        });
        return user;
    } catch (error) {
        console.error('Error fetching user by email:', error);
        throw new Error('Failed to fetch user');
    }
}
export const getUserById = async (id: string) => { 
    try {
        const user = await db.user.findUnique({
            where: {
                id: id
            }
        });
        return user;
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        throw new Error('Failed to fetch user');
    }
}