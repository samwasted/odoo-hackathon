'use client'
import { ResetForm } from '@/components/auth/reset-form'
import { ResetSchema } from '@/schemas'
import React, { useTransition } from 'react'
import * as z from 'zod'
import { reset } from '@/actions/reset'
import { toast } from 'sonner'
const ResetPage = () => {
          const [isPending, startTransition] = useTransition()
    
      const onSubmit = (values: z.infer<typeof ResetSchema>) => {
        console.log(values)
        
        startTransition(() => {
            reset(values)
                .then((data) => {
                    if(data.err){
                        toast.error(data.err)
                    }else if(data.success){
                        toast.success(data.success)
                    }
                })
        })
      }
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <ResetForm onSubmit={onSubmit} isPending={isPending}/>
      </div>
    </div>
  )
}

export default ResetPage