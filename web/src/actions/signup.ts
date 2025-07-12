'use server'
import * as z from 'zod'
import { db } from '@/lib/db'
import { SignupSchema } from '@/schemas'
import bcrypt from 'bcryptjs'
import { getUserByEmail } from '@/data/user'
import { generateVerificationToken } from '@/lib/tokens'
import { sendVerificationEmail } from '@/lib/mail'
export const signup = async (values : z.infer<typeof SignupSchema>) =>{
    const validatedFields = SignupSchema.parse(values)

    if(!validatedFields.email || !validatedFields.password){
        return {
            err: 'Invalid fields'
        }
    }
    const {name, password, email} = validatedFields

    const hashedPassword = await bcrypt.hash(password, 10)
    const test = await bcrypt.hash("testing", 10)
    console.log(test)

    const existingUser = await getUserByEmail(email)
    if(existingUser){
        return {
            err: 'User already exists with current email address'
        }
    }
    const user = await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    })
    if(user){
        const verificationToken = await generateVerificationToken(email);

        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token
        )
        return {
            success: "User created successfully, check email inbox to verify"
        }
    } else if(!user) {
        return {
            err: 'User creation failed'
        }
    }


    return { success: "Confirmation email sent"}
}