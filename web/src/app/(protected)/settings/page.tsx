'use client'
import { useCurrentUser } from "@/hooks/use-current-user"
import { logout } from "@/actions/logout"

const SettingsPage = () => {
    const user = useCurrentUser()
    const onClick = () => {
        logout()
    }

    return (
        <div>
            {JSON.stringify(user)}
                <button type="submit" onClick={onClick} className="cursor-pointer text-red-600">
                    Sign out
                </button>
        </div>
    )
}
export default SettingsPage