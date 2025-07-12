import {db} from '@/lib/db';
import { Skill, Availability } from '@/generated/prisma';


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
    if (!id) {
        console.warn("No ID provided to getUserById");
        return null;
    }

    try {
        const user = await db.user.findUnique({
            where: { id },
        });

        if (!user) {
            console.warn(`No user found for id: ${id}`);
        }

        return user;
    } catch (error: any) {
        console.error(`Error fetching user by ID (${id}):`, error?.message || error);
        return null;
    }
};




export const updateUserProfile = async (
  id: string,
  data: {
    name?: string;
    location?: string;
    skillsOffered?: Skill[];
    skillsWanted?: Skill[];
    availability?: Availability;
    isPublic?: boolean;
    image?: string;
  }
) => {
  if (!id) {
    console.warn("No ID provided to updateUserProfile");
    return null;
  }

  try {
    const updatedUser = await db.user.update({
      where: { id },
      data,
    });

    if (!updatedUser) {
      console.warn(`User not found while updating with id: ${id}`);
      return null;
    }

    return updatedUser;
  } catch (error: any) {
    console.error(`Error updating user (${id}):`, error?.message || error);
    return null;
  }
};