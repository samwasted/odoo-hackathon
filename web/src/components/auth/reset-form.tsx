'use client'
import { useState } from 'react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import * as z from 'zod'
import {  ResetSchema } from '@/schemas'

interface LoginFormProps {
    className?: string;
    onSubmit?: (data: { email: string}) => Promise<void> | void;
    isPending?: boolean
    [key: string]: any; // Allow passing additional props if needed
}

export function ResetForm({
    className,
    onSubmit,
    isPending,
    ...props
}: LoginFormProps) {
    const [formData, setFormData] = useState({
        email: '',
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            // Validate form data
            const validatedData = ResetSchema.parse(formData)
            
            // Clear any existing errors
            setErrors({})
            
            // Call the onSubmit prop if provided
            if (onSubmit) {
                await onSubmit(validatedData)
            } else {
                // Default behavior if no onSubmit is provided
                console.log('Form submitted with valid data:', validatedData)
                
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 2000))
                
                // Handle successful submission
                alert('Login successful!')
            }
            
        } catch (error) {
            if (error instanceof z.ZodError) {
                // Handle validation errors
                const newErrors: Record<string, string> = {}
                error.errors.forEach((err) => {
                    if (err.path[0]) {
                        newErrors[err.path[0] as string] = err.message
                    }
                })
                setErrors(newErrors)
            } else {
                // Handle other errors (like API errors)
                console.error('Login error:', error)
                alert('Login failed. Please try again.')
            }
        }
    }
    

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <div className="p-6 md:p-8">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div className="flex flex-col items-center text-center">
                                <h1 className="text-2xl font-bold">Forgot your password?</h1>
                                <p className="text-muted-foreground text-balance">
                                    some cool name
                                </p>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={errors.email ? 'border-red-500' : ''}
                                />
                                <p className="text-sm text-red-500 mt-1 min-h-[1.25rem]">
                                    {errors.email || " "}
                                </p>
                            </div>
                            <Button type="submit" className="w-full" disabled={isPending}>
                                {isPending ? 'Sending email...' : 'Send reset email'}
                            </Button>
                            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">

                            </div>
                            <div className="text-center text-size-sm">
                                Back to{' '}
                                <a href="/auth/login" className="underline underline-offset-4">
                                     Login
                                </a>
                            </div>
                        </form>
                    </div>
                    <div className="bg-muted relative hidden md:block">
                        <img
                            src="https://i.pinimg.com/236x/00/11/a6/0011a6edf53dae379b6246ce32434de9.jpg"
                            alt="Login illustration"
                            className="absolute inset-0 h-full w-full object-fit dark:brightness-[0.2] dark:grayscale"
                            //change to object-cover later
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}