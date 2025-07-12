'use client'
import { useState } from 'react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import * as z from 'zod'
import { LoginSchema } from '@/schemas'
import { onClick } from './social'

interface LoginFormProps {
    className?: string;
    onSubmit?: (data: { email: string; password: string }) => Promise<void> | void;
    isPending?: boolean
    [key: string]: any; // Allow passing additional props if needed
}

export function LoginForm({
    className,
    onSubmit,
    isPending,
    ...props
}: LoginFormProps) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            // Validate form data
            const validatedData = LoginSchema.parse(formData)
            
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
                                <h1 className="text-2xl font-bold">Welcome back</h1>
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
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <a
                                        href="/auth/reset"
                                        className="ml-auto text-sm underline-offset-2 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <div className="relative">
                                    <Input 
                                        id="password" 
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
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
                                {isPending ? 'Logging in...' : 'Login'}
                            </Button>
                            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                <span className="bg-card text-muted-foreground relative z-10 px-2">
                                    Or continue with
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="outline" type="button" className="w-full" onClick={() => onClick("github")}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0.297C5.373 0.297 0 5.67 0 12.297c0 5.29 3.438 9.773 8.207 11.387.6.11.793-.26.793-.577
      0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.612-4.042-1.612-.546-1.388-1.333-1.757-1.333-1.757-1.09-.745.083-.729.083-.729
      1.205.085 1.84 1.238 1.84 1.238 1.07 1.834 2.809 1.304 3.495.997.108-.775.42-1.304.763-1.604-2.665-.303-5.467-1.333-5.467-5.931
      0-1.31.467-2.381 1.236-3.221-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.47 11.47 0 013.003-.403
      c1.019.005 2.047.138 3.002.403 2.291-1.552 3.297-1.23 3.297-1.23.655 1.653.243 2.873.12 3.176.77.84 1.235 1.911
      1.235 3.221 0 4.609-2.807 5.625-5.479 5.921.43.37.823 1.103.823 2.222 0 1.606-.015 2.898-.015 3.293
      0 .319.19.694.8.576C20.565 22.067 24 17.586 24 12.297 24 5.67 18.627 0.297 12 0.297z"/>
                                    </svg>
                                    <span className="sr-only">Login with Github</span>
                                </Button>
                                <Button variant="outline" type="button" className="w-full" onClick={() => onClick('google')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path
                                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    <span className="sr-only">Login with Google</span>
                                </Button>
                            </div>
                            <div className="text-center text-size-sm">
                                Don't have an account?{" "}
                                <a href="/auth/signup" className="underline underline-offset-4">
                                    Sign up
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