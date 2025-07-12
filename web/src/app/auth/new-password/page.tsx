import { NewPasswordForm } from '@/components/auth/new-password-form'
import React from 'react'

const NewPasswordPage = () => {
    
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-3xl">
                <NewPasswordForm />
            </div>
        </div>
    )
}

export default NewPasswordPage