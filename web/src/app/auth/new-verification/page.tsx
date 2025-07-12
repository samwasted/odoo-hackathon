import NewVerificationForm from '@/components/auth/new-verification-form'

const NewVerificationPage = () => {

    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="max-w-sm md:max-w-3xl">
                <NewVerificationForm  />
            </div>
        </div>
    )
}

export default NewVerificationPage