'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { Card } from '../ui/card'
import { Loader2 } from 'lucide-react'
import { newVerification } from '@/actions/new-verification'
import { useSearchParams } from 'next/navigation'
const NewVerificationForm = () => {
    const searchParams = useSearchParams()
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const token = searchParams.get("token")

    const onSubmit = useCallback(() => {
        if (!token) {
            setError("Missing token!")
            return
        }

        newVerification(token)
            .then((data) => {
                setSuccess(data.success)
                setError(data.err)
            })

    }, [token])

    useEffect(() => {
        onSubmit()
    }, [onSubmit])
    return (
        <div className='flex items-center align-center justify-center'>
            <Card className='w-[95vw] md:w-[70vw] h-[20vh] md:h-[15vh] flex items-center justify-center'>
                {!success && !error && (
                       <> <p className='text-gray-700'>Confirming your verification</p>
            <Loader2 className='animate-spin'/></>
        )}
        {
            success && !error && (
                <p className='text-[#041c57]'>{success}</p>
            )
        }
        {
            !success && error && (
                <p className='text-[#4a2c2c]'>{error}</p>
            )
        }

            </Card>
        </div>
    )
}

export default NewVerificationForm