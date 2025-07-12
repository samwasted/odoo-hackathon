'use server'
import * as z from 'zod'
import { AuthError } from 'next-auth'
import {signIn} from '../../auth'
import { LoginSchema } from '@/schemas'
import { generateVerificationToken } from '@/lib/tokens'
import { getUserByEmail } from '@/data/user'
import { sendVerificationEmail } from '@/lib/mail'

export const login = async (values : z.infer<typeof LoginSchema>) =>{
    const validatedFields = LoginSchema.parse(values)

    if(!validatedFields.email || !validatedFields.password){
        return {
            err: 'Invalid fields'
        }
    }

    const {email, password} = validatedFields

    const existingUser = await getUserByEmail(email)

    if(!existingUser?.password && validatedFields.password){
        return { err: "Please login using your credentials provider"}
    }

    if(!existingUser || !existingUser.email){
        return {err: "Email doesn't exist"}
    }
    if(!existingUser.emailVerified){
        const verificationToken = await generateVerificationToken(
            existingUser.email
        )
        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token
        )        

        return {pending: "Confirmation email sent! Please verify to login"}
    }
    try{
        await signIn('credentials', {
            email,
            password,
            redirect: false,
        })

        return {
            success: "Login successful"
        }

    } catch (error) {
        if(error instanceof AuthError) {
            switch(error.type){
                case "CredentialsSignin":
                    return {
                        err: 'Invalid credentials'
                    }
                default:
                    return {
                        err: 'An unexpected error occurred'
                    }
            }
        }
    }
}