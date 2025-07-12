'use client'
import { useTransition } from "react"
import { login } from "@/actions/login"
import { LoginForm } from "@/components/auth/login-form"
import { LoginSchema } from "@/schemas"
import * as z from "zod"
import { toast } from "sonner"
import { DEFAULT_LOGIN_REDIRECT } from "../../../../routes"
export default function LoginPage() {
  const [isPending, startTransition] = useTransition()

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    startTransition(() => {
      login(values).then((data) => {
        console.log(data)
        if (data == undefined) {
          toast.error('Server error');
        }
        else if (data.err != undefined) {
          toast.error(data.err);
        }
        else if (data.success != undefined) {
          toast.success(data.success)
          window.location.href = DEFAULT_LOGIN_REDIRECT
        }
        else if(data.pending != undefined){
          toast.success(data.pending)
        }
      });
    });
  }
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm onSubmit={onSubmit} isPending={isPending} />
      </div>
    </div>
  )
}

