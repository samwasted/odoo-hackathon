'use client'
import { startTransition, useState } from 'react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import * as z from 'zod'
import { NewPasswordSchema } from '@/schemas'
import { Eye, EyeOff } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { newPassword } from '@/actions/new-password'
import { toast } from 'sonner'
interface NewPasswordFormProps {
    className?: string;
    [key: string]: any; // Allow passing additional props if needed
}

export function NewPasswordForm({
    className,
    isPending,
    ...props
}: NewPasswordFormProps) {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const [formData, setFormData] = useState({
        password: '',
    })

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [showPassword, setShowPassword] = useState(false)

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
    const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
        startTransition(() => {
            newPassword({values, token})
                .then((data) => {
                    if(data.err){
                        toast.error(data.err)
                    }
                    else if(data.success){
                        toast.success(data.success)
                    }
                })
        })
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            // Validate form data
            const validatedData = NewPasswordSchema.parse(formData)

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
                alert('Password reset successful!')
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
                console.error('Password reset error:', error)
                alert('Password reset failed. Please try again.')
            }
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-1">
                    <div className="p-6 md:p-8">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div className="flex flex-col items-center text-center">
                                <h1 className="text-2xl font-bold">Set New Password</h1>
                                <p className="text-muted-foreground text-balance">
                                    Enter your new password below
                                </p>
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">New Password</Label>
                                </div>
                                <div className="relative">
                                    <Input 
                                        id="password" 
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                                        placeholder="Enter your new password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                <p className="text-sm text-red-500 mt-1 min-h-[1.25rem]">
                                    {errors.password || " "}
                                </p>
                            </div>
                            <Button type="submit" className="w-full" disabled={isPending}>
                                {isPending ? 'Setting password...' : 'Set new password'}
                            </Button>
                            <div className="text-center text-sm">
                                Back to{' '}
                                <a href="/auth/login" className="underline underline-offset-4">
                                    Login
                                </a>
                            </div>
                        </form>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}