'use client'
import { signIn } from "next-auth/react"
import { DEFAULT_LOGIN_REDIRECT } from "../../../routes"

export const onClick = (provider: 'google' | 'github') => {
        signIn(provider, {
            callbackUrl: DEFAULT_LOGIN_REDIRECT
        })
    }
