'use client'
import { SignupForm } from "@/components/auth/signup-form"
import { SignupSchema } from "@/schemas";
import { useTransition } from "react";
import { signup } from "@/actions/signup"
import { toast } from "sonner";
import * as z from 'zod'
export default function SignupPage() {
    const [isPending, startTransition] = useTransition()

    const onSubmit = (values: z.infer<typeof SignupSchema>) => {
      startTransition(() => {
        signup(values).then((data) => {
          if(data.err){
            toast.error(data.err)
          }
          else if(data.success){
            toast.success(data.success)
          }
        });
      });
    }
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <SignupForm onSubmit={onSubmit} isPending={isPending} />
      </div>
    </div>
  )
}
