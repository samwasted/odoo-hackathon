"use server";
import bcrypt from 'bcryptjs';
import * as z from 'zod';
import { NewPasswordSchema } from "@/schemas";
import { getPasswordResetTokenByToken } from '@/data/password-reset-token';
import { getUserByEmail } from '@/data/user';
import { db } from '@/lib/db';

export const newPassword = async ({
  values,
  token,
}: {
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null,
}) => {
  if (!token) {
    return { err: "Missing token!" };
  }

  const validatedFields = NewPasswordSchema.safeParse(values)

  if(!validatedFields.success){
    return {err: "Invalid fields!"}
  }

  const {password} = validatedFields.data

  const existingToken = await getPasswordResetTokenByToken(token)

  if(!existingToken){
    return {err: "Invalid token!"}
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if(hasExpired){
    return { err: "Token has expired!"}
  }

  const existingUser = await getUserByEmail(existingToken.email)

  if(!existingUser){
    return {err: "Email does not exist"}
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await db.user.update({
    where: {id: existingUser.id},
    data: {password: hashedPassword}
  })

  await db.passwordResetToken.delete({
    where: {id: existingToken.id}
  })
  return { success: "Password updated!" };
};
